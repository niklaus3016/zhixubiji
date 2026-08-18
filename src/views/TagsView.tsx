import React, { useState, useMemo } from 'react';
import { Tag, ReadingNote, Book } from '../types';
import { NoteCard } from '../components/NoteCard';
import { Tags as TagsIcon, Plus, Edit2, Trash2, Search, ArrowUpDown, FileText, Check, X } from 'lucide-react';

interface TagsViewProps {
  tags: Tag[];
  notes: ReadingNote[];
  books: Book[];
  onAddNewTag: (tagName: string) => Promise<void>;
  onEditTagName: (tagId: string, oldName: string, newName: string) => Promise<void>;
  onDeleteTag: (tagId: string, tagName: string) => Promise<void>;
  onEditNote: (note: ReadingNote) => void;
  onDeleteNote: (note: ReadingNote) => void;
  onTogglePinNote: (noteId: string) => void;
  onOpenBook: (bookId: string) => void;
}

export const TagsView: React.FC<TagsViewProps> = ({
  tags,
  notes,
  books,
  onAddNewTag,
  onEditTagName,
  onDeleteTag,
  onEditNote,
  onDeleteNote,
  onTogglePinNote,
  onOpenBook,
}) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(tags.length > 0 ? tags[0].name : null);
  const [newTagName, setNewTagName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Tag editing state
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState('');

  // Search & Filter state for notes in tag view
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const bookMap = useMemo(() => {
    const map = new Map<string, Book>();
    books.forEach((b) => map.set(b.id, b));
    return map;
  }, [books]);

  // Count notes per tag
  const tagNotesCountMap = useMemo(() => {
    const map = new Map<string, number>();
    notes.forEach((n) => {
      if (n.tags) {
        n.tags.forEach((t) => {
          map.set(t, (map.get(t) || 0) + 1);
        });
      }
    });
    return map;
  }, [notes]);

  // Notes bound to selected tag
  const filteredNotes = useMemo(() => {
    if (!selectedTag) return [];
    return notes
      .filter((n) => {
        const hasTag = n.tags && n.tags.includes(selectedTag);
        if (!hasTag) return false;

        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase().trim();
          const quoteMatch = n.quote ? n.quote.toLowerCase().includes(q) : false;
          const thoughtMatch = n.thought ? n.thought.toLowerCase().includes(q) : false;
          const bookTitle = bookMap.get(n.bookId)?.title.toLowerCase() || '';
          return quoteMatch || thoughtMatch || bookTitle.includes(q);
        }
        return true;
      })
      .sort((a, b) => (sortOrder === 'desc' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt));
  }, [selectedTag, notes, searchTerm, sortOrder, bookMap]);

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    await onAddNewTag(newTagName.trim());
    setSelectedTag(newTagName.trim());
    setNewTagName('');
    setShowAddModal(false);
  };

  const handleSaveEditTag = async (tag: Tag) => {
    if (!editingTagName.trim() || editingTagName.trim() === tag.name) {
      setEditingTagId(null);
      return;
    }
    const newName = editingTagName.trim();
    await onEditTagName(tag.id, tag.name, newName);
    if (selectedTag === tag.name) {
      setSelectedTag(newName);
    }
    setEditingTagId(null);
  };

  const handleDeleteTagConfirm = async (tag: Tag) => {
    if (confirm(`确定要删除标签 “#${tag.name}” 吗？\n删除后所有笔记将解除该标签的绑定，但不会删除笔记内容。`)) {
      await onDeleteTag(tag.id, tag.name);
      if (selectedTag === tag.name) {
        const remaining = tags.filter((t) => t.id !== tag.id);
        setSelectedTag(remaining.length > 0 ? remaining[0].name : null);
      }
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner Header */}
      <div className="bg-white/5 backdrop-blur-xl p-4.5 rounded-2xl shadow-xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
            <TagsIcon className="w-5 h-5 text-indigo-400" />
            <span>标签汇总与跨书关联</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            打破书籍壁垒，按主题、思考维度汇总所有相关的读书笔记
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md shadow-indigo-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>新建标签</span>
        </button>
      </div>

      {/* New Tag Input Modal or Drawer */}
      {showAddModal && (
        <div className="bg-indigo-950/80 backdrop-blur-xl p-3.5 rounded-2xl border border-indigo-500/30 flex items-center gap-2 animate-in fade-in duration-150 shadow-xl">
          <input
            type="text"
            autoFocus
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="输入新标签名称 (如：心理学、历史逻辑、思考力)..."
            className="flex-1 px-3 py-1.5 bg-slate-800 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateTag();
            }}
          />
          <button
            onClick={handleCreateTag}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            保存
          </button>
          <button
            onClick={() => setShowAddModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* All Tags Horizontal/Grid Pill Cloud */}
      <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/10 space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          已创建的知识标签 ({tags.length})
        </h3>

        {tags.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">暂未创建标签，可在记笔记时添加或点击右上角新建。</p>
        ) : (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {tags.map((tag) => {
              const isSelected = selectedTag === tag.name;
              const count = tagNotesCountMap.get(tag.name) || 0;
              const isEditing = editingTagId === tag.id;

              if (isEditing) {
                return (
                  <div key={tag.id} className="flex items-center gap-1 bg-indigo-950/80 p-1 rounded-xl border border-indigo-500/40">
                    <input
                      type="text"
                      value={editingTagName}
                      onChange={(e) => setEditingTagName(e.target.value)}
                      className="px-2 py-0.5 bg-slate-800 border border-white/15 rounded text-xs text-white w-24"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEditTag(tag)}
                      className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingTagId(null)}
                      className="p-1 text-slate-400 hover:bg-white/10 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={tag.id}
                  className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition text-xs font-medium cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 font-semibold'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedTag(tag.name)}
                >
                  <span>#{tag.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>

                  {/* Inline Tag Management Icons */}
                  <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTagId(tag.id);
                        setEditingTagName(tag.name);
                      }}
                      className="p-0.5 hover:text-indigo-200"
                      title="重命名标签"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTagConfirm(tag);
                      }}
                      className="p-0.5 hover:text-red-400"
                      title="删除标签"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Tag Notes Aggregation Section */}
      {selectedTag && (
        <div className="space-y-3">
          {/* Tag Filter & Search Toolbar */}
          <div className="bg-white/5 backdrop-blur-xl p-3 rounded-2xl shadow-xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white font-serif">
                标签 “#{selectedTag}” 聚合笔记 ({filteredNotes.length})
              </span>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-xs ml-auto">
              {/* Search inside tag notes */}
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索此标签下内容..."
                  className="w-full pl-8 pr-3 py-1 text-xs border border-white/15 rounded-xl bg-slate-800/80 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Sort toggle */}
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="p-1.5 bg-white/10 hover:bg-white/15 rounded-xl text-slate-300 text-xs flex items-center gap-1 transition"
                title="切换时间排序"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Notes Cards */}
          {filteredNotes.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-10 text-center border border-white/10 shadow-xl">
              <FileText className="w-10 h-10 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-200 font-serif">未找到关联标签 “#{selectedTag}” 的笔记</p>
              <p className="text-xs text-slate-400 mt-1">尝试新增笔记并选择绑定该标签</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                book={bookMap.get(note.bookId)}
                onEdit={onEditNote}
                onDelete={onDeleteNote}
                onTogglePin={onTogglePinNote}
                onOpenBook={onOpenBook}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

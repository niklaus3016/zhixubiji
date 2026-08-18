import React, { useState, useEffect, useRef } from 'react';
import { Book, ReadingNote, NoteType, Tag } from '../types';
import { RichToolbar } from '../components/RichToolbar';
import { BookOpen, Tag as TagIcon, Plus, X, ArrowLeft, Save, Sparkles, Check } from 'lucide-react';

interface NoteEditViewProps {
  books: Book[];
  tags: Tag[];
  noteToEdit?: ReadingNote | null;
  preselectedBookId?: string;
  onSave: (noteData: Omit<ReadingNote, 'id' | 'createdAt' | 'updatedAt' | 'isPinned'> & { id?: string }) => void;
  onAddNewTag: (tagName: string) => Promise<void>;
  onCancel: () => void;
}

export const NoteEditView: React.FC<NoteEditViewProps> = ({
  books,
  tags,
  noteToEdit,
  preselectedBookId,
  onSave,
  onAddNewTag,
  onCancel,
}) => {
  const [bookId, setBookId] = useState<string>('');
  const [pageChapter, setPageChapter] = useState('');
  const [type, setType] = useState<NoteType>('excerpt');
  const [quote, setQuote] = useState('');
  const [thought, setThought] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [showAddTagInput, setShowAddTagInput] = useState(false);

  const [activeTextarea, setActiveTextarea] = useState<'quote' | 'thought'>('thought');
  const [errors, setErrors] = useState<{ bookId?: string; content?: string }>({});

  const quoteRef = useRef<HTMLTextAreaElement>(null);
  const thoughtRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (noteToEdit) {
      setBookId(noteToEdit.bookId);
      setPageChapter(noteToEdit.pageChapter || '');
      setType(noteToEdit.type);
      setQuote(noteToEdit.quote || '');
      setThought(noteToEdit.thought || '');
      setSelectedTags(noteToEdit.tags || []);
    } else {
      setBookId(preselectedBookId || (books.length > 0 ? books[0].id : ''));
      setPageChapter('');
      setType('excerpt');
      setQuote('');
      setThought('');
      setSelectedTags([]);
    }
    setErrors({});
  }, [noteToEdit, preselectedBookId, books]);

  // Insert Rich Text helper
  const handleInsertRichText = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const targetRef = activeTextarea === 'quote' ? quoteRef : thoughtRef;
    const currentText = activeTextarea === 'quote' ? quote : thought;
    const setText = activeTextarea === 'quote' ? setQuote : setThought;

    if (!targetRef.current) return;
    const textarea = targetRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selected = currentText.substring(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;
    const newText = currentText.substring(0, start) + replacement + currentText.substring(end);

    setText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  const handleCleanPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      // Remove HTML tags, excess blank lines, trim
      const cleaned = text
        .replace(/<[^>]*>?/gm, '')
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim();

      if (activeTextarea === 'quote') {
        setQuote((prev) => (prev ? `${prev}\n${cleaned}` : cleaned));
      } else {
        setThought((prev) => (prev ? `${prev}\n${cleaned}` : cleaned));
      }
    } catch {
      alert('请使用 Standard Paste 快捷键 (Ctrl+V/Cmd+V) 粘贴文本');
    }
  };

  const handleToggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
  };

  const handleCreateNewTag = async () => {
    if (!newTagInput.trim()) return;
    const tagName = newTagInput.trim();
    if (!selectedTags.includes(tagName)) {
      setSelectedTags((prev) => [...prev, tagName]);
    }
    await onAddNewTag(tagName);
    setNewTagInput('');
    setShowAddTagInput(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { bookId?: string; content?: string } = {};

    if (!bookId) {
      newErrors.bookId = '请选择归属的书籍';
    }

    if (!quote.trim() && !thought.trim()) {
      newErrors.content = '原文摘录与个人思考至少需填写一项';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: noteToEdit?.id,
      bookId,
      pageChapter: pageChapter.trim(),
      type,
      quote: quote.trim(),
      thought: thought.trim(),
      tags: selectedTags,
    });
  };

  if (books.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/10 shadow-xl my-6">
        <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-200 font-serif">无法新增读书笔记</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          知序笔记要求每条笔记必须强制绑定单本书籍。请先在书籍库中录入一本书籍。
        </p>
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20"
        >
          前往书籍库
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 bg-white/10 border border-white/15 rounded-xl text-slate-200 hover:bg-white/15 text-xs font-semibold flex items-center gap-1 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>取消</span>
        </button>

        <h2 className="text-base font-bold text-white font-serif">
          {noteToEdit ? '编辑读书笔记' : '新增读书笔记'}
        </h2>

        <button
          type="submit"
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1 shadow-md shadow-indigo-600/20 transition"
        >
          <Save className="w-4 h-4" />
          <span>保存笔记</span>
        </button>
      </div>

      {errors.content && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 text-red-300 text-xs rounded-xl font-medium">
          ⚠️ {errors.content}
        </div>
      )}

      {/* Book Binding & Location */}
      <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/10 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Bound Book Selector */}
          <div>
            <label className="block text-slate-200 font-semibold text-xs mb-1">
              归属书籍 <span className="text-red-400">* (强制绑定)</span>
            </label>
            <select
              value={bookId}
              onChange={(e) => {
                setBookId(e.target.value);
                if (errors.bookId) setErrors((prev) => ({ ...prev, bookId: undefined }));
              }}
              className={`w-full px-3 py-2 rounded-xl border bg-slate-800/80 text-white text-xs font-medium ${
                errors.bookId ? 'border-red-400' : 'border-white/15'
              }`}
            >
              <option value="" disabled className="bg-slate-900 text-slate-400">
                -- 请选择绑定的书籍 --
              </option>
              {books.map((b) => (
                <option key={b.id} value={b.id} className="bg-slate-900 text-slate-100">
                  《{b.title}》 - {b.author}
                </option>
              ))}
            </select>
            {errors.bookId && <p className="text-xs text-red-400 mt-1">{errors.bookId}</p>}
          </div>

          {/* Page / Chapter */}
          <div>
            <label className="block text-slate-200 font-semibold text-xs mb-1">
              页码 / 章节位置 (选填)
            </label>
            <input
              type="text"
              value={pageChapter}
              onChange={(e) => setPageChapter(e.target.value)}
              placeholder="例如：P. 128 或 第三章"
              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-slate-800/80 text-white placeholder-slate-500 text-xs"
            />
          </div>
        </div>

        {/* Note Type Selector */}
        <div>
          <label className="block text-slate-200 font-semibold text-xs mb-1.5">
            笔记类型 <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'excerpt', label: '📝 原文摘录', desc: '书本金句与精彩文本' },
              { id: 'summary', label: '💡 要点总结', desc: '章节核心要点提炼' },
              { id: 'reflection', label: '✍️ 个人感悟', desc: '个人思考与延伸批注' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setType(item.id as NoteType)}
                className={`p-2 rounded-xl border text-left transition ${
                  type === item.id
                    ? 'bg-indigo-500/20 text-indigo-200 border-indigo-500/50 font-bold shadow-md shadow-indigo-500/10'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="text-xs font-semibold">{item.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Main Section */}
      <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/10 space-y-4">
        {/* Rich Formatting Toolbar */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">轻量文本排版工具</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTextarea('quote')}
                className={`px-2 py-0.5 rounded text-[11px] transition ${
                  activeTextarea === 'quote' ? 'bg-indigo-600 text-white font-medium' : 'bg-white/10 text-slate-300'
                }`}
              >
                作用于原文区
              </button>
              <button
                type="button"
                onClick={() => setActiveTextarea('thought')}
                className={`px-2 py-0.5 rounded text-[11px] transition ${
                  activeTextarea === 'thought' ? 'bg-indigo-600 text-white font-medium' : 'bg-white/10 text-slate-300'
                }`}
              >
                作用于思考区
              </button>
            </div>
          </div>

          <RichToolbar onInsert={handleInsertRichText} onCleanPaste={handleCleanPaste} />
        </div>

        {/* 1. Original Quote Textarea (原文摘抄区) */}
        <div>
          <label className="block text-xs font-bold text-amber-300 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span>📖</span>
              <span>原文摘抄区 (独立保存)</span>
            </span>
            <span className="text-[10px] font-normal text-slate-400">适配读书原句对比</span>
          </label>
          <textarea
            ref={quoteRef}
            value={quote}
            onFocus={() => setActiveTextarea('quote')}
            onChange={(e) => setQuote(e.target.value)}
            rows={4}
            placeholder="粘贴或键入书中的精妙原文段落..."
            className={`w-full p-3 rounded-xl border text-xs leading-relaxed font-serif text-slate-100 placeholder-slate-500 ${
              activeTextarea === 'quote'
                ? 'border-amber-500/60 bg-amber-950/30 ring-2 ring-amber-500/20'
                : 'border-white/10 bg-slate-900/40'
            }`}
          />
        </div>

        {/* 2. Personal Thought Textarea (个人笔记区) */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span>✍️</span>
              <span>个人笔记与感悟区 (独立保存)</span>
            </span>
            <span className="text-[10px] font-normal text-slate-400">记录批注、联想与心得</span>
          </label>
          <textarea
            ref={thoughtRef}
            value={thought}
            onFocus={() => setActiveTextarea('thought')}
            onChange={(e) => setThought(e.target.value)}
            rows={5}
            placeholder="记录针对原文的个人感悟、逻辑批注、延伸思考或要点总结..."
            className={`w-full p-3 rounded-xl border text-xs leading-relaxed text-slate-100 placeholder-slate-500 ${
              activeTextarea === 'thought'
                ? 'border-indigo-500/60 bg-slate-800/80 ring-2 ring-indigo-500/20'
                : 'border-white/10 bg-slate-900/40'
            }`}
          />
        </div>

        {/* Tag Binding Section */}
        <div className="pt-2 border-t border-white/10">
          <label className="block text-xs font-semibold text-slate-200 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <TagIcon className="w-3.5 h-3.5 text-slate-400" />
              绑定所属标签 (打标签)
            </span>
            <button
              type="button"
              onClick={() => setShowAddTagInput(!showAddTagInput)}
              className="text-[11px] text-indigo-300 hover:underline flex items-center gap-0.5 font-medium"
            >
              <Plus className="w-3 h-3" />
              自定义新标签
            </button>
          </label>

          {showAddTagInput && (
            <div className="flex items-center gap-2 mb-3 bg-white/5 p-2 rounded-xl border border-white/10">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder="键入新标签名称 (如：心理学)"
                className="flex-1 px-2.5 py-1 text-xs border border-white/15 bg-slate-800 text-white placeholder-slate-500 rounded-lg focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreateNewTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleCreateNewTag}
                className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-medium"
              >
                添加
              </button>
            </div>
          )}

          {/* Tags Cloud Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((t) => {
              const isSelected = selectedTags.includes(t.name);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleToggleTag(t.name)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-indigo-200" />}
                  <span>#{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-300 rounded-xl text-xs font-semibold transition"
        >
          取消
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
        >
          保存读书笔记
        </button>
      </div>
    </form>
  );
};

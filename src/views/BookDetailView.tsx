import React, { useState } from 'react';
import { Book, ReadingNote, NoteType, NoteSortOrder } from '../types';
import { NoteCard } from '../components/NoteCard';
import { getStatusBadge, exportBookNotesMarkdown, downloadFile } from '../lib/formatters';
import { Plus, Download, Edit3, ArrowLeft, BookOpen, Calendar, ArrowUpDown, FileText } from 'lucide-react';

interface BookDetailViewProps {
  book: Book;
  notes: ReadingNote[];
  onGoBack: () => void;
  onEditBook: (book: Book) => void;
  onAddNoteForBook: (bookId: string) => void;
  onEditNote: (note: ReadingNote) => void;
  onDeleteNote: (note: ReadingNote) => void;
  onTogglePinNote: (noteId: string) => void;
  onSelectTag?: (tagName: string) => void;
}

export const BookDetailView: React.FC<BookDetailViewProps> = ({
  book,
  notes,
  onGoBack,
  onEditBook,
  onAddNoteForBook,
  onEditNote,
  onDeleteNote,
  onTogglePinNote,
  onSelectTag,
}) => {
  const [typeFilter, setTypeFilter] = useState<'all' | NoteType>('all');
  const [sortOrder, setSortOrder] = useState<NoteSortOrder>('time_desc');

  const statusInfo = getStatusBadge(book.status);

  // Filter & Sort Notes for this book
  const filteredNotes = notes
    .filter((n) => {
      if (typeFilter !== 'all' && n.type !== typeFilter) return false;
      return true;
    })
    .sort((a, b) => {
      // Pinned notes always on top first
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }

      if (sortOrder === 'time_desc') {
        return b.createdAt - a.createdAt;
      }
      if (sortOrder === 'time_asc') {
        return a.createdAt - b.createdAt;
      }
      if (sortOrder === 'page_asc') {
        const pageA = a.pageChapter || '';
        const pageB = b.pageChapter || '';
        return pageA.localeCompare(pageB, undefined, { numeric: true, sensitivity: 'base' });
      }
      return 0;
    });

  const handleExportMarkdown = () => {
    const md = exportBookNotesMarkdown(book, notes);
    downloadFile(`《${book.title}》_读书笔记.md`, md, 'text/markdown;charset=utf-8;');
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onGoBack}
          className="px-3 py-1.5 bg-white/10 border border-white/15 rounded-xl text-slate-200 hover:bg-white/15 text-xs font-semibold flex items-center gap-1 shadow-md transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回</span>
        </button>

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={handleExportMarkdown}
            className="px-2.5 py-1.5 bg-white/10 hover:bg-white/15 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition border border-white/10"
            title="导出整本书笔记为 Markdown 文件"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>导出 Markdown</span>
          </button>

          <button
            onClick={() => onEditBook(book)}
            className="px-2.5 py-1.5 bg-white/10 border border-white/15 hover:bg-white/15 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-300" />
            <span>编辑</span>
          </button>
        </div>
      </div>

      {/* Book Metadata Banner */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-xl border border-white/10 flex flex-col sm:flex-row gap-4 items-start">
        {/* Cover Image or Spine */}
        <div className="w-24 h-32 shrink-0 bg-slate-800 rounded-xl overflow-hidden shadow-md relative self-center sm:self-start">
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-slate-900 text-slate-100 p-2 flex flex-col justify-between border-l-4 border-indigo-500">
              <span className="text-[9px] text-indigo-400 font-mono">知序·图书</span>
              <div>
                <h4 className="font-serif font-bold text-xs line-clamp-2 text-white">{book.title}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{book.author}</p>
              </div>
              <span className="text-[9px] text-slate-500">{notes.length} 笔记</span>
            </div>
          )}
        </div>

        {/* Info Area */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-white font-serif leading-snug">{book.title}</h2>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${statusInfo.bg}`}>
              {statusInfo.label}
            </span>
            {book.isArchived && (
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium border border-white/10">
                已归档
              </span>
            )}
          </div>

          <p className="text-sm text-slate-300 font-medium">作者：{book.author}</p>

          {/* Reading Dates */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
            {book.startDate && (
              <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-lg">
                <Calendar className="w-3 h-3 text-slate-400" />
                开始阅读：{book.startDate}
              </span>
            )}
            {book.finishDate && (
              <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg">
                <Calendar className="w-3 h-3 text-emerald-400" />
                读完时间：{book.finishDate}
              </span>
            )}
          </div>

          {/* Book Description */}
          {book.description && (
            <p className="text-xs text-slate-300 bg-white/5 p-2.5 rounded-xl border border-white/10 leading-relaxed italic font-serif">
              “{book.description}”
            </p>
          )}
        </div>
      </div>

      {/* Notes Toolbar Bar */}
      <div className="bg-white/5 backdrop-blur-xl p-3 rounded-2xl shadow-xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
          <span className="text-xs text-slate-400 font-medium mr-1">类型:</span>
          {[
            { id: 'all', label: '全部' },
            { id: 'excerpt', label: '📝 原文摘录' },
            { id: 'summary', label: '💡 要点总结' },
            { id: 'reflection', label: '✍️ 个人感悟' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setTypeFilter(type.id as 'all' | NoteType)}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition shrink-0 ${
                typeFilter === type.id
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Sort & Add Note */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as NoteSortOrder)}
              className="bg-slate-800/80 border border-white/15 rounded-lg px-2 py-1 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="time_desc">最新时间</option>
              <option value="time_asc">最早时间</option>
              <option value="page_asc">按页码/章节</option>
            </select>
          </div>

          <button
            onClick={() => onAddNoteForBook(book.id)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md shadow-indigo-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>记本书笔记</span>
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold text-slate-200 font-serif flex items-center gap-1">
            <FileText className="w-4 h-4 text-indigo-400" />
            本书读书笔记 ({filteredNotes.length} 条)
          </span>
          {notes.some((n) => n.isPinned) && (
            <span className="text-[11px] text-amber-400 font-medium">包含已置顶笔记</span>
          )}
        </div>

        {filteredNotes.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-10 text-center border border-white/10 shadow-xl">
            <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-200 font-serif">本书暂无对应类型的笔记</p>
            <p className="text-xs text-slate-400 mt-1">记录书本原文与个人思考，积累深刻的阅读灵感</p>
            <button
              onClick={() => onAddNoteForBook(book.id)}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1 shadow-lg shadow-indigo-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>新增第一条读书笔记</span>
            </button>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              book={book}
              onEdit={onEditNote}
              onDelete={onDeleteNote}
              onTogglePin={onTogglePinNote}
              onSelectTag={onSelectTag}
            />
          ))
        )}
      </div>
    </div>
  );
};

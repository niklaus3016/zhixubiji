import React, { useState } from 'react';
import { Book, ReadingNote, ViewMode, BookFilterStatus, BookFilterArchive, BookSortOrder } from '../types';
import { BookCard } from '../components/BookCard';
import { LayoutGrid, List, Plus, Archive, Filter, BookOpen } from 'lucide-react';

interface LibraryViewProps {
  books: Book[];
  notes: ReadingNote[];
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
  onOpenBook: (bookId: string) => void;
  onOpenAddBookModal: () => void;
  onEditBook: (book: Book) => void;
  onToggleArchive: (book: Book) => void;
  onDeleteBook: (book: Book) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  books,
  notes,
  viewMode,
  onSetViewMode,
  onOpenBook,
  onOpenAddBookModal,
  onEditBook,
  onToggleArchive,
  onDeleteBook,
}) => {
  const [statusFilter, setStatusFilter] = useState<BookFilterStatus>('all');
  const [archiveFilter, setArchiveFilter] = useState<BookFilterArchive>('unarchived');
  const [sortOrder, setSortOrder] = useState<BookSortOrder>('newest');

  // Note count per book map
  const noteCountMap = new Map<string, number>();
  notes.forEach((n) => {
    noteCountMap.set(n.bookId, (noteCountMap.get(n.bookId) || 0) + 1);
  });

  // Calculate stats
  const totalBooks = books.length;
  const readingCount = books.filter((b) => b.status === 'reading').length;
  const finishedCount = books.filter((b) => b.status === 'finished').length;
  const wantCount = books.filter((b) => b.status === 'want_to_read').length;

  // Filter & Sort books
  const filteredBooks = books
    .filter((b) => {
      // Status filter
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;

      // Archive filter
      if (archiveFilter === 'unarchived' && b.isArchived) return false;
      if (archiveFilter === 'archived' && !b.isArchived) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') return b.createdAt - a.createdAt;
      return a.createdAt - b.createdAt;
    });

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner Overview */}
      <div className="bg-gradient-to-r from-slate-900/90 via-indigo-950/70 to-slate-900/90 text-white p-4 sm:p-4.5 rounded-2xl shadow-xl border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase font-semibold">
            知序·数字书架
          </span>
          <h2 className="text-base sm:text-lg font-bold font-serif text-slate-100 mt-0.5">我的私人阅读提炼库</h2>
          <p className="text-xs text-slate-300 mt-0.5">共收录 {totalBooks} 本书籍 · 累计 {notes.length} 条读书要点与心得</p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <div className="flex-1 sm:flex-none bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl text-center backdrop-blur-sm">
            <span className="block text-[10px] text-amber-300 font-medium">📖 在读</span>
            <span className="font-bold text-sm text-white">{readingCount}</span>
          </div>

          <div className="flex-1 sm:flex-none bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl text-center backdrop-blur-sm">
            <span className="block text-[10px] text-emerald-400 font-medium">✅ 已读完</span>
            <span className="font-bold text-sm text-white">{finishedCount}</span>
          </div>

          <div className="flex-1 sm:flex-none bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl text-center backdrop-blur-sm">
            <span className="block text-[10px] text-indigo-300 font-medium">📌 想读</span>
            <span className="font-bold text-sm text-white">{wantCount}</span>
          </div>
        </div>
      </div>

      {/* Control / Filter Bar */}
      <div className="bg-white/5 backdrop-blur-xl p-3 rounded-2xl shadow-xl border border-white/10 space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar max-w-full">
            {[
              { id: 'all', label: '全部' },
              { id: 'reading', label: '📖 在读' },
              { id: 'finished', label: '✅ 已读完' },
              { id: 'want_to_read', label: '📌 想读' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id as BookFilterStatus)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition shrink-0 ${
                  statusFilter === st.id
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* View Mode & Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-white/10">
              <button
                onClick={() => onSetViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-white/15 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="网格视图"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSetViewMode('list')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'list' ? 'bg-white/15 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="列表视图"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onOpenAddBookModal}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-md shadow-indigo-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>录入书籍</span>
            </button>
          </div>
        </div>

        {/* Secondary Filters: Archive & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-white/10 text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-slate-400 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              归档:
            </span>
            <select
              value={archiveFilter}
              onChange={(e) => setArchiveFilter(e.target.value as BookFilterArchive)}
              className="bg-slate-800/80 border border-white/15 rounded-lg px-2 py-1 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="unarchived">未归档 (默认)</option>
              <option value="archived">已归档</option>
              <option value="all">全部</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 shrink-0">排序:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as BookSortOrder)}
              className="bg-slate-800/80 border border-white/15 rounded-lg px-2 py-1 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="newest">最新添加</option>
              <option value="oldest">最早添加</option>
            </select>
          </div>
        </div>
      </div>

      {/* Book Grid / List Content */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-10 text-center border border-white/10 shadow-xl my-6">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200 font-serif">暂无匹配的书籍</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {books.length === 0
              ? '知序笔记专注服务读书场景，请手动录入第一本要阅读的书籍吧。'
              : '没有找到当前筛选条件下的书籍，尝试切换“阅读状态”或“归档状态”。'}
          </p>
          <button
            onClick={onOpenAddBookModal}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>立即录入新书</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              noteCount={noteCountMap.get(book.id) || 0}
              viewMode="grid"
              onOpenBook={onOpenBook}
              onEditBook={onEditBook}
              onToggleArchive={onToggleArchive}
              onDeleteBook={onDeleteBook}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              noteCount={noteCountMap.get(book.id) || 0}
              viewMode="list"
              onOpenBook={onOpenBook}
              onEditBook={onEditBook}
              onToggleArchive={onToggleArchive}
              onDeleteBook={onDeleteBook}
            />
          ))}
        </div>
      )}
    </div>
  );
};

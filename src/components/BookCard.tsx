import React, { useState, useRef, useEffect } from 'react';
import { Book, ViewMode } from '../types';
import { getStatusBadge } from '../lib/formatters';
import { MoreVertical, BookOpen, Archive, ArchiveRestore, Trash2, Edit3, FileText } from 'lucide-react';

interface BookCardProps {
  book: Book;
  noteCount: number;
  viewMode: ViewMode;
  onOpenBook: (bookId: string) => void;
  onEditBook: (book: Book) => void;
  onToggleArchive: (book: Book) => void;
  onDeleteBook: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  noteCount,
  viewMode,
  onOpenBook,
  onEditBook,
  onToggleArchive,
  onDeleteBook,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const statusInfo = getStatusBadge(book.status);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderCover = () => {
    if (book.coverUrl && book.coverUrl.trim().length > 0) {
      return (
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-full object-cover rounded-md shadow-xs group-hover:scale-105 transition duration-300"
          onError={(e) => {
            // Fallback to placeholder on broken image
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
          }}
        />
      );
    }

    // Default Book Spine Placeholder
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-800 via-indigo-950 to-slate-900 text-slate-100 p-3 flex flex-col justify-between rounded-md shadow-lg border-l-4 border-indigo-500/80 group-hover:scale-105 transition duration-300 select-none">
        <div className="text-xs text-indigo-300/80 font-mono tracking-widest uppercase">知序·图书</div>
        <div>
          <h4 className="font-serif font-bold text-sm leading-snug line-clamp-2 text-white">{book.title}</h4>
          <p className="text-[11px] text-slate-300/80 mt-1 line-clamp-1">{book.author}</p>
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-white/10 pt-1.5">
          <span>{noteCount} 笔记</span>
          <BookOpen className="w-3 h-3 text-indigo-400" />
        </div>
      </div>
    );
  };

  if (viewMode === 'list') {
    return (
      <div className="relative group bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white/10 hover:border-white/20 transition flex items-center justify-between gap-3">
        <div
          onClick={() => onOpenBook(book.id)}
          className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
        >
          <div className="w-12 h-16 shrink-0 relative bg-slate-800 rounded overflow-hidden shadow-xs">
            {renderCover()}
            <div className="hidden absolute inset-0 bg-slate-800 p-1 text-[9px] text-slate-100 flex flex-col justify-center text-center">
              <span className="line-clamp-2 font-serif">{book.title}</span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-base truncate font-serif">{book.title}</h3>
              {book.isArchived && (
                <span className="text-[10px] bg-slate-800 text-slate-400 border border-white/10 px-1.5 py-0.5 rounded font-medium shrink-0">
                  已归档
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{book.author}</p>

            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${statusInfo.bg}`}>
                {statusInfo.label}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                <FileText className="w-3 h-3 text-slate-400" />
                {noteCount} 条笔记
              </span>
            </div>
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
            title="更多操作"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-36 bg-slate-900/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/15 py-1 z-20 text-xs text-slate-200 animate-in fade-in duration-150">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEditBook(book);
                }}
                className="w-full text-left px-3 py-2 hover:bg-white/10 flex items-center gap-2 text-slate-200"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                <span>编辑书籍</span>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  onToggleArchive(book);
                }}
                className="w-full text-left px-3 py-2 hover:bg-white/10 flex items-center gap-2 text-slate-200"
              >
                {book.isArchived ? (
                  <>
                    <ArchiveRestore className="w-3.5 h-3.5 text-slate-400" />
                    <span>取消归档</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-3.5 h-3.5 text-slate-400" />
                    <span>归档书籍</span>
                  </>
                )}
              </button>

              <div className="my-1 border-t border-white/10" />

              <button
                onClick={() => {
                  setShowMenu(false);
                  onDeleteBook(book);
                }}
                className="w-full text-left px-3 py-2 hover:bg-red-500/20 flex items-center gap-2 text-red-400 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>删除书籍</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="relative group bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl p-3.5 shadow-xl hover:shadow-2xl border border-white/10 hover:border-white/20 transition flex flex-col justify-between h-full">
      <div onClick={() => onOpenBook(book.id)} className="cursor-pointer">
        {/* Cover Box */}
        <div className="w-full aspect-3/4 relative bg-slate-800/80 rounded-xl overflow-hidden shadow-lg mb-3">
          {renderCover()}
          <div className="hidden absolute inset-0 bg-slate-800 p-2 text-xs text-slate-100 flex flex-col justify-center text-center">
            <span className="line-clamp-3 font-serif font-bold">{book.title}</span>
            <span className="text-[10px] text-slate-400 mt-1">{book.author}</span>
          </div>

          <div className="absolute top-2 left-2 flex gap-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full border shadow-2xs font-medium backdrop-blur-md ${statusInfo.bg}`}>
              {statusInfo.label}
            </span>
            {book.isArchived && (
              <span className="text-[10px] bg-slate-900/80 text-slate-300 border border-white/10 px-1.5 py-0.5 rounded-full backdrop-blur-md font-medium">
                已归档
              </span>
            )}
          </div>
        </div>

        <h3 className="font-bold text-white text-sm leading-snug line-clamp-1 font-serif group-hover:text-indigo-300 transition">
          {book.title}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{book.author}</p>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10 text-xs text-slate-400">
        <span className="flex items-center gap-1 text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
          <FileText className="w-3 h-3 text-slate-400" />
          {noteCount} 笔记
        </span>

        {/* Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 bottom-7 w-36 bg-slate-900/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/15 py-1 z-20 text-xs text-slate-200 animate-in fade-in duration-150">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onEditBook(book);
                }}
                className="w-full text-left px-3 py-2 hover:bg-white/10 flex items-center gap-2 text-slate-200"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                <span>编辑书籍</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onToggleArchive(book);
                }}
                className="w-full text-left px-3 py-2 hover:bg-white/10 flex items-center gap-2 text-slate-200"
              >
                {book.isArchived ? (
                  <>
                    <ArchiveRestore className="w-3.5 h-3.5 text-slate-400" />
                    <span>取消归档</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-3.5 h-3.5 text-slate-400" />
                    <span>归档书籍</span>
                  </>
                )}
              </button>

              <div className="my-1 border-t border-white/10" />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onDeleteBook(book);
                }}
                className="w-full text-left px-3 py-2 hover:bg-red-500/20 flex items-center gap-2 text-red-400 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>删除书籍</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

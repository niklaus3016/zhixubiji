import React, { useState, useMemo } from 'react';
import { Book, ReadingNote, NoteType } from '../types';
import { Search, X, BookOpen, FileText } from 'lucide-react';
import { NoteCard } from './NoteCard';

interface GlobalSearchModalProps {
  isOpen: boolean;
  books: Book[];
  notes: ReadingNote[];
  onClose: () => void;
  onOpenBook: (bookId: string) => void;
  onEditNote: (note: ReadingNote) => void;
  onDeleteNote: (note: ReadingNote) => void;
  onTogglePinNote: (noteId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  books,
  notes,
  onClose,
  onOpenBook,
  onEditNote,
  onDeleteNote,
  onTogglePinNote,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | NoteType>('all');

  const bookMap = useMemo(() => {
    const map = new Map<string, Book>();
    books.forEach((b) => map.set(b.id, b));
    return map;
  }, [books]);

  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return { matchingBooks: [], matchingNotes: [] };
    }

    const query = searchTerm.toLowerCase().trim();

    // Matching Books
    const matchingBooks = books.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        (b.description && b.description.toLowerCase().includes(query))
    );

    // Matching Notes
    const matchingNotes = notes.filter((n) => {
      // Type check
      if (typeFilter !== 'all' && n.type !== typeFilter) return false;

      const boundBook = bookMap.get(n.bookId);
      const bookTitleMatch = boundBook ? boundBook.title.toLowerCase().includes(query) : false;
      const authorMatch = boundBook ? boundBook.author.toLowerCase().includes(query) : false;
      const quoteMatch = n.quote ? n.quote.toLowerCase().includes(query) : false;
      const thoughtMatch = n.thought ? n.thought.toLowerCase().includes(query) : false;
      const pageMatch = n.pageChapter ? n.pageChapter.toLowerCase().includes(query) : false;
      const tagMatch = n.tags ? n.tags.some((t) => t.toLowerCase().includes(query)) : false;

      return bookTitleMatch || authorMatch || quoteMatch || thoughtMatch || pageMatch || tagMatch;
    });

    return { matchingBooks, matchingNotes };
  }, [searchTerm, typeFilter, books, notes, bookMap]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden">
      <div className="m-auto bg-slate-900/95 text-slate-100 backdrop-blur-2xl rounded-2xl max-w-2xl w-full max-h-[85vh] sm:max-h-[90vh] flex flex-col shadow-2xl border border-white/15 overflow-hidden">
        {/* Search Header */}
        <div className="p-4 bg-slate-900/80 border-b border-white/10 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索书名、作者、原文摘录、个人思考、页码或标签..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/15 bg-slate-800/80 text-white placeholder-slate-500 focus:bg-slate-800 focus:outline-none focus:border-indigo-500 text-sm font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-3 py-2 text-sm text-slate-300 hover:bg-white/10 rounded-xl transition font-medium"
            >
              关闭
            </button>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
            <span className="text-slate-400 text-[11px] font-medium mr-1">笔记类型:</span>
            {[
              { id: 'all', label: '全部' },
              { id: 'excerpt', label: '📝 原文摘录' },
              { id: 'summary', label: '💡 要点总结' },
              { id: 'reflection', label: '✍️ 个人感悟' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTypeFilter(item.id as 'all' | NoteType)}
                className={`px-2.5 py-1 rounded-lg border transition ${
                  typeFilter === item.id
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-semibold'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {!searchTerm.trim() ? (
            <div className="text-center py-12 text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-40 text-indigo-400" />
              <p className="text-sm font-medium text-slate-300">输入关键词即可模糊检索全站书库与笔记</p>
              <p className="text-xs text-slate-400 mt-1">支持匹配：书名、作者、原文词句、笔记心得、章节点</p>
            </div>
          ) : filteredResults.matchingBooks.length === 0 && filteredResults.matchingNotes.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">未找到与 “{searchTerm}” 相关的书籍或笔记</p>
            </div>
          ) : (
            <>
              {/* Matching Books Section */}
              {filteredResults.matchingBooks.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    匹配到的书籍 ({filteredResults.matchingBooks.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredResults.matchingBooks.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          onClose();
                          onOpenBook(b.id);
                        }}
                        className="bg-white/5 p-3 rounded-xl border border-white/10 hover:border-indigo-400/50 hover:bg-white/10 transition cursor-pointer flex items-center gap-3"
                      >
                        <div className="w-10 h-14 bg-slate-800 rounded overflow-hidden shrink-0">
                          {b.coverUrl ? (
                            <img src={b.coverUrl} alt={b.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-slate-800 text-indigo-300 flex items-center justify-center text-[10px] p-1 font-serif">
                              {b.title}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-white text-sm truncate font-serif">{b.title}</h5>
                          <p className="text-xs text-slate-400 truncate">{b.author}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Notes Section */}
              {filteredResults.matchingNotes.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    匹配到的读书笔记 ({filteredResults.matchingNotes.length})
                  </h4>
                  <div className="space-y-3">
                    {filteredResults.matchingNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        book={bookMap.get(note.bookId)}
                        onEdit={(n) => {
                          onClose();
                          onEditNote(n);
                        }}
                        onDelete={onDeleteNote}
                        onTogglePin={onTogglePinNote}
                        onOpenBook={(bId) => {
                          onClose();
                          onOpenBook(bId);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

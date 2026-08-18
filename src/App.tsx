import { useState, useEffect, useCallback } from 'react';
import { Book, ReadingNote, Tag, ViewMode, AppDataExport } from './types';
import {
  initDatabase,
  getAllBooks,
  saveBook,
  deleteBook as dbDeleteBook,
  getAllNotes,
  saveNote,
  deleteNote as dbDeleteNote,
  togglePinNote as dbTogglePinNote,
  getAllTags,
  saveTag,
  updateTagName as dbUpdateTagName,
  deleteTag as dbDeleteTag,
  exportAppData,
  importAppData,
  clearAllDatabase,
} from './lib/db';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { BookModal } from './components/BookModal';
import { ConfirmModal } from './components/ConfirmModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { PrivacyConsent } from './components/PrivacyConsent';

import { LibraryView } from './views/LibraryView';
import { BookDetailView } from './views/BookDetailView';
import { NoteEditView } from './views/NoteEditView';
import { TagsView } from './views/TagsView';
import { StatsView } from './views/StatsView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  const [hasAgreedToPrivacy, setHasAgreedToPrivacy] = useState<boolean>(() => {
    return localStorage.getItem('zhixu_privacy_agreed') === 'true';
  });

  const [activeTab, setActiveTab] = useState<string>('library');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const handleAcceptPrivacy = () => {
    localStorage.setItem('zhixu_privacy_agreed', 'true');
    setHasAgreedToPrivacy(true);
  };

  // Local state
  const [books, setBooks] = useState<Book[]>([]);
  const [notes, setNotes] = useState<ReadingNote[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // View Preferences
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('zhixu_view_mode') as ViewMode) || 'grid';
  });

  // Modal States
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [noteToEdit, setNoteToEdit] = useState<ReadingNote | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Confirmation Modals
  const [deleteBookModal, setDeleteBookModal] = useState<{
    isOpen: boolean;
    book: Book | null;
  }>({ isOpen: false, book: null });

  const [deleteNoteModal, setDeleteNoteModal] = useState<{
    isOpen: boolean;
    note: ReadingNote | null;
  }>({ isOpen: false, note: null });

  // Load Data from IndexedDB
  const refreshData = useCallback(async () => {
    try {
      const [fetchedBooks, fetchedNotes, fetchedTags] = await Promise.all([
        getAllBooks(),
        getAllNotes(),
        getAllTags(),
      ]);
      setBooks(fetchedBooks);
      setNotes(fetchedNotes);
      setTags(fetchedTags);
    } catch (err) {
      console.error('Failed to fetch data from IndexedDB:', err);
    }
  }, []);

  useEffect(() => {
    initDatabase()
      .then(() => refreshData())
      .finally(() => setIsLoading(false));
  }, [refreshData]);

  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('zhixu_view_mode', mode);
  };

  // BOOK HANDLERS
  const handleOpenBook = (bookId: string) => {
    setSelectedBookId(bookId);
    setActiveTab('book_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveBook = async (
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'> & { id?: string }
  ) => {
    const now = Date.now();
    const existingBook = books.find((b) => b.id === bookData.id);

    const bookToSave: Book = {
      id: bookData.id || `book_${now}`,
      title: bookData.title,
      author: bookData.author,
      coverUrl: bookData.coverUrl,
      description: bookData.description,
      status: bookData.status,
      startDate: bookData.startDate,
      finishDate: bookData.finishDate,
      isArchived: existingBook ? existingBook.isArchived : false,
      createdAt: existingBook ? existingBook.createdAt : now,
      updatedAt: now,
    };

    await saveBook(bookToSave);
    await refreshData();
  };

  const handleToggleArchiveBook = async (book: Book) => {
    const updated: Book = {
      ...book,
      isArchived: !book.isArchived,
      updatedAt: Date.now(),
    };
    await saveBook(updated);
    await refreshData();
  };

  const handleConfirmDeleteBookOnly = async () => {
    if (!deleteBookModal.book) return;
    await dbDeleteBook(deleteBookModal.book.id, false); // Keep notes
    setDeleteBookModal({ isOpen: false, book: null });
    if (selectedBookId === deleteBookModal.book.id) {
      setSelectedBookId(null);
      setActiveTab('library');
    }
    await refreshData();
  };

  const handleConfirmDeleteBookAndNotes = async () => {
    if (!deleteBookModal.book) return;
    await dbDeleteBook(deleteBookModal.book.id, true); // Delete book + notes
    setDeleteBookModal({ isOpen: false, book: null });
    if (selectedBookId === deleteBookModal.book.id) {
      setSelectedBookId(null);
      setActiveTab('library');
    }
    await refreshData();
  };

  // NOTE HANDLERS
  const handleOpenAddNote = (prebookId?: string) => {
    setNoteToEdit(null);
    if (prebookId) {
      setSelectedBookId(prebookId);
    }
    setActiveTab('note_edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEditNote = (note: ReadingNote) => {
    setNoteToEdit(note);
    setActiveTab('note_edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveNote = async (
    noteData: Omit<ReadingNote, 'id' | 'createdAt' | 'updatedAt' | 'isPinned'> & { id?: string }
  ) => {
    const now = Date.now();
    const existingNote = notes.find((n) => n.id === noteData.id);

    const noteToSave: ReadingNote = {
      id: noteData.id || `note_${now}`,
      bookId: noteData.bookId,
      pageChapter: noteData.pageChapter,
      type: noteData.type,
      quote: noteData.quote,
      thought: noteData.thought,
      tags: noteData.tags,
      isPinned: existingNote ? existingNote.isPinned : false,
      createdAt: existingNote ? existingNote.createdAt : now,
      updatedAt: now,
    };

    await saveNote(noteToSave);
    await refreshData();

    // Navigate back to book detail or library
    if (noteData.bookId) {
      setSelectedBookId(noteData.bookId);
      setActiveTab('book_detail');
    } else {
      setActiveTab('library');
    }
  };

  const handleTogglePinNote = async (noteId: string) => {
    await dbTogglePinNote(noteId);
    await refreshData();
  };

  const handleConfirmDeleteNote = async () => {
    if (!deleteNoteModal.note) return;
    await dbDeleteNote(deleteNoteModal.note.id);
    setDeleteNoteModal({ isOpen: false, note: null });
    await refreshData();
  };

  // TAG HANDLERS
  const handleAddNewTag = async (tagName: string) => {
    if (!tagName.trim()) return;
    const cleanName = tagName.trim();
    if (!tags.some((t) => t.name === cleanName)) {
      const newTag: Tag = {
        id: `tag_${Date.now()}`,
        name: cleanName,
        createdAt: Date.now(),
      };
      await saveTag(newTag);
      await refreshData();
    }
  };

  const handleEditTagName = async (tagId: string, oldName: string, newName: string) => {
    await dbUpdateTagName(tagId, oldName, newName);
    await refreshData();
  };

  const handleDeleteTag = async (tagId: string, tagName: string) => {
    await dbDeleteTag(tagId, tagName);
    await refreshData();
  };

  // IMPORT / EXPORT / CLEAR
  const handleExportData = async (): Promise<AppDataExport> => {
    return await exportAppData();
  };

  const handleImportData = async (data: AppDataExport): Promise<void> => {
    await importAppData(data);
    await refreshData();
  };

  const handleClearAllData = async (): Promise<void> => {
    await clearAllDatabase();
    setSelectedBookId(null);
    setActiveTab('library');
    await refreshData();
  };

  const currentBook = books.find((b) => b.id === selectedBookId);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-indigo-500/30 antialiased flex flex-col relative overflow-x-hidden">
      {!hasAgreedToPrivacy && <PrivacyConsent onAccept={handleAcceptPrivacy} />}
      {/* Background Mesh Light Orbs for Frosted Glass Depth */}
      <div className="fixed -top-25 -left-25 w-125 h-125 bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed -bottom-25 -right-25 w-112.5 h-112.5 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-[40%] -right-25 w-87.5 h-87.5 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Container Frame with Frosted Glassmorphism */}
      <div className="w-full max-w-2xl mx-auto min-h-screen flex flex-col bg-slate-900/70 backdrop-blur-2xl sm:border-x border-white/10 shadow-2xl relative z-10">
        {/* Top Navigation Header */}
        <Header
          activeTab={activeTab}
          selectedBookTitle={activeTab === 'book_detail' ? currentBook?.title : undefined}
          onGoBack={
            activeTab === 'book_detail'
              ? () => {
                  setSelectedBookId(null);
                  setActiveTab('library');
                }
              : activeTab === 'note_edit'
              ? () => setActiveTab('library')
              : undefined
          }
          onOpenSearch={() => setIsSearchModalOpen(true)}
        />

        {/* Main Body View */}
        <main className="flex-1 p-3 sm:p-5 pb-24 sm:pb-28">
          {isLoading ? (
            <div className="py-20 text-center text-stone-400 space-y-2">
              <div className="w-8 h-8 border-3 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-serif font-medium">加载本地知序离线数据库...</p>
            </div>
          ) : (
            <>
              {/* 1. 書籍庫 (Library) */}
              {activeTab === 'library' && (
                <LibraryView
                  books={books}
                  notes={notes}
                  viewMode={viewMode}
                  onSetViewMode={handleSetViewMode}
                  onOpenBook={handleOpenBook}
                  onOpenAddBookModal={() => {
                    setBookToEdit(null);
                    setIsBookModalOpen(true);
                  }}
                  onEditBook={(book) => {
                    setBookToEdit(book);
                    setIsBookModalOpen(true);
                  }}
                  onToggleArchive={handleToggleArchiveBook}
                  onDeleteBook={(book) => setDeleteBookModal({ isOpen: true, book })}
                />
              )}

              {/* 2. 書籍詳情頁 (Book Detail) */}
              {activeTab === 'book_detail' && currentBook && (
                <BookDetailView
                  book={currentBook}
                  notes={notes.filter((n) => n.bookId === currentBook.id)}
                  onGoBack={() => {
                    setSelectedBookId(null);
                    setActiveTab('library');
                  }}
                  onEditBook={(book) => {
                    setBookToEdit(book);
                    setIsBookModalOpen(true);
                  }}
                  onAddNoteForBook={(bookId) => handleOpenAddNote(bookId)}
                  onEditNote={handleOpenEditNote}
                  onDeleteNote={(note) => setDeleteNoteModal({ isOpen: true, note })}
                  onTogglePinNote={handleTogglePinNote}
                  onSelectTag={(_tagName) => {
                    setActiveTab('tags');
                  }}
                />
              )}

              {/* 3. 筆記編輯頁 (Note Edit / Create) */}
              {activeTab === 'note_edit' && (
                <NoteEditView
                  books={books}
                  tags={tags}
                  noteToEdit={noteToEdit}
                  preselectedBookId={selectedBookId || undefined}
                  onSave={handleSaveNote}
                  onAddNewTag={handleAddNewTag}
                  onCancel={() => {
                    if (selectedBookId) {
                      setActiveTab('book_detail');
                    } else {
                      setActiveTab('library');
                    }
                  }}
                />
              )}

              {/* 4. 標籤彙總頁 (Tags Aggregation) */}
              {activeTab === 'tags' && (
                <TagsView
                  tags={tags}
                  notes={notes}
                  books={books}
                  onAddNewTag={handleAddNewTag}
                  onEditTagName={handleEditTagName}
                  onDeleteTag={handleDeleteTag}
                  onEditNote={handleOpenEditNote}
                  onDeleteNote={(note) => setDeleteNoteModal({ isOpen: true, note })}
                  onTogglePinNote={handleTogglePinNote}
                  onOpenBook={handleOpenBook}
                />
              )}

              {/* 5. 閱讀數據 (Stats) */}
              {activeTab === 'stats' && <StatsView books={books} notes={notes} tags={tags} />}

              {/* 6. 設置 (Settings) */}
              {activeTab === 'settings' && (
                <SettingsView
                  onExportData={handleExportData}
                  onImportData={handleImportData}
                  onClearAllData={handleClearAllData}
                />
              )}
            </>
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'note_edit') {
              setNoteToEdit(null);
            }
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Modals */}
        <BookModal
          isOpen={isBookModalOpen}
          bookToEdit={bookToEdit}
          onSave={handleSaveBook}
          onClose={() => {
            setIsBookModalOpen(false);
            setBookToEdit(null);
          }}
        />

        <GlobalSearchModal
          isOpen={isSearchModalOpen}
          books={books}
          notes={notes}
          onClose={() => setIsSearchModalOpen(false)}
          onOpenBook={handleOpenBook}
          onEditNote={handleOpenEditNote}
          onDeleteNote={(note) => setDeleteNoteModal({ isOpen: true, note })}
          onTogglePinNote={handleTogglePinNote}
        />

        {/* Confirm Book Delete Modal */}
        <ConfirmModal
          isOpen={deleteBookModal.isOpen}
          title="删除书籍"
          message={`确定要删除书籍《${deleteBookModal.book?.title}》吗？你可以选择只删除书籍保留笔记，或清空该书的全部笔记。`}
          confirmLabel="删除书籍+清空该书全部笔记"
          extraOptionLabel="仅删除书籍 (保留笔记)"
          isDanger
          onConfirm={handleConfirmDeleteBookAndNotes}
          onExtraOptionConfirm={handleConfirmDeleteBookOnly}
          onCancel={() => setDeleteBookModal({ isOpen: false, book: null })}
        />

        {/* Confirm Note Delete Modal */}
        <ConfirmModal
          isOpen={deleteNoteModal.isOpen}
          title="删除读书笔记"
          message="确定要彻底删除这条读书笔记吗？删除后不可撤销。"
          confirmLabel="确认删除"
          isDanger
          onConfirm={handleConfirmDeleteNote}
          onCancel={() => setDeleteNoteModal({ isOpen: false, note: null })}
        />
      </div>
    </div>
  );
}

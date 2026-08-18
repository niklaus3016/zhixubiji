import { Book, ReadingNote, Tag, AppDataExport } from '../types';

const DB_NAME = 'ZhixuNotesDB';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('books')) {
        db.createObjectStore('books', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('notes')) {
        const noteStore = db.createObjectStore('notes', { keyPath: 'id' });
        noteStore.createIndex('bookId', 'bookId', { unique: false });
      }
      if (!db.objectStoreNames.contains('tags')) {
        db.createObjectStore('tags', { keyPath: 'id' });
      }
    };
  });
}

// Initialize database on first load (creates object stores, no seed data)
export async function initDatabase(): Promise<void> {
  await openDB();
}

// BOOK OPERATIONS
export async function getAllBooks(): Promise<Book[]> {
  const db = await openDB();
  const tx = db.transaction('books', 'readonly');
  const store = tx.objectStore('books');
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function saveBook(book: Book): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('books', 'readwrite');
  const store = tx.objectStore('books');
  await new Promise<void>((resolve, reject) => {
    const req = store.put(book);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteBook(bookId: string, deleteNotes: boolean = true): Promise<void> {
  const db = await openDB();
  
  if (deleteNotes) {
    const notes = await getNotesByBookId(bookId);
    const txNotes = db.transaction('notes', 'readwrite');
    const noteStore = txNotes.objectStore('notes');
    notes.forEach((n) => noteStore.delete(n.id));
    await new Promise<void>((resolve) => { txNotes.oncomplete = () => resolve(); });
  }

  const tx = db.transaction('books', 'readwrite');
  const store = tx.objectStore('books');
  await new Promise<void>((resolve, reject) => {
    const req = store.delete(bookId);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// NOTE OPERATIONS
export async function getAllNotes(): Promise<ReadingNote[]> {
  const db = await openDB();
  const tx = db.transaction('notes', 'readonly');
  const store = tx.objectStore('notes');
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function getNotesByBookId(bookId: string): Promise<ReadingNote[]> {
  const allNotes = await getAllNotes();
  return allNotes.filter((n) => n.bookId === bookId);
}

export async function saveNote(note: ReadingNote): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('notes', 'readwrite');
  const store = tx.objectStore('notes');
  await new Promise<void>((resolve, reject) => {
    const req = store.put(note);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteNote(noteId: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('notes', 'readwrite');
  const store = tx.objectStore('notes');
  await new Promise<void>((resolve, reject) => {
    const req = store.delete(noteId);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function togglePinNote(noteId: string): Promise<boolean> {
  const allNotes = await getAllNotes();
  const target = allNotes.find((n) => n.id === noteId);
  if (target) {
    target.isPinned = !target.isPinned;
    target.updatedAt = Date.now();
    await saveNote(target);
    return target.isPinned;
  }
  return false;
}

// TAG OPERATIONS
export async function getAllTags(): Promise<Tag[]> {
  const db = await openDB();
  const tx = db.transaction('tags', 'readonly');
  const store = tx.objectStore('tags');
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function saveTag(tag: Tag): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('tags', 'readwrite');
  const store = tx.objectStore('tags');
  await new Promise<void>((resolve, reject) => {
    const req = store.put(tag);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function updateTagName(tagId: string, oldName: string, newName: string): Promise<void> {
  if (oldName === newName) return;
  const db = await openDB();
  
  // Update tag store
  const tags = await getAllTags();
  const tag = tags.find((t) => t.id === tagId);
  if (tag) {
    tag.name = newName;
    await saveTag(tag);
  }

  // Sync update all notes binding this tag
  const notes = await getAllNotes();
  const notesToUpdate = notes.filter((n) => n.tags.includes(oldName));
  
  for (const note of notesToUpdate) {
    note.tags = note.tags.map((t) => (t === oldName ? newName : t));
    await saveNote(note);
  }
}

export async function deleteTag(tagId: string, tagName: string): Promise<void> {
  const db = await openDB();
  
  // Delete tag from store
  const txTag = db.transaction('tags', 'readwrite');
  txTag.objectStore('tags').delete(tagId);
  await new Promise<void>((resolve) => { txTag.oncomplete = () => resolve(); });

  // Unbind tag from notes without deleting note content
  const notes = await getAllNotes();
  const notesToUpdate = notes.filter((n) => n.tags.includes(tagName));

  for (const note of notesToUpdate) {
    note.tags = note.tags.filter((t) => t !== tagName);
    await saveNote(note);
  }
}

// IMPORT / EXPORT DATA
export async function exportAppData(): Promise<AppDataExport> {
  const books = await getAllBooks();
  const notes = await getAllNotes();
  const tags = await getAllTags();

  return {
    version: '1.0',
    appName: '知序笔记',
    exportedAt: new Date().toISOString(),
    books,
    notes,
    tags,
  };
}

export async function importAppData(data: AppDataExport): Promise<void> {
  if (!data || !Array.isArray(data.books) || !Array.isArray(data.notes)) {
    throw new Error('无效的备份数据格式');
  }

  const db = await openDB();
  const tx = db.transaction(['books', 'notes', 'tags'], 'readwrite');
  
  const bookStore = tx.objectStore('books');
  const noteStore = tx.objectStore('notes');
  const tagStore = tx.objectStore('tags');

  bookStore.clear();
  noteStore.clear();
  tagStore.clear();

  data.books.forEach((b) => bookStore.put(b));
  data.notes.forEach((n) => noteStore.put(n));
  if (Array.isArray(data.tags)) {
    data.tags.forEach((t) => tagStore.put(t));
  }

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearAllDatabase(): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(['books', 'notes', 'tags'], 'readwrite');
  tx.objectStore('books').clear();
  tx.objectStore('notes').clear();
  tx.objectStore('tags').clear();
  await new Promise<void>((resolve) => {
    tx.oncomplete = () => resolve();
  });
}

export async function estimateStorageSize(): Promise<string> {
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      const usedBytes = estimate.usage || 0;
      if (usedBytes < 1024) return `${usedBytes} B`;
      if (usedBytes < 1024 * 1024) return `${(usedBytes / 1024).toFixed(1)} KB`;
      return `${(usedBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  } catch {
    // Fallback estimate
  }
  return '数据保存在本地 (IndexedDB)';
}

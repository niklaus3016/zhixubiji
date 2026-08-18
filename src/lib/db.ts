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

// Initial Seed Data
const DEFAULT_TAGS: Tag[] = [
  { id: 'tag_1', name: '经典名句', createdAt: Date.now() - 100000000 },
  { id: 'tag_2', name: '人生哲理', createdAt: Date.now() - 90000000 },
  { id: 'tag_3', name: '高效工作', createdAt: Date.now() - 80000000 },
  { id: 'tag_4', name: '思维模型', createdAt: Date.now() - 70000000 },
  { id: 'tag_5', name: '情节梳理', createdAt: Date.now() - 60000000 },
];

const DEFAULT_BOOKS: Book[] = [
  {
    id: 'book_1',
    title: '百年孤独',
    author: '加西亚·马尔克斯',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
    description: '拉丁美洲魔幻现实主义文学的代表作，描写了布恩迪亚家族七代人的传奇故事以及马孔多小镇的百年兴衰。',
    status: 'reading',
    startDate: '2026-07-15',
    finishDate: '',
    isArchived: false,
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'book_2',
    title: '深度工作',
    author: '卡尔·纽波特',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    description: '如何在认知过载的世界里复利你的专注力？探讨在干扰众多的现代社会中如何进行高质量深度思考与产出。',
    status: 'finished',
    startDate: '2026-06-01',
    finishDate: '2026-06-20',
    isArchived: false,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'book_3',
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80',
    description: '从认知革命、农业革命到科学革命，全景式梳理智人如何从一种无足轻重的动物成为地球的主宰者。',
    status: 'want_to_read',
    startDate: '',
    finishDate: '',
    isArchived: false,
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5,
  },
];

const DEFAULT_NOTES: ReadingNote[] = [
  {
    id: 'note_1',
    bookId: 'book_1',
    pageChapter: 'P. 382',
    type: 'excerpt',
    quote: '生命中曾经有过的所有灿烂，原来终究都需要用寂寞来偿还。',
    thought: '全书的绝妙结语之一。马尔克斯在这里探讨了孤独的宿命感，个体繁华落尽后的终极宁静。',
    tags: ['经典名句', '人生哲理'],
    isPinned: true,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'note_2',
    bookId: 'book_1',
    pageChapter: '第1章',
    type: 'reflection',
    quote: '许多年以后，面对打靶队，奥雷里亚诺·布恩迪亚上校将会想起父亲带他去参观冰块的那个遥远的下午。',
    thought: '极为经典的开篇首句，完美运用了倒叙与时间交错的预言叙事手法，预示着上校坎坷的人生经历。',
    tags: ['经典名句', '思维模型'],
    isPinned: false,
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 86400000 * 12,
  },
  {
    id: 'note_3',
    bookId: 'book_2',
    pageChapter: 'P. 18',
    type: 'excerpt',
    quote: '深度工作（Deep Work）：在无干扰的状态下进行职业活动，使个人的认知能力达到极限。这种努力能够创造新价值，提升技能，而且难以复制。',
    thought: '核心概念定义。在碎片化信息充斥的时代，深度工作能力是最稀缺的护城河。',
    tags: ['高效工作', '思维模型'],
    isPinned: true,
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 20,
  },
];

// Ensure DB is seeded on first load
export async function initDatabase(): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(['books', 'notes', 'tags'], 'readonly');
  const bookStore = tx.objectStore('books');
  
  const booksCount = await new Promise<number>((resolve) => {
    const req = bookStore.count();
    req.onsuccess = () => resolve(req.result);
  });

  if (booksCount === 0) {
    const writeTx = db.transaction(['books', 'notes', 'tags'], 'readwrite');
    const bStore = writeTx.objectStore('books');
    const nStore = writeTx.objectStore('notes');
    const tStore = writeTx.objectStore('tags');

    DEFAULT_BOOKS.forEach((b) => bStore.put(b));
    DEFAULT_NOTES.forEach((n) => nStore.put(n));
    DEFAULT_TAGS.forEach((t) => tStore.put(t));

    await new Promise<void>((resolve) => {
      writeTx.oncomplete = () => resolve();
    });
  }
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

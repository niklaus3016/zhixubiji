export type ReadingStatus = 'reading' | 'finished' | 'want_to_read';

export type NoteType = 'excerpt' | 'summary' | 'reflection';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  description?: string;
  status: ReadingStatus;
  startDate?: string;
  finishDate?: string;
  isArchived: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ReadingNote {
  id: string;
  bookId: string;
  pageChapter?: string;
  type: NoteType;
  quote: string;
  thought: string;
  tags: string[]; // tag names
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Tag {
  id: string;
  name: string;
  createdAt: number;
}

export type ViewMode = 'grid' | 'list';

export type BookFilterStatus = 'all' | 'reading' | 'finished' | 'want_to_read';

export type BookFilterArchive = 'unarchived' | 'archived' | 'all';

export type BookSortOrder = 'newest' | 'oldest';

export type NoteSortOrder = 'time_desc' | 'time_asc' | 'page_asc';

export interface AppDataExport {
  version: string;
  appName: string;
  exportedAt: string;
  books: Book[];
  notes: ReadingNote[];
  tags: Tag[];
}

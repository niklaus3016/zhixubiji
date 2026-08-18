import { ReadingStatus, NoteType, ReadingNote, Book } from '../types';

export function formatDate(timestampOrStr?: number | string): string {
  if (!timestampOrStr) return '';
  const date = typeof timestampOrStr === 'number' ? new Date(timestampOrStr) : new Date(timestampOrStr);
  if (isNaN(date.getTime())) return String(timestampOrStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateTime(timestamp: number): string {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${mins}`;
}

export function getStatusBadge(status: ReadingStatus) {
  switch (status) {
    case 'reading':
      return { label: '在读', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    case 'finished':
      return { label: '已读完', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    case 'want_to_read':
      return { label: '想读', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
  }
}

export function getNoteTypeBadge(type: NoteType) {
  switch (type) {
    case 'excerpt':
      return { label: '原文摘录', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: '📝' };
    case 'summary':
      return { label: '要点总结', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', icon: '💡' };
    case 'reflection':
      return { label: '个人感悟', bg: 'bg-teal-500/20 text-teal-300 border-teal-500/30', icon: '✍️' };
  }
}

export function formatSingleNoteText(note: ReadingNote, bookTitle?: string, author?: string): string {
  const parts: string[] = [];
  
  if (bookTitle) {
    let header = `《${bookTitle}》`;
    if (author) header += ` - ${author}`;
    if (note.pageChapter) header += ` | ${note.pageChapter}`;
    parts.push(header);
  } else if (note.pageChapter) {
    parts.push(`【位置】${note.pageChapter}`);
  }

  const typeInfo = getNoteTypeBadge(note.type);
  parts.push(`【笔记类型】${typeInfo.label}`);

  if (note.quote?.trim()) {
    parts.push(`【原文摘录】\n"${note.quote.trim()}"`);
  }

  if (note.thought?.trim()) {
    parts.push(`【个人思考】\n${note.thought.trim()}`);
  }

  if (note.tags && note.tags.length > 0) {
    parts.push(`【标签】${note.tags.map((t) => `#${t}`).join(' ')}`);
  }

  parts.push(`【时间】${formatDateTime(note.createdAt)}`);

  return parts.join('\n\n');
}

export function exportBookNotesMarkdown(book: Book, notes: ReadingNote[]): string {
  let md = `# 《${book.title}》 - 读书笔记\n\n`;
  md += `**作者**：${book.author}\n`;
  md += `**阅读状态**：${getStatusBadge(book.status).label}\n`;
  if (book.startDate) md += `**开始日期**：${book.startDate}\n`;
  if (book.finishDate) md += `**读完日期**：${book.finishDate}\n`;
  if (book.description) md += `**简介**：${book.description}\n`;
  md += `**笔记总计**：${notes.length} 条\n\n`;
  md += `---\n\n`;

  notes.forEach((note, idx) => {
    const typeLabel = getNoteTypeBadge(note.type).label;
    md += `### ${idx + 1}. [${typeLabel}] ${note.pageChapter ? note.pageChapter : '随感'}\n\n`;
    
    if (note.quote?.trim()) {
      md += `> **原文摘录**：\n> ${note.quote.trim().replace(/\n/g, '\n> ')}\n\n`;
    }

    if (note.thought?.trim()) {
      md += `**个人笔记与思考**：\n${note.thought.trim()}\n\n`;
    }

    if (note.tags && note.tags.length > 0) {
      md += `*标签*: ${note.tags.map((t) => `\`#${t}\``).join(' ')}\n\n`;
    }

    md += `*记录时间*: ${formatDateTime(note.createdAt)}\n\n`;
    md += `---\n\n`;
  });

  return md;
}

export function downloadFile(filename: string, content: string, contentType: string = 'text/plain;charset=utf-8;') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

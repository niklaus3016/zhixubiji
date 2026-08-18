import React, { useState } from 'react';
import { ReadingNote, Book } from '../types';
import { getNoteTypeBadge, formatDateTime, formatSingleNoteText, downloadFile } from '../lib/formatters';
import { Pin, Copy, Check, Edit3, Trash2, BookOpen, Tag as TagIcon, Download } from 'lucide-react';

interface NoteCardProps {
  note: ReadingNote;
  book?: Book;
  onEdit: (note: ReadingNote) => void;
  onDelete: (note: ReadingNote) => void;
  onTogglePin: (noteId: string) => void;
  onSelectTag?: (tagName: string) => void;
  onOpenBook?: (bookId: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  book,
  onEdit,
  onDelete,
  onTogglePin,
  onSelectTag,
  onOpenBook,
}) => {
  const [copied, setCopied] = useState(false);
  const typeBadge = getNoteTypeBadge(note.type);

  const handleCopy = () => {
    const formatted = formatSingleNoteText(note, book?.title, book?.author);
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportText = () => {
    const formatted = formatSingleNoteText(note, book?.title, book?.author);
    const fileName = `${book?.title || '读书笔记'}_${note.pageChapter || note.id}.txt`;
    downloadFile(fileName, formatted);
  };

  return (
    <div
      className={`relative rounded-2xl p-4.5 shadow-xl transition-all duration-200 border backdrop-blur-md ${
        note.isPinned
          ? 'border-amber-500/50 bg-gradient-to-b from-amber-500/15 via-white/5 to-white/5 shadow-amber-500/5'
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
      }`}
    >
      {/* Top Bar: Type, Location, Pin & Actions */}
      <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          {/* Note Type Badge */}
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1 ${typeBadge.bg}`}>
            <span>{typeBadge.icon}</span>
            <span>{typeBadge.label}</span>
          </span>

          {/* Location / Page */}
          {note.pageChapter && (
            <span className="text-xs bg-white/5 border border-white/10 text-slate-300 px-2.5 py-0.5 rounded-full font-mono">
              📍 {note.pageChapter}
            </span>
          )}

          {/* Book Name pill if available and clickable */}
          {book && (
            <button
              onClick={() => onOpenBook && onOpenBook(book.id)}
              className="text-xs text-indigo-300 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-serif transition"
            >
              <BookOpen className="w-3 h-3 text-indigo-400" />
              <span>《{book.title}》</span>
            </button>
          )}
        </div>

        {/* Pin & Quick Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onTogglePin(note.id)}
            className={`p-1.5 rounded-lg transition ${
              note.isPinned
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/10'
            }`}
            title={note.isPinned ? '取消置顶' : '置顶笔记'}
          >
            <Pin className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
            title="一键复制整条笔记"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleExportText}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
            title="导出为文本"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => onEdit(note)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
            title="编辑笔记"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(note)}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition"
            title="删除笔记"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Areas */}
      <div className="mt-3 space-y-3">
        {/* Original Quote Area (原文摘抄) */}
        {note.quote && note.quote.trim().length > 0 && (
          <div className="bg-amber-950/40 border-l-3 border-amber-500/90 rounded-r-xl p-3 text-amber-100/90 text-sm font-serif leading-relaxed relative shadow-inner">
            <span className="text-xs font-sans font-semibold text-amber-400/90 mb-1 block flex items-center gap-1">
              📖 书本原文：
            </span>
            <p className="whitespace-pre-wrap italic">"{note.quote.trim()}"</p>
          </div>
        )}

        {/* Personal Thought Area (个人思考/感悟) */}
        {note.thought && note.thought.trim().length > 0 && (
          <div className="bg-slate-800/60 rounded-xl p-3 border border-white/10 text-slate-200 text-sm leading-relaxed">
            <span className="text-xs font-semibold text-slate-400 mb-1 block flex items-center gap-1">
              ✍️ 个人笔记与思考：
            </span>
            <p className="whitespace-pre-wrap">{note.thought.trim()}</p>
          </div>
        )}
      </div>

      {/* Footer: Tags & Timestamp */}
      <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Tag chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {note.tags && note.tags.length > 0 ? (
            note.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onSelectTag && onSelectTag(tag)}
                className="text-[11px] bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10 transition"
              >
                <TagIcon className="w-2.5 h-2.5 text-slate-400" />
                <span>#{tag}</span>
              </button>
            ))
          ) : (
            <span className="text-[11px] text-slate-500">无标签</span>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[11px] text-slate-400 font-mono">
          {formatDateTime(note.updatedAt || note.createdAt)}
        </span>
      </div>
    </div>
  );
};

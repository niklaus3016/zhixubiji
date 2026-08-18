import React from 'react';
import { Bold, Italic, Strikethrough, List, ListOrdered, Minus, Sparkles } from 'lucide-react';

interface RichToolbarProps {
  onInsert: (prefix: string, suffix?: string, defaultText?: string) => void;
  onCleanPaste?: () => void;
}

export const RichToolbar: React.FC<RichToolbarProps> = ({ onInsert, onCleanPaste }) => {
  return (
    <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-800/60 rounded-lg border border-white/10 mb-2 text-slate-300">
      <button
        type="button"
        onClick={() => onInsert('**', '**', '加粗文本')}
        title="加粗"
        className="p-1.5 hover:bg-white/10 hover:text-white rounded transition text-xs flex items-center gap-1 font-semibold"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onInsert('*', '*', '斜体文本')}
        title="斜体"
        className="p-1.5 hover:bg-white/10 hover:text-white rounded transition text-xs flex items-center gap-1 italic"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onInsert('~~', '~~', '删除线')}
        title="删除线"
        className="p-1.5 hover:bg-white/10 hover:text-white rounded transition text-xs flex items-center gap-1 line-through"
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-4 bg-white/15 mx-1" />

      <button
        type="button"
        onClick={() => onInsert('\n- ', '', '无序列表项')}
        title="无序列表"
        className="p-1.5 hover:bg-white/10 hover:text-white rounded transition text-xs flex items-center gap-1"
      >
        <List className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onInsert('\n1. ', '', '有序列表项')}
        title="有序列表"
        className="p-1.5 hover:bg-white/10 hover:text-white rounded transition text-xs flex items-center gap-1"
      >
        <ListOrdered className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onInsert('\n\n---\n\n', '', '')}
        title="分割线"
        className="p-1.5 hover:bg-white/10 hover:text-white rounded transition text-xs flex items-center gap-1"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      {onCleanPaste && (
        <button
          type="button"
          onClick={onCleanPaste}
          title="纯文本粘贴格式化"
          className="ml-auto p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded transition text-xs flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>格式清理</span>
        </button>
      )}
    </div>
  );
};

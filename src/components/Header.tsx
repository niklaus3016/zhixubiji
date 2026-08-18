import React from 'react';
import { BookMarked, Search, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  selectedBookTitle?: string;
  onGoBack?: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  selectedBookTitle,
  onGoBack,
  onOpenSearch,
}) => {
  const getTabTitle = () => {
    if (selectedBookTitle) return `《${selectedBookTitle}》`;
    switch (activeTab) {
      case 'library':
        return '知序笔记';
      case 'book_detail':
        return '书籍详情与笔记';
      case 'note_edit':
        return '编辑读书笔记';
      case 'tags':
        return '标签汇总与思考';
      case 'stats':
        return '阅读概览与数据';
      case 'settings':
        return '设置与数据管理';
      default:
        return '知序笔记';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/85 text-white backdrop-blur-2xl border-b border-white/10 px-3.5 sm:px-4 py-2.5 sm:py-3 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand / Back button */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {onGoBack ? (
            <button
              onClick={onGoBack}
              className="p-1.5 -ml-1 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition flex items-center gap-1 text-xs shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">返回</span>
            </button>
          ) : (
            <div className="p-1.5 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-indigo-300 shrink-0">
              <BookMarked className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="font-bold text-base sm:text-lg text-white font-serif truncate leading-snug">
              {getTabTitle()}
            </h1>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition flex items-center gap-1 text-xs"
            title="全局检索 (书名/作者/原文/感悟)"
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline font-medium">搜索</span>
          </button>
        </div>
      </div>
    </header>
  );
};

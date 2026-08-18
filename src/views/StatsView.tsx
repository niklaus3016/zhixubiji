import React from 'react';
import { Book, ReadingNote, Tag } from '../types';
import { BookOpen, CheckCircle, Clock, Bookmark, FileText, Sparkles, Tags } from 'lucide-react';

interface StatsViewProps {
  books: Book[];
  notes: ReadingNote[];
  tags: Tag[];
}

export const StatsView: React.FC<StatsViewProps> = ({ books, notes, tags }) => {
  const totalBooks = books.length;
  const readingCount = books.filter((b) => b.status === 'reading').length;
  const finishedCount = books.filter((b) => b.status === 'finished').length;
  const wantCount = books.filter((b) => b.status === 'want_to_read').length;

  const totalNotes = notes.length;
  const excerptCount = notes.filter((n) => n.type === 'excerpt').length;
  const summaryCount = notes.filter((n) => n.type === 'summary').length;
  const reflectionCount = notes.filter((n) => n.type === 'reflection').length;

  // Percentage calculations
  const getPercent = (count: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Books */}
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-300">总收录书籍</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-serif text-white">{totalBooks} <span className="text-xs font-normal text-slate-400">本</span></div>
          <p className="text-[10px] text-slate-400">已归档 {books.filter((b) => b.isArchived).length} 本</p>
        </div>

        {/* Total Notes */}
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-300">累计读书笔记</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-serif text-white">{totalNotes} <span className="text-xs font-normal text-slate-400">条</span></div>
          <p className="text-[10px] text-slate-400">平均每书 {totalBooks > 0 ? (totalNotes / totalBooks).toFixed(1) : 0} 条</p>
        </div>

        {/* Finished Books */}
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-emerald-400">已读完书籍</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-serif text-emerald-300">{finishedCount} <span className="text-xs font-normal text-slate-400">本</span></div>
          <p className="text-[10px] text-emerald-400">完成率 {getPercent(finishedCount, totalBooks)}%</p>
        </div>

        {/* Total Tags */}
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-300">知识标签主题</span>
            <Tags className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-serif text-white">{tags.length} <span className="text-xs font-normal text-slate-400">个</span></div>
          <p className="text-[10px] text-slate-400">建立主题索引网</p>
        </div>
      </div>

      {/* Reading Status Breakdown Card */}
      <div className="bg-white/5 backdrop-blur-xl p-4.5 rounded-2xl border border-white/10 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-serif">
          <Clock className="w-4 h-4 text-indigo-400" />
          阅读状态分布
        </h3>

        {/* Stacked Progress Bar */}
        <div className="w-full h-3 bg-slate-800/80 rounded-full overflow-hidden flex border border-white/5">
          <div
            style={{ width: `${getPercent(readingCount, totalBooks)}%` }}
            className="bg-amber-500 h-full transition-all duration-500"
            title={`在读: ${readingCount}本`}
          />
          <div
            style={{ width: `${getPercent(finishedCount, totalBooks)}%` }}
            className="bg-emerald-500 h-full transition-all duration-500"
            title={`已读完: ${finishedCount}本`}
          />
          <div
            style={{ width: `${getPercent(wantCount, totalBooks)}%` }}
            className="bg-indigo-500 h-full transition-all duration-500"
            title={`想读: ${wantCount}本`}
          />
        </div>

        {/* Detailed Status Breakdown Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
          <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
            <span className="text-amber-300 font-semibold block">📖 在读中</span>
            <span className="text-base font-bold font-serif text-amber-200 mt-0.5 block">{readingCount} 本</span>
            <span className="text-[10px] text-amber-400">占比 {getPercent(readingCount, totalBooks)}%</span>
          </div>

          <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
            <span className="text-emerald-300 font-semibold block">✅ 已读完</span>
            <span className="text-base font-bold font-serif text-emerald-200 mt-0.5 block">{finishedCount} 本</span>
            <span className="text-[10px] text-emerald-400">占比 {getPercent(finishedCount, totalBooks)}%</span>
          </div>

          <div className="bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20">
            <span className="text-indigo-300 font-semibold block">📌 想读清单</span>
            <span className="text-base font-bold font-serif text-indigo-200 mt-0.5 block">{wantCount} 本</span>
            <span className="text-[10px] text-indigo-400">占比 {getPercent(wantCount, totalBooks)}%</span>
          </div>
        </div>
      </div>

      {/* Note Types Distribution Card */}
      <div className="bg-white/5 backdrop-blur-xl p-4.5 rounded-2xl border border-white/10 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-serif">
          <Bookmark className="w-4 h-4 text-indigo-400" />
          读书笔记类型偏好分布
        </h3>

        <div className="space-y-2.5 text-xs">
          {/* Excerpt */}
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>📝 原文摘录 ({excerptCount} 条)</span>
              <span className="font-mono text-slate-400">{getPercent(excerptCount, totalNotes)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${getPercent(excerptCount, totalNotes)}%` }}
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>💡 要点总结 ({summaryCount} 条)</span>
              <span className="font-mono text-slate-400">{getPercent(summaryCount, totalNotes)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${getPercent(summaryCount, totalNotes)}%` }}
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Reflection */}
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>✍️ 个人感悟 ({reflectionCount} 条)</span>
              <span className="font-mono text-slate-400">{getPercent(reflectionCount, totalNotes)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${getPercent(reflectionCount, totalNotes)}%` }}
                className="bg-teal-500 h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

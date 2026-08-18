import React from 'react';
import { BookOpen, Edit, Tags, BarChart2, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'library', label: '书籍库', icon: BookOpen },
    { id: 'note_edit', label: '记笔记', icon: Edit },
    { id: 'tags', label: '标签汇总', icon: Tags },
    { id: 'stats', label: '阅读数据', icon: BarChart2 },
    { id: 'settings', label: '设置', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-2xl border-t border-white/10 py-2 px-2 shadow-2xl pb-safe">
      <div className="max-w-2xl mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || (activeTab === 'book_detail' && tab.id === 'library');

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-indigo-300 font-bold bg-indigo-500/20 border border-indigo-500/30 scale-105 shadow-xs shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-300' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

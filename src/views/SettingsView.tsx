import React, { useState } from 'react';
import { AppDataExport } from '../types';
import { Download, Upload, ShieldCheck, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { AgreementModal, PrivacyPolicyContent, UserAgreementContent } from '../components/PrivacyConsent';

interface SettingsViewProps {
  onExportData: () => Promise<AppDataExport>;
  onImportData: (data: AppDataExport) => Promise<void>;
  onClearAllData: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onExportData,
  onImportData,
  onClearAllData,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearInput, setClearInput] = useState('');
  const [showPolicyModal, setShowPolicyModal] = useState<'agreement' | 'privacy' | null>(null);

  const [importConfirmModal, setImportConfirmModal] = useState<{
    isOpen: boolean;
    data: AppDataExport | null;
  }>({ isOpen: false, data: null });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportJSON = async () => {
    try {
      const data = await onExportData();
      const jsonStr = JSON.stringify(data, null, 2);
      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `知序笔记_本地备份_${dateStr}.json`;

      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('🎉 数据备份 JSON 导出成功！');
    } catch {
      alert('导出备份数据失败，请重试');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string) as AppDataExport;
        if (!json || !Array.isArray(json.books) || !Array.isArray(json.notes)) {
          alert('数据文件格式不正确，缺少书库或笔记数组');
          return;
        }
        setImportConfirmModal({ isOpen: true, data: json });
      } catch {
        alert('解析 JSON 备份文件失败，请确认文件格式有效');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmImport = async () => {
    if (!importConfirmModal.data) return;
    try {
      await onImportData(importConfirmModal.data);
      setImportConfirmModal({ isOpen: false, data: null });
      showToast('✅ 数据已成功导入恢复！');
    } catch {
      alert('导入恢复失败，请检查文件正确性');
    }
  };

  const handleConfirmClearAll = async () => {
    if (clearInput.trim() !== '确认清空') {
      alert('请输入 "确认清空" 四字确认');
      return;
    }
    await onClearAllData();
    setShowClearConfirm(false);
    setClearInput('');
    showToast('所有本地数据已安全重置');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-indigo-300 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-indigo-500/30 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Privacy Policy Card */}
      <button
        onClick={() => setShowPolicyModal('privacy')}
        className="w-full text-left bg-white/5 hover:bg-white/10 active:bg-white/15 backdrop-blur-xl p-4.5 rounded-2xl border border-white/10 shadow-xl flex items-center justify-between transition group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30 group-hover:scale-105 transition shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-serif">
              隐私政策与数据安全
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-medium">
          <span className="hidden sm:inline">查看政策</span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
        </div>
      </button>

      {/* Backup & Import Data Section */}
      <div className="bg-white/5 backdrop-blur-xl p-4.5 rounded-2xl border border-white/10 shadow-xl space-y-3.5">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-serif flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>数据备份与恢复 (JSON)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Export JSON */}
          <div className="p-3.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-900/90 transition space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-white font-serif">
                <Download className="w-4 h-4 text-indigo-400" />
                <span>全局备份导出</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                导出全部书籍、笔记及知识标签为 JSON 格式备份文件。
              </p>
            </div>
            <button
              onClick={handleExportJSON}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition mt-2"
            >
              导出 JSON 备份
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-3.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-900/90 transition space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-white font-serif">
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>恢复导入 JSON</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                选择本地 JSON 备份文件，一键恢复所有历史数据。
              </p>
            </div>

            <label className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/15 rounded-xl text-xs font-semibold transition text-center cursor-pointer block mt-2">
              <input type="file" accept=".json" onChange={handleFileSelect} className="hidden" />
              选择本地 JSON 恢复
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone: Clear Data */}
      <div className="bg-red-950/20 backdrop-blur-xl p-4.5 rounded-2xl border border-red-500/30 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider font-serif flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span>数据清空重置</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <p className="text-slate-300 leading-relaxed">
            清空将彻底删除本地所有书籍、笔记及标签，此操作不可逆。
          </p>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white font-semibold rounded-xl shrink-0 transition shadow-md shadow-red-600/20"
          >
            一键清空全部数据
          </button>
        </div>

        {/* Clear Confirm Box */}
        {showClearConfirm && (
          <div className="p-3.5 bg-red-950/80 border border-red-500/40 rounded-xl space-y-2.5 animate-in fade-in duration-150">
            <p className="text-xs font-bold text-red-200">
              ⚠️ 请在输入框中键入 "确认清空" 以继续：
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={clearInput}
                onChange={(e) => setClearInput(e.target.value)}
                placeholder={'键入 "确认清空"'}
                className="px-3 py-1.5 bg-slate-900 border border-red-500/40 rounded-xl text-xs focus:outline-none flex-1 font-semibold text-white placeholder-slate-500"
              />
              <button
                onClick={handleConfirmClearAll}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                彻底清空
              </button>
              <button
                onClick={() => {
                  setShowClearConfirm(false);
                  setClearInput('');
                }}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-medium"
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Import Overwrite Confirm Dialog */}
      {importConfirmModal.isOpen && importConfirmModal.data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-white/15 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-base font-serif">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3>确认覆盖导入历史数据吗？</h3>
            </div>

            <div className="text-xs text-slate-300 space-y-2 bg-white/5 p-3 rounded-xl border border-white/10">
              <p className="font-semibold text-indigo-300">检测到备份包包含：</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>书籍：{importConfirmModal.data.books.length} 本</li>
                <li>读书笔记：{importConfirmModal.data.notes.length} 条</li>
                <li>知识标签：{importConfirmModal.data.tags?.length || 0} 个</li>
                <li>备份导出时间：{importConfirmModal.data.exportedAt || '未注明'}</li>
              </ul>
              <p className="text-red-400 text-[11px] pt-1 border-t border-white/10 font-medium">
                * 导入恢复将替换当前现有数据，请确认。
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setImportConfirmModal({ isOpen: false, data: null })}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
              >
                确认覆盖导入
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy / User Agreement Modal */}
      {showPolicyModal && (
        <AgreementModal
          title={showPolicyModal === 'privacy' ? '隐私政策' : '用户服务协议'}
          onClose={() => setShowPolicyModal(null)}
        >
          <div className="relative">
            <div className="flex items-center gap-1 mb-4 bg-white/5 p-1 rounded-lg w-fit">
              <button
                onClick={() => setShowPolicyModal('privacy')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${
                  showPolicyModal === 'privacy'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                隐私政策
              </button>
              <button
                onClick={() => setShowPolicyModal('agreement')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${
                  showPolicyModal === 'agreement'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                用户服务协议
              </button>
            </div>
            {showPolicyModal === 'privacy' ? <PrivacyPolicyContent /> : <UserAgreementContent />}
          </div>
        </AgreementModal>
      )}
    </div>
  );
};

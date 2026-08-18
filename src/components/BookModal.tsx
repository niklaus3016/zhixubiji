import React, { useState, useEffect } from 'react';
import { Book, ReadingStatus } from '../types';
import { X, Upload, Link, BookOpen, Calendar } from 'lucide-react';

interface BookModalProps {
  isOpen: boolean;
  bookToEdit?: Book | null;
  onSave: (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'> & { id?: string }) => void;
  onClose: () => void;
}

export const BookModal: React.FC<BookModalProps> = ({ isOpen, bookToEdit, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ReadingStatus>('reading');
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');

  const [coverInputType, setCoverInputType] = useState<'upload' | 'url'>('upload');
  const [errors, setErrors] = useState<{ title?: string; author?: string }>({});

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
      setCoverUrl(bookToEdit.coverUrl || '');
      setDescription(bookToEdit.description || '');
      setStatus(bookToEdit.status);
      setStartDate(bookToEdit.startDate || '');
      setFinishDate(bookToEdit.finishDate || '');
    } else {
      setTitle('');
      setAuthor('');
      setCoverUrl('');
      setDescription('');
      setStatus('reading');
      setStartDate(new Date().toISOString().split('T')[0]);
      setFinishDate('');
    }
    setErrors({});
  }, [bookToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('请选择小于 3MB 的封面图片');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; author?: string } = {};

    if (!title.trim()) newErrors.title = '请输入书名';
    if (!author.trim()) newErrors.author = '请输入作者';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: bookToEdit?.id,
      title: title.trim(),
      author: author.trim(),
      coverUrl: coverUrl.trim(),
      description: description.trim(),
      status,
      startDate,
      finishDate: status === 'finished' ? finishDate : '',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="m-auto bg-slate-900/95 text-slate-100 backdrop-blur-2xl rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-white/15 max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 font-bold text-white text-base sm:text-lg font-serif">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3>{bookToEdit ? '编辑书籍信息' : '新增书籍库录入'}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3 flex-1 overflow-y-auto space-y-3.5 text-sm pr-1">
          {/* Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                书名 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="例如：百年孤独"
                className={`w-full px-3 py-2 rounded-xl border bg-slate-800/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition ${
                  errors.title ? 'border-red-400' : 'border-white/15'
                }`}
              />
              {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                作者 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                  if (errors.author) setErrors((prev) => ({ ...prev, author: undefined }));
                }}
                placeholder="例如：加西亚·马尔克斯"
                className={`w-full px-3 py-2 rounded-xl border bg-slate-800/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition ${
                  errors.author ? 'border-red-400' : 'border-white/15'
                }`}
              />
              {errors.author && <p className="text-xs text-red-400 mt-1">{errors.author}</p>}
            </div>
          </div>

          {/* Reading Status */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              阅读状态 <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('reading')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  status === 'reading'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-xs'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <span>📖 在读</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('finished')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  status === 'finished'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-xs'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <span>✅ 已读完</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('want_to_read')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  status === 'want_to_read'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-xs'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <span>📌 想读</span>
              </button>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1 text-xs flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                阅读开始时间 (选填)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-white/15 bg-slate-800/80 text-xs text-slate-100"
              />
            </div>

            {status === 'finished' && (
              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  阅读结束时间 (已读完可填)
                </label>
                <input
                  type="date"
                  value={finishDate}
                  onChange={(e) => setFinishDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 text-xs text-slate-100"
                />
              </div>
            )}
          </div>

          {/* Book Cover */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-medium">书籍封面</label>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setCoverInputType('upload')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border transition ${
                    coverInputType === 'upload'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-medium'
                      : 'text-slate-400 border-white/10'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  本地上传
                </button>
                <button
                  type="button"
                  onClick={() => setCoverInputType('url')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border transition ${
                    coverInputType === 'url'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-medium'
                      : 'text-slate-400 border-white/10'
                  }`}
                >
                  <Link className="w-3 h-3" />
                  图片链接
                </button>
              </div>
            </div>

            {coverInputType === 'upload' ? (
              <div className="border-2 border-dashed border-white/20 hover:border-indigo-400 bg-white/5 rounded-xl p-3 text-center transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="book-cover-input"
                />
                <label htmlFor="book-cover-input" className="cursor-pointer flex flex-col items-center gap-1">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-xs text-slate-200 font-medium">点击选择本地图片 (PNG/JPG)</span>
                  <span className="text-[10px] text-slate-400">留空则自动生成典雅经典书脊占位图</span>
                </label>
              </div>
            ) : (
              <input
                type="text"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="粘贴网络图片 URL (https://...)"
                className="w-full px-3 py-2 rounded-xl border border-white/15 bg-slate-800/80 text-xs text-white"
              />
            )}

            {coverUrl && (
              <div className="mt-2 flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-xl">
                <img src={coverUrl} alt="Cover preview" className="w-10 h-14 object-cover rounded shadow-xs" />
                <div className="text-xs text-slate-200 min-w-0 flex-1">
                  <p className="font-medium">封面已就绪</p>
                  <p className="text-[10px] text-slate-400 truncate">{coverUrl}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCoverUrl('')}
                  className="text-xs text-red-400 hover:underline px-2"
                >
                  清除
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">书籍简介 (选填)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="记录简短的内容提要、阅读目的或推荐理由..."
              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-slate-800/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          {/* Form Buttons */}
          <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:bg-white/10 transition text-xs font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition"
            >
              保存书籍
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

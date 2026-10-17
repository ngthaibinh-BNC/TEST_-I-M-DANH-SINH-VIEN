import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Clock, 
  ChevronDown, 
  Plus, 
  Check, 
  CalendarDays, 
  Sun, 
  Moon, 
  Coffee, 
  Users, 
  Layers, 
  Sparkles,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { SessionInfo } from '../types';
import { 
  PRESET_CLASSES, 
  PRESET_SUBJECTS, 
  PRESET_SHIFTS, 
  ClassOption, 
  SubjectOption, 
  ShiftOption 
} from '../data/academicPresets';

interface ClassSubjectSelectorProps {
  session: SessionInfo;
  onUpdateSession: (updated: Partial<SessionInfo>) => void;
  availableClasses: string[];
  totalStudentsInClass: number;
  totalStudentsAll: number;
  selectedClassFilter: string; // 'ALL' or specific class code
  onSelectClassFilter: (classCode: string) => void;
  onDeleteClass: (classCode: string) => void;
  onAddClass?: (classCode: string) => void;
  studentCountByClass: Record<string, number>;
}

export const ClassSubjectSelector: React.FC<ClassSubjectSelectorProps> = ({
  session,
  onUpdateSession,
  availableClasses,
  totalStudentsInClass,
  totalStudentsAll,
  selectedClassFilter,
  onSelectClassFilter,
  onDeleteClass,
  onAddClass,
  studentCountByClass
}) => {
  const [openModal, setOpenModal] = useState<'class' | 'subject' | 'date' | 'shift' | null>(null);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  
  // Custom inputs
  const [customClass, setCustomClass] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customShift, setCustomShift] = useState('');

  // Format date to Vietnamese display
  const formatVNDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = days[d.getDay()];
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${dayName}, ${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  // Quick Date Helpers
  const setQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const dateStr = d.toISOString().split('T')[0];
    onUpdateSession({ sessionDate: dateStr });
    setOpenModal(null);
  };

  const handleAddCustomClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customClass.trim()) return;
    const code = customClass.trim().toUpperCase();
    if (onAddClass) {
      onAddClass(code);
    }
    onSelectClassFilter(code);
    onUpdateSession({ className: code });
    setCustomClass('');
  };

  const handleConfirmDeleteClass = (code: string) => {
    onDeleteClass(code);
    setClassToDelete(null);
  };

  const handleAddCustomSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSubject.trim()) return;
    onUpdateSession({ subjectName: customSubject.trim() });
    setCustomSubject('');
    setOpenModal(null);
  };

  const handleAddCustomShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customShift.trim()) return;
    onUpdateSession({ sessionPeriod: customShift.trim() });
    setCustomShift('');
    setOpenModal(null);
  };

  // Combine default preset classes with any custom classes
  const allClasses = Array.from(new Set([
    ...availableClasses,
    ...PRESET_CLASSES.map(c => c.code)
  ])).filter(Boolean);

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-2xl border border-indigo-500/30 mb-6">
      {/* Selector Section Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-md">
            <Layers className="w-4 h-4 font-black" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
              Bộ Điều Khiển Buổi Dạy
            </span>
            <h3 className="text-sm sm:text-base font-black text-white">
              Chọn Lớp • Môn Học • Ngày • Ca Dạy
            </h3>
          </div>
        </div>

        {/* View mode toggle: Single class vs All classes */}
        <div className="flex items-center gap-1.5 p-1 bg-black/30 rounded-2xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => onSelectClassFilter(session.className)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedClassFilter !== 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Lớp {session.className} ({totalStudentsInClass})</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectClassFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedClassFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Tất Cả Các Lớp ({totalStudentsAll})</span>
          </button>
        </div>
      </div>

      {/* 4 PROMINENT BUTTONS GRID (LỚP, MÔN, NGÀY, CA) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. NÚT CHỌN LỚP */}
        <button
          type="button"
          onClick={() => setOpenModal('class')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-amber-400/50 transition-all duration-200 text-left group shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>1. CHỌN & QUẢN LÝ LỚP</span>
            </span>
            <span className="text-[10px] bg-amber-400/20 text-amber-200 border border-amber-300/30 px-2 py-0.5 rounded-full font-bold tabular-nums">
              {totalStudentsInClass} SV
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="truncate font-black text-base sm:text-lg text-white group-hover:text-amber-200 transition-colors">
              {session.className}
            </div>
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/80 group-hover:bg-amber-400 group-hover:text-slate-900 transition-all shrink-0">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[11px] text-slate-300 mt-1 truncate">
            Đổi lớp, thêm lớp hoặc xóa lớp
          </div>
        </button>

        {/* 2. NÚT CHỌN MÔN */}
        <button
          type="button"
          onClick={() => setOpenModal('subject')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-cyan-400/50 transition-all duration-200 text-left group shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-0.5 cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>2. CHỌN MÔN HỌC</span>
            </span>
            <span className="text-[10px] bg-cyan-400/20 text-cyan-200 border border-cyan-300/30 px-2 py-0.5 rounded-full font-bold">
              Học phần
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="truncate font-black text-base sm:text-lg text-white group-hover:text-cyan-200 transition-colors">
              {session.subjectName}
            </div>
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/80 group-hover:bg-cyan-400 group-hover:text-slate-900 transition-all shrink-0">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[11px] text-slate-300 mt-1 truncate">
            Nhấn để đổi môn giảng dạy
          </div>
        </button>

        {/* 3. NÚT CHỌN NGÀY */}
        <button
          type="button"
          onClick={() => setOpenModal('date')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-emerald-400/50 transition-all duration-200 text-left group shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>3. CHỌN NGÀY DẠY</span>
            </span>
            <span className="text-[10px] bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 px-2 py-0.5 rounded-full font-bold tabular-nums">
              {session.sessionDate}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="truncate font-black text-base sm:text-lg text-white group-hover:text-emerald-200 transition-colors">
              {formatVNDate(session.sessionDate)}
            </div>
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/80 group-hover:bg-emerald-400 group-hover:text-slate-900 transition-all shrink-0">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[11px] text-slate-300 mt-1 truncate">
            Hôm nay / Hôm qua / Chọn lịch
          </div>
        </button>

        {/* 4. NÚT CHỌN CA DẠY */}
        <button
          type="button"
          onClick={() => setOpenModal('shift')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-purple-400/50 transition-all duration-200 text-left group shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5 cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>4. CHỌN CA & TIẾT HỌC</span>
            </span>
            <span className="text-[10px] bg-purple-400/20 text-purple-200 border border-purple-300/30 px-2 py-0.5 rounded-full font-bold">
              {session.roomName || 'Lab'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="truncate font-black text-base sm:text-lg text-white group-hover:text-purple-200 transition-colors">
              {session.sessionPeriod}
            </div>
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/80 group-hover:bg-purple-400 group-hover:text-slate-900 transition-all shrink-0">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[11px] text-slate-300 mt-1 truncate">
            Ca Sáng / Ca Chiều / Ca Tối
          </div>
        </button>
      </div>

      {/* ========================================================
          MODAL 1: CHỌN & QUẢN LÝ / XÓA LỚP HỌC
         ======================================================== */}
      {openModal === 'class' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-scaleUp"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-extrabold text-base">Quản Lý & Chọn Lớp Học</h3>
                  <p className="text-[11px] text-blue-100">Chọn lớp để điểm danh hoặc xóa lớp không dùng</p>
                </div>
              </div>
              <button
                onClick={() => setOpenModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Danh sách các lớp hiện có trong hệ thống:</span>
                <span className="font-bold text-slate-700">Tổng: {allClasses.length} lớp</span>
              </div>

              {/* List of Classes with Select & Delete Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {allClasses.map(code => {
                  const isCurrent = session.className === code;
                  const presetInfo = PRESET_CLASSES.find(p => p.code === code);
                  const count = studentCountByClass[code] || 0;

                  return (
                    <div
                      key={code}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 group ${
                        isCurrent
                          ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {/* Left: Click to Select Class */}
                      <button
                        type="button"
                        onClick={() => {
                          onSelectClassFilter(code);
                          onUpdateSession({ className: code });
                          setOpenModal(null);
                        }}
                        className="flex-1 text-left cursor-pointer overflow-hidden"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm text-slate-900 group-hover:text-blue-700 truncate">
                            {code}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] bg-blue-600 text-white font-extrabold px-1.5 py-0.2 rounded-md">
                              Đang mở
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <span>{presetInfo?.faculty || 'Khoa chuyên ngành'}</span>
                          <span>•</span>
                          <strong className="text-slate-700 tabular-nums">{count} SV</strong>
                        </div>
                      </button>

                      {/* Right: Actions (Check + Delete Trash Button) */}
                      <div className="flex items-center gap-1 shrink-0">
                        {isCurrent && <Check className="w-4 h-4 text-blue-600 stroke-[3] mr-1" />}
                        
                        {/* NÚT XÓA LỚP - NỔI BẬT */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setClassToDelete(code);
                          }}
                          className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                          title={`Xóa lớp ${code}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Class Form */}
              <form onSubmit={handleAddCustomClass} className="pt-3 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Thêm Mã Lớp Mới Vào Hệ Thống
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customClass}
                    onChange={e => setCustomClass(e.target.value)}
                    placeholder="VD: CD-DL23A, CD-KT22B..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Lớp</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CONFIRMATION MODAL: XÁC NHẬN XÓA LỚP HỌC
         ======================================================== */}
      {classToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-rose-200 w-full max-w-md overflow-hidden animate-scaleUp p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Xác Nhận Xóa Lớp Học?
                </h3>
                <p className="text-xs text-slate-500">
                  Hành động này sẽ xóa lớp khỏi danh sách
                </p>
              </div>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
              <div className="text-sm font-bold text-rose-950">
                Thầy đang chọn xóa lớp: <span className="text-rose-700 underline text-base font-black">{classToDelete}</span>
              </div>
              <p className="text-xs text-rose-800 leading-relaxed">
                Lớp này hiện có <strong>{studentCountByClass[classToDelete] || 0} sinh viên</strong> trong danh sách. Nếu xóa lớp này, toàn bộ sinh viên thuộc lớp sẽ được xóa khỏi hệ thống.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setClassToDelete(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>

              <button
                type="button"
                onClick={() => handleConfirmDeleteClass(classToDelete)}
                className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-rose-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xác Nhận Xóa Lớp Này</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: CHỌN MÔN HỌC
         ======================================================== */}
      {openModal === 'subject' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleUp"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-teal-700 to-cyan-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-cyan-200" />
                <h3 className="font-extrabold text-base">Chọn Môn Học Giảng Dạy</h3>
              </div>
              <button
                onClick={() => setOpenModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <p className="text-xs text-slate-500 font-medium">
                Chọn môn học đào tạo trong chương trình:
              </p>

              {/* Preset Subjects */}
              <div className="space-y-2">
                {PRESET_SUBJECTS.map(subj => {
                  const isCurrent = session.subjectName === subj.name;

                  return (
                    <button
                      key={subj.code}
                      type="button"
                      onClick={() => {
                        onUpdateSession({ subjectName: subj.name });
                        setOpenModal(null);
                      }}
                      className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'bg-cyan-50 border-cyan-600 ring-2 ring-cyan-500 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-extrabold text-sm text-slate-900">{subj.name}</div>
                        <div className="text-[11px] text-slate-500">Mã: {subj.code} • {subj.credits} tín chỉ</div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-cyan-700 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Subject */}
              <form onSubmit={handleAddCustomSubject} className="pt-3 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hoặc Thêm Tên Môn Học Khác
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSubject}
                    onChange={e => setCustomSubject(e.target.value)}
                    placeholder="VD: An Toàn Lao Động, Thực Tập Doanh Nghiệp..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: CHỌN NGÀY DẠY
         ======================================================== */}
      {openModal === 'date' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-scaleUp"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-emerald-200" />
                <h3 className="font-extrabold text-base">Chọn Ngày Học / Điểm Danh</h3>
              </div>
              <button
                onClick={() => setOpenModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setQuickDate(-1)}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
                >
                  Hôm Qua
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(0)}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-600/30 transition-all text-center cursor-pointer"
                >
                  Hôm Nay ⭐
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(1)}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
                >
                  Ngày Mai
                </button>
              </div>

              {/* Exact Date Picker */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  Hoặc chọn ngày cụ thể từ lịch:
                </label>
                <input
                  type="date"
                  value={session.sessionDate}
                  onChange={e => {
                    onUpdateSession({ sessionDate: e.target.value });
                    setOpenModal(null);
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ngày đang chọn: <strong>{formatVNDate(session.sessionDate)}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: CHỌN CA DẠY & PHÒNG HỌC
         ======================================================== */}
      {openModal === 'shift' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleUp"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-purple-200" />
                <h3 className="font-extrabold text-base">Chọn Ca Dạy & Tiết Học</h3>
              </div>
              <button
                onClick={() => setOpenModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <p className="text-xs text-slate-500 font-medium">
                Chọn ca học tiêu chuẩn trường CĐ Bách Nghệ TP.HCM:
              </p>

              {/* Preset Shifts */}
              <div className="space-y-2">
                {PRESET_SHIFTS.map(shift => {
                  const isCurrent = session.sessionPeriod.includes(shift.title) || session.sessionPeriod.includes(shift.periods);

                  const IconComp = 
                    shift.iconType === 'morning' ? Sun :
                    shift.iconType === 'noon' ? Coffee :
                    shift.iconType === 'evening' ? Moon : Clock;

                  return (
                    <button
                      key={shift.id}
                      type="button"
                      onClick={() => {
                        onUpdateSession({ sessionPeriod: `${shift.title} (${shift.periods})` });
                        setOpenModal(null);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'bg-purple-50 border-purple-600 ring-2 ring-purple-500 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isCurrent ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-slate-900">{shift.title} • {shift.periods}</div>
                          <div className="text-[11px] text-slate-500">Thời gian: {shift.timeRange}</div>
                        </div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-purple-700 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              {/* Room and Custom Shift */}
              <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phòng Học / Lab
                  </label>
                  <input
                    type="text"
                    value={session.roomName}
                    onChange={e => onUpdateSession({ roomName: e.target.value })}
                    placeholder="VD: Phòng Lab A2-302"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hoặc Ca Tự Do
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customShift}
                      onChange={e => setCustomShift(e.target.value)}
                      placeholder="VD: Tiết 1 - 5..."
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomShift}
                      className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl cursor-pointer shrink-0"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

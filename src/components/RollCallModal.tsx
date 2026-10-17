import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Sparkles,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, AttendanceStatus } from '../types';

interface RollCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onUpdateStatus: (id: string, status: AttendanceStatus) => void;
}

export const RollCallModal: React.FC<RollCallModalProps> = ({
  isOpen,
  onClose,
  students,
  onUpdateStatus
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  if (!isOpen || students.length === 0) return null;

  const currentStudent = students[currentIndex];

  const handleMark = (status: AttendanceStatus) => {
    onUpdateStatus(currentStudent.id, status);

    if (status === 'present' && currentIndex === students.length - 1) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    if (currentIndex < students.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentStudent.fullName);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col transform transition-all animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Chế Độ Điểm Danh Từng Bạn (Roll Call)</h3>
              <p className="text-xs text-slate-300">Gọi tên sinh viên to rõ & chuyển nhanh tiếp theo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2">
          <div 
            className="bg-gradient-to-r from-blue-600 to-emerald-500 h-2 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / students.length) * 100}%` }}
          />
        </div>

        {/* Main Card */}
        <div className="p-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
            <span>Sinh viên số {currentIndex + 1} / {students.length}</span>
          </div>

          <div className="space-y-3">
            <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-900 font-mono text-base font-extrabold rounded-2xl tracking-wider">
              {currentStudent.studentCode}
            </div>

            <div className="flex items-center justify-center gap-3">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                {currentStudent.fullName}
              </h2>
              <button
                type="button"
                onClick={handleSpeech}
                title="Đọc tên sinh viên"
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="text-sm font-semibold text-slate-500 flex items-center justify-center gap-4">
              <span>Ngày sinh: <strong className="text-slate-800">{currentStudent.dateOfBirth}</strong></span>
              <span>•</span>
              <span>Lớp: <strong className="text-slate-800">{currentStudent.className || 'CĐ Bách Nghệ'}</strong></span>
              <span>•</span>
              <span>Giới tính: <strong className="text-slate-800">{currentStudent.gender || 'Nam'}</strong></span>
            </div>

            {currentStudent.note && (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl inline-block max-w-md">
                Ghi chú: {currentStudent.note}
              </div>
            )}
          </div>

          {/* 4 Large Touch Action Buttons - NỔI BẬT */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <button
              onClick={() => handleMark('present')}
              className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 font-black text-sm flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>CÓ MẶT</span>
              <span className="text-[10px] opacity-80">(Phím 1)</span>
            </button>

            <button
              onClick={() => handleMark('late')}
              className="p-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/30 font-black text-sm flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Clock className="w-6 h-6 stroke-[2.5]" />
              <span>ĐI TRỄ</span>
              <span className="text-[10px] opacity-80">(Phím 2)</span>
            </button>

            <button
              onClick={() => handleMark('excused')}
              className="p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 font-black text-sm flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
              <span>VẮNG PHÉP</span>
              <span className="text-[10px] opacity-80">(Phím 3)</span>
            </button>

            <button
              onClick={() => handleMark('unexcused')}
              className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 font-black text-sm flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <XCircle className="w-6 h-6 stroke-[2.5]" />
              <span>VẮNG K.PHÉP</span>
              <span className="text-[10px] opacity-80">(Phím 4)</span>
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
            className="px-4 py-2 bg-white border border-slate-300 disabled:opacity-40 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Bạn Trước</span>
          </button>

          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Hoàn tất điểm danh
          </button>

          <button
            disabled={currentIndex === students.length - 1}
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="px-4 py-2 bg-white border border-slate-300 disabled:opacity-40 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Bạn Kế Tiếp</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

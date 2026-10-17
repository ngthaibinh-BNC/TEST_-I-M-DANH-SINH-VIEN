import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  Share2, 
  School,
  Copy,
  Check
} from 'lucide-react';
import { Student, SessionInfo } from '../types';
import { exportToExcel, exportToCSV, getStatusLabel } from '../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  session: SessionInfo;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  students,
  session
}) => {
  const [copied, setCopied] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const total = students.length;
  const present = students.filter(s => s.status === 'present').length;
  const late = students.filter(s => s.status === 'late').length;
  const excused = students.filter(s => s.status === 'excused').length;
  const unexcused = students.filter(s => s.status === 'unexcused').length;
  const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  const handleExportExcel = () => {
    exportToExcel(students, session);
    setExportSuccess('Đã tải xuống file Excel (.xlsx) thành công!');
    setTimeout(() => setExportSuccess(null), 3000);
  };

  const handleExportCSV = () => {
    exportToCSV(students, session);
    setExportSuccess('Đã tải xuống file CSV (UTF-8) thành công!');
    setTimeout(() => setExportSuccess(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyTextReport = () => {
    const textReport = `TRƯỜNG CAO ĐẲNG BÁCH NGHỆ TP. HỒ CHÍ MINH
BÁO CÁO ĐIỂM DANH - ${session.subjectName}
Tác giả: ${session.author}
Lớp: ${session.className} | Ngày: ${session.sessionDate}
Sĩ số: ${total} | Có mặt: ${present} | Trễ: ${late} | Phép: ${excused} | Không phép: ${unexcused}
Tỷ lệ chuyên cần: ${rate}%

DANH SÁCH SINH VIÊN VẮNG / ĐI TRỄ:
${students.filter(s => s.status !== 'present').map(s => `- ${s.studentCode} | ${s.fullName} (${s.dateOfBirth}): ${getStatusLabel(s.status)}${s.note ? ' - ' + s.note : ''}`).join('\n') || 'Không có sinh viên vắng!'}`;

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn no-print">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden transform transition-all animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Xuất Danh Sách & Báo Cáo Điểm Danh</h3>
              <p className="text-xs text-emerald-100">Trường Cao đẳng Bách Nghệ TP.HCM • Tác giả: {session.author}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {exportSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{exportSuccess}</span>
            </div>
          )}

          {/* Session Summary Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-emerald-600" />
                <span className="font-extrabold text-xs text-slate-800 uppercase">
                  {session.collegeName}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-600">
                Lớp: <strong className="text-slate-900">{session.className}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <div className="text-slate-500">Tổng sinh viên</div>
                <div className="text-lg font-black text-slate-900 tabular-nums">{total}</div>
              </div>
              <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-emerald-700">Có mặt</div>
                <div className="text-lg font-black text-emerald-700 tabular-nums">{present}</div>
              </div>
              <div className="p-2 bg-amber-50 rounded-xl border border-amber-200">
                <div className="text-amber-700">Đi trễ</div>
                <div className="text-lg font-black text-amber-700 tabular-nums">{late}</div>
              </div>
              <div className="p-2 bg-rose-50 rounded-xl border border-rose-200">
                <div className="text-rose-700">Vắng</div>
                <div className="text-lg font-black text-rose-700 tabular-nums">{excused + unexcused}</div>
              </div>
            </div>
          </div>

          {/* Export Options - CÁC NÚT BẤM NỔI BẬT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. Xuất Excel - NỔI BẬT NHẤT */}
            <button
              onClick={handleExportExcel}
              className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 hover:from-emerald-400 hover:to-teal-600 text-white shadow-xl shadow-emerald-600/30 hover:scale-[1.03] active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-black tracking-wide">Xuất File Excel</span>
              <span className="text-[11px] text-emerald-100 mt-1">Định dạng .xlsx chuẩn giáo vụ</span>
            </button>

            {/* 2. Xuất CSV */}
            <button
              onClick={handleExportCSV}
              className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white shadow-xl shadow-blue-600/30 hover:scale-[1.03] active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-black tracking-wide">Xuất File CSV</span>
              <span className="text-[11px] text-blue-100 mt-1">UTF-8 kèm BOM tiếng Việt</span>
            </button>

            {/* 3. In / PDF */}
            <button
              onClick={handlePrint}
              className="p-5 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-xl shadow-purple-600/30 hover:scale-[1.03] active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Printer className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-black tracking-wide">In Bảng / PDF</span>
              <span className="text-[11px] text-purple-100 mt-1">Trang in A4 có chữ ký</span>
            </button>
          </div>

          {/* Quick Copy Summary text for Zalo / SMS / Email */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-800">Sao chép nhanh tóm tắt báo cáo</span> (gửi qua Zalo nhóm lớp, tin nhắn cho phụ huynh hoặc ban cán sự).
            </div>
            <button
              onClick={handleCopyTextReport}
              className="px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Đã Sao Chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao Chép Tóm Tắt</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  Edit3, 
  Check, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  CheckCheck, 
  RotateCcw, 
  MessageSquare, 
  Sparkles, 
  ArrowUpDown, 
  Filter, 
  UserCheck,
  UserPlus,
  Plus
} from 'lucide-react';
import { Student, AttendanceStatus } from '../types';

interface StudentTableProps {
  students: Student[];
  onUpdateStatus: (id: string, status: AttendanceStatus) => void;
  onUpdateNote: (id: string, note: string) => void;
  onDeleteStudent: (id: string) => void;
  onMarkAllPresent: () => void;
  onResetAllStatus: () => void;
  onEditStudent: (student: Student) => void;
  currentFilter: AttendanceStatus | 'all';
  onFilterChange: (status: AttendanceStatus | 'all') => void;
  currentClassName: string;
  onQuickAddStudent: (fullName: string, studentCode?: string, dateOfBirth?: string) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onUpdateStatus,
  onUpdateNote,
  onDeleteStudent,
  onMarkAllPresent,
  onResetAllStatus,
  onEditStudent,
  currentFilter,
  onFilterChange,
  currentClassName,
  onQuickAddStudent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'studentCode' | 'fullName' | 'dateOfBirth'>('studentCode');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  // Quick Inline Add State
  const [quickName, setQuickName] = useState('');
  const [quickCode, setQuickCode] = useState('');
  const [quickDob, setQuickDob] = useState('');
  const [showExtraQuickFields, setShowExtraQuickFields] = useState(false);

  // Lọc theo search term và status
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.dateOfBirth.includes(searchTerm) ||
      (student.className && student.className.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = currentFilter === 'all' ? true : student.status === currentFilter;

    return matchesSearch && matchesStatus;
  });

  // Sắp xếp
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let comp = 0;
    if (sortField === 'studentCode') {
      comp = a.studentCode.localeCompare(b.studentCode);
    } else if (sortField === 'fullName') {
      const nameA = a.fullName.trim().split(' ').pop() || '';
      const nameB = b.fullName.trim().split(' ').pop() || '';
      comp = nameA.localeCompare(nameB, 'vi');
    } else if (sortField === 'dateOfBirth') {
      comp = a.dateOfBirth.localeCompare(b.dateOfBirth);
    }
    return sortOrder === 'asc' ? comp : -comp;
  });

  const toggleSort = (field: 'studentCode' | 'fullName' | 'dateOfBirth') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const startEditNote = (student: Student) => {
    setEditingNoteId(student.id);
    setTempNote(student.note || '');
  };

  const saveNote = (id: string) => {
    onUpdateNote(id, tempNote);
    setEditingNoteId(null);
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;

    onQuickAddStudent(
      quickName.trim(), 
      quickCode.trim() || undefined, 
      quickDob.trim() || undefined
    );

    // Clear inputs
    setQuickName('');
    setQuickCode('');
    setQuickDob('');
    setSearchTerm('');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden mb-8">
      {/* ========================================================
          THÊM NHANH SINH VIÊN TRỰC TIẾP (QUICK INLINE ADD BAR)
         ======================================================== */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-5 border-b border-indigo-100">
        <form onSubmit={handleQuickAddSubmit} className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-indigo-600" />
              <span>Thêm Nhanh Sinh Viên Vào Lớp: <strong className="text-blue-700 bg-white px-2 py-0.5 rounded-lg border border-indigo-200">{currentClassName}</strong></span>
            </span>
            <button
              type="button"
              onClick={() => setShowExtraQuickFields(!showExtraQuickFields)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
            >
              {showExtraQuickFields ? 'Thu gọn ô phụ' : '+ Điền thêm MSSV & Ngày sinh'}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Input Họ và Tên - Chủ đạo */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={quickName}
                onChange={e => setQuickName(e.target.value)}
                placeholder="Nhập Họ và Tên sinh viên (VD: Lê Văn Dũng) rồi nhấn Enter..."
                className="w-full px-4 py-2.5 bg-white border-2 border-indigo-200 focus:border-indigo-600 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none shadow-xs transition-all"
              />
            </div>

            {/* Extra fields if toggled */}
            {showExtraQuickFields && (
              <>
                <input
                  type="text"
                  value={quickCode}
                  onChange={e => setQuickCode(e.target.value)}
                  placeholder="Mã SV (Tự tạo nếu trống)"
                  className="w-full sm:w-44 px-3 py-2.5 bg-white border border-indigo-200 focus:border-indigo-600 rounded-xl text-xs font-mono font-bold uppercase text-slate-800 focus:outline-none"
                />
                <input
                  type="text"
                  value={quickDob}
                  onChange={e => setQuickDob(e.target.value)}
                  placeholder="Ngày sinh (dd/mm/yyyy)"
                  className="w-full sm:w-44 px-3 py-2.5 bg-white border border-indigo-200 focus:border-indigo-600 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
                />
              </>
            )}

            {/* Nút Thêm Nhanh - CỰC KỲ NỔI BẬT */}
            <button
              type="submit"
              disabled={!quickName.trim()}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                quickName.trim()
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-indigo-600/30 hover:scale-105 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Thêm Vào Lớp</span>
            </button>
          </div>
        </form>
      </div>

      {/* Table Action Bar */}
      <div className="p-4 sm:p-6 border-b border-slate-200/80 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm theo Mã SV, Họ tên, Ngày sinh..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Batch Actions - NỔI BẬT */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Nút Điểm danh tất cả Có mặt - SIÊU NỔI BẬT */}
          <button
            onClick={onMarkAllPresent}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 stroke-[2.5]" />
            <span>Tất Cả Có Mặt</span>
          </button>

          {/* Nút Đặt lại - NỔI BẬT */}
          <button
            onClick={onResetAllStatus}
            className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold rounded-2xl border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Đặt Lại</span>
          </button>
        </div>
      </div>

      {/* Main Student List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-100/80 text-slate-700 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4 w-12 text-center">STT</th>
              
              <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors" onClick={() => toggleSort('studentCode')}>
                <div className="flex items-center gap-1.5">
                  <span>MÃ SỐ SINH VIÊN</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors" onClick={() => toggleSort('fullName')}>
                <div className="flex items-center gap-1.5">
                  <span>HỌ VÀ TÊN</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors" onClick={() => toggleSort('dateOfBirth')}>
                <div className="flex items-center gap-1.5">
                  <span>NGÀY THÁNG NĂM SINH</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th className="py-3.5 px-4">LỚP</th>

              <th className="py-3.5 px-4 text-center min-w-[280px]">
                TRẠNG THÁI ĐIỂM DANH (1-CHẠM)
              </th>

              <th className="py-3.5 px-4">GHI CHÚ</th>

              <th className="py-3.5 px-4 text-right">THAO TÁC</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {sortedStudents.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-slate-600 text-sm">
                    Lớp {currentClassName} chưa có sinh viên nào hoặc không khớp bộ lọc
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Thầy hãy nhập tên ở thanh "Thêm Nhanh Sinh Viên Vào Lớp" phía trên để thêm ngay!
                  </p>
                </td>
              </tr>
            ) : (
              sortedStudents.map((student, index) => {
                const isPresent = student.status === 'present';
                const isLate = student.status === 'late';
                const isExcused = student.status === 'excused';
                const isUnexcused = student.status === 'unexcused';

                return (
                  <tr 
                    key={student.id} 
                    className={`transition-colors hover:bg-slate-50/80 ${
                      isPresent ? 'bg-emerald-50/25' : isLate ? 'bg-amber-50/25' : isUnexcused ? 'bg-rose-50/25' : ''
                    }`}
                  >
                    {/* STT */}
                    <td className="py-3.5 px-4 text-center font-bold text-slate-400 tabular-nums">
                      {index + 1}
                    </td>

                    {/* Mã số sinh viên (MSSV) */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900 tracking-tight whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
                        {student.studentCode}
                      </span>
                    </td>

                    {/* Họ và tên */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{student.fullName}</span>
                        {student.gender && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${student.gender === 'Nữ' ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-600'}`}>
                            {student.gender}
                          </span>
                        )}
                      </div>
                      {student.checkInTime && (
                        <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                          <Check className="w-3 h-3" />
                          <span>Giờ điểm danh: {student.checkInTime}</span>
                        </div>
                      )}
                    </td>

                    {/* Ngày tháng năm sinh */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700 tabular-nums whitespace-nowrap">
                      {student.dateOfBirth}
                    </td>

                    {/* Lớp */}
                    <td className="py-3.5 px-4 font-semibold text-slate-600 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-slate-100 rounded-md font-bold text-xs text-slate-700">
                        {student.className || '-'}
                      </span>
                    </td>

                    {/* 4 Nút Trạng Thái Điểm Danh - CỰC KỲ NỔI BẬT & DỄ NHẤN */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80">
                        {/* Có mặt */}
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(student.id, 'present')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isPresent
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105'
                              : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                          }`}
                          title="Có mặt"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Có Mặt</span>
                        </button>

                        {/* Đi trễ */}
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(student.id, 'late')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isLate
                              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-105'
                              : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                          }`}
                          title="Đi trễ"
                        >
                          <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Trễ</span>
                        </button>

                        {/* Vắng có phép */}
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(student.id, 'excused')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isExcused
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105'
                              : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                          }`}
                          title="Vắng có phép"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Phép</span>
                        </button>

                        {/* Vắng không phép */}
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(student.id, 'unexcused')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isUnexcused
                              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-105'
                              : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
                          }`}
                          title="Vắng không phép"
                        >
                          <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Vắng</span>
                        </button>
                      </div>
                    </td>

                    {/* Ghi chú */}
                    <td className="py-3.5 px-4 min-w-[160px]">
                      {editingNoteId === student.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={tempNote}
                            onChange={e => setTempNote(e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-indigo-400 rounded-lg text-xs"
                            placeholder="Ghi chú..."
                            autoFocus
                            onKeyDown={e => e.key === 'Enter' && saveNote(student.id)}
                          />
                          <button
                            onClick={() => saveNote(student.id)}
                            className="p-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditNote(student)}
                          className="group flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 text-left cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                          <span className={student.note ? 'text-slate-700 font-medium' : 'italic text-slate-400'}>
                            {student.note || 'Thêm ghi chú...'}
                          </span>
                        </button>
                      )}
                    </td>

                    {/* Thao tác */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEditStudent(student)}
                          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                          title="Chỉnh sửa thông tin"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteStudent(student.id)}
                          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                          title="Xóa khỏi danh sách"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Count */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
        <div>
          Hiển thị <span className="font-bold text-slate-800 tabular-nums">{sortedStudents.length}</span> / <span className="tabular-nums">{students.length}</span> sinh viên
        </div>
        <div className="text-[11px] text-slate-400">
          Trường Cao Đẳng Bách Nghệ TP.HCM • APP ĐIỂM DANH
        </div>
      </div>
    </div>
  );
};

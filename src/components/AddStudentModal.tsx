import React, { useState, useEffect } from 'react';
import { X, UserPlus, AlertCircle, Check, Sparkles, RefreshCw } from 'lucide-react';
import { Student } from '../types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: Omit<Student, 'id' | 'status'>) => { success: boolean; message?: string };
  defaultClass: string;
  totalStudents: number;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
  defaultClass,
  totalStudents
}) => {
  const [studentCode, setStudentCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [className, setClassName] = useState(defaultClass);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Helper to generate a nice student code
  const generateStudentCode = (targetClass: string) => {
    const cleanClass = (targetClass || defaultClass || 'BN')
      .replace(/[^A-Za-z0-9]/g, '')
      .toUpperCase();
    const prefix = cleanClass.includes('CNTT') ? '22BN-CNTT' :
                   cleanClass.includes('QTKD') ? '23BN-QTKD' :
                   cleanClass.includes('DDT') ? '22BN-DDT' :
                   '22BN-SV';
    const randNum = Math.floor(10 + Math.random() * 90);
    return `${prefix}${randNum}`;
  };

  // Sync state when modal opens or defaultClass changes
  useEffect(() => {
    if (isOpen) {
      setClassName(defaultClass);
      setError(null);
      if (!studentCode) {
        setStudentCode(generateStudentCode(defaultClass));
      }
      if (!dateOfBirth) {
        setDateOfBirth('15/05/2004');
      }
    }
  }, [isOpen, defaultClass]);

  if (!isOpen) return null;

  const handleRegenerateCode = () => {
    setStudentCode(generateStudentCode(className));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Vui lòng nhập Họ và tên sinh viên');
      return;
    }

    // Auto-generate code if empty
    const finalCode = studentCode.trim() 
      ? studentCode.trim().toUpperCase() 
      : generateStudentCode(className);

    // Default date of birth if empty
    const finalDob = dateOfBirth.trim() || '01/01/2004';
    const finalClass = className.trim() || defaultClass;

    const result = onAddStudent({
      studentCode: finalCode,
      fullName: fullName.trim(),
      dateOfBirth: finalDob,
      gender,
      className: finalClass,
      phone: phone.trim(),
      email: email.trim(),
      note: note.trim()
    });

    if (result.success) {
      // Reset form
      setStudentCode('');
      setFullName('');
      setDateOfBirth('15/05/2004');
      setPhone('');
      setEmail('');
      setNote('');
      onClose();
    } else {
      setError(result.message || 'Không thể thêm sinh viên');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden transform transition-all animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Thêm Sinh Viên Mới</h3>
              <p className="text-xs text-blue-100">
                Thêm vào lớp: <strong className="text-amber-300 font-bold">{className || defaultClass}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Họ và tên - BẮT BUỘC DUY NHẤT */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Họ và Tên Sinh Viên <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="VD: Nguyễn Thành Đạt"
                autoFocus
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-slate-900 text-base font-bold focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                required
              />
            </div>

            {/* MSSV (Có nút tự động tạo) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Mã Số Sinh Viên (MSSV)
                </label>
                <button
                  type="button"
                  onClick={handleRegenerateCode}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  title="Tạo mã ngẫu nhiên"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Tạo mã tự động</span>
                </button>
              </div>
              <input
                type="text"
                value={studentCode}
                onChange={e => setStudentCode(e.target.value)}
                placeholder="VD: 22BN-CNTT15 (hoặc để trống)"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all uppercase placeholder:normal-case font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Nếu để trống, hệ thống sẽ tự động gán mã MSSV
              </span>
            </div>

            {/* Ngày tháng năm sinh */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Ngày Tháng Năm Sinh
              </label>
              <input
                type="text"
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
                placeholder="dd/mm/yyyy (VD: 20/11/2004)"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Mặc định: 15/05/2004
              </span>
            </div>

            {/* Giới tính */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Giới Tính
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setGender('Nam')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    gender === 'Nam'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Nam
                </button>
                <button
                  type="button"
                  onClick={() => setGender('Nữ')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    gender === 'Nữ'
                      ? 'bg-pink-600 text-white border-pink-600 shadow-md shadow-pink-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Nữ
                </button>
              </div>
            </div>

            {/* Lớp */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Lớp Cần Thêm Vào
              </label>
              <input
                type="text"
                value={className}
                onChange={e => setClassName(e.target.value)}
                placeholder="VD: CD-CNTT22A"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all uppercase"
                required
              />
            </div>

            {/* Số điện thoại */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Số Điện Thoại / Ghi Chú (Tùy chọn)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="SĐT: 0908123456"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Ghi chú: Lớp phó, cán bộ lớp..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions - Nổi Bật */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-2xl transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-extrabold rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Xác Nhận Thêm Sinh Viên</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

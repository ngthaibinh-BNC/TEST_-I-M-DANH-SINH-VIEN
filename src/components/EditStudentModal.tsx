import React, { useState, useEffect } from 'react';
import { X, Edit3, Check } from 'lucide-react';
import { Student } from '../types';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSave: (updated: Student) => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  isOpen,
  onClose,
  student,
  onSave
}) => {
  const [studentCode, setStudentCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [className, setClassName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (student) {
      setStudentCode(student.studentCode);
      setFullName(student.fullName);
      setDateOfBirth(student.dateOfBirth);
      setGender(student.gender || 'Nam');
      setClassName(student.className || '');
      setPhone(student.phone || '');
      setNote(student.note || '');
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...student,
      studentCode: studentCode.trim().toUpperCase(),
      fullName: fullName.trim(),
      dateOfBirth: dateOfBirth.trim(),
      gender,
      className: className.trim(),
      phone: phone.trim(),
      note: note.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden transform transition-all animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Edit3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Sửa Thông Tin Sinh Viên</h3>
              <p className="text-xs text-blue-100">Cập nhật hồ sơ sinh viên Trường CĐ Bách Nghệ TP.HCM</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Mã Số Sinh Viên (MSSV)
              </label>
              <input
                type="text"
                value={studentCode}
                onChange={e => setStudentCode(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Họ và Tên
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Ngày Tháng Năm Sinh
              </label>
              <input
                type="text"
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
                placeholder="dd/mm/yyyy"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

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
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Nam
                </button>
                <button
                  type="button"
                  onClick={() => setGender('Nữ')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    gender === 'Nữ'
                      ? 'bg-pink-600 text-white border-pink-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Nữ
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Lớp Niên Chế
              </label>
              <input
                type="text"
                value={className}
                onChange={e => setClassName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Số Điện Thoại
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Ghi Chú
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-2xl transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-extrabold rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Cập Nhật Thông Tin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

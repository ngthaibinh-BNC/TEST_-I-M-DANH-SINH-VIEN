import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserPlus, 
  FileSpreadsheet, 
  Download, 
  Sparkles, 
  QrCode, 
  RotateCcw, 
  Award, 
  ShieldCheck, 
  Heart,
  CheckCircle2,
  Share2,
  Info
} from 'lucide-react';
import { Student, SessionInfo, AttendanceStatus } from './types';
import { INITIAL_STUDENTS } from './data/sampleStudents';
import { PRESET_CLASSES } from './data/academicPresets';
import { Header } from './components/Header';
import { ClassSubjectSelector } from './components/ClassSubjectSelector';
import { StatsCards } from './components/StatsCards';
import { StudentTable } from './components/StudentTable';
import { AddStudentModal } from './components/AddStudentModal';
import { ImportStudentsModal } from './components/ImportStudentsModal';
import { ExportModal } from './components/ExportModal';
import { EditStudentModal } from './components/EditStudentModal';
import { RollCallModal } from './components/RollCallModal';
import { QRCheckInModal } from './components/QRCheckInModal';
import { PrintSheet } from './components/PrintSheet';

const STORAGE_KEY_STUDENTS = 'bachnghe_attendance_students_v3';
const STORAGE_KEY_SESSION = 'bachnghe_attendance_session_v3';
const STORAGE_KEY_CLASSES = 'bachnghe_attendance_classes_v1';

export default function App() {
  // Custom & active classes list
  const [customClasses, setCustomClasses] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CLASSES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return PRESET_CLASSES.map(c => c.code);
  });

  // Session Configuration
  const [session, setSession] = useState<SessionInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SESSION);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    const today = new Date().toISOString().split('T')[0];
    return {
      collegeName: 'Trường Cao Đẳng Bách Nghệ Thành Phố Hồ Chí Minh',
      appName: 'APP ĐIỂM DANH',
      author: 'Thái Bình AI',
      className: 'CD-CNTT22A',
      subjectName: 'Lập Trình Web & Di Động',
      roomName: 'Phòng Lab A2-302',
      sessionDate: today,
      sessionPeriod: 'Ca Sáng 1 (Tiết 1 - 3)',
      lecturerName: 'Thầy Thái Bình'
    };
  });

  // Students list
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_STUDENTS;
  });

  // Active class filter: specific class e.g. 'CD-CNTT22A' or 'ALL'
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>(() => session.className || 'CD-CNTT22A');

  // Status Filter state (All / Present / Late / Excused / Unexcused)
  const [currentFilter, setCurrentFilter] = useState<AttendanceStatus | 'all'>('all');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isRollCallOpen, setIsRollCallOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(customClasses));
  }, [customClasses]);

  // Dynamic available classes
  const availableClasses = useMemo(() => {
    const classesFromStudents = students.map(s => s.className?.trim()).filter(Boolean) as string[];
    return Array.from(new Set([...customClasses, ...classesFromStudents])).filter(Boolean);
  }, [customClasses, students]);

  // Student count by class
  const studentCountByClass = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach(s => {
      const c = (s.className || '').trim().toUpperCase();
      if (c) counts[c] = (counts[c] || 0) + 1;
    });
    return counts;
  }, [students]);

  // Students in currently selected class vs all
  const displayedStudents = useMemo(() => {
    if (selectedClassFilter === 'ALL') {
      return students;
    }
    return students.filter(s => (s.className || '').trim().toUpperCase() === selectedClassFilter.trim().toUpperCase());
  }, [students, selectedClassFilter]);

  const studentsInCurrentSessionClass = useMemo(() => {
    return students.filter(s => (s.className || '').trim().toUpperCase() === session.className.trim().toUpperCase());
  }, [students, session.className]);

  // Handle delete class
  const handleDeleteClass = (classCode: string) => {
    const targetCode = classCode.trim().toUpperCase();

    // Remove students of this class
    setStudents(prev => prev.filter(s => (s.className || '').trim().toUpperCase() !== targetCode));

    // Remove from customClasses
    const remaining = customClasses.filter(c => c.trim().toUpperCase() !== targetCode);
    setCustomClasses(remaining);

    // If currently active class was deleted, switch to the first remaining class
    if (session.className.trim().toUpperCase() === targetCode || selectedClassFilter.trim().toUpperCase() === targetCode) {
      const nextClass = remaining.length > 0 ? remaining[0] : (availableClasses.find(c => c !== targetCode) || 'CD-CNTT22A');
      setSession(prev => ({ ...prev, className: nextClass }));
      setSelectedClassFilter(nextClass);
    }

    showToast(`Đã xóa thành công lớp ${targetCode} và toàn bộ sinh viên của lớp!`);
  };

  // Handle add custom class
  const handleAddClass = (classCode: string) => {
    const targetCode = classCode.trim().toUpperCase();
    if (!customClasses.includes(targetCode)) {
      setCustomClasses(prev => [...prev, targetCode]);
    }
    showToast(`Đã thêm mã lớp ${targetCode} vào hệ thống!`);
  };

  // Update session handler
  const handleUpdateSession = (updated: Partial<SessionInfo>) => {
    setSession(prev => {
      const next = { ...prev, ...updated };
      if (updated.className && updated.className !== prev.className) {
        setSelectedClassFilter(updated.className);
      }
      return next;
    });
    showToast('Đã cập nhật thông tin buổi học thành công!');
  };

  const handleSelectClassFilter = (classCode: string) => {
    setSelectedClassFilter(classCode);
    if (classCode !== 'ALL') {
      setSession(prev => ({ ...prev, className: classCode }));
    }
  };

  // Status update 1-click
  const handleUpdateStatus = (id: string, status: AttendanceStatus) => {
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setStudents(prev =>
      prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            status,
            checkInTime: status === 'present' || status === 'late' ? timeString : undefined
          };
        }
        return s;
      })
    );
  };

  // Update student note
  const handleUpdateNote = (id: string, note: string) => {
    setStudents(prev =>
      prev.map(s => (s.id === id ? { ...s, note } : s))
    );
    showToast('Đã lưu ghi chú');
  };

  // Delete student
  const handleDeleteStudent = (id: string) => {
    const studentToDelete = students.find(s => s.id === id);
    if (!studentToDelete) return;
    
    if (window.confirm(`Xóa sinh viên "${studentToDelete.fullName}" (${studentToDelete.studentCode}) khỏi danh sách?`)) {
      setStudents(prev => prev.filter(s => s.id !== id));
      showToast(`Đã xóa sinh viên ${studentToDelete.fullName}`);
    }
  };

  // Add single student - SIÊU LINH HOẠT & BẢO ĐẢM THÀNH CÔNG
  const handleAddStudent = (newStudent: Omit<Student, 'id' | 'status'>) => {
    const targetClass = (newStudent.className || session.className || 'CD-CNTT22A').trim().toUpperCase();

    // Generate unique studentCode if missing or duplicate
    let finalCode = newStudent.studentCode ? newStudent.studentCode.trim().toUpperCase() : '';
    if (!finalCode) {
      const classNum = targetClass.replace(/[^A-Za-z0-9]/g, '');
      finalCode = `22BN-${classNum.slice(-4) || 'SV'}${Math.floor(10 + Math.random() * 90)}`;
    } else {
      // Check duplicate
      const isDuplicate = students.some(
        s => s.studentCode.trim().toLowerCase() === finalCode.toLowerCase()
      );
      if (isDuplicate) {
        finalCode = `${finalCode}-${Math.floor(10 + Math.random() * 90)}`;
      }
    }

    const student: Student = {
      ...newStudent,
      studentCode: finalCode,
      className: targetClass,
      dateOfBirth: newStudent.dateOfBirth?.trim() || '15/05/2004',
      id: `sv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'present',
      checkInTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setStudents(prev => [student, ...prev]);

    // Ensure the current view displays this student's class so the user sees it immediately!
    if (selectedClassFilter !== 'ALL' && selectedClassFilter.toUpperCase() !== targetClass) {
      setSelectedClassFilter(targetClass);
      setSession(prev => ({ ...prev, className: targetClass }));
    }

    // Reset status filter to 'all' so it isn't hidden by a filter
    setCurrentFilter('all');

    showToast(`Đã thêm thành công: ${student.fullName} (${student.studentCode}) vào lớp ${targetClass}!`);
    return { success: true };
  };

  // Quick Add directly from Table Inline Bar
  const handleQuickAddStudent = (fullName: string, studentCode?: string, dateOfBirth?: string) => {
    handleAddStudent({
      fullName,
      studentCode: studentCode || '',
      dateOfBirth: dateOfBirth || '15/05/2004',
      className: session.className,
      gender: 'Nam',
      note: ''
    });
  };

  // Bulk import
  const handleImportStudents = (importedList: Omit<Student, 'id' | 'status'>[], targetClass: string) => {
    const finalTargetClass = (targetClass || session.className || 'CD-CNTT22A').trim().toUpperCase();
    const existingCodes = new Set(students.map(s => s.studentCode.toLowerCase().trim()));
    const newItems: Student[] = [];

    importedList.forEach((item, idx) => {
      let code = item.studentCode.trim().toUpperCase();
      if (!code || existingCodes.has(code.toLowerCase())) {
        const cleanTag = finalTargetClass.replace(/[^A-Za-z0-9]/g, '');
        code = `${code || '22BN-' + cleanTag.slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;
      }
      existingCodes.add(code.toLowerCase());

      newItems.push({
        ...item,
        studentCode: code,
        className: finalTargetClass,
        id: `sv-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        status: 'present',
        dateOfBirth: item.dateOfBirth || '15/05/2004'
      });
    });

    if (newItems.length === 0) {
      showToast('Không có sinh viên mới nào được nhập!');
    } else {
      setStudents(prev => [...newItems, ...prev]);
      
      // Tự động chuyển màn hình sang lớp vừa thêm và mở toàn bộ danh sách
      setSelectedClassFilter(finalTargetClass);
      setSession(prev => ({ ...prev, className: finalTargetClass }));
      setCurrentFilter('all');

      showToast(`Đã nhập thành công ${newItems.length} sinh viên vào lớp ${finalTargetClass}!`);
    }
  };

  // Edit student
  const handleSaveEditedStudent = (updated: Student) => {
    setStudents(prev => prev.map(s => (s.id === updated.id ? updated : s)));
    showToast(`Đã cập nhật sinh viên ${updated.fullName}`);
  };

  // Mark all present in displayed list
  const handleMarkAllPresent = () => {
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const displayedIds = new Set(displayedStudents.map(s => s.id));

    setStudents(prev =>
      prev.map(s => {
        if (displayedIds.has(s.id)) {
          return {
            ...s,
            status: 'present',
            checkInTime: s.checkInTime || timeString
          };
        }
        return s;
      })
    );
    showToast(`Đã đánh dấu TẤT CẢ sinh viên đang hiển thị CÓ MẶT!`);
  };

  // Reset all status in displayed list
  const handleResetAll = () => {
    if (window.confirm('Đặt lại trạng thái điểm danh của các sinh viên đang chọn về "Chưa điểm danh"?')) {
      const displayedIds = new Set(displayedStudents.map(s => s.id));
      setStudents(prev =>
        prev.map(s => {
          if (displayedIds.has(s.id)) {
            return {
              ...s,
              status: 'unmarked',
              checkInTime: undefined
            };
          }
          return s;
        })
      );
      showToast('Đã đặt lại trạng thái điểm danh');
    }
  };

  // Preset reload original students
  const handleReloadOriginalSample = () => {
    if (window.confirm('Khôi phục danh sách sinh viên mẫu chuẩn trường CĐ Bách Nghệ TP.HCM?')) {
      setStudents(INITIAL_STUDENTS);
      setSelectedClassFilter('CD-CNTT22A');
      setSession(prev => ({ ...prev, className: 'CD-CNTT22A' }));
      showToast('Đã nạp lại danh sách sinh viên mẫu Bách Nghệ TP.HCM');
    }
  };

  const presentCount = displayedStudents.filter(s => s.status === 'present' || s.status === 'late').length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-slideUp text-xs sm:text-sm font-semibold no-print">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Printable Sheet for window.print() */}
        <PrintSheet students={displayedStudents} session={session} />

        {/* Interactive App - Hidden when printing */}
        <div className="no-print">
          {/* Header Component */}
          <Header
            session={session}
            onUpdateSession={handleUpdateSession}
            totalStudents={displayedStudents.length}
            presentStudents={presentCount}
          />

          {/* ========================================================
              BỘ ĐIỀU KHIỂN CHỌN LỚP - MÔN - NGÀY - CA
             ======================================================== */}
          <ClassSubjectSelector
            session={session}
            onUpdateSession={handleUpdateSession}
            availableClasses={availableClasses}
            totalStudentsInClass={studentsInCurrentSessionClass.length}
            totalStudentsAll={students.length}
            selectedClassFilter={selectedClassFilter}
            onSelectClassFilter={handleSelectClassFilter}
            onDeleteClass={handleDeleteClass}
            onAddClass={handleAddClass}
            studentCountByClass={studentCountByClass}
          />

          {/* MASTER ACTION BUTTONS BAR - CỰC KỲ NỔI BẬT */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-xl border border-slate-200/80 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-indigo-700 block mb-0.5">
                  Lớp Đang Chọn: {session.className}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Quản Lý Sinh Viên & Điểm Danh
                </h3>
              </div>

              {/* ACTION BUTTONS CLUSTER - VIBRANT & PROMINENT */}
              <div className="flex flex-wrap items-center gap-3">
                {/* 1. NÚT THÊM SINH VIÊN - SIÊU NỔI BẬT */}
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs sm:text-sm font-black shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  <span>+ Thêm Sinh Viên</span>
                </button>

                {/* 2. NÚT NHẬP DANH SÁCH - SIÊU NỔI BẬT */}
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 hover:from-teal-500 hover:to-green-500 text-white text-xs sm:text-sm font-black shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  <span>Nhập Danh Sách (Excel / Dán)</span>
                </button>

                {/* 3. NÚT XUẤT DANH SÁCH - SIÊU NỔI BẬT */}
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-white text-xs sm:text-sm font-black shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  <span>Xuất Danh Sách (Excel / PDF)</span>
                </button>

                {/* 4. NÚT ROLL CALL (ĐIỂM DANH TỪNG BẠN) */}
                <button
                  type="button"
                  onClick={() => setIsRollCallOpen(true)}
                  className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Gọi Tên (Roll Call)</span>
                </button>

                {/* 5. NÚT QR CODE */}
                <button
                  type="button"
                  onClick={() => setIsQROpen(true)}
                  className="px-4 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs sm:text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Mã QR Lớp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats & Filter Cards */}
          <StatsCards
            students={displayedStudents}
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
          />

          {/* Student Table with Inline Quick Add Bar */}
          <StudentTable
            students={displayedStudents}
            onUpdateStatus={handleUpdateStatus}
            onUpdateNote={handleUpdateNote}
            onDeleteStudent={handleDeleteStudent}
            onMarkAllPresent={handleMarkAllPresent}
            onResetAllStatus={handleResetAll}
            onEditStudent={setEditingStudent}
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            currentClassName={session.className}
            onQuickAddStudent={handleQuickAddStudent}
          />

          {/* Footer Branding Info */}
          <footer className="mt-12 pt-6 border-t border-slate-300/70 text-center text-xs text-slate-500 space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="font-extrabold text-slate-700">TRƯỜNG CAO ĐẲNG BÁCH NGHỆ THÀNH PHỐ HỒ CHÍ MINH</span>
              <span>•</span>
              <span className="font-bold text-indigo-600">APP ĐIỂM DANH</span>
              <span>•</span>
              <span className="font-bold text-amber-600">Tác giả: Thái Bình AI</span>
            </div>
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
              <button
                onClick={handleReloadOriginalSample}
                className="hover:text-indigo-600 underline cursor-pointer"
              >
                Khôi phục danh sách sinh viên mẫu
              </button>
              <span>|</span>
              <span>Lưu trữ tự động trên trình duyệt (LocalStorage)</span>
              <span>|</span>
              <span>Xuất Excel & CSV chuẩn Unicode UTF-8</span>
            </div>
          </footer>
        </div>

        {/* MODALS */}
        <AddStudentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddStudent={handleAddStudent}
          defaultClass={session.className}
          totalStudents={students.length}
        />

        <ImportStudentsModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImportStudents}
          defaultClass={session.className}
          availableClasses={availableClasses}
        />

        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          students={displayedStudents}
          session={session}
        />

        <EditStudentModal
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          student={editingStudent}
          onSave={handleSaveEditedStudent}
        />

        <RollCallModal
          isOpen={isRollCallOpen}
          onClose={() => setIsRollCallOpen(false)}
          students={displayedStudents}
          onUpdateStatus={handleUpdateStatus}
        />

        <QRCheckInModal
          isOpen={isQROpen}
          onClose={() => setIsQROpen(false)}
          session={session}
        />
      </main>
    </div>
  );
}

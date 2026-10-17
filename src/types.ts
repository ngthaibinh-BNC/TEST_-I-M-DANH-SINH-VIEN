export type AttendanceStatus = 'present' | 'late' | 'excused' | 'unexcused' | 'unmarked';

export interface Student {
  id: string;
  studentCode: string; // Mã số sinh viên (MSSV)
  fullName: string;    // Họ và tên
  dateOfBirth: string; // Ngày tháng năm sinh (dd/mm/yyyy)
  gender?: 'Nam' | 'Nữ';
  className?: string;  // Lớp học
  phone?: string;
  email?: string;
  status: AttendanceStatus;
  note?: string;
  checkInTime?: string;
}

export interface SessionInfo {
  collegeName: string;
  appName: string;
  author: string;
  className: string;
  subjectName: string;
  roomName: string;
  sessionDate: string; // YYYY-MM-DD
  sessionPeriod: string; // Tiết học (ví dụ: Tiết 1 - 4)
  lecturerName: string;
}

export interface AttendanceHistory {
  id: string;
  date: string;
  subject: string;
  className: string;
  totalStudents: number;
  presentCount: number;
  lateCount: number;
  excusedCount: number;
  unexcusedCount: number;
  students: Student[];
}

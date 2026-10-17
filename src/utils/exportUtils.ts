import * as XLSX from 'xlsx';
import { Student, SessionInfo } from '../types';

export const getStatusLabel = (status: Student['status']): string => {
  switch (status) {
    case 'present':
      return 'Có mặt';
    case 'late':
      return 'Đi trễ';
    case 'excused':
      return 'Vắng có phép';
    case 'unexcused':
      return 'Vắng không phép';
    default:
      return 'Chưa điểm danh';
  }
};

/**
 * Xuất danh sách sinh viên ra file Excel (.xlsx) chuẩn mẫu giáo dục
 */
export const exportToExcel = (students: Student[], session: SessionInfo) => {
  const wb = XLSX.utils.book_new();

  // Tính toán thống kê
  const total = students.length;
  const present = students.filter(s => s.status === 'present').length;
  const late = students.filter(s => s.status === 'late').length;
  const excused = students.filter(s => s.status === 'excused').length;
  const unexcused = students.filter(s => s.status === 'unexcused').length;
  const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  // Header rows
  const headerData = [
    [session.collegeName.toUpperCase()],
    [`${session.appName.toUpperCase()} - MÔN: ${session.subjectName.toUpperCase()}`],
    [`Tác giả: ${session.author} | Lớp: ${session.className} | Ngày: ${session.sessionDate} | Tiết: ${session.sessionPeriod}`],
    [`Giảng viên: ${session.lecturerName} | Phòng: ${session.roomName}`],
    [],
    [`THỐNG KÊ SĨ SỐ: Tổng số: ${total} SV | Có mặt: ${present} | Đi trễ: ${late} | Vắng có phép: ${excused} | Vắng k.phép: ${unexcused} | Tỷ lệ: ${rate}%`],
    [],
    [
      'STT',
      'Mã số sinh viên (MSSV)',
      'Họ và tên',
      'Ngày tháng năm sinh',
      'Giới tính',
      'Lớp',
      'Trạng thái điểm danh',
      'Giờ điểm danh',
      'Ghi chú'
    ]
  ];

  // Student rows
  const studentRows = students.map((s, index) => [
    index + 1,
    s.studentCode,
    s.fullName,
    s.dateOfBirth,
    s.gender || 'Nam',
    s.className || session.className,
    getStatusLabel(s.status),
    s.checkInTime || (s.status === 'present' ? 'Đã điểm danh' : '-'),
    s.note || ''
  ]);

  const fullData = [...headerData, ...studentRows];
  const ws = XLSX.utils.aoa_to_sheet(fullData);

  // Column widths
  ws['!cols'] = [
    { wch: 6 },  // STT
    { wch: 20 }, // MSSV
    { wch: 28 }, // Họ và tên
    { wch: 18 }, // Ngày sinh
    { wch: 12 }, // Giới tính
    { wch: 16 }, // Lớp
    { wch: 22 }, // Trạng thái
    { wch: 16 }, // Giờ điểm danh
    { wch: 30 }  // Ghi chú
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'DiemDanh');

  const fileName = `DiemDanh_${session.className}_${session.sessionDate}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

/**
 * Xuất file CSV định dạng UTF-8 kèm BOM
 */
export const exportToCSV = (students: Student[], session: SessionInfo) => {
  const headers = ['STT', 'MSSV', 'HoVaTen', 'NgaySinh', 'GioiTinh', 'Lop', 'TrangThai', 'GioDiemDanh', 'GhiChu'];
  
  const rows = students.map((s, idx) => [
    idx + 1,
    `"${s.studentCode}"`,
    `"${s.fullName}"`,
    `"${s.dateOfBirth}"`,
    `"${s.gender || 'Nam'}"`,
    `"${s.className || session.className}"`,
    `"${getStatusLabel(s.status)}"`,
    `"${s.checkInTime || ''}"`,
    `"${(s.note || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `DanhSach_SinhVien_${session.className}_${session.sessionDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Tải file mẫu Excel để giảng viên nhập liệu
 */
export const downloadSampleTemplate = () => {
  const wb = XLSX.utils.book_new();
  const sampleData = [
    ['MSSV', 'Họ và tên', 'Ngày tháng năm sinh', 'Giới tính', 'Lớp', 'Số điện thoại', 'Ghi chú'],
    ['23BN-CNTT01', 'Nguyễn Văn An', '15/04/2004', 'Nam', 'CD-CNTT22A', '0908123456', ''],
    ['23BN-CNTT02', 'Trần Thị Mai', '22/09/2004', 'Nữ', 'CD-CNTT22A', '0912345678', 'Lớp phó'],
    ['23BN-CNTT03', 'Lê Hoàng Long', '05/11/2003', 'Nam', 'CD-CNTT22A', '0933789012', ''],
    ['23BN-CNTT04', 'Phạm Minh Quân', '18/02/2004', 'Nam', 'CD-CNTT22A', '0977890123', '']
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  ws['!cols'] = [
    { wch: 18 },
    { wch: 25 },
    { wch: 20 },
    { wch: 12 },
    { wch: 15 },
    { wch: 16 },
    { wch: 20 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'MauNhapSinhVien');
  XLSX.writeFile(wb, 'Mau_Nhap_Danh_Sach_Sinh_Vien_BachNghe.xlsx');
};

export interface ClassOption {
  code: string;
  name: string;
  faculty: string;
}

export interface SubjectOption {
  code: string;
  name: string;
  credits: number;
}

export interface ShiftOption {
  id: string;
  title: string;
  timeRange: string;
  periods: string;
  iconType: 'morning' | 'noon' | 'afternoon' | 'evening';
}

export const PRESET_CLASSES: ClassOption[] = [
  { code: 'CD-CNTT22A', name: 'Cao đẳng Công nghệ Thông tin 22A', faculty: 'Khoa CNTT' },
  { code: 'CD-CNTT22B', name: 'Cao đẳng Công nghệ Thông tin 22B', faculty: 'Khoa CNTT' },
  { code: 'CD-QTKD23A', name: 'Cao đẳng Quản trị Kinh doanh 23A', faculty: 'Khoa Kinh tế' },
  { code: 'CD-DDT22A', name: 'Cao đẳng Điện - Điện tử 22A', faculty: 'Khoa Điện tử' },
  { code: 'CD-CK23A', name: 'Cao đẳng Cơ khí Chế tạo máy 23A', faculty: 'Khoa Cơ khí' },
  { code: 'CD-OTO22B', name: 'Cao đẳng Công nghệ Ô tô 22B', faculty: 'Khoa Ô tô' }
];

export const PRESET_SUBJECTS: SubjectOption[] = [
  { code: 'WEB201', name: 'Lập Trình Web & Di Động', credits: 3 },
  { code: 'CSDL101', name: 'Cơ Sở Dữ Liệu SQL', credits: 3 },
  { code: 'NET301', name: 'Mạng Máy Tính & An Ninh Mạng', credits: 4 },
  { code: 'JAVA202', name: 'Lập Trình Java Nâng Cao', credits: 3 },
  { code: 'QTKD102', name: 'Quản Trị Doanh Nghiệp Hiện Đại', credits: 3 },
  { code: 'PLC303', name: 'Điện Tử Công Nghiệp & PLC', credits: 4 },
  { code: 'OTO201', name: 'Động Cơ Đốt Trong & Điện Ô Tô', credits: 4 },
  { code: 'SOFT101', name: 'Kỹ Năng Mềm & Làm Việc Nhóm', credits: 2 }
];

export const PRESET_SHIFTS: ShiftOption[] = [
  { id: 'shift-1', title: 'Ca Sáng 1', periods: 'Tiết 1 - 3', timeRange: '07:00 - 09:15', iconType: 'morning' },
  { id: 'shift-2', title: 'Ca Sáng 2', periods: 'Tiết 4 - 6', timeRange: '09:30 - 11:45', iconType: 'noon' },
  { id: 'shift-3', title: 'Ca Chiều 1', periods: 'Tiết 7 - 9', timeRange: '12:30 - 14:45', iconType: 'afternoon' },
  { id: 'shift-4', title: 'Ca Chiều 2', periods: 'Tiết 10 - 12', timeRange: '15:00 - 17:15', iconType: 'afternoon' },
  { id: 'shift-5', title: 'Ca Tối', periods: 'Tiết 13 - 15', timeRange: '17:45 - 20:00', iconType: 'evening' }
];

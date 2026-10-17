import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  ClipboardCheck, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Sparkles,
  HelpCircle,
  GraduationCap,
  Layers,
  ArrowRight
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Student } from '../types';
import { downloadSampleTemplate } from '../utils/exportUtils';
import { PRESET_CLASSES } from '../data/academicPresets';

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newStudents: Omit<Student, 'id' | 'status'>[], targetClass: string) => void;
  defaultClass: string;
  availableClasses: string[];
}

export const ImportStudentsModal: React.FC<ImportStudentsModalProps> = ({
  isOpen,
  onClose,
  onImport,
  defaultClass,
  availableClasses
}) => {
  const [activeTab, setActiveTab] = useState<'excel' | 'paste' | 'preset'>('excel');
  const [selectedTargetClass, setSelectedTargetClass] = useState(defaultClass);
  const [customTargetClass, setCustomTargetClass] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [previewStudents, setPreviewStudents] = useState<Omit<Student, 'id' | 'status'>[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [importedFileName, setImportedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selectedTargetClass whenever defaultClass changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTargetClass(defaultClass);
      setImportError(null);
      setPreviewStudents([]);
      setImportedFileName(null);
    }
  }, [isOpen, defaultClass]);

  if (!isOpen) return null;

  const currentClassCode = (customTargetClass.trim() || selectedTargetClass || defaultClass).trim().toUpperCase();

  // Helper: Format date
  const parseExcelDate = (val: any): string => {
    if (!val) return '15/05/2004';
    if (typeof val === 'number') {
      try {
        const dateObj = new Date(Math.round((val - 25569) * 86400 * 1000));
        const d = String(dateObj.getDate()).padStart(2, '0');
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const y = dateObj.getFullYear();
        if (y > 1980 && y < 2035) return `${d}/${m}/${y}`;
      } catch {
        // Fallback
      }
    }
    const str = String(val).trim();
    // Support dd/mm/yyyy, yyyy-mm-dd, dd-mm-yyyy, dd.mm.yyyy
    if (/^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}$/.test(str)) {
      return str.replace(/[\-\.]/g, '/');
    }
    if (/^\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}$/.test(str)) {
      const parts = str.split(/[\/\-\.]/);
      return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
    }
    return str || '15/05/2004';
  };

  // Helper: generate code based on class and index
  const makeCode = (prefix: string, index: number) => {
    const cleanPrefix = prefix.replace(/[^A-Za-z0-9]/g, '');
    const tag = cleanPrefix.includes('CNTT') ? '22BN-CNTT' :
                cleanPrefix.includes('QTKD') ? '23BN-QTKD' :
                cleanPrefix.includes('DDT') ? '22BN-DDT' :
                '22BN';
    return `${tag}${String(index).padStart(2, '0')}`;
  };

  // Xử lý đọc file Excel / CSV siêu linh hoạt
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportedFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

      if (rows.length < 1) {
        setImportError('File Excel không có dữ liệu.');
        return;
      }

      // Scan up to 50 rows to detect headers
      let headerRowIndex = -1;
      let mssvIdx = -1;
      let fullNameIdx = -1;
      let lastNameIdx = -1; // Họ đệm
      let firstNameIdx = -1; // Tên
      let dobIdx = -1;
      let genderIdx = -1;
      let classIdx = -1;

      for (let i = 0; i < Math.min(rows.length, 50); i++) {
        const row = rows[i].map(c => String(c || '').toLowerCase().trim());
        
        // Check keywords
        const hMssv = row.findIndex(c => 
          c.includes('mssv') || c.includes('mã số') || c.includes('mã sv') || 
          c.includes('mã hssv') || c.includes('mã sinh viên') || c === 'mã' || c === 'code' || c === 'id'
        );
        const hFullName = row.findIndex(c => 
          c.includes('họ và tên') || c.includes('họ tên') || c.includes('họ & tên') || 
          c.includes('full name') || c.includes('tên sinh viên') || c.includes('tên học sinh')
        );
        const hLastName = row.findIndex(c => 
          c === 'họ' || c.includes('họ lót') || c.includes('họ đệm') || c.includes('họ và đệm') || c.includes('chữ lót')
        );
        const hFirstName = row.findIndex(c => 
          c === 'tên' || c === 'tên gọi' || c.includes('tên sv')
        );

        if (hFullName !== -1 || (hLastName !== -1 && hFirstName !== -1) || hMssv !== -1) {
          headerRowIndex = i;
          mssvIdx = hMssv;
          fullNameIdx = hFullName;
          lastNameIdx = hLastName;
          firstNameIdx = hFirstName;

          row.forEach((c, colIdx) => {
            if (c.includes('sinh') || c.includes('dob') || c.includes('ngày') || c.includes('năm sinh')) dobIdx = colIdx;
            else if (c.includes('tính') || c.includes('gender') || c.includes('phái') || c.includes('nam/nữ')) genderIdx = colIdx;
            else if (c.includes('lớp') || c.includes('class')) classIdx = colIdx;
          });
          break;
        }
      }

      const parsed: Omit<Student, 'id' | 'status'>[] = [];
      const startRow = headerRowIndex !== -1 ? headerRowIndex + 1 : 0;

      for (let i = startRow; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        // Extract student name
        let name = '';
        if (fullNameIdx !== -1 && row[fullNameIdx]) {
          name = String(row[fullNameIdx]).trim();
        } else if (lastNameIdx !== -1 && firstNameIdx !== -1) {
          const lName = String(row[lastNameIdx] || '').trim();
          const fName = String(row[firstNameIdx] || '').trim();
          name = `${lName} ${fName}`.trim();
        } else {
          // If no explicit header, search for a column containing a Vietnamese name (has space and letters)
          for (const cell of row) {
            const strCell = String(cell || '').trim();
            if (strCell.includes(' ') && /[a-zA-ZÀ-ỹ]/.test(strCell) && strCell.length > 3 && strCell.length < 40) {
              name = strCell;
              break;
            }
          }
        }

        // Filter out non-student header repeats or summaries
        if (!name || name.toLowerCase().includes('tổng cộng') || name.toLowerCase().includes('danh sách') || name.toLowerCase().includes('bách nghệ')) {
          continue;
        }

        // Extract MSSV
        let code = '';
        if (mssvIdx !== -1 && row[mssvIdx]) {
          code = String(row[mssvIdx]).trim().toUpperCase();
        } else {
          // Look for an alphanumeric code like 22BN...
          for (const cell of row) {
            const strCell = String(cell || '').trim().toUpperCase();
            if (/^[0-9A-Z]{4,15}$/.test(strCell) && /\d/.test(strCell) && strCell !== name) {
              code = strCell;
              break;
            }
          }
        }
        if (!code) {
          code = makeCode(currentClassCode, parsed.length + 1);
        }

        // Extract DOB
        let dob = '15/05/2004';
        if (dobIdx !== -1 && row[dobIdx]) {
          dob = parseExcelDate(row[dobIdx]);
        }

        // Extract Gender
        let gender: 'Nam' | 'Nữ' = 'Nam';
        if (genderIdx !== -1 && row[genderIdx]) {
          const gStr = String(row[genderIdx]).toLowerCase();
          if (gStr.includes('nữ') || gStr === 'f' || gStr === 'female') {
            gender = 'Nữ';
          }
        }

        parsed.push({
          studentCode: code,
          fullName: name,
          dateOfBirth: dob,
          gender,
          className: currentClassCode,
          note: ''
        });
      }

      if (parsed.length === 0) {
        setImportError('Không tìm thấy danh sách sinh viên hợp lệ trong file Excel. Vui lòng tải file mẫu để xem định dạng chuẩn.');
      } else {
        setPreviewStudents(parsed);
      }
    } catch (err: any) {
      setImportError(`Lỗi đọc file Excel: ${err?.message || 'Định dạng file không tương thích'}`);
    }
  };

  // Xử lý dán văn bản trực tiếp
  const handleParsePastedText = () => {
    setImportError(null);
    if (!pastedText.trim()) {
      setImportError('Vui lòng dán danh sách sinh viên vào ô bên dưới.');
      return;
    }

    const lines = pastedText.split('\n');
    const parsed: Omit<Student, 'id' | 'status'>[] = [];

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      let parts: string[] = [];
      if (line.includes('\t')) parts = line.split('\t');
      else if (line.includes('|')) parts = line.split('|');
      else if (line.includes(',')) parts = line.split(',');
      else if (line.includes(';')) parts = line.split(';');
      else parts = line.split(/\s{2,}/);

      parts = parts.map(p => p.trim());

      // If line only has 1 column, assume it's the full name!
      if (parts.length === 1 && parts[0].length > 2) {
        parsed.push({
          studentCode: makeCode(currentClassCode, parsed.length + 1),
          fullName: parts[0],
          dateOfBirth: '15/05/2004',
          gender: 'Nam',
          className: currentClassCode,
          note: ''
        });
      } else if (parts.length >= 2) {
        if (parts[0].toLowerCase().includes('mssv') || parts[1].toLowerCase().includes('họ')) {
          continue;
        }

        // Check whether part 0 is code or name
        let code = '';
        let name = '';
        let dob = '15/05/2004';

        if (/^[0-9A-Za-z\-_]{3,15}$/.test(parts[0]) && /\d/.test(parts[0])) {
          code = parts[0].toUpperCase();
          name = parts[1];
          dob = parts[2] ? parseExcelDate(parts[2]) : '15/05/2004';
        } else {
          name = parts[0];
          code = makeCode(currentClassCode, parsed.length + 1);
          dob = parts[1] ? parseExcelDate(parts[1]) : '15/05/2004';
        }

        parsed.push({
          studentCode: code,
          fullName: name,
          dateOfBirth: dob,
          gender: parts[3]?.toLowerCase().includes('nữ') ? 'Nữ' : 'Nam',
          className: currentClassCode,
          note: ''
        });
      }
    }

    if (parsed.length === 0) {
      setImportError('Không phân tích được danh sách. Thầy có thể dán mỗi dòng 1 Họ Tên sinh viên.');
    } else {
      setPreviewStudents(parsed);
    }
  };

  // Nạp danh sách mẫu nhanh theo lớp
  const handleLoadClassPreset = (classCode: string) => {
    setSelectedTargetClass(classCode);
    setCustomTargetClass('');

    const classPrefix = classCode.replace(/[^A-Za-z0-9]/g, '');
    const sampleNames = [
      'Nguyễn Văn An', 'Trần Thị Mai', 'Lê Hoàng Long', 'Phạm Minh Quân',
      'Đỗ Thùy Linh', 'Võ Quốc Huy', 'Bùi Thị Ngọc Hân', 'Dương Hữu Tài',
      'Hoàng Kim Yến', 'Ngô Thanh Phong', 'Lý Gia Bảo', 'Đặng Ngọc Trâm'
    ];

    const generated = sampleNames.map((name, i) => ({
      studentCode: `22BN-${classPrefix.slice(-4)}${String(i + 1).padStart(2, '0')}`,
      fullName: name,
      dateOfBirth: `${String((i * 3) % 28 + 1).padStart(2, '0')}/${String((i % 12) + 1).padStart(2, '0')}/2004`,
      gender: (i % 3 === 1 ? 'Nữ' : 'Nam') as 'Nam' | 'Nữ',
      className: classCode,
      note: i === 0 ? 'Lớp trưởng' : ''
    }));

    setPreviewStudents(generated);
  };

  // Confirm import
  const handleConfirmImport = () => {
    if (previewStudents.length === 0) return;

    // Ensure all imported students have the chosen target class
    const finalBatch = previewStudents.map(st => ({
      ...st,
      className: currentClassCode
    }));

    onImport(finalBatch, currentClassCode);
    onClose();
  };

  // Combine available class options
  const classList = Array.from(new Set([
    defaultClass,
    ...PRESET_CLASSES.map(c => c.code),
    ...availableClasses
  ])).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden max-h-[92vh] flex flex-col transform transition-all animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Thêm / Nhập Danh Sách Sinh Viên</h3>
              <p className="text-xs text-teal-100">
                Nhập file Excel, CSV hoặc Dán danh sách vào lớp học đã chọn
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

        {/* TARGET CLASS SELECTION BAR - RÕ RÀNG THEO YÊU CẦU CỦA THẦY */}
        <div className="bg-emerald-50/80 px-6 py-3.5 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-700" />
            <span className="text-xs font-black uppercase text-emerald-950">
              Lớp Sẽ Tiếp Nhận Danh Sách:
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedTargetClass}
              onChange={e => {
                setSelectedTargetClass(e.target.value);
                setCustomTargetClass('');
                // If there are preview students, update their class
                setPreviewStudents(prev => prev.map(s => ({ ...s, className: e.target.value })));
              }}
              className="px-3 py-1.5 bg-white border-2 border-emerald-400 font-extrabold text-xs sm:text-sm text-emerald-900 rounded-xl focus:outline-none shadow-xs"
            >
              {classList.map(c => (
                <option key={c} value={c}>
                  Lớp: {c} {c === defaultClass ? '⭐ (Đang mở)' : ''}
                </option>
              ))}
            </select>

            <span className="text-xs text-slate-400 font-bold">hoặc</span>

            <input
              type="text"
              value={customTargetClass}
              onChange={e => {
                setCustomTargetClass(e.target.value);
                if (e.target.value.trim()) {
                  setPreviewStudents(prev => prev.map(s => ({ ...s, className: e.target.value.trim().toUpperCase() })));
                }
              }}
              placeholder="Nhập mã lớp mới..."
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 uppercase w-36 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 pt-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('excel')}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'excel'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Nhập File Excel / CSV</span>
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'paste'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ClipboardCheck className="w-4 h-4 text-teal-600" />
              <span>Dán Văn Bản Trực Tiếp</span>
            </button>
            <button
              onClick={() => setActiveTab('preset')}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'preset'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Nạp Nhanh DS Mẫu Lớp Này</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {importError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {activeTab === 'excel' ? (
            <div className="space-y-4">
              {/* Dropzone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-400 hover:border-emerald-600 rounded-3xl p-8 text-center bg-emerald-50/40 hover:bg-emerald-50 transition-all cursor-pointer group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".xlsx, .xls, .csv, .tsv, .ods"
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-md">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="text-base font-extrabold text-slate-800">
                  {importedFileName ? `Đã chọn file: ${importedFileName}` : 'Bấm vào đây để chọn File Excel (.xlsx, .xls) hoặc CSV'}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Tự động nhận diện mọi mẫu danh sách (kể cả có dòng tiêu đề trường/khoa, cột Họ đệm riêng, Tên riêng). Tất cả sẽ được thêm vào lớp <strong>{currentClassCode}</strong>.
                </p>
              </div>

              {/* Download template notice */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cần xem cấu trúc mẫu Excel? Tải file mẫu của trường Bách Nghệ.</span>
                </div>
                <button
                  type="button"
                  onClick={downloadSampleTemplate}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải File Mẫu Excel</span>
                </button>
              </div>
            </div>
          ) : activeTab === 'paste' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Dán danh sách sinh viên vào đây (Copy từ Excel sang):</span>
                <span>Tự động gán vào lớp: <strong>{currentClassCode}</strong></span>
              </div>
              <textarea
                rows={6}
                value={pastedText}
                onChange={e => setPastedText(e.target.value)}
                placeholder="23BN-CNTT01 | Nguyễn Văn An | 15/04/2004&#10;23BN-CNTT02 | Trần Thị Mai | 22/09/2004&#10;Hoặc chỉ cần dán danh sách Họ và Tên mỗi người 1 dòng..."
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              <button
                type="button"
                onClick={handleParsePastedText}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Phân Tích Dữ Liệu Dán Vào Lớp {currentClassCode}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Thầy muốn nạp nhanh danh sách 12 sinh viên mẫu chuẩn cho lớp nào? Bấm chọn lớp bên dưới để nạp tức thì:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {classList.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleLoadClassPreset(c)}
                    className="p-3 bg-indigo-50/60 hover:bg-indigo-100 border border-indigo-200 rounded-2xl text-left transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-extrabold text-sm text-indigo-950">Nạp DS Lớp {c}</div>
                      <div className="text-[11px] text-indigo-600">12 sinh viên mẫu chuẩn</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preview Parsed Table */}
          {previewStudents.length > 0 && (
            <div className="mt-6 space-y-3 border-t border-slate-200 pt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-sm font-extrabold text-slate-800">
                    Đã nhận diện: <span className="text-emerald-600 tabular-nums">{previewStudents.length}</span> sinh viên sẽ thêm vào lớp <strong className="text-blue-700 underline">{currentClassCode}</strong>
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewStudents([]);
                    setImportedFileName(null);
                  }}
                  className="text-xs text-rose-600 hover:underline cursor-pointer"
                >
                  Xóa xem trước
                </button>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-52 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">STT</th>
                      <th className="py-2 px-3">MSSV</th>
                      <th className="py-2 px-3">Họ và tên</th>
                      <th className="py-2 px-3">Ngày sinh</th>
                      <th className="py-2 px-3">Giới tính</th>
                      <th className="py-2 px-3">Lớp Sẽ Thêm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewStudents.map((st, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-400 tabular-nums">{i + 1}</td>
                        <td className="py-2 px-3 font-mono font-bold text-blue-700">{st.studentCode}</td>
                        <td className="py-2 px-3 font-semibold text-slate-800">{st.fullName}</td>
                        <td className="py-2 px-3 text-slate-600 tabular-nums">{st.dateOfBirth}</td>
                        <td className="py-2 px-3 text-slate-600">{st.gender || 'Nam'}</td>
                        <td className="py-2 px-3 font-bold text-emerald-700">{currentClassCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions - Nổi Bật */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-2xl transition-all cursor-pointer"
          >
            Đóng
          </button>

          <button
            type="button"
            disabled={previewStudents.length === 0}
            onClick={handleConfirmImport}
            className={`px-6 py-2.5 text-sm font-extrabold rounded-2xl shadow-xl flex items-center gap-2 transition-all cursor-pointer ${
              previewStudents.length > 0
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 stroke-[3]" />
            <span>Xác Nhận Thêm {previewStudents.length > 0 ? `${previewStudents.length} Sinh Viên Vào Lớp ${currentClassCode}` : ''}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

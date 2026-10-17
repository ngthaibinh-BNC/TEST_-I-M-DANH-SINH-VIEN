import React from 'react';
import { Student, SessionInfo } from '../types';
import { getStatusLabel } from '../utils/exportUtils';

interface PrintSheetProps {
  students: Student[];
  session: SessionInfo;
}

export const PrintSheet: React.FC<PrintSheetProps> = ({ students, session }) => {
  const total = students.length;
  const present = students.filter(s => s.status === 'present').length;
  const late = students.filter(s => s.status === 'late').length;
  const excused = students.filter(s => s.status === 'excused').length;
  const unexcused = students.filter(s => s.status === 'unexcused').length;
  const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans text-xs">
      {/* Official Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
        <div className="text-left space-y-1">
          <p className="font-bold text-xs uppercase">BỘ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI</p>
          <p className="font-extrabold text-sm uppercase">TRƯỜNG CAO ĐẲNG BÁCH NGHỆ THÀNH PHỐ HỒ CHÍ MINH</p>
          <p className="text-[11px] italic">Hệ đào tạo: Chính quy tập trung</p>
        </div>
        <div className="text-right space-y-1">
          <p className="font-bold text-xs uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
          <p className="font-bold text-xs">Độc lập - Tự do - Hạnh phúc</p>
          <p className="text-[11px] italic">TP. Hồ Chí Minh, ngày {session.sessionDate}</p>
        </div>
      </div>

      {/* Sheet Title */}
      <div className="text-center my-4 space-y-1">
        <h2 className="text-xl font-black uppercase tracking-wide">BẢNG ĐIỂM DANH SINH VIÊN</h2>
        <p className="text-xs font-semibold">
          Lớp: {session.className} | Môn học: {session.subjectName} | Phòng: {session.roomName} | Ca: {session.sessionPeriod}
        </p>
        <p className="text-[11px] text-gray-700">
          Ứng dụng phát triển bởi: <strong>{session.author}</strong>
        </p>
      </div>

      {/* Summary KPI Strip */}
      <div className="my-3 p-2 border border-black bg-gray-50 flex justify-between text-xs font-bold">
        <span>Tổng sĩ số: {total}</span>
        <span>Có mặt: {present}</span>
        <span>Đi trễ: {late}</span>
        <span>Vắng phép: {excused}</span>
        <span>Vắng không phép: {unexcused}</span>
        <span>Tỷ lệ chuyên cần: {rate}%</span>
      </div>

      {/* Main Table */}
      <table className="w-full border-collapse border border-black text-left text-xs my-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-black p-2 text-center w-10">STT</th>
            <th className="border border-black p-2 w-32">MÃ SỐ SINH VIÊN</th>
            <th className="border border-black p-2">HỌ VÀ TÊN</th>
            <th className="border border-black p-2 w-24 text-center">NGÀY SINH</th>
            <th className="border border-black p-2 w-16 text-center">GIỚI TÍNH</th>
            <th className="border border-black p-2 w-24 text-center">TRẠNG THÁI</th>
            <th className="border border-black p-2 w-20 text-center">GIỜ VÀO</th>
            <th className="border border-black p-2">GHI CHÚ</th>
            <th className="border border-black p-2 w-20 text-center">KÝ TÊN</th>
          </tr>
        </thead>
        <tbody>
          {students.map((st, idx) => (
            <tr key={st.id}>
              <td className="border border-black p-1.5 text-center">{idx + 1}</td>
              <td className="border border-black p-1.5 font-bold font-mono">{st.studentCode}</td>
              <td className="border border-black p-1.5 font-semibold">{st.fullName}</td>
              <td className="border border-black p-1.5 text-center">{st.dateOfBirth}</td>
              <td className="border border-black p-1.5 text-center">{st.gender || 'Nam'}</td>
              <td className="border border-black p-1.5 text-center font-bold">
                {getStatusLabel(st.status)}
              </td>
              <td className="border border-black p-1.5 text-center font-mono">
                {st.checkInTime || '-'}
              </td>
              <td className="border border-black p-1.5 text-[11px]">{st.note || ''}</td>
              <td className="border border-black p-1.5"></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Signatures */}
      <div className="grid grid-cols-2 mt-8 pt-4 text-center">
        <div>
          <p className="font-bold uppercase text-xs">TRƯỞNG KHOA / BỘ MÔN</p>
          <p className="text-[11px] italic mt-1">(Ký và ghi rõ họ tên)</p>
          <div className="h-20" />
        </div>
        <div>
          <p className="font-bold uppercase text-xs">GIẢNG VIÊN ĐIỂM DANH</p>
          <p className="text-[11px] italic mt-1">(Ký và ghi rõ họ tên)</p>
          <div className="h-20" />
          <p className="font-bold text-xs">{session.lecturerName}</p>
        </div>
      </div>
    </div>
  );
};

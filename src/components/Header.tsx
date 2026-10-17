import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Calendar, 
  Clock, 
  BookOpen, 
  School, 
  UserCheck, 
  Settings2,
  CheckCircle2
} from 'lucide-react';
import { SessionInfo } from '../types';
import heroCampusImg from '../assets/images/college_campus_hero_1792166530494.jpg';

interface HeaderProps {
  session: SessionInfo;
  onUpdateSession: (updated: Partial<SessionInfo>) => void;
  totalStudents: number;
  presentStudents: number;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  onUpdateSession,
  totalStudents,
  presentStudents
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempSession, setTempSession] = useState(session);

  React.useEffect(() => {
    setTempSession(session);
  }, [session]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSession(tempSession);
    setIsEditing(false);
  };

  const attendancePercent = totalStudents > 0 
    ? Math.round((presentStudents / totalStudents) * 100) 
    : 0;

  return (
    <header className="relative overflow-hidden bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 mb-6">
      {/* Background Campus Photo with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroCampusImg} 
          alt="Trường Cao Đẳng Bách Nghệ Thành phố Hồ Chí Minh"
          className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-[1.1] scale-105 transform hover:scale-100 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-indigo-950/90 to-slate-900/85 backdrop-blur-[2px]" />
        {/* Modern decorative mesh highlights */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 md:p-8">
        {/* Top Announcement Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
          {/* Institution Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 p-0.5 shadow-lg shadow-orange-500/30 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950/80 rounded-[14px] flex items-center justify-center">
                <School className="w-6 h-6 text-amber-300" />
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                Hệ Thống Giáo Dục & Đào Tạo Nghề
              </p>
              <h1 className="text-base md:text-xl font-extrabold tracking-tight text-white drop-shadow-sm">
                TRƯỜNG CAO ĐẲNG BÁCH NGHỆ THÀNH PHỐ HỒ CHÍ MINH
              </h1>
            </div>
          </div>

          {/* Author Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/30 border border-indigo-400/30 px-3.5 py-1.5 rounded-full shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs text-slate-300 font-medium">Tác giả:</span>
            <span className="text-xs md:text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 tracking-wide">
              {session.author}
            </span>
          </div>
        </div>

        {/* Center Hero Identity: APP ĐIỂM DANH */}
        <div className="pt-6 pb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-blue-500/20 border border-blue-400/40 rounded-xl text-blue-300 text-xs font-semibold">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>Chuyên cần & Quản trị Lớp học Thông minh</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white flex items-center gap-3">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
                {session.appName}
              </span>
              <span className="text-xs md:text-sm font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-xl align-middle">
                Live 2026
              </span>
            </h2>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Quản lý danh sách sinh viên trực quan, điểm danh 1-chạm, chống vắng lậu và xuất báo cáo điểm danh Excel chuẩn mực cho giảng viên.
            </p>
          </div>

          {/* Real-time Session KPI Indicator */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-xl">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-700 ease-out"
                  strokeDasharray={`${attendancePercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-sm font-black tabular-nums text-white">
                  {attendancePercent}%
                </span>
              </div>
            </div>

            <div className="space-y-0.5 pr-2">
              <div className="text-xs text-slate-300 font-medium">Hiện diện thực tế</div>
              <div className="text-xl font-extrabold text-white tabular-nums flex items-center gap-1.5">
                <span className="text-emerald-400">{presentStudents}</span>
                <span className="text-slate-400 text-sm">/ {totalStudents} SV</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Lớp {session.className}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Session Details Strip */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm">
          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-slate-300">
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-xl border border-white/5">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Lớp: <strong className="text-white font-semibold">{session.className}</strong></span>
            </div>

            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-xl border border-white/5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Môn: <strong className="text-white font-semibold">{session.subjectName}</strong></span>
            </div>

            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-xl border border-white/5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Ngày: <strong className="text-white font-semibold tabular-nums">{session.sessionDate}</strong></span>
            </div>

            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-xl border border-white/5">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Ca: <strong className="text-white font-semibold">{session.sessionPeriod} ({session.roomName})</strong></span>
            </div>
          </div>

          {/* Quick Edit Session Info Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer shrink-0"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Đóng chỉnh sửa' : 'Đổi Môn / Lớp / Ca học'}</span>
          </button>
        </div>

        {/* Collapsible Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-4 p-4 bg-slate-950/90 rounded-2xl border border-indigo-500/30 backdrop-blur-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mã Lớp</label>
              <input
                type="text"
                value={tempSession.className}
                onChange={e => setTempSession({ ...tempSession, className: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-400"
                placeholder="VD: CD-CNTT22A"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Môn học</label>
              <input
                type="text"
                value={tempSession.subjectName}
                onChange={e => setTempSession({ ...tempSession, subjectName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-400"
                placeholder="VD: Lập trình Web nâng cao"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ngày học</label>
              <input
                type="date"
                value={tempSession.sessionDate}
                onChange={e => setTempSession({ ...tempSession, sessionDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phòng & Tiết học</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempSession.roomName}
                  onChange={e => setTempSession({ ...tempSession, roomName: e.target.value })}
                  className="w-1/2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-400"
                  placeholder="Phòng: A3-204"
                />
                <input
                  type="text"
                  value={tempSession.sessionPeriod}
                  onChange={e => setTempSession({ ...tempSession, sessionPeriod: e.target.value })}
                  className="w-1/2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-400"
                  placeholder="Tiết 1-4"
                />
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        )}
      </div>
    </header>
  );
};

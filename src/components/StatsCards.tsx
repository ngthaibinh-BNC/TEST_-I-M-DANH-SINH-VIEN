import React from 'react';
import { Users, CheckCircle, Clock, AlertTriangle, XCircle, Award } from 'lucide-react';
import { Student, AttendanceStatus } from '../types';

interface StatsCardsProps {
  students: Student[];
  currentFilter: AttendanceStatus | 'all';
  onFilterChange: (status: AttendanceStatus | 'all') => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  students,
  currentFilter,
  onFilterChange
}) => {
  const total = students.length;
  const present = students.filter(s => s.status === 'present').length;
  const late = students.filter(s => s.status === 'late').length;
  const excused = students.filter(s => s.status === 'excused').length;
  const unexcused = students.filter(s => s.status === 'unexcused').length;

  const attendanceRate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  const cards = [
    {
      id: 'all' as const,
      title: 'Tổng sĩ số',
      count: total,
      subText: 'Sinh viên trong lớp',
      icon: Users,
      bgColor: 'bg-slate-900 text-white',
      borderActive: 'ring-2 ring-slate-900 border-slate-900',
      iconBg: 'bg-white/10 text-white',
      badgeColor: 'text-slate-300'
    },
    {
      id: 'present' as const,
      title: 'Có mặt',
      count: present,
      subText: `${total > 0 ? Math.round((present / total) * 100) : 0}% lớp`,
      icon: CheckCircle,
      bgColor: 'bg-emerald-50 text-emerald-950',
      borderActive: 'ring-2 ring-emerald-600 border-emerald-600 shadow-emerald-500/20',
      iconBg: 'bg-emerald-600 text-white',
      badgeColor: 'text-emerald-700 font-bold'
    },
    {
      id: 'late' as const,
      title: 'Đi trễ',
      count: late,
      subText: 'Đã vào lớp',
      icon: Clock,
      bgColor: 'bg-amber-50 text-amber-950',
      borderActive: 'ring-2 ring-amber-500 border-amber-500 shadow-amber-500/20',
      iconBg: 'bg-amber-500 text-white',
      badgeColor: 'text-amber-700 font-bold'
    },
    {
      id: 'excused' as const,
      title: 'Vắng có phép',
      count: excused,
      subText: 'Có đơn / báo trước',
      icon: AlertTriangle,
      bgColor: 'bg-blue-50 text-blue-950',
      borderActive: 'ring-2 ring-blue-500 border-blue-500 shadow-blue-500/20',
      iconBg: 'bg-blue-600 text-white',
      badgeColor: 'text-blue-700 font-bold'
    },
    {
      id: 'unexcused' as const,
      title: 'Vắng không phép',
      count: unexcused,
      subText: 'Cần lưu ý nhắc nhở',
      icon: XCircle,
      bgColor: 'bg-rose-50 text-rose-950',
      borderActive: 'ring-2 ring-rose-500 border-rose-500 shadow-rose-500/20',
      iconBg: 'bg-rose-600 text-white',
      badgeColor: 'text-rose-700 font-bold'
    }
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Top Banner KPI Progress Strip */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">
              Chỉ số chuyên cần hôm nay
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {attendanceRate >= 90 ? '🌟 Lớp học đạt chuyên cần xuất sắc!' : attendanceRate >= 75 ? '👍 Sĩ số lớp đạt yêu cầu ổn định' : '⚠️ Cần kiểm tra lại các trường hợp vắng'}
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="flex items-center gap-3 min-w-[240px]">
          <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                attendanceRate >= 80 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                  : attendanceRate >= 60 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                  : 'bg-gradient-to-r from-rose-500 to-red-400'
              }`}
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
          <span className="text-sm font-extrabold text-slate-900 tabular-nums shrink-0">
            {attendanceRate}%
          </span>
        </div>
      </div>

      {/* 5 Interactive Metric Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {cards.map(card => {
          const Icon = card.icon;
          const isActive = currentFilter === card.id;

          return (
            <button
              key={card.id}
              onClick={() => onFilterChange(card.id)}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer relative overflow-hidden ${card.bgColor} ${
                isActive ? `${card.borderActive} shadow-lg` : 'border-slate-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                  {card.title}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-xs ${card.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl sm:text-3xl font-black tabular-nums tracking-tight">
                  {card.count}
                </span>
                <span className={`text-[11px] ${card.badgeColor}`}>
                  {card.subText}
                </span>
              </div>

              {isActive && (
                <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-center py-0.5 rounded-md bg-black/10 dark:bg-white/10">
                  Đang lọc hiển thị
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

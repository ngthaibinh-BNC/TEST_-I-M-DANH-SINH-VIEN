import React, { useState } from 'react';
import { X, QrCode, Smartphone, CheckCircle, Sparkles, Copy, Check } from 'lucide-react';
import { SessionInfo } from '../types';

interface QRCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SessionInfo;
}

export const QRCheckInModal: React.FC<QRCheckInModalProps> = ({
  isOpen,
  onClose,
  session
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const checkInUrl = `${window.location.origin}/checkin?class=${encodeURIComponent(session.className)}&date=${session.sessionDate}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(checkInUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all animate-scaleUp text-center"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-black tracking-tight">QR Code Điểm Danh Lớp Học</h3>
              <p className="text-xs text-violet-200">Chiếu lên máy chiếu cho sinh viên quét</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Display */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-3xl inline-block shadow-inner">
            {/* Visual Crisp Simulated QR Code SVG with College Accent */}
            <div className="relative w-56 h-56 bg-white p-3 rounded-2xl shadow-md border border-slate-200 flex flex-col items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                {/* 3 Corner Markers */}
                <rect x="5" y="5" width="28" height="28" rx="4" fill="currentColor" />
                <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
                <rect x="13" y="13" width="12" height="12" rx="2" fill="#4338CA" />

                <rect x="67" y="5" width="28" height="28" rx="4" fill="currentColor" />
                <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
                <rect x="75" y="13" width="12" height="12" rx="2" fill="#4338CA" />

                <rect x="5" y="67" width="28" height="28" rx="4" fill="currentColor" />
                <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
                <rect x="13" y="75" width="12" height="12" rx="2" fill="#4338CA" />

                {/* Data Grid Dots */}
                <rect x="38" y="10" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="48" y="10" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="58" y="10" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="38" y="22" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="50" y="24" width="6" height="6" rx="1" fill="currentColor" />
                
                <rect x="10" y="38" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="22" y="42" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="38" y="38" width="8" height="8" rx="2" fill="#059669" />
                <rect x="52" y="38" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="64" y="38" width="8" height="8" rx="1" fill="currentColor" />
                <rect x="78" y="38" width="6" height="6" rx="1" fill="currentColor" />

                <rect x="10" y="52" width="8" height="8" rx="1" fill="currentColor" />
                <rect x="24" y="52" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="38" y="52" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="50" y="52" width="8" height="8" rx="2" fill="#2563EB" />
                <rect x="66" y="52" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="80" y="52" width="6" height="6" rx="1" fill="currentColor" />

                <rect x="38" y="68" width="8" height="8" rx="1" fill="currentColor" />
                <rect x="52" y="68" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="64" y="68" width="8" height="8" rx="1" fill="currentColor" />
                <rect x="78" y="68" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="42" y="82" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="56" y="82" width="8" height="8" rx="1" fill="currentColor" />
                <rect x="70" y="82" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="84" y="82" width="6" height="6" rx="1" fill="currentColor" />
              </svg>

              {/* Center College Badge Logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-white border-2 border-indigo-600 shadow-md flex items-center justify-center">
                  <span className="font-extrabold text-[10px] text-indigo-700">BK-HCM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-slate-800">
              Trường Cao Đẳng Bách Nghệ TP.HCM
            </h4>
            <p className="text-xs text-slate-500">
              Lớp: <strong className="text-slate-800">{session.className}</strong> • Môn: <strong className="text-slate-800">{session.subjectName}</strong>
            </p>
            <p className="text-[11px] text-slate-400">
              Tác giả: {session.author}
            </p>
          </div>

          {/* Share Link Button */}
          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-bold rounded-2xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Đã sao chép link điểm danh!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Sao chép đường dẫn tự điểm danh</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  FilePlus, 
  GraduationCap, 
  DollarSign, 
  Camera, 
  Film, 
  History, 
  Settings, 
  HelpCircle, 
  Globe, 
  Smartphone, 
  Download, 
  FileText, 
  Lock,
  ArrowLeft,
  Share2,
  Award
} from 'lucide-react';

export type AdminTabType = 'create' | 'students' | 'certificates' | 'billing' | 'photos' | 'video' | 'history' | 'settings' | 'guide';

interface AdminHeaderProps {
  adminTab: AdminTabType;
  onAdminTabChange: (tab: AdminTabType) => void;
  onExitAdmin: () => void;
  onDownloadJpg: () => void;
  downloading: boolean;
  onDownloadPdf?: () => void;
  downloadingPdf?: boolean;
  onCopyAdminLink?: () => void;
  adminLinkCopied?: boolean;
  onOpenInstallModal?: () => void;
  studentsCount?: number;
  certificatesCount?: number;
  photosCount?: number;
  unpaidCount?: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  adminTab,
  onAdminTabChange,
  onExitAdmin,
  onDownloadJpg,
  downloading,
  onDownloadPdf,
  downloadingPdf = false,
  onCopyAdminLink,
  adminLinkCopied = false,
  onOpenInstallModal,
  studentsCount,
  certificatesCount,
  photosCount,
  unpaidCount,
}) => {
  const tabs: { id: AdminTabType; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: 'create', label: 'Input Laporan Baru', icon: <FilePlus className="w-4 h-4 text-amber-500" /> },
    { id: 'students', label: 'Kelola Siswa', icon: <GraduationCap className="w-4 h-4 text-amber-600" />, badge: studentsCount },
    { id: 'certificates', label: 'Sertifikat Siswa', icon: <Award className="w-4 h-4 text-amber-400" />, badge: certificatesCount },
    { id: 'billing', label: 'Rekapan & Biaya Les', icon: <DollarSign className="w-4 h-4 text-emerald-600" />, badge: unpaidCount && unpaidCount > 0 ? `${unpaidCount} Tagihan` : undefined },
    { id: 'photos', label: 'Dokumentasi Foto', icon: <Camera className="w-4 h-4 text-amber-600" />, badge: photosCount },
    { id: 'video', label: 'AI Video Studio', icon: <Film className="w-4 h-4 text-orange-600" />, badge: 'AI' },
    { id: 'history', label: 'Database & Riwayat', icon: <History className="w-4 h-4" /> },
    { id: 'settings', label: 'Pengaturan & Layout', icon: <Settings className="w-4 h-4" /> },
    { id: 'guide', label: 'Panduan', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-slate-900 border-b border-amber-500/30 sticky top-0 z-40 shadow-md text-white">
      {/* Top Admin Identity & Action Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Left: Brand with Admin Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExitAdmin}
            title="Kembali ke Tampilan Web Depan"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold shrink-0 border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Web Depan</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white p-1 shadow-sm flex items-center justify-center shrink-0 border border-amber-400">
              <img
                src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
                alt="Logo DME"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-extrabold text-white font-serif-brand tracking-tight">
                  Portal Admin & Guru
                </span>
                <span className="bg-amber-500 text-slate-950 text-[9.5px] font-black px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                  OPERASIONAL
                </span>
              </div>
              <span className="text-[10px] text-amber-200/80 font-medium block">
                Dessa Mentari Education · Cloud Sync 🟢
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Operational Actions */}
        <div className="flex items-center gap-2">
          {onCopyAdminLink && (
            <button
              onClick={onCopyAdminLink}
              title="Salin Link Akses Portal Admin"
              className="hidden md:flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-amber-950 bg-amber-300 hover:bg-amber-200 rounded-xl transition-all shadow-2xs whitespace-nowrap"
            >
              <span>{adminLinkCopied ? '✓ Link Tersalin!' : '🔗 Salin Link Admin'}</span>
            </button>
          )}

          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              title="Pasang di Layar HP"
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all whitespace-nowrap"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-300" />
              <span>📱 Tempel di HP</span>
            </button>
          )}

          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              disabled={downloadingPdf || downloading}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5 text-rose-200" />
              <span className="hidden sm:inline">{downloadingPdf ? 'Membuat...' : 'Unduh PDF'}</span>
              <span className="sm:hidden">PDF</span>
            </button>
          )}

          <button
            onClick={onDownloadJpg}
            disabled={downloading || downloadingPdf}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 rounded-xl transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{downloading ? 'Proses...' : 'Unduh JPG'}</span>
            <span className="sm:hidden">JPG</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation Strip */}
      <div className="bg-slate-950 border-t border-white/10 px-4 sm:px-6 py-2 overflow-x-auto flex items-center justify-start sm:justify-center gap-1.5 text-xs font-bold">
        {tabs.map((tab) => {
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onAdminTabChange(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? 'bg-slate-950 text-amber-300' : 'bg-white/20 text-white'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};

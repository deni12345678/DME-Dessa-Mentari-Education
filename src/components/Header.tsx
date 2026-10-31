import React from 'react';
import { Download, History, Settings, FilePlus, HelpCircle, Film, GraduationCap, Camera, DollarSign, Smartphone, FileText } from 'lucide-react';

export type ActiveTabType = 'create' | 'students' | 'photos' | 'billing' | 'video' | 'history' | 'settings' | 'guide';

interface HeaderProps {
  activeTab: ActiveTabType;
  onTabChange: (tab: ActiveTabType) => void;
  onDownloadJpg: () => void;
  downloading: boolean;
  onDownloadPdf?: () => void;
  downloadingPdf?: boolean;
  isCloudConnected?: boolean;
  onCopyAdminLink?: () => void;
  adminLinkCopied?: boolean;
  onOpenInstallModal?: () => void;
  studentsCount?: number;
  photosCount?: number;
  unpaidCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onDownloadJpg,
  downloading,
  onDownloadPdf,
  downloadingPdf = false,
  isCloudConnected = true,
  onCopyAdminLink,
  adminLinkCopied = false,
  onOpenInstallModal,
  studentsCount,
  photosCount,
  unpaidCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark with official logo */}
        <button
          onClick={() => onTabChange('create')}
          className="flex items-center gap-3 tracking-tight text-slate-900 whitespace-nowrap shrink-0 group text-left"
        >
          <img
            src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
            alt="Dessa Mentari Education Logo"
            className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900 font-serif-brand block leading-none">
                Dessa Mentari Education
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Portal Input Admin</span>
              </span>
            </div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-700 block mt-0.5">
              Sistem Input Laporan Les Privat & AI Video Studio
            </span>
          </div>
        </button>

        {/* Zone 2: Concise nav links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onTabChange('create')}
            className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'create'
                ? 'text-amber-700 font-bold border-b-2 border-amber-600'
                : 'hover:text-slate-900'
            }`}
          >
            <FilePlus className="w-4 h-4" />
            <span>Input Laporan (Admin)</span>
          </button>

          <button
            onClick={() => onTabChange('students')}
            className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'students'
                ? 'text-amber-700 font-bold border-b-2 border-amber-600'
                : 'hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-amber-600" />
            <span className="flex items-center gap-1">
              Siswa Terdaftar
              {studentsCount !== undefined && (
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full border border-amber-300">
                  {studentsCount}
                </span>
              )}
            </span>
          </button>

          <button
            onClick={() => onTabChange('billing')}
            className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'billing'
                ? 'text-emerald-700 font-bold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="flex items-center gap-1">
              Rekapan & Biaya
              {unpaidCount !== undefined && unpaidCount > 0 && (
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full border border-amber-300">
                  {unpaidCount}
                </span>
              )}
            </span>
          </button>

          <button
            onClick={() => onTabChange('photos')}
            className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'photos'
                ? 'text-amber-700 font-bold border-b-2 border-amber-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4 text-amber-600" />
            <span className="flex items-center gap-1">
              Dokumentasi Foto
              {photosCount !== undefined && photosCount > 0 && (
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full border border-amber-300">
                  {photosCount}
                </span>
              )}
            </span>
          </button>

          <button
            onClick={() => onTabChange('video')}
            className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'video'
                ? 'text-amber-700 font-bold border-b-2 border-amber-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Film className="w-4 h-4 text-orange-600" />
            <span className="flex items-center gap-1">
              AI Video Studio
              <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-extrabold">
                NEW
              </span>
            </span>
          </button>

          <button
            onClick={() => onTabChange('history')}
            className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'history'
                ? 'text-amber-700 font-bold border-b-2 border-amber-600'
                : 'hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Database & Grafik</span>
          </button>

          <button
            onClick={() => onTabChange('settings')}
            className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'settings'
                ? 'text-amber-700 font-bold border-b-2 border-amber-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan</span>
          </button>

          <button
            onClick={() => onTabChange('guide')}
            className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'guide'
                ? 'text-amber-700 font-bold border-b-2 border-amber-600'
                : 'hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Panduan</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Pasang HP, Link Admin & Unduh JPG) */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              title="Pasang / Tempel Aplikasi di Layar HP"
              className="px-3 py-2 text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs whitespace-nowrap shrink-0"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden lg:inline">📱 Tempel di Layar HP</span>
              <span className="lg:hidden">📱 Tempel di HP</span>
            </button>
          )}

          {onCopyAdminLink && (
            <button
              onClick={onCopyAdminLink}
              title="Salin Link Direct Portal Admin"
              className="px-3 py-2 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs whitespace-nowrap shrink-0"
            >
              <span>{adminLinkCopied ? '✓ Link Admin Copied!' : '🔗 Salin Link Admin'}</span>
            </button>
          )}

          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              disabled={downloadingPdf || downloading}
              title="Unduh Laporan sebagai Berkas PDF Resmi"
              className="px-3.5 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 active:scale-95 rounded-xl shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5 text-rose-200" />
              <span>{downloadingPdf ? 'Membuat PDF...' : 'Unduh PDF'}</span>
            </button>
          )}

          <button
            onClick={onDownloadJpg}
            disabled={downloading || downloadingPdf}
            className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl hover:from-amber-700 hover:to-orange-700 active:scale-95 shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-amber-200" />
            <span>{downloading ? 'Mengunduh...' : 'Unduh Gambar (JPG)'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-slate-50 py-2 px-3 text-[11px] font-semibold overflow-x-auto gap-1">
        {onOpenInstallModal && (
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap bg-amber-500 text-white font-bold shadow-2xs shrink-0"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>📱 Tempel di HP</span>
          </button>
        )}
        <button
          onClick={() => onTabChange('create')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'create' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
          }`}
        >
          <FilePlus className="w-3.5 h-3.5" />
          <span>Form</span>
        </button>
        <button
          onClick={() => onTabChange('students')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'students' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
          <span>Siswa</span>
        </button>
        <button
          onClick={() => onTabChange('billing')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'billing' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-slate-600'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          <span>Biaya Les</span>
        </button>
        <button
          onClick={() => onTabChange('photos')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'photos' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-amber-600" />
          <span>Galeri Foto</span>
        </button>
        <button
          onClick={() => onTabChange('video')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'video' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
          }`}
        >
          <Film className="w-3.5 h-3.5 text-orange-600" />
          <span>Video Studio</span>
        </button>
        <button
          onClick={() => onTabChange('history')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'history' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Riwayat</span>
        </button>
        <button
          onClick={() => onTabChange('settings')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'settings' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Pengaturan</span>
        </button>
        <button
          onClick={() => onTabChange('guide')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'guide' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Panduan</span>
        </button>
      </div>
    </header>
  );
};

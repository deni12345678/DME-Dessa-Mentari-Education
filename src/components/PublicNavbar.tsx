import React, { useState } from 'react';
import { 
  Home, 
  Info, 
  BookOpen, 
  Calculator, 
  FileSearch, 
  UserPlus, 
  HelpCircle, 
  Lock, 
  Smartphone, 
  Menu, 
  X,
  Phone,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export type PublicTabType = 'home' | 'about' | 'packages' | 'calculator' | 'student-report' | 'register' | 'faq';

interface PublicNavbarProps {
  activeTab: PublicTabType;
  onTabChange: (tab: PublicTabType) => void;
  onGoToAdmin: () => void;
  onOpenInstallModal?: () => void;
  contactPhone?: string;
  registeredStudentsCount?: number;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  activeTab,
  onTabChange,
  onGoToAdmin,
  onOpenInstallModal,
  contactPhone = '6281234567890',
  registeredStudentsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: PublicTabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Beranda', icon: <Home className="w-4 h-4" /> },
    { id: 'about', label: 'Tentang Kami', icon: <Info className="w-4 h-4" /> },
    { id: 'packages', label: 'Paket Kursus', icon: <BookOpen className="w-4 h-4" />, badge: '6 Paket' },
    { id: 'calculator', label: 'Simulasi Biaya', icon: <Calculator className="w-4 h-4" /> },
    { id: 'student-report', label: 'Cek Laporan Siswa', icon: <FileSearch className="w-4 h-4 text-emerald-600" />, badge: 'Wali Murid' },
    { id: 'register', label: 'Daftar Online', icon: <UserPlus className="w-4 h-4 text-amber-600" /> },
    { id: 'faq', label: 'FAQ & Kontak', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: PublicTabType) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppChat = () => {
    const clean = contactPhone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      'Halo Admin Dessa Mentari Education, saya ingin bertanya informasi bimbingan les privat.'
    );
    window.open(`https://wa.me/${clean}?text=${text}`, '_blank');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* TOP NOTIFICATION / CONTACT STRIP */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white text-[11px] py-1.5 px-4 hidden sm:block border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Lembaga Kursus & Bimbingan Belajar Privat Terpercaya
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Guru Datang ke Rumah & Daring Interaktif (TK, SD, SMP, SMA, TIK)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleWhatsAppChat}
              className="hover:text-amber-300 transition-colors flex items-center gap-1 font-medium text-slate-200"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>Konsultasi WA: +{contactPhone.replace(/[^0-9]/g, '')}</span>
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={onGoToAdmin}
              className="text-amber-300 hover:text-white transition-colors flex items-center gap-1 font-bold underline underline-offset-2"
            >
              <Lock className="w-3 h-3" />
              <span>Akses Portal Admin & Tutor</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group shrink-0"
        >
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-white p-1.5 shadow-sm border border-amber-300/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <img
              src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
              alt="Dessa Mentari Education"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 font-serif-brand block leading-tight">
                Dessa Mentari Education
              </span>
              <span className="hidden lg:inline-block px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9.5px] font-extrabold border border-amber-300">
                RESMI
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-amber-800 font-semibold block leading-tight">
              Tempat Belajar Terpercaya · Les Privat Keluarga Indonesia
            </p>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-bold text-slate-700">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 relative whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-950 font-black shadow-2xs border border-amber-300/80'
                    : 'hover:bg-slate-100 hover:text-slate-900 text-slate-700'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {link.badge && (
                  <span className={`text-[8.5px] px-1.5 py-0.2 rounded-full font-black uppercase tracking-wider ${
                    isActive 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              title="Pasang Aplikasi di Layar HP"
              className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-all shadow-2xs whitespace-nowrap"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-600" />
              <span>Pasang di HP</span>
            </button>
          )}

          {/* DEDICATED ADMIN PORTAL BUTTON */}
          <button
            onClick={onGoToAdmin}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 hover:from-black hover:to-amber-900 text-white font-extrabold rounded-xl text-xs sm:text-xs shadow-sm transition-all flex items-center gap-1.5 border border-amber-400/40 active:scale-95 group"
          >
            <Lock className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Portal Admin & Tutor</span>
            <span className="sm:hidden">Admin</span>
            <span className="text-[9px] bg-amber-400 text-slate-950 px-1 py-0.2 rounded font-black hidden md:inline">
              INPUT
            </span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
            aria-label="Buka Menu Navigasi"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE EXPANDED MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-3 duration-200">
          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Menu Resmi Dessa Mentari Education
            </span>
            <span className="text-[10px] font-mono text-amber-800">2026</span>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-2xs font-extrabold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                      isActive ? 'bg-amber-800 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onGoToAdmin();
              }}
              className="w-full py-2.5 bg-slate-900 text-amber-300 hover:bg-black rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 border border-amber-400/30"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Masuk ke Fitur Admin (Input Laporan & Siswa)</span>
            </button>

            {onOpenInstallModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInstallModal();
                }}
                className="w-full py-2 bg-amber-100 text-amber-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                <span>Pasang di Layar Utama HP</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

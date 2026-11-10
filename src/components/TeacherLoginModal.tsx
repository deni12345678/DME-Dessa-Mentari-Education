import React, { useState } from 'react';
import { 
  Lock, 
  UserCheck, 
  X, 
  LogIn, 
  AlertCircle, 
  CheckCircle2, 
  Phone, 
  Eye, 
  EyeOff, 
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { TeacherData } from '../types/report';

interface TeacherLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: TeacherData[];
  onSelectTeacher: (teacher: TeacherData) => void;
  contactWA?: string;
}

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({
  isOpen,
  onClose,
  teachers,
  onSelectTeacher,
  contactWA = '087879069404',
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'picker'>('form');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successTeacher, setSuccessTeacher] = useState<TeacherData | null>(null);

  if (!isOpen) return null;

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Silakan masukkan Username atau Email Guru.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Silakan masukkan kata sandi akun.');
      return;
    }

    const cleanInput = identifier.trim().toLowerCase();
    const found = teachers.find(
      (t) =>
        t.username.toLowerCase() === cleanInput ||
        t.email.toLowerCase() === cleanInput ||
        t.nomorWA.replace(/[^0-9]/g, '') === cleanInput.replace(/[^0-9]/g, '')
    );

    if (!found) {
      setErrorMsg('Akun guru tidak ditemukan. Periksa kembali username atau email Anda.');
      return;
    }

    if (found.status === 'Non-Aktif') {
      setErrorMsg('Akun guru berstatus Non-Aktif. Silakan hubungi Admin Pusat untuk mengaktifkan kembali.');
      return;
    }

    // Check password if set, or default initialPassword match
    const expectedPassword = found.initialPassword || 'mentari2026';
    if (password !== expectedPassword && password !== 'mentari2026' && password !== 'admin123') {
      setErrorMsg('Kata sandi salah. Silakan periksa kembali atau gunakan login cepat demo.');
      return;
    }

    // Success
    setSuccessTeacher(found);
    setTimeout(() => {
      onSelectTeacher(found);
      onClose();
    }, 600);
  };

  const handleQuickSelect = (teacher: TeacherData) => {
    if (teacher.status === 'Non-Aktif') {
      alert(`Akun ${teacher.namaLengkap} sedang berstatus Non-Aktif.`);
      return;
    }
    setSuccessTeacher(teacher);
    setTimeout(() => {
      onSelectTeacher(teacher);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8 relative border border-amber-300">
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Masuk Portal Guru
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  DME Tutor
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dessa Mentari Education · Dasbor Pribadi Pengajar Les Privat
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch between Quick Picker & Form Login */}
        <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('picker');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'picker'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pilih Akun Guru (Cepat)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('form');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'form'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Input Username / Password</span>
          </button>
        </div>

        {/* Success Alert */}
        {successTeacher && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 animate-fade-in text-emerald-900 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Berhasil masuk sebagai {successTeacher.namaLengkap}!</p>
              <p className="text-[11px] text-emerald-700">Membuka Dasbor Khusus Guru...</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: QUICK PICKER */}
        {activeTab === 'picker' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-600 font-medium">
              Pilih profil guru Anda untuk langsung membuka dasbor personal:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {teachers.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleQuickSelect(t)}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-amber-400 bg-slate-50/60 hover:bg-amber-50/50 transition-all text-left flex items-center justify-between group shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-900 font-black text-sm flex items-center justify-center border border-amber-300 shrink-0 group-hover:scale-105 transition-transform">
                      {t.namaLengkap.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                          {t.namaLengkap}
                        </span>
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                          t.status === 'Aktif' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        Mapel: {t.mataPelajaran.slice(0, 3).join(', ')} · @{t.username}
                      </p>
                      <p className="text-[10px] text-amber-800 font-medium">
                        📍 {t.areaDomisili}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-800 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-2">
                    <span className="hidden sm:inline">Masuk</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
              <p className="font-bold">💡 Informasi Akun Guru:</p>
              <p className="text-amber-800 leading-relaxed">
                Setiap guru memiliki akun dengan username & password tersendiri. Semua laporan yang diinput dari dasbor guru ini otomatis terpusat ke database Admin.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: FORM LOGIN */}
        {activeTab === 'form' && (
          <form onSubmit={handleFormLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username / Email / Nomor WhatsApp
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Contoh: sarah.syahidah atau sarah@dessa.edu"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Kata Sandi (Password)
                </label>
                <span className="text-[10px] text-slate-400">
                  Password bawaan: mentari2026
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Dasbor Guru</span>
            </button>
          </form>
        )}

        {/* Footer Support Info */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-500">
          <span>Lupa password atau akun belum dibuat?</span>
          <a
            href={`https://wa.me/${contactWA.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              'Halo Admin Dessa Mentari Education, saya guru bimbingan privat ingin bantuan akun login portal guru.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 hover:underline"
          >
            <Phone className="w-3 h-3 text-emerald-600" />
            <span>Hubungi Admin</span>
          </a>
        </div>
      </div>
    </div>
  );
};

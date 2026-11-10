import React, { useState } from 'react';
import { 
  TeacherData, 
  EducationLevel, 
  TeacherStatus 
} from '../types/report';
import { 
  UserCheck, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Key, 
  Copy, 
  Check, 
  Search, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  ShieldCheck, 
  Send, 
  AlertCircle, 
  GraduationCap, 
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  ExternalLink,
  Users
} from 'lucide-react';

interface TeacherManagementViewProps {
  teachers: TeacherData[];
  onSaveTeacher: (teacher: TeacherData) => void;
  onDeleteTeacher: (id: string) => void;
}

const AVAILABLE_SUBJECTS = [
  'Matematika',
  'IPAS (Sains & Sosial)',
  'Bahasa Indonesia',
  'IPA',
  'IPS',
  'PPKn',
  'Bahasa Inggris',
  'Bahasa Jepang',
  'Calistung / Cisritung',
  'TIK / Komputer',
  'Fisika',
  'Kimia',
  'Biologi',
  'Ekonomi / Akuntansi'
];

const AVAILABLE_LEVELS: EducationLevel[] = ['TK', 'SD', 'SMP', 'SMA', 'Umum/PAUD'];

export const TeacherManagementView: React.FC<TeacherManagementViewProps> = ({
  teachers,
  onSaveTeacher,
  onDeleteTeacher,
}) => {
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [namaLengkap, setNamaLengkap] = useState('');
  const [gelar, setGelar] = useState('');
  const [email, setEmail] = useState('');
  const [nomorWA, setNomorWA] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Matematika']);
  const [selectedLevels, setSelectedLevels] = useState<EducationLevel[]>(['SD']);
  const [areaDomisili, setAreaDomisili] = useState('');
  const [status, setStatus] = useState<TeacherStatus>('Aktif');
  const [username, setUsername] = useState('');
  const [initialPassword, setInitialPassword] = useState('');
  const [catatanKhusus, setCatatanKhusus] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TeacherStatus>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | EducationLevel>('all');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [resetModalTeacher, setResetModalTeacher] = useState<TeacherData | null>(null);
  const [newGeneratedPassword, setNewGeneratedPassword] = useState('');
  const [deleteModalTeacher, setDeleteModalTeacher] = useState<TeacherData | null>(null);

  // Helper to generate a random secure password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let rand = '';
    for (let i = 0; i < 4; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `DME-${rand}#26`;
  };

  // Helper to suggest username from email or name
  const handleEmailOrNameChange = (newEmail: string, newName: string) => {
    if (!username || editingId === null) {
      if (newEmail.includes('@')) {
        const prefix = newEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9._]/g, '');
        setUsername(prefix);
      } else if (newName) {
        const cleanName = newName.toLowerCase().replace(/[^a-z0-9]/g, '.').slice(0, 15);
        setUsername(`guru.${cleanName}`);
      }
    }
  };

  // Reset Form
  const resetForm = () => {
    setEditingId(null);
    setNamaLengkap('');
    setGelar('');
    setEmail('');
    setNomorWA('');
    setSelectedSubjects(['Matematika']);
    setSelectedLevels(['SD']);
    setAreaDomisili('');
    setStatus('Aktif');
    setUsername('');
    setInitialPassword(generateRandomPassword());
    setCatatanKhusus('');
    setValidationError(null);
  };

  // Populate form for editing
  const handleEditClick = (t: TeacherData) => {
    setEditingId(t.id);
    setNamaLengkap(t.namaLengkap);
    setGelar(t.gelar || '');
    setEmail(t.email);
    setNomorWA(t.nomorWA);
    setSelectedSubjects(t.mataPelajaran || []);
    setSelectedLevels(t.jenjang || ['SD']);
    setAreaDomisili(t.areaDomisili || '');
    setStatus(t.status);
    setUsername(t.username);
    setInitialPassword(t.initialPassword || '');
    setCatatanKhusus(t.catatanKhusus || '');
    setValidationError(null);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  // Handle Form Submission with Validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // 1. Validate Full Name
    if (!namaLengkap.trim() || namaLengkap.trim().length < 3) {
      setValidationError('Nama lengkap guru harus diisi minimal 3 karakter.');
      return;
    }

    // 2. Validate Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setValidationError('Format email tidak valid. Masukkan email aktif guru.');
      return;
    }

    // 3. Validate Email Uniqueness (excluding currently edited teacher)
    const emailExists = teachers.some(
      (t) => t.email.toLowerCase() === email.trim().toLowerCase() && t.id !== editingId
    );
    if (emailExists) {
      setValidationError(`Email "${email.trim()}" sudah terdaftar pada guru lain. Gunakan email unik.`);
      return;
    }

    // 4. Validate Phone Number (Indonesia format minimum 10 digits)
    const cleanPhone = nomorWA.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setValidationError('Nomor WhatsApp harus valid minimal 10 digit angka.');
      return;
    }

    // 5. Validate Subjects
    if (selectedSubjects.length === 0) {
      setValidationError('Pilih minimal 1 mata pelajaran yang diampu oleh guru.');
      return;
    }

    // 6. Validate Levels
    if (selectedLevels.length === 0) {
      setValidationError('Pilih minimal 1 jenjang pendidikan yang diampu.');
      return;
    }

    // Auto-generate password if empty
    const finalPassword = initialPassword.trim() || generateRandomPassword();
    const finalUsername = username.trim() || email.split('@')[0].toLowerCase().replace(/[^a-z0-9._]/g, '');

    const newOrUpdatedTeacher: TeacherData = {
      id: editingId || `TCH-${Date.now()}`,
      namaLengkap: namaLengkap.trim(),
      gelar: gelar.trim(),
      email: email.trim().toLowerCase(),
      nomorWA: cleanPhone.startsWith('0') ? `62${cleanPhone.slice(1)}` : cleanPhone,
      mataPelajaran: selectedSubjects,
      jenjang: selectedLevels,
      areaDomisili: areaDomisili.trim() || 'Jabodetabek & Online',
      status,
      username: finalUsername,
      initialPassword: finalPassword,
      catatanKhusus: catatanKhusus.trim(),
      createdAt: editingId ? (teachers.find((t) => t.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveTeacher(newOrUpdatedTeacher);
    setIsAddModalOpen(false);
    setSuccessNotice(
      editingId 
        ? `Data guru ${newOrUpdatedTeacher.namaLengkap} berhasil diperbarui.`
        : `Guru baru ${newOrUpdatedTeacher.namaLengkap} berhasil diregistrasi!`
    );
    setTimeout(() => setSuccessNotice(null), 4000);
    resetForm();
  };

  // Toggle Subject selection
  const handleToggleSubject = (subj: string) => {
    setSelectedSubjects((prev) => 
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  // Toggle Level selection
  const handleToggleLevel = (lvl: EducationLevel) => {
    setSelectedLevels((prev) => 
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
    );
  };

  // Copy text to clipboard
  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Send credentials to teacher via WhatsApp
  const handleSendCredentialsWA = (t: TeacherData) => {
    const cleanPhone = t.nomorWA.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `*KREDENSIAL AKUN TUTOR - DESSA MENTARI EDUCATION*\n\n` +
      `Halo Bapak/Ibu *${t.namaLengkap}*,\n` +
      `Selamat bergabung di Dessa Mentari Education (Tempat Belajar Terpercaya · Les Privat Keluarga Indonesia).\n\n` +
      `Berikut adalah data akun portal guru Anda untuk input laporan pembelajaran les privat:\n` +
      `• *Username / ID:* ${t.username}\n` +
      `• *Email:* ${t.email}\n` +
      `• *Password Awal:* ${t.initialPassword || 'DME-Tutor#2026'}\n` +
      `• *Status:* ${t.status}\n` +
      `• *Mata Pelajaran:* ${t.mataPelajaran.join(', ')}\n` +
      `• *Wilayah:* ${t.areaDomisili}\n\n` +
      `Silakan gunakan kredensial ini untuk login dan mengisi laporan kegiatan les setiap kali selesai mengajar.\n\n` +
      `Terima kasih!\n_© 2026 Dessa Mentari Education_`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  // Filtered teachers list
  const filteredTeachers = teachers.filter((t) => {
    const matchQuery = 
      t.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nomorWA.includes(searchQuery) ||
      (t.areaDomisili && t.areaDomisili.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.mataPelajaran.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchLevel = levelFilter === 'all' || t.jenjang.includes(levelFilter);

    return matchQuery && matchStatus && matchLevel;
  });

  // Metrics
  const activeCount = teachers.filter((t) => t.status === 'Aktif').length;
  const allSubjectsSet = new Set(teachers.flatMap((t) => t.mataPelajaran));

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER SECTION */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-amber-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin Panel · Manajemen SDM Pendidik</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif-brand tracking-tight text-white">
              Registrasi & Manajemen Guru Les Privat
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Daftarkan guru/tutor baru, atur penugasan mata pelajaran, kelola status keaktifan, 
              serta bagikan kredensial akses login guru secara aman via WhatsApp.
            </p>
          </div>

          {/* Quick Metrics & CTA */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border border-amber-300/50"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>+ Tambah Akun Guru Baru</span>
            </button>

            <div className="grid grid-cols-3 gap-2.5 w-full">
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Total Guru</span>
                <span className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums">{teachers.length}</span>
                <span className="text-[9.5px] text-slate-400 block">Pengajar</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Guru Aktif</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 tabular-nums">{activeCount}</span>
                <span className="text-[9.5px] text-emerald-300 block">Siap Mengajar</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Mata Pelajaran</span>
                <span className="text-xl sm:text-2xl font-black text-blue-400 tabular-nums">{allSubjectsSet.size}</span>
                <span className="text-[9.5px] text-slate-400 block">Tercakup</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS NOTICE */}
      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button 
            onClick={() => setSuccessNotice(null)} 
            className="text-xs text-emerald-700 hover:text-emerald-900 underline"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 2. REGISTRATION FORM (COLLAPSIBLE / PROMINENT) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-xs">
              {editingId ? <Edit3 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 font-serif-brand">
                {editingId ? 'Edit Profil Guru Terdaftar' : 'Formulir Registrasi Guru Baru'}
              </h2>
              <p className="text-xs text-slate-500">
                {editingId 
                  ? 'Perbarui data kontak, mata pelajaran, atau wilayah mengajar guru.'
                  : 'Lengkapi formulir di bawah ini untuk membuat profil dan akun pengajar baru.'}
              </p>
            </div>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Batal Edit (Buat Baru)</span>
            </button>
          )}
        </div>

        {/* VALIDATION ERROR ALERT */}
        {validationError && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Nama, Gelar, Email, Nomor WA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={namaLengkap}
                onChange={(e) => {
                  setNamaLengkap(e.target.value);
                  handleEmailOrNameChange(email, e.target.value);
                }}
                placeholder="Contoh: Sarah Syahidah"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Gelar Akademik / Keahlian
              </label>
              <input
                type="text"
                value={gelar}
                onChange={(e) => setGelar(e.target.value)}
                placeholder="Contoh: S.Pd / M.M / S.Si"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Aktif <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    handleEmailOrNameChange(e.target.value, namaLengkap);
                  }}
                  placeholder="tutor@dessamentari.id"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nomor WhatsApp <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={nomorWA}
                  onChange={(e) => setNomorWA(e.target.value)}
                  placeholder="087879069404"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Jenjang & Mata Pelajaran */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            {/* Jenjang */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-2 flex items-center justify-between">
                <span>Jenjang yang Diampu <span className="text-rose-500">*</span></span>
                <span className="text-[11px] text-slate-500 font-normal">Klik untuk memilih</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_LEVELS.map((lvl) => {
                  const isSelected = selectedLevels.includes(lvl);
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleToggleLevel(lvl)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-600 text-white shadow-2xs font-extrabold'
                          : 'bg-white text-slate-700 border border-slate-300 hover:border-amber-400'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                      <span>{lvl}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mata Pelajaran */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-2 flex items-center justify-between">
                <span>Mata Pelajaran yang Diampu <span className="text-rose-500">*</span></span>
                <span className="text-[11px] text-slate-500 font-normal">Pilih minimal satu</span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200">
                {AVAILABLE_SUBJECTS.map((subj) => {
                  const isSelected = selectedSubjects.includes(subj);
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => handleToggleSubject(subj)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-amber-300 font-bold shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {subj}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 3: Area Domisili & Status Akun */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Area Domisili / Penugasan Les Privat
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={areaDomisili}
                  onChange={(e) => setAreaDomisili(e.target.value)}
                  placeholder="Contoh: Jakarta Selatan, Depok & Tangsel (Guru Datang ke Rumah)"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Status Akun Guru
              </label>
              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="radio"
                    name="statusAkun"
                    value="Aktif"
                    checked={status === 'Aktif'}
                    onChange={() => setStatus('Aktif')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    ● Aktif (Bisa Mengajar & Input Laporan)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="radio"
                    name="statusAkun"
                    value="Non-Aktif"
                    checked={status === 'Non-Aktif'}
                    onChange={() => setStatus('Non-Aktif')}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span className="inline-flex items-center gap-1 text-slate-500">
                    ○ Non-Aktif (Cuti / Belum Ada Jadwal)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Row 4: Kredensial Login Guru Otomatis */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-950 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-700" />
                <span>Kredensial Akses Login Guru (Auto-Generated)</span>
              </span>
              <button
                type="button"
                onClick={() => setInitialPassword(generateRandomPassword())}
                className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Acak Password Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-amber-900 mb-1">
                  Username / ID Pengajar
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="guru.sarah"
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-900 mb-1">
                  Password Awal (Kirimkan ke Guru)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={initialPassword}
                    onChange={(e) => setInitialPassword(e.target.value)}
                    placeholder="DME-XXXX#26"
                    className="w-full pr-16 pl-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs px-1"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-amber-800/80">
              *Password ini dapat diberikan kepada guru melalui WhatsApp untuk akses langsung ke Portal Laporan Tutor.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{editingId ? 'Simpan Perubahan Guru' : 'Daftarkan Guru Baru Sekarang'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. DAFTAR TABEL GURU TERDAFTAR */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 font-serif-brand">
              Daftar Guru & Tutor Terdaftar
            </h2>
            <p className="text-xs text-slate-500">
              Daftar seluruh pendidik les privat Dessa Mentari Education beserta status dan kredensial.
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, email, mapel..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Semua Status</option>
              <option value="Aktif">Status Aktif</option>
              <option value="Non-Aktif">Status Non-Aktif</option>
            </select>

            {/* Level Filter */}
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Semua Jenjang</option>
              {AVAILABLE_LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                <th className="py-3 px-4">Profil Guru & Gelar</th>
                <th className="py-3 px-4">Kontak (Email / WA)</th>
                <th className="py-3 px-4">Mata Pelajaran & Jenjang</th>
                <th className="py-3 px-4">Area Penugasan</th>
                <th className="py-3 px-4">Status Akun</th>
                <th className="py-3 px-4 text-right">Aksi & Kredensial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-600">Tidak ada data guru yang cocok.</p>
                    <p className="text-[11px] text-slate-400">Silakan sesuaikan kata kunci pencarian atau tambah guru baru.</p>
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((t) => {
                  const isAktif = t.status === 'Aktif';
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                            {t.namaLengkap.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-900">{t.namaLengkap}</span>
                              {t.gelar && (
                                <span className="text-[11px] text-amber-800 font-bold">
                                  {t.gelar}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 block">
                              ID: {t.username || t.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contacts */}
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-[11px] truncate max-w-[160px]">{t.email}</span>
                        </div>
                        <a
                          href={`https://wa.me/${t.nomorWA}?text=Halo%20Bapak/Ibu%20${encodeURIComponent(t.namaLengkap)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold text-[11px]"
                        >
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span>+{t.nomorWA}</span>
                        </a>
                      </td>

                      {/* Mapel & Jenjang */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap gap-1 max-w-[220px]">
                            {t.mataPelajaran.slice(0, 3).map((m, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold"
                              >
                                {m}
                              </span>
                            ))}
                            {t.mataPelajaran.length > 3 && (
                              <span className="text-[10px] text-slate-400 font-bold">
                                +{t.mataPelajaran.length - 3} lainnya
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-semibold">
                            Jenjang: {t.jenjang.join(', ')}
                          </div>
                        </div>
                      </td>

                      {/* Domisili */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-[11px] text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate max-w-[140px]">{t.areaDomisili || 'Jabodetabek'}</span>
                        </div>
                      </td>

                      {/* Status Akun */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => {
                            const newStatus: TeacherStatus = isAktif ? 'Non-Aktif' : 'Aktif';
                            onSaveTeacher({ ...t, status: newStatus });
                          }}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
                            isAktif
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                          title="Klik untuk ubah status aktif/non-aktif"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isAktif ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
                          <span>{t.status}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Send Credentials via WA */}
                          <button
                            type="button"
                            onClick={() => handleSendCredentialsWA(t)}
                            title="Kirim Kredensial Akun ke WhatsApp Guru"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          {/* Reset Password */}
                          <button
                            type="button"
                            onClick={() => {
                              setResetModalTeacher(t);
                              setNewGeneratedPassword(generateRandomPassword());
                            }}
                            title="Reset Password Guru"
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors border border-amber-200"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleEditClick(t)}
                            title="Edit Data Guru"
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeleteModalTeacher(t)}
                            title="Hapus Data Guru"
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL POPUP TAMBAH GURU BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black shadow-xs">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-serif-brand">
                    Tambah Akun Guru Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Registrasikan pendidik les privat Dessa Mentari Education & buatkan kredensial login.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {validationError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={namaLengkap}
                    onChange={(e) => {
                      setNamaLengkap(e.target.value);
                      handleEmailOrNameChange(email, e.target.value);
                    }}
                    placeholder="Contoh: Sarah Syahidah"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gelar Akademik
                  </label>
                  <input
                    type="text"
                    value={gelar}
                    onChange={(e) => setGelar(e.target.value)}
                    placeholder="Contoh: S.Pd / M.M / S.Si"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Aktif <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      handleEmailOrNameChange(e.target.value, namaLengkap);
                    }}
                    placeholder="tutor@dessamentari.id"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={nomorWA}
                    onChange={(e) => setNomorWA(e.target.value)}
                    placeholder="087879069404"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mata Pelajaran (Pilih minimal satu)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {AVAILABLE_SUBJECTS.map((subj) => {
                    const isSelected = selectedSubjects.includes(subj);
                    return (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => handleToggleSubject(subj)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {subj}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jenjang Pendidikan
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_LEVELS.map((lvl) => {
                    const isSelected = selectedLevels.includes(lvl);
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleToggleLevel(lvl)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-slate-900 text-amber-300 font-bold'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Area Domisili / Penugasan
                  </label>
                  <input
                    type="text"
                    value={areaDomisili}
                    onChange={(e) => setAreaDomisili(e.target.value)}
                    placeholder="Contoh: Jakarta Selatan & Depok"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Username / ID Pengajar
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="guru.sarah"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50/40 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-900 font-bold block">Password Awal Otomatis:</span>
                  <span className="font-mono text-sm font-black text-amber-950">{initialPassword}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setInitialPassword(generateRandomPassword())}
                  className="px-2.5 py-1 text-[11px] font-bold text-amber-900 bg-white border border-amber-300 rounded-lg hover:bg-amber-100"
                >
                  Acak Ulang
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-sm transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Daftarkan Guru Sekarang</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL RESET PASSWORD */}
      {resetModalTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif-brand">
                  Reset Password Guru
                </h3>
                <p className="text-xs text-slate-500">
                  {resetModalTeacher.namaLengkap} ({resetModalTeacher.email})
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Sistem telah men-generate password baru yang aman untuk akun guru ini:
              </p>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Password Baru</span>
                  <span className="font-mono text-base font-black text-amber-900">
                    {newGeneratedPassword}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(newGeneratedPassword, 'modal-pwd')}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
                >
                  {copiedKey === 'modal-pwd' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'modal-pwd' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setResetModalTeacher(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const updated: TeacherData = {
                    ...resetModalTeacher,
                    initialPassword: newGeneratedPassword,
                    updatedAt: new Date().toISOString()
                  };
                  onSaveTeacher(updated);
                  handleSendCredentialsWA(updated);
                  setResetModalTeacher(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan & Kirim ke WA Guru</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL KONFIRMASI HAPUS */}
      {deleteModalTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900 font-serif-brand">
                Hapus Data Guru?
              </h3>
              <p className="text-xs text-slate-500">
                Apakah Anda yakin ingin menghapus <strong>{deleteModalTeacher.namaLengkap}</strong>? Data akun tidak dapat dikembalikan.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalTeacher(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteTeacher(deleteModalTeacher.id);
                  setDeleteModalTeacher(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Ya, Hapus Guru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

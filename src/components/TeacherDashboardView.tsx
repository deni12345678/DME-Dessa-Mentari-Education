import React, { useState, useMemo } from 'react';
import { 
  UserCheck, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Calendar, 
  Clock, 
  Star, 
  Send, 
  Plus, 
  Search, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Phone, 
  Share2, 
  Download, 
  RotateCcw, 
  LogOut, 
  ShieldCheck, 
  UserPlus, 
  Edit3, 
  Lock, 
  Sparkles, 
  Eye, 
  ArrowRight,
  Filter,
  Check,
  Award,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { 
  TeacherData, 
  StudentData, 
  ReportData, 
  EducationLevel, 
  AttendanceStatus 
} from '../types/report';
import { copyWhatsAppTextToClipboard, openWhatsAppDirect } from '../utils/exportImage';

export type TeacherSubTab = 'overview' | 'input-report' | 'my-students' | 'my-reports' | 'my-earnings' | 'my-profile';

interface TeacherDashboardViewProps {
  teacher: TeacherData;
  allTeachers: TeacherData[];
  students: StudentData[];
  reports: ReportData[];
  onSaveReport: (report: ReportData) => void;
  onSaveStudent: (student: StudentData) => void;
  onUpdateTeacherProfile: (teacher: TeacherData) => void;
  onSwitchTeacher: (teacherId: string) => void;
  onLogout: () => void;
  onGoToAdmin: () => void;
  onGoToPublic: () => void;
  contactWA?: string;
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  teacher,
  allTeachers,
  students,
  reports,
  onSaveReport,
  onSaveStudent,
  onUpdateTeacherProfile,
  onSwitchTeacher,
  onLogout,
  onGoToAdmin,
  onGoToPublic,
  contactWA = '087879069404',
}) => {
  const [activeTab, setActiveTab] = useState<TeacherSubTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState('ALL');

  // Input Report Form State
  const getTodayDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [formStudentName, setFormStudentName] = useState('');
  const [formSesiKe, setFormSesiKe] = useState<number>(1);
  const [formTanggal, setFormTanggal] = useState(getTodayDate());
  const [formWaktuDurasi, setFormWaktuDurasi] = useState('90 Menit (15.30 - 17.00 WIB)');
  const [formJenjang, setFormJenjang] = useState<EducationLevel>(teacher.jenjang[0] || 'SD');
  const [formKelasGrade, setFormKelasGrade] = useState('Kelas 4 SD');
  const [formMataPelajaran, setFormMataPelajaran] = useState(teacher.mataPelajaran[0] || 'Matematika');
  const [formStatusKehadiran, setFormStatusKehadiran] = useState<AttendanceStatus>('Hadir');
  const [formPemahamanScale, setFormPemahamanScale] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [formSkorPemahaman, setFormSkorPemahaman] = useState(90);
  const [formSkorKeaktifan, setFormSkorKeaktifan] = useState(90);
  const [formSkorFokus, setFormSkorFokus] = useState(88);
  const [formMateri, setFormMateri] = useState('');
  const [formEvaluasi, setFormEvaluasi] = useState('');
  const [formPR, setFormPR] = useState('');
  const [formCatatanOrtu, setFormCatatanOrtu] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState('');

  // Add Student Modal State
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentNama, setNewStudentNama] = useState('');
  const [newStudentPanggilan, setNewStudentPanggilan] = useState('');
  const [newStudentJenjang, setNewStudentJenjang] = useState<EducationLevel>('SD');
  const [newStudentKelas, setNewStudentKelas] = useState('Kelas 4 SD');
  const [newStudentSekolah, setNewStudentSekolah] = useState('');
  const [newStudentOrtu, setNewStudentOrtu] = useState('');
  const [newStudentNomorOrtu, setNewStudentNomorOrtu] = useState('');
  const [newStudentAlamat, setNewStudentAlamat] = useState(teacher.areaDomisili || '');
  const [newStudentMapel, setNewStudentMapel] = useState(teacher.mataPelajaran[0] || 'Matematika');
  const [newStudentHari, setNewStudentHari] = useState('Senin & Kamis');
  const [newStudentJam, setNewStudentJam] = useState('15.30 - 17.00 WIB');
  const [newStudentCatatan, setNewStudentCatatan] = useState('');
  const [newStudentFoto, setNewStudentFoto] = useState('');

  // Profile Edit State
  const [editPhone, setEditPhone] = useState(teacher.nomorWA);
  const [editArea, setEditArea] = useState(teacher.areaDomisili);
  const [editNotes, setEditNotes] = useState(teacher.catatanKhusus || '');
  const [newPassword, setNewPassword] = useState('');
  const [profileSuccessNotice, setProfileSuccessNotice] = useState(false);

  // Switch Teacher Modal State
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

  // Filter students assigned to this teacher
  const myStudents = useMemo(() => {
    return students.filter((s) => {
      if (!s.namaPengajar) return true; // show unassigned or shared
      return s.namaPengajar.toLowerCase().includes(teacher.namaLengkap.toLowerCase()) ||
             teacher.namaLengkap.toLowerCase().includes(s.namaPengajar.toLowerCase());
    });
  }, [students, teacher.namaLengkap]);

  // Filter reports submitted by this teacher
  const myReports = useMemo(() => {
    return reports.filter((r) => {
      return r.namaPengajar.toLowerCase().includes(teacher.namaLengkap.toLowerCase()) ||
             teacher.namaLengkap.toLowerCase().includes(r.namaPengajar.toLowerCase());
    });
  }, [reports, teacher.namaLengkap]);

  // Compute today and tomorrow schedule reminders
  const todayAndTomorrowSchedules = useMemo(() => {
    const daysMap: Record<number, string> = {
      0: 'Minggu',
      1: 'Senin',
      2: 'Selasa',
      3: 'Rabu',
      4: 'Kamis',
      5: 'Jumat',
      6: 'Sabtu'
    };
    const now = new Date();
    const todayIndex = now.getDay();
    const tomorrowIndex = (todayIndex + 1) % 7;
    const todayName = daysMap[todayIndex];
    const tomorrowName = daysMap[tomorrowIndex];

    const todayList: StudentData[] = [];
    const tomorrowList: StudentData[] = [];

    myStudents.forEach((st) => {
      if (st.status !== 'Aktif') return;
      const hari = (st.hariLes || '').toLowerCase();
      if (hari.includes(todayName.toLowerCase()) || hari.includes('tiap') || hari.includes('setiap') || hari.includes('senin-jumat')) {
        todayList.push(st);
      }
      if (hari.includes(tomorrowName.toLowerCase()) || hari.includes('tiap') || hari.includes('setiap')) {
        tomorrowList.push(st);
      }
    });

    return {
      todayName,
      tomorrowName,
      todayList,
      tomorrowList,
    };
  }, [myStudents]);

  // Filtered reports for list
  const filteredMyReports = useMemo(() => {
    return myReports.filter((r) => {
      const matchSearch = 
        r.namaSiswa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.materiDipelajari.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.mataPelajaran.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStudent = selectedStudentFilter === 'ALL' || r.namaSiswa === selectedStudentFilter;
      return matchSearch && matchStudent;
    });
  }, [myReports, searchQuery, selectedStudentFilter]);

  // KPI Calculations
  const currentMonthStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  const sessionsThisMonth = useMemo(() => {
    return myReports.filter((r) => r.tanggal.startsWith(currentMonthStr)).length;
  }, [myReports, currentMonthStr]);

  const avgScore = useMemo(() => {
    if (myReports.length === 0) return 90;
    const total = myReports.reduce((sum, r) => sum + (r.skorPemahaman || 85), 0);
    return Math.round(total / myReports.length);
  }, [myReports]);

  // Teaching honorarium estimate (standard bimbel Rp 85.000 / sesi)
  const tarifPerSesiDefault = 85000;
  const estimatedEarnings = sessionsThisMonth * tarifPerSesiDefault;

  // Auto-fill form when student is selected
  const handleSelectStudentForInput = (selectedName: string) => {
    setFormStudentName(selectedName);
    const found = students.find((s) => s.namaSiswa === selectedName);
    if (found) {
      setFormJenjang(found.jenjang);
      if (found.kelasGrade) setFormKelasGrade(found.kelasGrade);
      if (found.mataPelajaran) {
        // pick first matching subject if multiple
        const firstSub = found.mataPelajaran.split('&')[0].trim();
        setFormMataPelajaran(firstSub);
      }
      // Calculate next session number for this student
      const studentReports = myReports.filter((r) => r.namaSiswa === selectedName);
      setFormSesiKe(studentReports.length + 1);
    }
  };

  // Synchronize comprehension scale with scores
  const handleScaleChange = (scale: 1 | 2 | 3 | 4 | 5) => {
    setFormPemahamanScale(scale);
    const scaleToScore = {
      1: { pemahaman: 65, keaktifan: 68, fokus: 65 },
      2: { pemahaman: 75, keaktifan: 75, fokus: 74 },
      3: { pemahaman: 84, keaktifan: 85, fokus: 82 },
      4: { pemahaman: 92, keaktifan: 90, fokus: 90 },
      5: { pemahaman: 98, keaktifan: 96, fokus: 96 },
    };
    const s = scaleToScore[scale];
    setFormSkorPemahaman(s.pemahaman);
    setFormSkorKeaktifan(s.keaktifan);
    setFormSkorFokus(s.fokus);
  };

  // Submit report from teacher
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorMessage('');

    if (!formStudentName.trim()) {
      setFormErrorMessage('Silakan pilih nama siswa yang diajar.');
      return;
    }
    if (!formMateri.trim()) {
      setFormErrorMessage('Silakan masukkan topik materi pembelajaran hari ini.');
      return;
    }
    if (!formEvaluasi.trim()) {
      setFormErrorMessage('Silakan berikan catatan evaluasi perkembangan siswa.');
      return;
    }

    const newReport: ReportData = {
      id: `RPT-${Date.now()}`,
      namaSiswa: formStudentName.trim(),
      namaPengajar: teacher.namaLengkap,
      teacherId: teacher.id,
      sesiKe: formSesiKe,
      tanggal: formTanggal,
      waktuDurasi: formWaktuDurasi,
      jenjang: formJenjang,
      kelasGrade: formKelasGrade,
      mataPelajaran: formMataPelajaran,
      statusKehadiran: formStatusKehadiran,
      pemahamanScale: formPemahamanScale,
      skorPemahaman: formSkorPemahaman,
      skorKeaktifan: formSkorKeaktifan,
      skorFokus: formSkorFokus,
      materiDipelajari: formMateri.trim(),
      evaluasiSiswa: formEvaluasi.trim(),
      tugasRumah: formPR.trim() || undefined,
      catatanOrangTua: formCatatanOrtu.trim() || undefined,
      theme: 'solar',
      cardLayout: 'elegant',
      createdAt: new Date().toISOString(),
    };

    onSaveReport(newReport);
    setFormSuccessMessage(true);
    setTimeout(() => setFormSuccessMessage(false), 3500);

    // Reset fields for next entry
    setFormMateri('');
    setFormEvaluasi('');
    setFormPR('');
    setFormCatatanOrtu('');
    setFormSesiKe((prev) => prev + 1);
  };

  // Handle adding new student directly by teacher
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentNama.trim()) return;

    const newStu: StudentData = {
      id: `STU-${Date.now()}`,
      namaSiswa: newStudentNama.trim(),
      panggilan: newStudentPanggilan.trim() || undefined,
      jenjang: newStudentJenjang,
      kelasGrade: newStudentKelas.trim() || undefined,
      sekolah: newStudentSekolah.trim() || undefined,
      namaOrangTua: newStudentOrtu.trim() || undefined,
      nomorOrangTua: newStudentNomorOrtu.trim() || undefined,
      alamat: newStudentAlamat.trim() || undefined,
      mataPelajaran: newStudentMapel.trim(),
      hariLes: newStudentHari.trim(),
      jamLes: newStudentJam.trim(),
      namaPengajar: teacher.namaLengkap,
      status: 'Aktif',
      catatanKhusus: newStudentCatatan.trim() || undefined,
      fotoSiswa: newStudentFoto.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onSaveStudent(newStu);
    setIsAddStudentOpen(false);
    // Reset form
    setNewStudentNama('');
    setNewStudentPanggilan('');
    setNewStudentSekolah('');
    setNewStudentOrtu('');
    setNewStudentNomorOrtu('');
    setNewStudentCatatan('');
    setNewStudentFoto('');
  };

  // Handle saving teacher profile update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: TeacherData = {
      ...teacher,
      nomorWA: editPhone.trim(),
      areaDomisili: editArea.trim(),
      catatanKhusus: editNotes.trim(),
      initialPassword: newPassword.trim() ? newPassword.trim() : teacher.initialPassword,
      updatedAt: new Date().toISOString(),
    };
    onUpdateTeacherProfile(updated);
    setProfileSuccessNotice(true);
    setTimeout(() => setProfileSuccessNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* 1. TEACHER HERO BANNER & PERSONALIZED STATUS BAR */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-amber-500/40 relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          {/* Teacher Profile Left */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg border-2 border-white/20 shrink-0">
              {teacher.namaLengkap.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Dasbor Resmi Pengajar · ID: {teacher.id}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-400/30">
                  ● Status {teacher.status}
                </span>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-400/30">
                  Cloud Sync Live
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-0.5">
                {teacher.namaLengkap}
              </h2>

              <p className="text-xs text-slate-300 mt-1 flex items-center gap-3 flex-wrap">
                <span>📚 <strong>Mapel:</strong> {teacher.mataPelajaran.join(', ')}</span>
                <span>•</span>
                <span>📍 <strong>Domisili:</strong> {teacher.areaDomisili}</span>
                <span>•</span>
                <span>📱 <strong>WhatsApp:</strong> {teacher.nomorWA}</span>
              </p>
            </div>
          </div>

          {/* Teacher Action Controls Right */}
          <div className="flex items-center gap-2 flex-wrap self-stretch lg:self-center justify-start lg:justify-end">
            <button
              type="button"
              onClick={() => setIsSwitchModalOpen(true)}
              className="px-3 py-2 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 rounded-xl transition-all flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Ganti Akun Guru</span>
            </button>

            <button
              type="button"
              onClick={onGoToAdmin}
              className="px-3 py-2 text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Pusat Admin</span>
            </button>

            <button
              type="button"
              onClick={onGoToPublic}
              className="px-3 py-2 text-xs font-bold text-slate-300 hover:text-white bg-transparent hover:bg-white/10 rounded-xl transition-all"
            >
              Web Depan
            </button>

            <button
              type="button"
              onClick={onLogout}
              title="Keluar dari Portal Guru"
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/30"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Informational Sub-Strip */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-300 gap-2">
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Semua data laporan yang Anda kirim <strong>otomatis tersinkronisasi ke Dashboard Admin</strong> untuk rekapitulasi orang tua murid.</span>
          </p>
          <div className="flex items-center gap-3 text-slate-400 shrink-0">
            <span>Username: <strong>@{teacher.username}</strong></span>
            <span>•</span>
            <span>© 2026 Dessa Mentari Education</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. SUB-TAB NAVIGATION STRIP */}
      {/* ======================================================== */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: 'Ringkasan Kinerja Saya', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'input-report', label: 'Input Laporan Mengajar', icon: <Edit3 className="w-4 h-4 text-amber-600" />, badge: 'Cepat' },
          { id: 'my-students', label: 'Murid Bimbingan Saya', icon: <GraduationCap className="w-4 h-4" />, badge: myStudents.length },
          { id: 'my-reports', label: 'Riwayat Laporan Saya', icon: <FileText className="w-4 h-4" />, badge: myReports.length },
          { id: 'my-earnings', label: 'Rekap Sesi & Honor', icon: <DollarSign className="w-4 h-4 text-emerald-600" /> },
          { id: 'my-profile', label: 'Profil Akun Guru', icon: <UserCheck className="w-4 h-4" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TeacherSubTab)}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 3. TAB CONTENT */}
      {/* ======================================================== */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* ======================================================== */}
          {/* SCHEDULE REMINDER PANEL (HARI INI & BESOK)               */}
          {/* ======================================================== */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-4 sm:p-5 text-slate-950 shadow-md border border-amber-400 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-slate-950/10 border border-slate-950/20 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black tracking-tight">
                    Pengingat Jadwal Les Privat
                  </h3>
                  <span className="bg-slate-950 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {todayAndTomorrowSchedules.todayName} &amp; {todayAndTomorrowSchedules.tomorrowName}
                  </span>
                </div>
                <p className="text-xs text-slate-950/80 mt-0.5 font-medium">
                  Hari ini ({todayAndTomorrowSchedules.todayName}): <strong>{todayAndTomorrowSchedules.todayList.length} siswa</strong> · Besok ({todayAndTomorrowSchedules.tomorrowName}): <strong>{todayAndTomorrowSchedules.tomorrowList.length} siswa</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
              {/* Today Pill */}
              <div className="bg-white/90 backdrop-blur-xs px-3 py-2 rounded-xl shadow-2xs border border-white flex-1 lg:flex-none">
                <span className="text-[10px] font-extrabold uppercase text-amber-900 block">Jadwal Hari Ini ({todayAndTomorrowSchedules.todayName})</span>
                <div className="text-xs font-black text-slate-950 mt-0.5">
                  {todayAndTomorrowSchedules.todayList.length === 0 ? (
                    <span className="text-slate-500 font-normal italic">Tidak ada jadwal hari ini</span>
                  ) : (
                    todayAndTomorrowSchedules.todayList.map((s) => s.namaSiswa).join(', ')
                  )}
                </div>
              </div>

              {/* Tomorrow Pill */}
              <div className="bg-white/90 backdrop-blur-xs px-3 py-2 rounded-xl shadow-2xs border border-white flex-1 lg:flex-none">
                <span className="text-[10px] font-extrabold uppercase text-amber-900 block">Jadwal Besok ({todayAndTomorrowSchedules.tomorrowName})</span>
                <div className="text-xs font-black text-slate-950 mt-0.5">
                  {todayAndTomorrowSchedules.tomorrowList.length === 0 ? (
                    <span className="text-slate-500 font-normal italic">Tidak ada jadwal besok</span>
                  ) : (
                    todayAndTomorrowSchedules.tomorrowList.map((s) => s.namaSiswa).join(', ')
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* KPI METRIC CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pertemuan Bulan Ini
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {sessionsThisMonth}
                </span>
                <span className="text-xs font-bold text-emerald-600">Sesi Les</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Total riwayat mengajar: {myReports.length} pertemuan
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Murid Bimbingan Saya
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {myStudents.length}
                </span>
                <span className="text-xs font-bold text-amber-600">Siswa Aktif</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Jenjang: {teacher.jenjang.join(', ')}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Rata-rata Pemahaman
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                  {avgScore}
                </span>
                <span className="text-xs font-bold text-slate-400">/ 100</span>
              </div>
              <div className="flex items-center text-amber-500 text-xs gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
                <span className="text-[10px] text-slate-500 ml-1 font-semibold">Predikat Sangat Baik</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 p-4 rounded-2xl border border-amber-300 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                Estimasi Honor Bulan Ini
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold text-amber-900">Rp</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-950">
                  {estimatedEarnings.toLocaleString('id-ID')}
                </span>
              </div>
              <p className="text-[10px] text-amber-800">
                Dasar: Rp {tarifPerSesiDefault.toLocaleString('id-ID')} / sesi hadir
              </p>
            </div>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('input-report')}
              className="p-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-2xl text-left shadow-sm transition-all group flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-900/70 block">
                  Aksi Guru Utama
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-950 mt-0.5">
                  Input Laporan Selesai Mengajar
                </h4>
                <p className="text-xs text-slate-900/80 mt-1">
                  Catat materi, nilai pemahaman, dan tugas rumah sesi hari ini.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            <button
              onClick={() => setActiveTab('my-students')}
              className="p-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-2xl text-left shadow-2xs transition-all group flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                  Jadwal & Kontak
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                  Lihat Murid Bimbingan Saya
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Akses kontak orang tua, jadwal les mingguan, dan catatan khusus.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            <button
              onClick={() => setActiveTab('my-reports')}
              className="p-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-2xl text-left shadow-2xs transition-all group flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                  Arsip & WhatsApp
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                  Riwayat Laporan & Kirim WA
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Salin teks format laporan untuk dibagikan ke wali murid.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
          </div>

          {/* TWO COLUMN SECTION: RECENT REPORTS BY THIS TEACHER & MY STUDENTS PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: 5 Recent Reports by this teacher */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    Laporan Terkini yang Dikirim ke Admin
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('my-reports')}
                  className="text-xs text-amber-700 hover:text-amber-800 font-bold hover:underline"
                >
                  Lihat Semua ({myReports.length})
                </button>
              </div>

              {myReports.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-medium">Belum ada laporan yang Anda input.</p>
                  <button
                    onClick={() => setActiveTab('input-report')}
                    className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-2xs"
                  >
                    + Buat Laporan Pertama
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myReports.slice(0, 5).map((r) => (
                    <div
                      key={r.id}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 bg-slate-50/50 hover:bg-amber-50/30 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">
                            {r.namaSiswa}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-100 text-amber-900">
                            {r.mataPelajaran}
                          </span>
                          {r.sesiKe && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-black bg-slate-200 text-slate-700">
                              Sesi {r.sesiKe}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-medium">
                            {r.tanggal}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            Nilai: {r.skorPemahaman ?? 85}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-1">
                        <strong>Materi:</strong> {r.materiDipelajari}
                      </p>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tersinkronisasi di Admin</span>
                        </span>
                        <button
                          onClick={() => {
                            copyWhatsAppTextToClipboard(r);
                            alert('Format teks laporan disalin! Siap dikirim ke WhatsApp orang tua.');
                          }}
                          className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>Salin Format WA</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Assigned Students List Preview */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    Murid Bimbingan Saya
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddStudentOpen(true)}
                  className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Murid</span>
                </button>
              </div>

              {myStudents.length === 0 ? (
                <div className="p-6 text-center text-slate-400 space-y-2">
                  <p className="text-xs font-medium">Belum ada murid bimbingan yang terdaftar atas nama Anda.</p>
                  <button
                    onClick={() => setIsAddStudentOpen(true)}
                    className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-2xs"
                  >
                    + Daftarkan Murid Baru
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myStudents.map((stu) => (
                    <div
                      key={stu.id}
                      className="p-3 rounded-xl border border-slate-200 hover:border-amber-300 bg-slate-50/60 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-extrabold text-slate-900">
                            {stu.namaSiswa}
                          </span>
                          <span className="text-[9.5px] px-1.5 py-0.2 rounded font-bold bg-amber-100 text-amber-900">
                            {stu.kelasGrade || stu.jenjang}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Jadwal: {stu.hariLes || 'Fleksibel'} ({stu.jamLes || 'Sesuai kesepakatan'})
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {stu.nomorOrangTua && (
                          <a
                            href={`https://wa.me/${stu.nomorOrangTua.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat WhatsApp Wali Murid"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => {
                            handleSelectStudentForInput(stu.namaSiswa);
                            setActiveTab('input-report');
                          }}
                          title="Input Laporan Pertemuan"
                          className="px-2.5 py-1 text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg shadow-2xs"
                        >
                          Lapor
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INPUT LAPORAN MENGAJAR */}
      {activeTab === 'input-report' && (
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-black">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Form Laporan Selesai Mengajar (Guru)
                </h3>
                <p className="text-xs text-slate-500">
                  Pengajar: <strong>{teacher.namaLengkap}</strong> · Otomatis masuk ke Rekapan Orang Tua & Admin
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              Sinkronisasi Cloud
            </span>
          </div>

          {formSuccessMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Laporan Pertemuan Berhasil Dikirim & Tersimpan!</p>
                <p className="text-[11px] text-emerald-700">
                  Laporan otomatis terpusat di Dashboard Admin dan siap direkap untuk orang tua murid.
                </p>
              </div>
            </div>
          )}

          {formErrorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formErrorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmitReport} className="space-y-5">
            {/* Row 1: Student & Session */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Siswa yang Diajar <span className="text-red-500">*</span>
                </label>
                <select
                  value={formStudentName}
                  onChange={(e) => handleSelectStudentForInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                  required
                >
                  <option value="">-- Pilih Siswa Bimbingan --</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.namaSiswa}>
                      {st.namaSiswa} ({st.kelasGrade || st.jenjang}) {st.namaPengajar ? `· ${st.namaPengajar}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pertemuan Sesi Ke-
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formSesiKe}
                  onChange={(e) => setFormSesiKe(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                />
              </div>
            </div>

            {/* Row 2: Date & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tanggal Pertemuan
                </label>
                <input
                  type="date"
                  value={formTanggal}
                  onChange={(e) => setFormTanggal(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Waktu & Durasi Les
                </label>
                <input
                  type="text"
                  value={formWaktuDurasi}
                  onChange={(e) => setFormWaktuDurasi(e.target.value)}
                  placeholder="Contoh: 90 Menit (15.30 - 17.00 WIB)"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                />
              </div>
            </div>

            {/* Row 3: Subject & Attendance */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jenjang
                </label>
                <select
                  value={formJenjang}
                  onChange={(e) => setFormJenjang(e.target.value as EducationLevel)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                >
                  <option value="TK">TK / Calistung</option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA">SMA</option>
                  <option value="Umum/PAUD">Umum / Komputer</option>
                </select>
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={formMataPelajaran}
                  onChange={(e) => setFormMataPelajaran(e.target.value)}
                  placeholder="Contoh: Matematika, IPA, Bahasa Inggris..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status Hadir
                </label>
                <select
                  value={formStatusKehadiran}
                  onChange={(e) => setFormStatusKehadiran(e.target.value as AttendanceStatus)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Reschedule / Disingkat">Reschedule</option>
                  <option value="Izin / Sakit">Izin / Sakit</option>
                </select>
              </div>
            </div>

            {/* Row 4: Comprehension Scale (1 - 5 Stars) */}
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-amber-950 uppercase tracking-wider block">
                    Indikator Pemahaman Materi Sesi Ini
                  </span>
                  <span className="text-[11px] text-amber-800">
                    Pilih skala bintang untuk penilaian kemajuan siswa:
                  </span>
                </div>
                <span className="text-xs font-black px-2.5 py-1 bg-amber-500 text-slate-950 rounded-lg">
                  {formPemahamanScale === 1 && '1/5 · Perlu Bimbingan Ekstra'}
                  {formPemahamanScale === 2 && '2/5 · Cukup (Pemahaman Dasar)'}
                  {formPemahamanScale === 3 && '3/5 · Baik (Memahami Konsep)'}
                  {formPemahamanScale === 4 && '4/5 · Sangat Baik (Cepat & Tepat)'}
                  {formPemahamanScale === 5 && '5/5 · Istimewa / Sempurna'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((scale) => {
                  const isSelected = formPemahamanScale >= scale;
                  return (
                    <button
                      type="button"
                      key={scale}
                      onClick={() => handleScaleChange(scale as 1 | 2 | 3 | 4 | 5)}
                      className={`flex-1 py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isSelected ? 'fill-current' : ''}`} />
                      <span>{scale}</span>
                    </button>
                  );
                })}
              </div>

              {/* Fine-tune numerical sliders */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-0.5">
                    <span>Pemahaman:</span>
                    <strong className="text-slate-900">{formSkorPemahaman}%</strong>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={formSkorPemahaman}
                    onChange={(e) => setFormSkorPemahaman(parseInt(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-0.5">
                    <span>Keaktifan:</span>
                    <strong className="text-slate-900">{formSkorKeaktifan}%</strong>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={formSkorKeaktifan}
                    onChange={(e) => setFormSkorKeaktifan(parseInt(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-0.5">
                    <span>Fokus:</span>
                    <strong className="text-slate-900">{formSkorFokus}%</strong>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={formSkorFokus}
                    onChange={(e) => setFormSkorFokus(parseInt(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>
              </div>
            </div>

            {/* Row 5: Topic / Materials */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Topik / Materi Pembelajaran Hari Ini <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={formMateri}
                onChange={(e) => setFormMateri(e.target.value)}
                placeholder="Contoh: Operasi Hitung Campuran Pecahan & Latihan 10 Soal Cerita Mandiri..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                required
              />
            </div>

            {/* Row 6: Evaluation & Notes */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Catatan Evaluasi & Perkembangan Siswa <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">Rekomendasi Cepat:</span>
              </div>

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {[
                  'Ananda sangat aktif bertanya dan fokus selama sesi les.',
                  'Sudah mampu menyelesaikan soal secara mandiri tanpa bantuan.',
                  'Perlu latihan tambahan untuk menghitung operasi perkalian.',
                  'Konsentrasi sangat baik dan ceria saat membahas materi baru.',
                ].map((chip, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setFormEvaluasi((prev) => (prev ? `${prev} ${chip}` : chip))}
                    className="text-[10.5px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-950 transition-colors border border-slate-200"
                  >
                    + {chip}
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                value={formEvaluasi}
                onChange={(e) => setFormEvaluasi(e.target.value)}
                placeholder="Tuliskan evaluasi belajar, tingkat pemahaman, dan sikap belajar anak hari ini..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                required
              />
            </div>

            {/* Row 7: Homework & Parent Note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tugas Rumah / PR (Jika Ada)
                </label>
                <input
                  type="text"
                  value={formPR}
                  onChange={(e) => setFormPR(e.target.value)}
                  placeholder="Contoh: Latihan 5 soal halaman 32 di buku paket..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pesan Khusus untuk Orang Tua
                </label>
                <input
                  type="text"
                  value={formCatatanOrtu}
                  onChange={(e) => setFormCatatanOrtu(e.target.value)}
                  placeholder="Contoh: Mohon dibantu mengulang hafalan rumus ya Bund..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Laporan ini akan langsung tersimpan di Cloud Database & Admin Portal.
              </span>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Kirim & Sinkronkan ke Pusat</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: MY STUDENTS */}
      {activeTab === 'my-students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Daftar Murid Bimbingan Saya ({myStudents.length})
              </h3>
              <p className="text-xs text-slate-500">
                Peserta didik aktif yang ditugaskan kepada pengajar {teacher.namaLengkap}
              </p>
            </div>

            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-2xs hover:scale-102 transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Daftarkan Murid Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myStudents.map((st) => {
              const studentReports = myReports.filter((r) => r.namaSiswa === st.namaSiswa);
              const lastReport = studentReports[0];

              return (
                <div
                  key={st.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-400 shadow-2xs hover:shadow-sm transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      {st.fotoSiswa ? (
                        <img
                          src={st.fotoSiswa}
                          alt={st.namaSiswa}
                          className="w-12 h-12 rounded-2xl object-cover border border-amber-300 shadow-2xs shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-900 font-black text-sm flex items-center justify-center border border-amber-300 shrink-0">
                          {st.namaSiswa.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-black text-slate-900">
                            {st.namaSiswa}
                          </h4>
                          {st.panggilan && (
                            <span className="text-[10px] text-slate-400 font-semibold">
                              ({st.panggilan})
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {st.kelasGrade || st.jenjang} · {st.sekolah || 'Sekolah Terdaftar'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                      {st.status}
                    </span>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
                      <p>
                        📚 <strong>Mapel:</strong> {st.mataPelajaran || 'Matematika'}
                      </p>
                      <p>
                        🗓️ <strong>Jadwal:</strong> {st.hariLes || 'Senin & Kamis'} ({st.jamLes || '15.30 WIB'})
                      </p>
                      <p>
                        📍 <strong>Alamat:</strong> {st.alamat || teacher.areaDomisili}
                      </p>
                      {st.namaOrangTua && (
                        <p>
                          👨‍👩‍👦 <strong>Wali:</strong> {st.namaOrangTua} ({st.nomorOrangTua || '-'})
                        </p>
                      )}
                    </div>

                    {lastReport && (
                      <div className="text-[11px] text-amber-900 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
                        <span className="font-bold">Pertemuan Terakhir ({lastReport.tanggal}):</span>
                        <p className="line-clamp-1 text-slate-600 mt-0.5">{lastReport.materiDipelajari}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {st.nomorOrangTua ? (
                      <a
                        href={`https://wa.me/${st.nomorOrangTua.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Halo Bapak/Ibu ${st.namaOrangTua || 'Wali Murid'}, saya ${teacher.namaLengkap} guru les privat Ananda ${st.namaSiswa} dari Dessa Mentari Education.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Chat WA</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No WA belum diisi</span>
                    )}

                    <button
                      onClick={() => {
                        handleSelectStudentForInput(st.namaSiswa);
                        setActiveTab('input-report');
                      }}
                      className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-2xs transition-all flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Input Sesi</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: MY REPORTS */}
      {activeTab === 'my-reports' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari materi / nama siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 bg-slate-50"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedStudentFilter}
                onChange={(e) => setSelectedStudentFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
              >
                <option value="ALL">Semua Siswa Bimbingan</option>
                {myStudents.map((s) => (
                  <option key={s.id} value={s.namaSiswa}>{s.namaSiswa}</option>
                ))}
              </select>

              <button
                onClick={() => setActiveTab('input-report')}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-2xs whitespace-nowrap"
              >
                + Tambah Laporan
              </button>
            </div>
          </div>

          {/* Reports Table / Card List */}
          <div className="space-y-3">
            {filteredMyReports.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">Tidak ada laporan yang sesuai pencarian.</p>
              </div>
            ) : (
              filteredMyReports.map((r) => (
                <div
                  key={r.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-300 shadow-2xs transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-black text-slate-900">
                        {r.namaSiswa}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        {r.mataPelajaran}
                      </span>
                      {r.sesiKe && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          Sesi Ke-{r.sesiKe}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">
                        📅 {r.tanggal} · ⏱️ {r.waktuDurasi}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Pemahaman: {r.skorPemahaman ?? 85}%
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {r.statusKehadiran}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700">
                    <p>
                      <strong>Topik Materi:</strong> {r.materiDipelajari}
                    </p>
                    <p className="text-slate-600">
                      <strong>Evaluasi Perkembangan:</strong> {r.evaluasiSiswa}
                    </p>
                    {r.tugasRumah && (
                      <p className="text-amber-900 bg-amber-50 p-2 rounded-xl text-[11px] border border-amber-200">
                        📝 <strong>Tugas Rumah (PR):</strong> {r.tugasRumah}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tersimpan di Cloud Database</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          const ok = await copyWhatsAppTextToClipboard(r);
                          if (ok) alert('Format pesan WhatsApp berhasil disalin!');
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Salin Format WA</span>
                      </button>

                      <button
                        onClick={() => openWhatsAppDirect(r, contactWA)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Kirim WA</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: MY EARNINGS & SESSIONS */}
      {activeTab === 'my-earnings' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Rekapitulasi Mengajar & Honorarium Saya
                </h3>
                <p className="text-xs text-slate-500">
                  Periode Aktif: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-400 block">Total Estimasi Honor:</span>
                <span className="text-xl font-black text-emerald-700">
                  Rp {estimatedEarnings.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Sesi Hadir</span>
                <p className="text-lg font-black text-slate-900 mt-0.5">{sessionsThisMonth} Pertemuan</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Tarif Standar / Sesi</span>
                <p className="text-lg font-black text-slate-900 mt-0.5">Rp {tarifPerSesiDefault.toLocaleString('id-ID')}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">Status Verifikasi Admin</span>
                <p className="text-sm font-black text-emerald-900 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tercatat Otomatis di Pusat</span>
                </p>
              </div>
            </div>

            {/* Teaching Log Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                    <th className="p-3">No</th>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3">Mata Pelajaran</th>
                    <th className="p-3">Durasi</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Estimasi Honor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myReports.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400">
                        Belum ada rekapan sesi mengajar pada periode ini.
                      </td>
                    </tr>
                  ) : (
                    myReports.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="p-3 font-semibold text-slate-500">{idx + 1}</td>
                        <td className="p-3 font-bold text-slate-900">{item.tanggal}</td>
                        <td className="p-3 font-medium text-slate-800">{item.namaSiswa}</td>
                        <td className="p-3 text-slate-600">{item.mataPelajaran}</td>
                        <td className="p-3 text-slate-500">{item.waktuDurasi}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800">
                            {item.statusKehadiran}
                          </span>
                        </td>
                        <td className="p-3 text-right font-extrabold text-slate-900">
                          Rp {tarifPerSesiDefault.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MY PROFILE */}
      {activeTab === 'my-profile' && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-black">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Pengaturan Profil & Akun Guru
              </h3>
              <p className="text-xs text-slate-500">
                Kredensial login & informasi kontak bimbingan privat Anda
              </p>
            </div>
          </div>

          {profileSuccessNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profil berhasil diperbarui dan disinkronkan ke pusat!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap & Gelar (Terkunci oleh Admin)
                </label>
                <input
                  type="text"
                  value={teacher.namaLengkap}
                  disabled
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-600 cursor-not-allowed font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username Login
                </label>
                <input
                  type="text"
                  value={`@${teacher.username}`}
                  disabled
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-600 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor WhatsApp Aktif
              </label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Area Domisili / Penugasan Les Privat
              </label>
              <input
                type="text"
                value={editArea}
                onChange={(e) => setEditArea(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ubah Kata Sandi (Password Akun Baru)
              </label>
              <input
                type="password"
                placeholder="Kosongkan jika tidak ingin mengubah password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Minimal 6 karakter kombinasi huruf dan angka.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Catatan Khusus / Biodata Singkat
              </label>
              <textarea
                rows={2}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-xs transition-all"
              >
                Simpan Perubahan Profil
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MODAL: TAMBAH MURID BARU OLEH GURU */}
      {/* ======================================================== */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8 relative border border-amber-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center font-black">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Daftarkan Murid Baru
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Otomatis ditugaskan ke Guru: {teacher.namaLengkap}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap Siswa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ananda Kevin Pratama"
                  value={newStudentNama}
                  onChange={(e) => setNewStudentNama(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenjang</label>
                  <select
                    value={newStudentJenjang}
                    onChange={(e) => setNewStudentJenjang(e.target.value as EducationLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="TK">TK / Calistung</option>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kelas 4 SD"
                    value={newStudentKelas}
                    onChange={(e) => setNewStudentKelas(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Asal Sekolah</label>
                <input
                  type="text"
                  placeholder="Contoh: SD Mentari Bangsa"
                  value={newStudentSekolah}
                  onChange={(e) => setNewStudentSekolah(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Orang Tua</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ibu Ratna"
                    value={newStudentOrtu}
                    onChange={(e) => setNewStudentOrtu(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. WhatsApp Wali</label>
                  <input
                    type="text"
                    placeholder="Contoh: 087879069404"
                    value={newStudentNomorOrtu}
                    onChange={(e) => setNewStudentNomorOrtu(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    placeholder="Contoh: Matematika & IPA"
                    value={newStudentMapel}
                    onChange={(e) => setNewStudentMapel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jadwal Les</label>
                  <input
                    type="text"
                    placeholder="Contoh: Senin & Kamis"
                    value={newStudentHari}
                    onChange={(e) => setNewStudentHari(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Foto Siswa / Pas Foto (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... atau tautan foto siswa"
                  value={newStudentFoto}
                  onChange={(e) => setNewStudentFoto(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Anda dapat menyertakan tautan foto siswa untuk profil bimbingan.
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:text-slate-900 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs"
                >
                  Simpan & Daftarkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODAL: GANTI AKUN GURU (SWITCH TEACHER) */}
      {/* ======================================================== */}
      {isSwitchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 my-8 relative border border-amber-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Pilih Akun Guru Lain
                </h3>
              </div>
              <button
                onClick={() => setIsSwitchModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {allTeachers.map((tch) => {
                const isCurrent = tch.id === teacher.id;
                return (
                  <button
                    key={tch.id}
                    onClick={() => {
                      onSwitchTeacher(tch.id);
                      setIsSwitchModalOpen(false);
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'bg-amber-50 border-amber-400 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">
                          {tch.namaLengkap}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        @{tch.username} · {tch.areaDomisili}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Compass, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  GraduationCap, 
  Clock, 
  Phone, 
  Send, 
  ShieldCheck, 
  Calculator, 
  HelpCircle, 
  Users, 
  FileCheck, 
  Calendar, 
  ChevronRight, 
  Check, 
  Laptop, 
  HeartHandshake, 
  Star,
  MapPin,
  MessageCircle,
  FileText
} from 'lucide-react';
import { EducationLevel, StudentData, TeacherSettings } from '../types/report';

interface InstitutionViewProps {
  settings: TeacherSettings;
  onRegisterStudent?: (student: StudentData) => void;
  onGoToReportForm?: () => void;
  initialSection?: 'all' | 'vision' | 'packages' | 'calculator' | 'register' | 'faq';
}

export interface CoursePackage {
  id: string;
  name: string;
  category: string;
  level: EducationLevel | 'Semua Jenjang';
  tagline: string;
  pricePerSession: number;
  duration: string;
  popular?: boolean;
  highlightBadge?: string;
  description: string;
  features: string[];
  subjects: string[];
  accentColor: string;
}

export const COURSE_PACKAGES: CoursePackage[] = [
  {
    id: 'calistung-ceria',
    name: 'Paket Calistung Ceria & Fondasi',
    category: 'Pendidikan Anak Usia Dini',
    level: 'TK',
    tagline: 'Membangun Minat Belajar & Kemandirian Sejak Dini',
    pricePerSession: 75000,
    duration: '60 - 75 Menit / Sesi',
    popular: true,
    highlightBadge: 'Paling Diminati Ortu TK',
    description: 'Metode belajar interaktif bermain sambil belajar yang dirancang khusus untuk usia prasekolah dan kelas awal SD agar anak senang membaca, menulis, dan berhitung tanpa rasa tertekan.',
    features: [
      'Pengenalan huruf fonik & suku kata cepat tanggap',
      'Latihan motorik halus & menulis huruf/angka rapi',
      'Pengenalan logika matematika konkrit & bercerita',
      'Laporan perkembangan motorik & fokus per sesi',
      'Stiker motivasi & lembar aktivitas bergambar gratis'
    ],
    subjects: ['Calistung (Membaca, Menulis, Berhitung)', 'Pengenalan Bahasa Inggris Dasar', 'Pendidikan Karakter Santun'],
    accentColor: 'from-amber-500 to-orange-500'
  },
  {
    id: 'reguler-sd',
    name: 'Paket Reguler Juara SD',
    category: 'Sekolah Dasar',
    level: 'SD',
    tagline: 'Kuasai Pelajaran Sekolah & Sukses Ulangan Harian',
    pricePerSession: 80000,
    duration: '90 Menit / Sesi',
    popular: true,
    highlightBadge: 'Rekomendasi Utama',
    description: 'Bimbingan privat intensif tatap muka langsung di rumah siswa untuk mendampingi pemahaman konsep, penyelesaian PR harian, serta persiapan menghadapi Penilaian Tengah dan Akhir Semester (PTS/PAS).',
    features: [
      'Pendampingan tuntas PR & tugas sekolah setiap hari',
      'Penjelasan konsep dasar Matematika & Sains sampai paham',
      'Latihan soal formatif & persiapan Penilaian Harian',
      'Rapor evaluasi digital resmi (1 lembar A4) ke WA ortu',
      'Jadwal belajar fleksibel sore / malam hari'
    ],
    subjects: ['Matematika', 'IPAS (IPA & IPS)', 'Bahasa Indonesia', 'Bahasa Inggris', 'Pendidikan Pancasila'],
    accentColor: 'from-emerald-600 to-teal-600'
  },
  {
    id: 'prestasi-smp',
    name: 'Paket Bintang Prestasi SMP',
    category: 'Sekolah Menengah Pertama',
    level: 'SMP',
    tagline: 'Fondasi Kuat Menuju SMA Favorit & Asesmen Nasional',
    pricePerSession: 95000,
    duration: '90 Menit / Sesi',
    description: 'Bimbingan terstruktur yang menitikberatkan pada penguasaan penalaran analitis, penyelesaian soal-soal HOTS (Higher Order Thinking Skills), dan persiapan Asesmen Nasional Berbasis Komputer (ANBK).',
    features: [
      'Drilling soal bertingkat dari dasar hingga tipe olimpiade/HOTS',
      'Rumus praktis & cara cepat penyelesaian soal eksak',
      'Bimbingan belajar tatap muka privat 1-on-1 tanpa distraksi',
      'Konsultasi tugas proyek kurikulum merdeka & karya ilmiah',
      'Evaluasi skor pemahaman materi akurat per pertemuan'
    ],
    subjects: ['Matematika SMP', 'IPA Terpadu (Fisika & Biologi)', 'Bahasa Inggris Grammar & Conversation', 'IPS & Bahasa Indonesia'],
    accentColor: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'intensif-sma',
    name: 'Paket Unggulan SMA & SNBT',
    category: 'Sekolah Menengah Atas',
    level: 'SMA',
    tagline: 'Raih Nilai Rapor Tinggi & Tembus PTN Impian',
    pricePerSession: 120000,
    duration: '90 - 100 Menit / Sesi',
    highlightBadge: 'Eksklusif & Mendalam',
    description: 'Program persiapan akademis berstandar tinggi bagi siswa SMA/SMK untuk memantapkan pemahaman mata pelajaran peminatan IPA/IPS serta persiapan matang tes penalaran skolastik UTBK SNBT.',
    features: [
      'Tutor ahli spesialis mata pelajaran jurusan',
      'Bedah tuntas soal UTBK SNBT & Ujian Mandiri PTN',
      'Strategi manajemen waktu pengerjaan soal ujian nasional',
      'Konsultasi pemilihan jurusan & pemetaan minat karier',
      'Laporan performa analitik kemajuan belajar berkala'
    ],
    subjects: ['Matematika Peminatan / Lanjut', 'Fisika & Kimia', 'Biologi', 'Ekonomi & Akuntansi', 'Penalaran Matematika SNBT'],
    accentColor: 'from-purple-600 to-indigo-700'
  },
  {
    id: 'komputer-tik',
    name: 'Paket Keahlian TIK & Komputer',
    category: 'Keterampilan Digital',
    level: 'Semua Jenjang',
    tagline: 'Literasi Digital Praktis untuk Masa Depan Digital',
    pricePerSession: 90000,
    duration: '90 Menit / Sesi',
    highlightBadge: 'Skill Abad 21',
    description: 'Kursus privat komputer praktis dengan praktik langsung di laptop siswa. Membekali anak dengan keahlian aplikasi perkantoran, mengetik cepat 10 jari, desain grafis dasar, hingga pengenalan coding ramah anak.',
    features: [
      'Praktik 100% langsung (Hands-on) di laptop/komputer',
      'Kuasai Microsoft Word, Excel (Rumus & Tabel), dan PowerPoint',
      'Pelatihan mengetik 10 jari cepat dan tepat',
      'Pengenalan internet sehat & keamanan data pribadi anak',
      'Dokumentasi portofolio hasil karya digital siswa'
    ],
    subjects: ['Microsoft Office Terapan', 'Dasar Komputer & Windows', 'Logika Pemrograman Dasar (Scratch)', 'Desain Kanvas Kreatif'],
    accentColor: 'from-amber-600 to-rose-600'
  },
  {
    id: 'privat-sibling',
    name: 'Paket Hemat Privat Keluarga (Sibling)',
    category: 'Solusi Keluarga',
    level: 'Semua Jenjang',
    tagline: '1 Tutor untuk 2 Bersaudara, Lebih Hemat & Nyaman',
    pricePerSession: 125000,
    duration: '90 - 120 Menit / Sesi',
    highlightBadge: 'Pilihan Keluarga Cerdas',
    description: 'Solusi hemat bagi orang tua yang memiliki 2 anak (kakak & adik). Tutor mendampingi kedua anak sekaligus di rumah secara bergantian atau bersamaan dengan kurikulum individual masing-masing.',
    features: [
      'Tarif hemat khusus 2 anak sekaligus dalam 1 kunjungan',
      'Laporan belajar terpisah dan individual untuk setiap anak',
      'Menghemat waktu orang tua tanpa perlu mengantar anak ke tempat les',
      'Suasana belajar akrab dan menyenangkan di rumah sendiri',
      'Jadwal sesi dapat disesuaikan dengan waktu luang keluarga'
    ],
    subjects: ['Gabungan Jenjang TK, SD, maupun SMP', 'Semua Mata Pelajaran Pokok'],
    accentColor: 'from-emerald-700 to-teal-800'
  }
];

export const InstitutionView: React.FC<InstitutionViewProps> = ({
  settings,
  onRegisterStudent,
  onGoToReportForm,
  initialSection = 'all',
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'vision' | 'packages' | 'calculator' | 'register' | 'faq'>(initialSection);

  React.useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);
  
  // Interactive Fee Calculator State
  const [calcLevel, setCalcLevel] = useState<EducationLevel>('SD');
  const [calcSessionsPerWeek, setCalcSessionsPerWeek] = useState<number>(2);
  const [calcDuration, setCalcDuration] = useState<'90_menit' | '120_menit'>('90_menit');

  // Direct Online Registration Form State
  const [regForm, setRegForm] = useState({
    namaSiswa: '',
    panggilan: '',
    jenjang: 'SD' as EducationLevel,
    kelasGrade: 'Kelas 4',
    sekolah: '',
    namaOrangTua: '',
    nomorOrangTua: '',
    alamat: '',
    mataPelajaran: 'Matematika & IPAS',
    paketPilihan: 'Paket Reguler Juara SD',
    hariLes: 'Senin & Kamis',
    jamLes: '15.30 - 17.00 WIB',
    catatanKhusus: ''
  });
  const [regSuccess, setRegSuccess] = useState(false);

  // Price matrix for calculator
  const baseTariff: Record<EducationLevel, number> = {
    'TK': 75000,
    'SD': 80000,
    'SMP': 95000,
    'SMA': 120000,
    'Umum/PAUD': 85000
  };

  const currentRate = baseTariff[calcLevel] * (calcDuration === '120_menit' ? 1.3 : 1.0);
  const totalSessionsMonth = calcSessionsPerWeek * 4;
  const estimatedMonthlyFee = currentRate * totalSessionsMonth;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.namaSiswa.trim() || !regForm.namaOrangTua.trim()) {
      alert('Mohon lengkapi Nama Siswa dan Nama Orang Tua.');
      return;
    }

    const newStudentData: StudentData = {
      id: `STU-${Date.now()}`,
      namaSiswa: regForm.namaSiswa.trim(),
      panggilan: regForm.panggilan.trim() || undefined,
      jenjang: regForm.jenjang,
      kelasGrade: regForm.kelasGrade.trim(),
      sekolah: regForm.sekolah.trim() || undefined,
      namaOrangTua: regForm.namaOrangTua.trim(),
      nomorOrangTua: regForm.nomorOrangTua.trim() || undefined,
      alamat: regForm.alamat.trim() || undefined,
      mataPelajaran: `${regForm.paketPilihan} (${regForm.mataPelajaran})`,
      hariLes: regForm.hariLes.trim(),
      jamLes: regForm.jamLes.trim(),
      namaPengajar: settings.namaPengajar || 'Deni Santoso, M.M',
      status: 'Aktif',
      catatanKhusus: regForm.catatanKhusus.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    if (onRegisterStudent) {
      onRegisterStudent(newStudentData);
    }

    setRegSuccess(true);
  };

  const handleConsultWhatsApp = (packageName?: string) => {
    const targetPhone = (settings.nomorWA || '6281234567890').replace(/[^0-9]/g, '');
    const pkgText = packageName ? `tentang *${packageName}*` : 'mengenai program les privat Dessa Mentari Education';
    const text = encodeURIComponent(
      `Halo Admin Dessa Mentari Education,\n\nSaya ingin berkonsultasi ${pkgText} untuk putra/putri saya.\nBisa mohon info jadwal tutor yang tersedia dan biaya lesnya?\n\nTerima kasih!`
    );
    window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-10 pb-16">
      {/* 1. HERO INSTITUTION BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white shadow-xl border-2 border-amber-500/30">
        {/* Glow and watermark background */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-orange-600/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Logo Emblem */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-white p-3 shadow-2xl flex items-center justify-center border-4 border-amber-400/90 ring-4 ring-amber-500/20">
                <img
                  src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
                  alt="Dessa Mentari Education"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider border border-white shadow-md">
                RESMI
              </span>
            </div>

            {/* Title & Tagline */}
            <div className="text-center md:text-left space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-bold tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Lembaga Kursus & Bimbingan Belajar Privat Terpercaya</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-serif-brand tracking-tight">
                DESSA MENTARI EDUCATION
              </h1>

              <p className="text-base sm:text-lg text-amber-200/90 font-medium">
                Tempat Belajar Terpercaya · Les Privat Keluarga Indonesia
              </p>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Menyediakan layanan bimbingan belajar privat datang ke rumah (*in-home private tutoring*) serta pendampingan belajar online interaktif untuk jenjang TK, SD, SMP, SMA, hingga kursus keahlian TIK & Komputer dengan metode ramah keluarga.
              </p>

              {/* Quick Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={() => {
                    setActiveSection('register');
                    const el = document.getElementById('daftar-siswa-baru');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 hover:scale-[1.02]"
                >
                  <GraduationCap className="w-4 h-4 text-slate-950" />
                  <span>Daftar Siswa Baru</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection('packages');
                    const el = document.getElementById('paket-bimbingan');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span>Pilihan Paket Les</span>
                </button>

                <button
                  onClick={() => handleConsultWhatsApp()}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-200" />
                  <span>Konsultasi WA</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Stats Bar */}
        <div className="border-t border-white/15 bg-slate-950/70 px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="space-y-0.5">
            <span className="text-xl sm:text-2xl font-black text-amber-400">1-on-1</span>
            <p className="text-[11px] text-slate-300 font-medium">Privat Personal di Rumah</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-xl sm:text-2xl font-black text-emerald-400">100%</span>
            <p className="text-[11px] text-slate-300 font-medium">Laporan Hasil Sesi Resmi</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-xl sm:text-2xl font-black text-amber-300">TK s.d SMA</span>
            <p className="text-[11px] text-slate-300 font-medium">Semua Jenjang & TIK</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-xl sm:text-2xl font-black text-orange-400">Fleksibel</span>
            <p className="text-[11px] text-slate-300 font-medium">Bebas Reschedule Jadwal</p>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION PILLS FOR SECTIONS */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'all', label: 'Semua Informasi' },
          { id: 'vision', label: 'Visi & Misi Lembaga' },
          { id: 'packages', label: 'Katalog Paket Les' },
          { id: 'calculator', label: 'Simulasi Biaya' },
          { id: 'register', label: 'Pendaftaran Siswa Baru' },
          { id: 'faq', label: 'Keunggulan & FAQ' }
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id as any)}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 border ${
              activeSection === sec.id
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* 3. VISI & MISI LEMBAGA */}
      {(activeSection === 'all' || activeSection === 'vision') && (
        <div id="visi-misi" className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Landasan Filosofis Lembaga
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif-brand">
              Visi & Misi Dessa Mentari Education
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Komitmen kami dalam menghadirkan pendampingan belajar terbaik yang mengedepankan kualitas akademis, integritas moral, dan kedekatan emosional dengan keluarga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* VISI BOX */}
            <div className="md:col-span-5 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-md relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
                <Target className="w-52 h-52 text-white" />
              </div>
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest font-black text-amber-200 block">
                    Visi Utama
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-serif-brand text-white mt-1">
                    Mencetak Generasi Cerdas, Mandiri & Berkarakter Mulia
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-medium">
                  "Menjadi lembaga pendidikan non-formal dan bimbingan belajar privat terdepan, terpercaya, dan ramah keluarga di Indonesia yang membantu setiap anak menemukan potensi terbaiknya melalui pendekatan belajar yang menyenangkan, berkarakter, dan berkesinambungan."
                </p>
              </div>

              <div className="pt-6 border-t border-white/20 text-[11px] text-amber-100/90 font-mono">
                DESSA MENTARI EDUCATION · SEJAK 2026
              </div>
            </div>

            {/* MISI BOX */}
            <div className="md:col-span-7 bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-amber-600" />
                  <span className="text-xs uppercase tracking-widest font-extrabold text-slate-800">
                    5 Misi Strategis Lembaga
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif-brand">
                  Langkah Nyata Pendampingan Belajar Kami
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-black flex items-center justify-center shrink-0 text-xs">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900 block font-bold">Pendekatan Belajar Personal (Personalized Learning)</strong>
                    <span className="text-slate-500 text-xs">
                      Menyesuaikan tempo dan metode mengajar sesuai keunikan, daya tangkap, dan gaya belajar masing-masing anak.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-black flex items-center justify-center shrink-0 text-xs">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900 block font-bold">Pendidik Berdedikasi & Terverifikasi</strong>
                    <span className="text-slate-500 text-xs">
                      Menghadirkan tutor yang berpendidikan tinggi, sabar, komunikatif, dan memiliki etika pengajaran ramah anak.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-black flex items-center justify-center shrink-0 text-xs">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-900 block font-bold">Transparansi Laporan & Rapor Sesi Resmi</strong>
                    <span className="text-slate-500 text-xs">
                      Memberikan laporan perkembangan komprehensif (1 lembar PDF & foto) kepada orang tua di setiap akhir sesi les.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-black flex items-center justify-center shrink-0 text-xs">
                    4
                  </span>
                  <div>
                    <strong className="text-slate-900 block font-bold">Penguatan Karakter, Disiplin & Rasa Percaya Diri</strong>
                    <span className="text-slate-500 text-xs">
                      Tidak hanya mengejar nilai angka, namun membiasakan anak menyukai proses belajar dan berani mencoba hal baru.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-black flex items-center justify-center shrink-0 text-xs">
                    5
                  </span>
                  <div>
                    <strong className="text-slate-900 block font-bold">Kemitraan Erat dengan Orang Tua Siswa</strong>
                    <span className="text-slate-500 text-xs">
                      Membina komunikasi terbuka dua arah demi keselarasan bimbingan antara rumah dan pendamping les privat.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NILAI UTAMA (CORE VALUES) */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-center text-xs font-black uppercase tracking-wider text-slate-500 mb-4">
              Nilai Utama Lembaga · Nilai Luhur DME STARS
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                <span className="text-base font-black text-amber-800 block">D - Dedikasi</span>
                <span className="text-[11px] text-slate-600">Bimbingan tulus & sepenuh hati</span>
              </div>
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
                <span className="text-base font-black text-emerald-800 block">M - Mandiri</span>
                <span className="text-[11px] text-slate-600">Melatih nalar & pemecahan masalah</span>
              </div>
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
                <span className="text-base font-black text-blue-800 block">E - Empati</span>
                <span className="text-[11px] text-slate-600">Paham karakter & emosi anak</span>
              </div>
              <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200">
                <span className="text-base font-black text-purple-800 block">S - Sinergi</span>
                <span className="text-[11px] text-slate-600">Kolaborasi tutor & orang tua</span>
              </div>
              <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 col-span-2 sm:col-span-1">
                <span className="text-base font-black text-rose-800 block">T - Terpercaya</span>
                <span className="text-[11px] text-slate-600">Integritas & profesional</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. KATALOG PAKET KURSUS PRIVAT */}
      {(activeSection === 'all' || activeSection === 'packages') && (
        <div id="paket-bimbingan" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Pilihan Program & Kurikulum
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif-brand">
              Katalog Paket Kursus & Les Privat
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Pilih paket bimbingan yang sesuai dengan jenjang dan target prestasi anak Anda. Tutor datang langsung ke rumah dengan protokol belajar yang nyaman.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSE_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between overflow-hidden relative group"
              >
                {/* Header Strip with Accent */}
                <div className={`h-2.5 bg-gradient-to-r ${pkg.accentColor} w-full`}></div>

                <div className="p-5 sm:p-6 space-y-4 flex-1">
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {pkg.category}
                    </span>
                    {pkg.highlightBadge && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 border border-amber-500 shadow-2xs">
                        ★ {pkg.highlightBadge}
                      </span>
                    )}
                  </div>

                  {/* Name & Tagline */}
                  <div>
                    <h3 className="text-lg font-black text-slate-900 font-serif-brand group-hover:text-amber-800 transition-colors">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-amber-800 font-medium mt-0.5">
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Price Tag */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Tarif Mulai Dari</span>
                      <span className="text-xl font-black text-slate-900">
                        Rp {pkg.pricePerSession.toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs text-slate-500"> / sesi</span>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {pkg.duration}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Subjects Pill */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 block">Fokus Materi:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.subjects.map((sub, sIdx) => (
                        <span key={sIdx} className="text-[10.5px] font-semibold bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200/60">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-700 block">Fasilitas Bimbingan:</span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {pkg.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setRegForm(prev => ({
                        ...prev,
                        jenjang: pkg.level === 'Semua Jenjang' ? 'SD' : pkg.level,
                        paketPilihan: pkg.name
                      }));
                      setActiveSection('register');
                      const el = document.getElementById('daftar-siswa-baru');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-2xs text-center flex items-center justify-center gap-1"
                  >
                    <span>Daftar Paket</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleConsultWhatsApp(pkg.name)}
                    title="Konsultasi Paket via WhatsApp"
                    className="p-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-2xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. INTERACTIVE CALCULATOR (SIMULASI BIAYA LES) */}
      {(activeSection === 'all' || activeSection === 'calculator') && (
        <div id="simulasi-biaya" className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-serif-brand">
                Kalkulator Estimasi Biaya Les Privat
              </h3>
              <p className="text-xs text-slate-500">
                Hitung perkiraan biaya bulanan berdasarkan jenjang dan frekuensi pertemuan yang diinginkan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Input Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Pilih Jenjang Pendidikan Siswa:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['TK', 'SD', 'SMP', 'SMA', 'Umum/PAUD'] as EducationLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCalcLevel(lvl)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        calcLevel === lvl
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Frekuensi Belajar Per Minggu:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCalcSessionsPerWeek(num)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        calcSessionsPerWeek === num
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {num}x / Minggu
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. Durasi Per Sesi:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCalcDuration('90_menit')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      calcDuration === '90_menit'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Standar (90 Menit)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcDuration('120_menit')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      calcDuration === '120_menit'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Intensif (120 Menit)
                  </button>
                </div>
              </div>
            </div>

            {/* Result Preview Box */}
            <div className="p-6 bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-2xl border border-amber-500/30 space-y-4 shadow-md">
              <span className="text-[11px] uppercase tracking-wider text-amber-300 font-extrabold block">
                Rangkuman Simulasi Les
              </span>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Jenjang:</span>
                  <strong className="text-white font-bold">{calcLevel}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Tarif / Sesi:</span>
                  <strong className="text-white font-bold">Rp {currentRate.toLocaleString('id-ID')}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Jumlah Sesi Sebulan:</span>
                  <strong className="text-white font-bold">~{totalSessionsMonth} Sesi ({calcSessionsPerWeek}x/pekan)</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-white/15">
                <span className="text-xs text-amber-200 block">Perkiraan Biaya Bulanan:</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-serif-brand">
                  Rp {estimatedMonthlyFee.toLocaleString('id-ID')}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  *Bisa dibayar di akhir bulan atau per termin sesuai kebijakan lembaga.
                </span>
              </div>

              <button
                onClick={() => {
                  const phone = (settings.nomorWA || '6281234567890').replace(/[^0-9]/g, '');
                  const text = encodeURIComponent(
                    `Halo Admin Dessa Mentari Education,\n\nSaya ingin mendaftar bimbingan les privat dengan simulasi berikut:\n- Jenjang: ${calcLevel}\n- Frekuensi: ${calcSessionsPerWeek}x / minggu\n- Durasi: ${calcDuration === '90_menit' ? '90 Menit' : '120 Menit'}\n- Estimasi biaya: Rp ${estimatedMonthlyFee.toLocaleString('id-ID')} / bulan\n\nMohon info ketersediaan tutor dan jadwal.\nTerima kasih!`
                  );
                  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Hasil Simulasi ke WA Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. ONLINE DIRECT REGISTRATION FORM */}
      {(activeSection === 'all' || activeSection === 'register') && (
        <div id="daftar-siswa-baru" className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-slate-100 pb-4 text-center sm:text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Pendaftaran Online Resmi
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif-brand mt-2">
              Formulir Pendaftaran Siswa Baru
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Daftarkan putra/putri Anda secara langsung. Data otomatis tersimpan di sistem lembaga dan admin kami akan segera menghubungi Anda untuk konfirmasi jadwal.
            </p>
          </div>

          {regSuccess ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-2xs">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-emerald-950 font-serif-brand">
                  Pendaftaran Berhasil Dikirim!
                </h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto mt-1">
                  Data calon siswa <strong>{regForm.namaSiswa}</strong> telah terdaftar di database Dessa Mentari Education.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    const phone = (settings.nomorWA || '6281234567890').replace(/[^0-9]/g, '');
                    const text = encodeURIComponent(
                      `Halo Admin Dessa Mentari Education,\n\nSaya telah mengisi formulir pendaftaran online:\n- Nama Siswa: ${regForm.namaSiswa}\n- Jenjang & Kelas: ${regForm.jenjang} (${regForm.kelasGrade})\n- Nama Orang Tua: ${regForm.namaOrangTua}\n- Paket: ${regForm.paketPilihan}\n- Jadwal Diinginkan: ${regForm.hariLes} (${regForm.jamLes})\n\nMohon konfirmasi jadwal tutor ya, terima kasih!`
                    );
                    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Konfirmasi via WhatsApp Sekarang</span>
                </button>

                <button
                  onClick={() => {
                    setRegSuccess(false);
                    setRegForm({
                      namaSiswa: '',
                      panggilan: '',
                      jenjang: 'SD',
                      kelasGrade: 'Kelas 4',
                      sekolah: '',
                      namaOrangTua: '',
                      nomorOrangTua: '',
                      alamat: '',
                      mataPelajaran: 'Matematika & IPAS',
                      paketPilihan: 'Paket Reguler Juara SD',
                      hariLes: 'Senin & Kamis',
                      jamLes: '15.30 - 17.00 WIB',
                      catatanKhusus: ''
                    });
                  }}
                  className="px-4 py-2.5 bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  Daftar Siswa Lain
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.namaSiswa}
                    onChange={(e) => setRegForm({ ...regForm, namaSiswa: e.target.value })}
                    placeholder="Contoh: Kevin Pratama"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    value={regForm.panggilan}
                    onChange={(e) => setRegForm({ ...regForm, panggilan: e.target.value })}
                    placeholder="Contoh: Kevin"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jenjang Pendidikan *
                  </label>
                  <select
                    value={regForm.jenjang}
                    onChange={(e) => setRegForm({ ...regForm, jenjang: e.target.value as EducationLevel })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="TK">TK / PAUD</option>
                    <option value="SD">SD (Sekolah Dasar)</option>
                    <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                    <option value="SMA">SMA / SMK (Sekolah Menengah Atas)</option>
                    <option value="Umum/PAUD">Umum / Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kelas / Grade Saat Ini
                  </label>
                  <input
                    type="text"
                    value={regForm.kelasGrade}
                    onChange={(e) => setRegForm({ ...regForm, kelasGrade: e.target.value })}
                    placeholder="Contoh: Kelas 2 SD / Kelas 8 SMP"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Asal Sekolah
                  </label>
                  <input
                    type="text"
                    value={regForm.sekolah}
                    onChange={(e) => setRegForm({ ...regForm, sekolah: e.target.value })}
                    placeholder="Contoh: SD Negeri 01 Mentari"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Paket Bimbingan yang Dipilih
                  </label>
                  <select
                    value={regForm.paketPilihan}
                    onChange={(e) => setRegForm({ ...regForm, paketPilihan: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    {COURSE_PACKAGES.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Orang Tua / Wali *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.namaOrangTua}
                    onChange={(e) => setRegForm({ ...regForm, namaOrangTua: e.target.value })}
                    placeholder="Contoh: Ibu Rina / Bpk. Santoso"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp Orang Tua *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regForm.nomorOrangTua}
                    onChange={(e) => setRegForm({ ...regForm, nomorOrangTua: e.target.value })}
                    placeholder="Contoh: 081234567890"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Lengkap / Wilayah Rumah (Untuk Jadwal Datang ke Rumah)
                  </label>
                  <textarea
                    rows={2}
                    value={regForm.alamat}
                    onChange={(e) => setRegForm({ ...regForm, alamat: e.target.value })}
                    placeholder="Contoh: Jl. Mentari No. 12, Kel. Harapan, Kec. Makmur (Patokan dekat Masjid Al-Ikhlas)"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferensi Hari Les
                  </label>
                  <input
                    type="text"
                    value={regForm.hariLes}
                    onChange={(e) => setRegForm({ ...regForm, hariLes: e.target.value })}
                    placeholder="Contoh: Senin & Kamis / Selasa & Jumat"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferensi Jam Belajar
                  </label>
                  <input
                    type="text"
                    value={regForm.jamLes}
                    onChange={(e) => setRegForm({ ...regForm, jamLes: e.target.value })}
                    placeholder="Contoh: 15.30 - 17.00 WIB / 19.00 WIB"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catatan Khusus / Kendala Belajar Anak (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={regForm.catatanKhusus}
                    onChange={(e) => setRegForm({ ...regForm, catatanKhusus: e.target.value })}
                    placeholder="Contoh: Anak agak pemalu, butuh bantuan perkalian dan pembagian matematika..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Formulir Pendaftaran</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 7. KEUNGGULAN LEMBAGA & FAQ */}
      {(activeSection === 'all' || activeSection === 'faq') && (
        <div id="faq-section" className="space-y-8">
          {/* 4 Steps to Success */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Alur Mudah & Transparan
              </span>
              <h3 className="text-2xl font-black text-slate-900 font-serif-brand">
                4 Langkah Mudah Memulai Les Privat
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">
                  1
                </span>
                <strong className="text-sm font-bold text-slate-900 block">Konsultasi Kebutuhan</strong>
                <p className="text-xs text-slate-600">
                  Diskusikan jenjang, kendala belajar anak, dan target nilai yang ingin dicapai secara gratis.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                  2
                </span>
                <strong className="text-sm font-bold text-slate-900 block">Penentuan Tutor & Jadwal</strong>
                <p className="text-xs text-slate-600">
                  Kami mencocokkan tutor pendamping yang ramah dan kompeten sesuai jadwal luang anak Anda.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                  3
                </span>
                <strong className="text-sm font-bold text-slate-900 block">Sesi Belajar Nyaman</strong>
                <p className="text-xs text-slate-600">
                  Tutor datang ke rumah atau belajar interaktif daring dengan suasana yang hangat dan fokus.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2">
                <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-sm flex items-center justify-center">
                  4
                </span>
                <strong className="text-sm font-bold text-slate-900 block">Laporan Sesi Berkala</strong>
                <p className="text-xs text-slate-600">
                  Orang tua menerima laporan evaluasi resmi 1 lembar PDF & foto dokumentasi setiap selesai sesi.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-serif-brand">
                  Pertanyaan yang Sering Diajukan (FAQ)
                </h3>
                <p className="text-xs text-slate-500">
                  Jawaban atas pertanyaan umum seputar layanan bimbingan les privat Dessa Mentari Education.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <strong className="text-slate-900 font-bold block flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Apakah tutor datang langsung ke rumah siswa?
                </strong>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Ya! Layanan utama kami adalah bimbingan tatap muka langsung di rumah siswa (*in-home tutoring*) agar anak merasa tenang dan orang tua dapat memantau dengan mudah. Kami juga menyediakan opsi les online interaktif jika diinginkan.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <strong className="text-slate-900 font-bold block flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Bagaimana jika anak berhalangan hadir atau sakit?
                </strong>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Kami memiliki kebijakan *Reschedule Fleksibel*. Cukup beri tahu tutor atau admin minimal 2-3 jam sebelum jadwal sesi, dan sesi belajar dapat dijadwalkan ulang tanpa biaya hangus.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <strong className="text-slate-900 font-bold block flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Kapan dan bagaimana sistem pembayaran les?
                </strong>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Sistem pembayaran sangat fleksibel dan transparan. Rekapan tagihan dikirimkan secara otomatis di awal atau akhir bulan melalui invoice digital dengan rincian kehadiran yang jelas.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <strong className="text-slate-900 font-bold block flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Bisakah berganti fokus mata pelajaran saat ujian?
                </strong>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Sangat bisa! Misalnya jika biasanya bimbingan Matematika, namun besoknya siswa ada ulangan IPAS atau Bahasa Inggris, sesi les dapat dialihkan untuk persiapan ulangan tersebut.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. FOOTER CONTACT CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 sm:p-10 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-300">
              Layanan Konsultasi Buka Setiap Hari
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-serif-brand">
            Mari Wujudkan Prestasi Terbaik Putra/Putri Anda Bersama Kami
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Dessa Mentari Education siap menjadi mitra terpercaya keluarga Anda dalam mendidik dan membimbing anak.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => handleConsultWhatsApp()}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-slate-950" />
            <span>Chat WhatsApp Admin</span>
          </button>

          {onGoToReportForm && (
            <button
              onClick={onGoToReportForm}
              className="w-full sm:w-auto px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Masuk Portal Admin</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

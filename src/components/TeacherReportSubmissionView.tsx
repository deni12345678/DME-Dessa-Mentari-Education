import React, { useState, useEffect } from 'react';
import { 
  ReportData, 
  StudentData, 
  TeacherData, 
  EducationLevel, 
  SubjectOption, 
  AttendanceStatus,
  CardTheme 
} from '../types/report';
import { 
  FileText, 
  User, 
  Calendar, 
  Clock, 
  BookOpen, 
  Award, 
  Star, 
  CheckCircle2, 
  Send, 
  RotateCcw, 
  Sparkles, 
  GraduationCap, 
  Camera, 
  Upload, 
  X, 
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowRight
} from 'lucide-react';
import { compressImageFile } from '../utils/imageCompressor';

interface TeacherReportSubmissionViewProps {
  students: StudentData[];
  teachers: TeacherData[];
  onSaveReport: (report: ReportData) => void;
  onGoToRecap?: (studentName?: string) => void;
  currentTeacherName?: string;
}

const COMMON_SUBJECTS: SubjectOption[] = [
  'Matematika',
  'IPAS (Ilmu Pengetahuan Alam & Sosial)',
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

const PRESET_EVALUATIONS = [
  'Siswa sangat aktif dan antusias selama sesi belajar berlangsung.',
  'Mampu memahami konsep dasar materi dengan cepat dan tepat.',
  'Dapat menyelesaikan latihan soal cerita secara mandiri.',
  'Fokus belajar sangat baik, konsentrasi terjaga sepanjang 90 menit.',
  'Perlu sedikit pengulangan latihan berhitung di rumah agar lebih lancar.',
  'Menunjukkan peningkatan kepercayaan diri yang sangat baik dalam menjawab soal.'
];

export const TeacherReportSubmissionView: React.FC<TeacherReportSubmissionViewProps> = ({
  students,
  teachers,
  onSaveReport,
  onGoToRecap,
  currentTeacherName
}) => {
  // Form Fields
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [namaSiswa, setNamaSiswa] = useState<string>('');
  const [jenjang, setJenjang] = useState<EducationLevel>('SD');
  const [kelasGrade, setKelasGrade] = useState<string>('Kelas 4 SD');
  const [namaPengajar, setNamaPengajar] = useState<string>(
    currentTeacherName || (teachers.length > 0 ? teachers[0].namaLengkap : 'Sarah Syahidah Syahrudin, S.Pd')
  );
  const [sesiKe, setSesiKe] = useState<number>(1);
  const [tanggal, setTanggal] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [waktuDurasi, setWaktuDurasi] = useState<string>('90 Menit (15.30 - 17.00 WIB)');
  const [mataPelajaran, setMataPelajaran] = useState<string>('Matematika');
  const [statusKehadiran, setStatusKehadiran] = useState<AttendanceStatus>('Hadir');

  // Qualitative & Quantitative Indicators
  const [pemahamanScale, setPemahamanScale] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [skorPemahaman, setSkorPemahaman] = useState<number>(85);
  const [skorKeaktifan, setSkorKeaktifan] = useState<number>(90);
  const [skorFokus, setSkorFokus] = useState<number>(85);

  // Content
  const [materiDipelajari, setMateriDipelajari] = useState<string>('');
  const [evaluasiSiswa, setEvaluasiSiswa] = useState<string>('');
  const [tugasRumah, setTugasRumah] = useState<string>('');
  const [catatanOrangTua, setCatatanOrangTua] = useState<string>('');
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedReport, setLastSubmittedReport] = useState<ReportData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync qualitative star scale with numerical score default
  const handleScaleChange = (scale: 1 | 2 | 3 | 4 | 5) => {
    setPemahamanScale(scale);
    switch (scale) {
      case 1:
        setSkorPemahaman(55);
        break;
      case 2:
        setSkorPemahaman(68);
        break;
      case 3:
        setSkorPemahaman(78);
        break;
      case 4:
        setSkorPemahaman(88);
        break;
      case 5:
        setSkorPemahaman(96);
        break;
    }
  };

  // When a student is selected from the dropdown
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    const found = students.find((s) => s.id === studentId);
    if (found) {
      setNamaSiswa(found.namaSiswa);
      setJenjang(found.jenjang);
      if (found.kelasGrade) setKelasGrade(found.kelasGrade);
      if (found.namaPengajar) setNamaPengajar(found.namaPengajar);
      if (found.mataPelajaran) {
        const firstMapel = found.mataPelajaran.split('&')[0].trim();
        setMataPelajaran(firstMapel);
      }
    }
  };

  // Handle Photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 1024, 0.7);
        setFotoBase64(compressed);
      } catch (err) {
        console.error("Gagal compress foto:", err);
      }
    }
  };

  // Reset form
  const handleReset = () => {
    setSelectedStudentId('');
    setNamaSiswa('');
    setMateriDipelajari('');
    setEvaluasiSiswa('');
    setTugasRumah('');
    setCatatanOrangTua('');
    setFotoBase64(null);
    setSesiKe((prev) => prev + 1);
    setErrorMessage(null);
    setLastSubmittedReport(null);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!namaSiswa.trim()) {
      setErrorMessage('Pilih siswa atau masukkan nama siswa yang diajar.');
      return;
    }

    if (!materiDipelajari.trim()) {
      setErrorMessage('Isi topik atau materi yang dipelajari pada sesi hari ini.');
      return;
    }

    if (!evaluasiSiswa.trim()) {
      setErrorMessage('Tuliskan catatan evaluasi perkembangan siswa pada pertemuan ini.');
      return;
    }

    setIsSubmitting(true);

    const reportId = `RPT-${Date.now()}`;
    const newReport: ReportData = {
      id: reportId,
      namaSiswa: namaSiswa.trim(),
      namaPengajar: namaPengajar.trim(),
      tanggal,
      waktuDurasi: waktuDurasi.trim(),
      jenjang,
      kelasGrade: kelasGrade.trim(),
      mataPelajaran,
      statusKehadiran,
      sesiKe,
      pemahamanScale,
      skorPemahaman,
      skorKeaktifan,
      skorFokus,
      materiDipelajari: materiDipelajari.trim(),
      evaluasiSiswa: evaluasiSiswa.trim(),
      tugasRumah: tugasRumah.trim(),
      catatanOrangTua: catatanOrangTua.trim(),
      fotoDokumentasi: fotoBase64 ? [
        {
          id: `FTO-${Date.now()}`,
          url: fotoBase64,
          caption: `Sesi ${sesiKe} - ${materiDipelajari.slice(0, 40)}`,
          namaSiswa: namaSiswa.trim(),
          tanggal,
          namaPengajar: namaPengajar.trim(),
          mataPelajaran
        }
      ] : [],
      theme: 'solar',
      createdAt: new Date().toISOString()
    };

    try {
      onSaveReport(newReport);
      setLastSubmittedReport(newReport);
    } catch (err) {
      setErrorMessage('Terjadi kendala saat menyimpan laporan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper text for qualitative scale
  const getScaleLabel = (scale: number) => {
    switch (scale) {
      case 5:
        return 'Sangat Memuaskan (Istimewa / A+)';
      case 4:
        return 'Baik & Antusias (A)';
      case 3:
        return 'Cukup Baik (B)';
      case 2:
        return 'Kurang Memahami (C)';
      case 1:
        return 'Perlu Pendampingan Khusus (D)';
      default:
        return 'Baik';
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* 1. HEADER SECTION */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full border border-white/20 inline-block">
              Portal Guru · Input Selesai Mengajar
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-serif-brand">
              Laporan Pertemuan Les Privat
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
              Isi hasil bimbingan belajar setiap kali selesai mengajar. Data otomatis tersinkronisasi 
              ke dashboard admin untuk rekapan berkala orang tua murid.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/20 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-amber-100 block">Guru Pengampu</span>
            <span className="text-sm font-bold text-white truncate max-w-[180px] block">{namaPengajar}</span>
          </div>
        </div>
      </div>

      {/* 2. SUCCESS CARD AFTER SUBMISSION */}
      {lastSubmittedReport && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-950 font-serif-brand">
                Laporan Sesi {lastSubmittedReport.sesiKe} Berhasil Dikirim & Tersinkronisasi!
              </h3>
              <p className="text-xs text-emerald-800">
                Laporan bimbingan untuk <strong>{lastSubmittedReport.namaSiswa}</strong> telah tersimpan di sistem cloud Dessa Mentari Education.
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-emerald-200 text-xs space-y-1.5 text-slate-700">
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Mata Pelajaran & Materi:</span>
              <span className="font-bold text-slate-900">{lastSubmittedReport.mataPelajaran} - {lastSubmittedReport.materiDipelajari}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Tingkat Pemahaman:</span>
              <span className="font-bold text-emerald-700">{lastSubmittedReport.skorPemahaman}% ({getScaleLabel(lastSubmittedReport.pemahamanScale || 4)})</span>
            </div>
            {lastSubmittedReport.tugasRumah && (
              <div className="flex justify-between">
                <span className="text-slate-500">PR Siswa:</span>
                <span className="font-semibold text-slate-900">{lastSubmittedReport.tugasRumah}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Input Sesi Pertemuan Lain</span>
            </button>

            {onGoToRecap && (
              <button
                type="button"
                onClick={() => onGoToRecap(lastSubmittedReport.namaSiswa)}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-2"
              >
                <span>Buka Dashboard Rekapan Orang Tua</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. MAIN INPUT FORM */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 font-serif-brand">
              Formulir Laporan Pertemuan
            </h2>
            <p className="text-xs text-slate-500">
              Lengkapi data di bawah ini seusai sesi mengajar selesai.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Sesi Ke-{sesiKe}
          </span>
        </div>

        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION A: DATA SISWA & JADWAL PERTEMUAN */}
          <div className="space-y-4">
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-600" />
              <span>1. Data Siswa & Waktu Sesi</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Dropdown Siswa Terdaftar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilih Siswa Les Privat <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">-- Pilih Siswa Terdaftar --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.namaSiswa} ({s.jenjang} - {s.kelasGrade || 'Kelas Aktif'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Input Nama Manual jika belum terdaftar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={namaSiswa}
                  onChange={(e) => setNamaSiswa(e.target.value)}
                  placeholder="Contoh: Ananda Kevin Pratama"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Jenjang */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Jenjang & Kelas
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={jenjang}
                    onChange={(e) => setJenjang(e.target.value as EducationLevel)}
                    className="w-full px-2 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="TK">TK</option>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                    <option value="Umum/PAUD">PAUD/Umum</option>
                  </select>
                  <input
                    type="text"
                    value={kelasGrade}
                    onChange={(e) => setKelasGrade(e.target.value)}
                    placeholder="Kelas 4 SD"
                    className="w-full px-2.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Sesi Ke- */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pertemuan (Sesi Ke-) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={sesiKe}
                  onChange={(e) => setSesiKe(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Tanggal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tanggal Pertemuan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Durasi & Jam */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Waktu & Durasi Les
                </label>
                <input
                  type="text"
                  value={waktuDurasi}
                  onChange={(e) => setWaktuDurasi(e.target.value)}
                  placeholder="90 Menit (15.30 - 17.00)"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Guru Pengampu */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Guru Pengampu
                </label>
                <select
                  value={namaPengajar}
                  onChange={(e) => setNamaPengajar(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.namaLengkap}>
                      {t.namaLengkap} {t.gelar || ''}
                    </option>
                  ))}
                  <option value="Deni Santoso, M.M">Deni Santoso, M.M</option>
                  <option value="Sarah Syahidah Syahrudin, S.Pd">Sarah Syahidah Syahrudin, S.Pd</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION B: MATERI & INDIKATOR PEMAHAMAN */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>2. Materi & Evaluasi Pemahaman Siswa</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Mapel */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mata Pelajaran <span className="text-rose-500">*</span>
                </label>
                <select
                  value={mataPelajaran}
                  onChange={(e) => setMataPelajaran(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {COMMON_SUBJECTS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Status Kehadiran */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Status Kehadiran Siswa
                </label>
                <select
                  value={statusKehadiran}
                  onChange={(e) => setStatusKehadiran(e.target.value as AttendanceStatus)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Hadir">Hadir Penuh (Normal)</option>
                  <option value="Reschedule / Disingkat">Reschedule / Jadwal Ulang</option>
                  <option value="Izin / Sakit">Izin / Sakit</option>
                </select>
              </div>

              {/* Indikator Pemahaman Skala 1-5 Bintang */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Indikator Pemahaman (Skala 1 - 5)
                </label>
                <div className="flex items-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleScaleChange(star as 1 | 2 | 3 | 4 | 5)}
                      className={`p-1.5 rounded-xl transition-all ${
                        pemahamanScale >= star
                          ? 'text-amber-500 hover:scale-110'
                          : 'text-slate-300 hover:text-slate-400'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-900 ml-1">
                    {pemahamanScale}/5
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold block">
                  {getScaleLabel(pemahamanScale)}
                </span>
              </div>
            </div>

            {/* Topik Materi Hari Ini */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Topik / Materi Pembelajaran Hari Ini <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={materiDipelajari}
                onChange={(e) => setMateriDipelajari(e.target.value)}
                placeholder="Contoh: Operasi hitung pecahan campuran, penjumlahan desimal, dan latihan 5 soal cerita."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />
            </div>

            {/* Catatan Perkembangan & Evaluasi Sesi */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Catatan Perkembangan & Evaluasi Sesi Guru <span className="text-rose-500">*</span>
              </label>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                <span className="text-[10px] text-slate-400 font-bold self-center">Saran Cepat:</span>
                {PRESET_EVALUATIONS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setEvaluasiSiswa((prev) => prev ? `${prev} ${preset}` : preset);
                    }}
                    className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-lg transition-colors border border-slate-200"
                  >
                    + {preset.slice(0, 32)}...
                  </button>
                ))}
              </div>

              <textarea
                required
                rows={3}
                value={evaluasiSiswa}
                onChange={(e) => setEvaluasiSiswa(e.target.value)}
                placeholder="Jelaskan secara ringkas respon siswa, ketelitian, dan bagian mana yang telah dikuasai maupun butuh bimbingan."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />
            </div>

            {/* Tugas Rumah & Catatan Orang Tua */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tugas Rumah / PR Siswa (Jika Ada)
                </label>
                <input
                  type="text"
                  value={tugasRumah}
                  onChange={(e) => setTugasRumah(e.target.value)}
                  placeholder="Contoh: Buku Paket Hal. 24 No. 1 - 5"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pesan Khusus untuk Orang Tua Murid
                </label>
                <input
                  type="text"
                  value={catatanOrangTua}
                  onChange={(e) => setCatatanOrangTua(e.target.value)}
                  placeholder="Contoh: Mohon Ananda dibantu mengulang hafalan rumus luas segitiga ya Bund."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Upload Foto Dokumentasi Opsional */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Foto Dokumentasi Belajar (Opsional)</span>
                <span className="text-[11px] text-slate-400 font-normal">Maks. 1 foto per sesi</span>
              </label>

              {fotoBase64 ? (
                <div className="relative inline-block border-2 border-amber-300 rounded-2xl overflow-hidden shadow-xs">
                  <img src={fotoBase64} alt="Dokumentasi Sesi" className="w-36 h-28 object-cover" />
                  <button
                    type="button"
                    onClick={() => setFotoBase64(null)}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full hover:bg-rose-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-amber-50 hover:border-amber-400 text-xs font-bold text-slate-700 transition-colors">
                  <Camera className="w-4 h-4 text-amber-600" />
                  <span>Ambil Foto atau Upload Dokumentasi</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Reset Input
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Mengirim Laporan...' : 'Kirim Laporan Pembelajaran & Sinkronkan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

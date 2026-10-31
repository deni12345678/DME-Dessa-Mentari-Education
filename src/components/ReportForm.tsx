import React, { useState } from 'react';
import { 
  ReportData, 
  EducationLevel, 
  SubjectOption, 
  AttendanceStatus, 
  CardTheme,
  StudentData 
} from '../types/report';
import { 
  User, 
  BookOpen, 
  FileText, 
  Sparkles, 
  Wand2,
  PlusCircle,
  TrendingUp,
  Award,
  Target,
  UserCheck,
  GraduationCap,
  Camera,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { compressImageFile } from '../utils/imageCompressor';

interface ReportFormProps {
  report: ReportData;
  onChange: (updated: Partial<ReportData>) => void;
  onOpenAiAssistant: () => void;
  registeredStudents?: StudentData[];
}

const EDUCATION_LEVELS: EducationLevel[] = ['TK', 'SD', 'SMP', 'SMA', 'Umum/PAUD'];

const SUBJECT_OPTIONS: SubjectOption[] = [
  'Matematika',
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
  'Ekonomi / Akuntansi',
];

const PRESET_TEACHERS = [
  'Deni Santoso, M.M',
  'Sarah Syahidah Syahrudin, S.Pd'
];

const PRESET_EVALUATIONS = [
  'Sangat aktif dan antusias mengikuti sesi.',
  'Dapat memahami konsep materi dengan cepat.',
  'Fokus belajar sangat baik sepanjang sesi les.',
  'Perlu memperbanyak latihan soal di rumah.',
  'Perlu peningkatan ketelitian saat menghitung.',
  'Mampu menyelesaikan latihan soal dengan mandiri.',
];

const THEME_OPTIONS: { id: CardTheme; label: string; color: string }[] = [
  { id: 'solar', label: 'Mentari Amber', color: 'bg-amber-500' },
  { id: 'emerald', label: 'Emerald Teal', color: 'bg-emerald-600' },
  { id: 'navy', label: 'Royal Navy', color: 'bg-slate-900' },
  { id: 'pastel', label: 'Pastel Lavender', color: 'bg-purple-600' },
  { id: 'dark', label: 'Modern Dark', color: 'bg-zinc-900 border border-amber-400' },
];

export const ReportForm: React.FC<ReportFormProps> = ({
  report,
  onChange,
  onOpenAiAssistant,
  registeredStudents = [],
}) => {
  const [isCustomTeacher, setIsCustomTeacher] = useState(() => {
    return !!report.namaPengajar && !PRESET_TEACHERS.includes(report.namaPengajar);
  });

  const handleSelectRegisteredStudent = (s: StudentData) => {
    onChange({
      namaSiswa: s.namaSiswa,
      jenjang: s.jenjang,
      ...(s.kelasGrade ? { kelasGrade: s.kelasGrade } : {}),
      ...(s.namaPengajar ? { namaPengajar: s.namaPengajar } : {}),
      ...(s.mataPelajaran ? { mataPelajaran: s.mataPelajaran } : {}),
    });
  };

  const handleAddPresetEval = (presetText: string) => {
    const current = report.evaluasiSiswa || '';
    if (!current) {
      onChange({ evaluasiSiswa: presetText });
    } else if (!current.includes(presetText)) {
      onChange({ evaluasiSiswa: `${current.trim()}\n- ${presetText}` });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 space-y-6">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-serif-brand flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-600" />
            <span>Formulir Input Laporan (Input oleh Admin)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Isi data sesi les siswa atas nama pengajar terkait. Tersimpan otomatis ke Database Cloud.
          </p>
        </div>
        
        {/* Theme Picker */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {THEME_OPTIONS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange({ theme: t.id })}
              title={t.label}
              className={`w-6 h-6 rounded-lg ${t.color} transition-all ${
                report.theme === t.id
                  ? 'ring-2 ring-offset-1 ring-slate-800 scale-110 shadow-xs'
                  : 'opacity-60 hover:opacity-100'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 1. IDENTITAS SISWA & PENGASUH */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <User className="w-4 h-4 text-amber-500" />
          Identitas Pembelajaran
        </h3>

        {/* Nama Pengajar Selector (Preset Buttons) */}
        <div className="bg-amber-50/50 border border-amber-200/80 p-3.5 rounded-xl space-y-2">
          <label className="block text-xs font-bold text-amber-900 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-amber-600" />
            Pilih Nama Pengajar / Tutor <span className="text-red-500">*</span>
          </label>
          
          <div className="flex flex-wrap gap-2">
            {PRESET_TEACHERS.map((teacher) => (
              <button
                key={teacher}
                type="button"
                onClick={() => {
                  setIsCustomTeacher(false);
                  onChange({ namaPengajar: teacher });
                }}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition-all border flex items-center gap-1.5 ${
                  !isCustomTeacher && report.namaPengajar === teacher
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-amber-400 hover:bg-amber-100/50'
                }`}
              >
                <span>{teacher}</span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setIsCustomTeacher(true);
                if (PRESET_TEACHERS.includes(report.namaPengajar)) {
                  onChange({ namaPengajar: '' });
                }
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all border ${
                isCustomTeacher
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-amber-400'
              }`}
            >
              + Pengajar Lain
            </button>
          </div>

          {/* Custom Teacher Text Input if needed */}
          {isCustomTeacher && (
            <input
              type="text"
              value={report.namaPengajar}
              onChange={(e) => onChange({ namaPengajar: e.target.value })}
              placeholder="Masukkan Nama Pengajar & Gelar..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none mt-2 bg-white"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nama Siswa */}
          <div className="sm:col-span-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Nama Siswa <span className="text-red-500">*</span>
              </label>
              {registeredStudents.some((s) => s.namaSiswa.toLowerCase() === report.namaSiswa.toLowerCase()) && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  ✓ Siswa Terdaftar
                </span>
              )}
            </div>

            <input
              type="text"
              value={report.namaSiswa}
              onChange={(e) => onChange({ namaSiswa: e.target.value })}
              placeholder="Contoh: Ananda Kevin Pratama"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />

            {/* Quick Registered Student Selector */}
            {registeredStudents.length > 0 && (
              <div className="pt-1">
                <span className="text-[10px] font-medium text-slate-400 block mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-amber-600" />
                  Pilih Cepat dari Siswa Terdaftar:
                </span>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {registeredStudents.slice(0, 6).map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleSelectRegisteredStudent(st)}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-all ${
                        report.namaSiswa.toLowerCase() === st.namaSiswa.toLowerCase()
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs font-bold'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-amber-100 hover:text-amber-900'
                      }`}
                    >
                      {st.panggilan || st.namaSiswa} ({st.jenjang})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tanggal Pembelajaran */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tanggal Pembelajaran <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={report.tanggal}
              onChange={(e) => onChange({ tanggal: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </div>

          {/* Kelas / Grade (Optional) */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kelas / Grade <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <input
              type="text"
              value={report.kelasGrade || ''}
              onChange={(e) => onChange({ kelasGrade: e.target.value })}
              placeholder="Contoh: Kelas 4 SD, TK B, 9 SMP"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Jenjang Education & Subject */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Jenjang Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jenjang Pendidikan <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {EDUCATION_LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onChange({ jenjang: lvl })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    report.jenjang === lvl
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Mata Pelajaran */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mata Pelajaran <span className="text-red-500">*</span>
            </label>
            <select
              value={report.mataPelajaran}
              onChange={(e) => onChange({ mataPelajaran: e.target.value as SubjectOption })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white transition-all"
            >
              {SUBJECT_OPTIONS.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Waktu & Kehadiran */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Waktu Durasi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Durasi / Jam Sesi
            </label>
            <input
              type="text"
              value={report.waktuDurasi}
              onChange={(e) => onChange({ waktuDurasi: e.target.value })}
              placeholder="Contoh: 90 Menit (15.30 - 17.00 WIB)"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </div>

          {/* Status Kehadiran */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status Kehadiran
            </label>
            <select
              value={report.statusKehadiran}
              onChange={(e) => onChange({ statusKehadiran: e.target.value as AttendanceStatus })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white transition-all"
            >
              <option value="Hadir">Hadir</option>
              <option value="Reschedule / Disingkat">Reschedule / Disingkat</option>
              <option value="Izin / Sakit">Izin / Sakit</option>
            </select>
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* METRIK GRAFIK NILAI & KEAKTIFAN (FOR CHART.JS) */}
      <div className="space-y-3 bg-amber-50/60 border border-amber-200/80 p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            Metrik Evaluasi Grafik (0 - 100)
          </h3>
          <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md font-medium">
            Ditampilkan di Grafik Chart.js
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Skor Pemahaman */}
          <div className="bg-white p-3 rounded-xl border border-amber-200/60 shadow-2xs">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span className="flex items-center gap-1 text-amber-900">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                Pemahaman
              </span>
              <span className="font-bold text-amber-700">{report.skorPemahaman ?? 85}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              step="5"
              value={report.skorPemahaman ?? 85}
              onChange={(e) => onChange({ skorPemahaman: parseInt(e.target.value, 10) })}
              className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Skor Keaktifan */}
          <div className="bg-white p-3 rounded-xl border border-amber-200/60 shadow-2xs">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span className="flex items-center gap-1 text-emerald-900">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Keaktifan
              </span>
              <span className="font-bold text-emerald-700">{report.skorKeaktifan ?? 90}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              step="5"
              value={report.skorKeaktifan ?? 90}
              onChange={(e) => onChange({ skorKeaktifan: parseInt(e.target.value, 10) })}
              className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Skor Fokus */}
          <div className="bg-white p-3 rounded-xl border border-amber-200/60 shadow-2xs">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span className="flex items-center gap-1 text-indigo-900">
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                Fokus Belajar
              </span>
              <span className="font-bold text-indigo-700">{report.skorFokus ?? 85}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              step="5"
              value={report.skorFokus ?? 85}
              onChange={(e) => onChange({ skorFokus: parseInt(e.target.value, 10) })}
              className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 2. DETAIL LAPORAN PEMBELAJARAN */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-amber-500" />
          Detail Laporan Pembelajaran
        </h3>

        {/* Materi Dipelajari */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Materi yang Dipelajari Hari Ini <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={report.materiDipelajari}
            onChange={(e) => onChange({ materiDipelajari: e.target.value })}
            placeholder="Tuliskan bab/topik materi (misal: Perkalian Pecahan, Vocabulary Unit 3, Latihan Berhitung 1-20)..."
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
          />
        </div>

        {/* Perkembangan & Evaluasi Siswa */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Perkembangan / Evaluasi Siswa <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={onOpenAiAssistant}
              className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              Bantu Polesan Evaluasi AI
            </button>
          </div>

          <textarea
            rows={4}
            value={report.evaluasiSiswa}
            onChange={(e) => onChange({ evaluasiSiswa: e.target.value })}
            placeholder="Tuliskan catatan pemahaman, keaktifan, dan fokus siswa..."
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
          />

          {/* Preset Quick Chips */}
          <div className="mt-2.5">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">
              Catatan Cepat Presets (Klik untuk menambahkan):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_EVALUATIONS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddPresetEval(preset)}
                  className="text-[11px] text-slate-600 bg-slate-100 hover:bg-amber-100 hover:text-amber-800 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 border border-slate-200"
                >
                  <PlusCircle className="w-3 h-3 text-slate-400" />
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PR / Tugas Rumah (Opsional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            PR / Tugas Rumah <span className="text-slate-400 font-normal">(Opsional)</span>
          </label>
          <input
            type="text"
            value={report.tugasRumah || ''}
            onChange={(e) => onChange({ tugasRumah: e.target.value })}
            placeholder="Contoh: Mengerjakan Halaman 25 No. 1 - 5 di Buku Latihan"
            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
          />
        </div>

        {/* Catatan untuk Orang Tua (Opsional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Catatan Khusus untuk Orang Tua <span className="text-slate-400 font-normal">(Opsional)</span>
          </label>
          <input
            type="text"
            value={report.catatanOrangTua || ''}
            onChange={(e) => onChange({ catatanOrangTua: e.target.value })}
            placeholder="Contoh: Mohon Ananda dibantu mengulang hafalan perkalian 7 di rumah ya Bund."
            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
          />
        </div>

        {/* 📷 DOKUMENTASI FOTO KEGIATAN LES */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-amber-600" />
              <span>Dokumentasi Foto Kegiatan Les</span>
              <span className="text-[10px] text-amber-700 bg-amber-100 font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                {(report.fotoDokumentasi || []).length} / 6 Foto
              </span>
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">Opsional</span>
          </div>

          <p className="text-xs text-slate-500">
            Unggah foto pembelajaran siswa (kegiatan les, hasil latihan, praktikum). Kompresi otomatis web-optimized.
          </p>

          {/* Photo File Upload Trigger */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <label className="px-3.5 py-2 text-xs font-bold text-amber-950 bg-amber-300 hover:bg-amber-200 cursor-pointer rounded-xl transition-all shadow-2xs flex items-center gap-1.5 active:scale-95">
              <Upload className="w-3.5 h-3.5" />
              <span>+ Pilih / Ambil Foto</span>
              <input
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                className="hidden"
                onChange={async (e) => {
                  if (!e.target.files) return;
                  const files = Array.from(e.target.files);
                  const newItems = [];
                  for (const file of files) {
                    try {
                      const compressedUrl = await compressImageFile(file);
                      newItems.push({
                        id: `IMG-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                        url: compressedUrl,
                        caption: `Dokumentasi Les ${report.mataPelajaran || ''}`,
                        namaSiswa: report.namaSiswa,
                        tanggal: report.tanggal,
                        namaPengajar: report.namaPengajar,
                        createdAt: new Date().toISOString()
                      });
                    } catch (err) {
                      console.error('Failed to compress photo:', err);
                    }
                  }
                  const currentPhotos = report.fotoDokumentasi || [];
                  onChange({ fotoDokumentasi: [...currentPhotos, ...newItems].slice(0, 6) });
                  e.target.value = '';
                }}
              />
            </label>
          </div>

          {/* Photo Grid Preview & Caption Input */}
          {(report.fotoDokumentasi || []).length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {(report.fotoDokumentasi || []).map((photo, idx) => (
                <div key={photo.id || idx} className="relative group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                  <div className="aspect-4/3 w-full bg-slate-100 overflow-hidden relative">
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Foto Dokumentasi'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const filtered = (report.fotoDokumentasi || []).filter((_, i) => i !== idx);
                        onChange({ fotoDokumentasi: filtered });
                      }}
                      className="absolute top-1.5 right-1.5 p-1 bg-slate-900/80 hover:bg-red-600 text-white rounded-full transition-colors shadow-xs"
                      title="Hapus foto"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-2">
                    <input
                      type="text"
                      value={photo.caption || ''}
                      onChange={(e) => {
                        const updatedList = [...(report.fotoDokumentasi || [])];
                        updatedList[idx] = { ...updatedList[idx], caption: e.target.value };
                        onChange({ fotoDokumentasi: updatedList });
                      }}
                      placeholder="Judul / Keterangan foto..."
                      className="w-full text-[11px] p-1 rounded border border-slate-200 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

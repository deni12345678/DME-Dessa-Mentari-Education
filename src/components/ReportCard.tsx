import React from 'react';
import { ReportData, CardTheme, CardLayout } from '../types/report';
import { 
  Sun, 
  BookOpen, 
  User, 
  Clock, 
  Award,
  FileText,
  MessageSquareQuote,
  Target,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Check,
  Sparkles,
  Zap
} from 'lucide-react';

interface ReportCardProps {
  report: ReportData;
}

const themeStyles: Record<CardTheme, {
  headerBg: string;
  headerText: string;
  subText: string;
  goldAccent: string;
  badgeBg: string;
  badgeBorder: string;
  cardBorder: string;
  outerBorder: string;
  sectionHeaderBg: string;
  sectionHeaderText: string;
  sectionBorder: string;
  tableHeaderBg: string;
  metricBarBg: string;
  footerBg: string;
  footerText: string;
}> = {
  solar: {
    headerBg: 'bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950',
    headerText: 'text-amber-100',
    subText: 'text-amber-300/80',
    goldAccent: 'border-amber-500/40 text-amber-600',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    badgeBorder: 'border-amber-200',
    cardBorder: 'border-amber-200/90',
    outerBorder: 'border-amber-600/30',
    sectionHeaderBg: 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent',
    sectionHeaderText: 'text-amber-950',
    sectionBorder: 'border-amber-500/30',
    tableHeaderBg: 'bg-amber-50/70 text-amber-950',
    metricBarBg: 'bg-amber-500',
    footerBg: 'bg-slate-950 text-amber-100/90',
    footerText: 'text-amber-200/70',
  },
  emerald: {
    headerBg: 'bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950',
    headerText: 'text-emerald-100',
    subText: 'text-emerald-300/80',
    goldAccent: 'border-emerald-500/40 text-emerald-600',
    badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    badgeBorder: 'border-emerald-200',
    cardBorder: 'border-emerald-200/90',
    outerBorder: 'border-emerald-600/30',
    sectionHeaderBg: 'bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent',
    sectionHeaderText: 'text-emerald-950',
    sectionBorder: 'border-emerald-500/30',
    tableHeaderBg: 'bg-emerald-50/70 text-emerald-950',
    metricBarBg: 'bg-emerald-600',
    footerBg: 'bg-slate-950 text-emerald-100/90',
    footerText: 'text-emerald-200/70',
  },
  navy: {
    headerBg: 'bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900',
    headerText: 'text-indigo-100',
    subText: 'text-indigo-300/80',
    goldAccent: 'border-indigo-500/40 text-indigo-600',
    badgeBg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    badgeBorder: 'border-indigo-200',
    cardBorder: 'border-indigo-200/90',
    outerBorder: 'border-indigo-600/30',
    sectionHeaderBg: 'bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-transparent',
    sectionHeaderText: 'text-indigo-950',
    sectionBorder: 'border-indigo-500/30',
    tableHeaderBg: 'bg-indigo-50/70 text-indigo-950',
    metricBarBg: 'bg-indigo-600',
    footerBg: 'bg-slate-950 text-indigo-100/90',
    footerText: 'text-indigo-200/70',
  },
  pastel: {
    headerBg: 'bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900',
    headerText: 'text-purple-100',
    subText: 'text-purple-300/80',
    goldAccent: 'border-purple-500/40 text-purple-600',
    badgeBg: 'bg-purple-50 text-purple-900 border-purple-200',
    badgeBorder: 'border-purple-200',
    cardBorder: 'border-purple-200/90',
    outerBorder: 'border-purple-600/30',
    sectionHeaderBg: 'bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent',
    sectionHeaderText: 'text-purple-950',
    sectionBorder: 'border-purple-500/30',
    tableHeaderBg: 'bg-purple-50/70 text-purple-950',
    metricBarBg: 'bg-purple-600',
    footerBg: 'bg-slate-950 text-purple-100/90',
    footerText: 'text-purple-200/70',
  },
  dark: {
    headerBg: 'bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950',
    headerText: 'text-amber-200',
    subText: 'text-amber-400/80',
    goldAccent: 'border-amber-500/40 text-amber-400',
    badgeBg: 'bg-zinc-800 text-amber-300 border-amber-500/40',
    badgeBorder: 'border-amber-500/40',
    cardBorder: 'border-amber-500/30',
    outerBorder: 'border-amber-500/40',
    sectionHeaderBg: 'bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent',
    sectionHeaderText: 'text-amber-300',
    sectionBorder: 'border-amber-500/40',
    tableHeaderBg: 'bg-zinc-800 text-amber-300',
    metricBarBg: 'bg-amber-500',
    footerBg: 'bg-zinc-950 text-amber-100',
    footerText: 'text-amber-400/60',
  },
};

function getScorePredicate(score: number): { label: string; color: string; badge: string } {
  if (score >= 90) return { label: 'Amat Baik (A)', color: 'text-emerald-700', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
  if (score >= 75) return { label: 'Baik (B)', color: 'text-blue-700', badge: 'bg-blue-50 text-blue-800 border-blue-200' };
  if (score >= 60) return { label: 'Cukup (C)', color: 'text-amber-700', badge: 'bg-amber-50 text-amber-800 border-amber-200' };
  return { label: 'Perlu Bimbingan (D)', color: 'text-rose-700', badge: 'bg-rose-50 text-rose-800 border-rose-200' };
}

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const layout: CardLayout = report.cardLayout || 'elegant';
  const t = themeStyles[report.theme || 'solar'];
  const isDark = report.theme === 'dark';

  const formattedDate = report.tanggal 
    ? new Date(report.tanggal).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'Tanggal Belum Dipilih';

  const rawDate = report.tanggal || new Date().toISOString().split('T')[0];
  const yearCode = rawDate.split('-')[0] || '2026';
  const cleanId = (report.id || 'RPT').replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase();
  const serialNo = `DME-EVL/${yearCode}/${cleanId || '0101'}`;

  const pemahamanScore = report.skorPemahaman ?? 85;
  const keaktifanScore = report.skorKeaktifan ?? 90;
  const fokusScore = report.skorFokus ?? 85;

  const pemahamanPred = getScorePredicate(pemahamanScore);
  const keaktifanPred = getScorePredicate(keaktifanScore);
  const fokusPred = getScorePredicate(fokusScore);

  // ==========================================
  // 1. MINIMALIST LAYOUT (CLEAN SCANDINAVIAN)
  // ==========================================
  if (layout === 'minimalist') {
    return (
      <div
        id="report-card-container"
        className="w-full max-w-[760px] mx-auto rounded-xl shadow-lg overflow-hidden border border-slate-300 bg-white text-slate-800 transition-all font-sans print:border-none print:shadow-none print:max-w-none print:w-full"
        style={{ boxSizing: 'border-box' }}
      >
        {/* Minimalist Top Hairline */}
        <div className="h-1 w-full bg-slate-900"></div>

        {/* Clean Header */}
        <div className="p-6 bg-slate-50/70 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-lg bg-white p-1.5 shadow-2xs border border-slate-200 flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
                  alt="Logo"
                  crossOrigin="anonymous"
                  loading="eager"
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                  Lembaga Bimbingan Belajar Privat
                </span>
                <h1 className="text-xl font-black tracking-tight text-slate-900 font-serif-brand">
                  Dessa Mentari Education
                </h1>
                <p className="text-xs text-slate-500">
                  Tempat Belajar Terpercaya · Les Privat Keluarga Indonesia
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 border-slate-200 pt-2 sm:pt-0 w-full sm:w-auto">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                {serialNo}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                {formattedDate}
              </p>
            </div>
          </div>
        </div>

        {/* Minimalist Body Content */}
        <div className="p-4 sm:p-5 space-y-3.5 bg-white">
          {/* Identity Grid */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/40 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Siswa</span>
                <span className="font-extrabold text-slate-900 text-sm">{report.namaSiswa || 'Kevin Pratama'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Jenjang & Kelas</span>
                <span className="font-bold text-slate-800">{report.jenjang} {report.kelasGrade ? `(${report.kelasGrade})` : ''}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Mata Pelajaran</span>
                <span className="font-bold text-slate-900">{report.mataPelajaran || 'Matematika'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Waktu / Status</span>
                <span className="font-semibold text-slate-700">{report.waktuDurasi || '90 Menit'} · {report.statusKehadiran}</span>
              </div>
            </div>
          </div>

          {/* Minimalist Metrics Table */}
          <div className="p-3 rounded-lg border border-slate-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Indikator Capaian Belajar (Skala 0 - 100%)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Pemahaman Materi</span>
                  <span className="font-mono font-bold">{pemahamanScore}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-800 h-full rounded-full" style={{ width: `${pemahamanScore}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">{pemahamanPred.label}</span>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Keaktifan Belajar</span>
                  <span className="font-mono font-bold">{keaktifanScore}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-800 h-full rounded-full" style={{ width: `${keaktifanScore}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">{keaktifanPred.label}</span>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Fokus & Konsentrasi</span>
                  <span className="font-mono font-bold">{fokusScore}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-800 h-full rounded-full" style={{ width: `${fokusScore}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">{fokusPred.label}</span>
              </div>
            </div>
          </div>

          {/* Materi */}
          <div className="p-3.5 rounded-lg border border-slate-200">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Materi & Pokok Bahasan
            </span>
            <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
              {report.materiDipelajari || 'Rincian topik sesi les.'}
            </div>
          </div>

          {/* Evaluasi */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Evaluasi Perkembangan Siswa
            </span>
            <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
              {report.evaluasiSiswa || 'Observasi hasil sesi belajar.'}
            </div>
          </div>

          {/* Homework & Note */}
          {(report.tugasRumah || report.catatanOrangTua) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {report.tugasRumah && (
                <div className="p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">PR / Tugas Rumah</span>
                  <div className="text-slate-800 whitespace-pre-line leading-relaxed">{report.tugasRumah}</div>
                </div>
              )}
              {report.catatanOrangTua && (
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/40">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Catatan Orang Tua</span>
                  <div className="text-slate-700 italic leading-relaxed">"{report.catatanOrangTua}"</div>
                </div>
              )}
            </div>
          )}

          {/* Documentation Photos if available */}
          {report.fotoDokumentasi && report.fotoDokumentasi.length > 0 && (
            <div className="p-3 rounded-lg border border-slate-200">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Dokumentasi Pembelajaran ({report.fotoDokumentasi.length} Foto)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {report.fotoDokumentasi.map((photo, idx) => (
                  <div key={photo.id || idx} className="rounded border border-slate-200 overflow-hidden">
                    <img src={photo.url} alt="" className="w-full aspect-4/3 object-cover" crossOrigin="anonymous" />
                    <div className="p-1 text-[8px] text-slate-600 truncate">{photo.caption || 'Dokumentasi Sesi'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Minimalist Endorsement */}
          <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-4 items-end text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Validasi Dokumen</span>
              <span className="text-[11px] font-semibold text-slate-700 block">Dessa Mentari Education</span>
              <span className="text-[9.5px] text-slate-400 italic">Mengetahui Orang Tua / Wali Siswa</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tutor Pendamping</span>
              <p className="font-extrabold text-slate-900 text-xs border-b border-slate-300 pb-0.5 inline-block min-w-[130px]">
                {report.namaPengajar || 'Pengajar DME'}
              </p>
              <span className="text-[9px] text-slate-400 block mt-0.5">[ Terverifikasi Digital ]</span>
            </div>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="px-5 py-2 bg-slate-100 text-slate-500 text-[9px] border-t border-slate-200 flex justify-between">
          <span>© 2026 Dessa Mentari Education</span>
          <span>Lembar Evaluasi Resmi · {serialNo}</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. BOLD LAYOUT (HIGH IMPACT & VIBRANT)
  // ==========================================
  if (layout === 'bold') {
    return (
      <div
        id="report-card-container"
        className="w-full max-w-[760px] mx-auto rounded-xl shadow-2xl overflow-hidden border-2 border-slate-900 bg-white text-slate-900 transition-all font-sans print:border-none print:shadow-none print:max-w-none print:w-full"
        style={{ boxSizing: 'border-box' }}
      >
        {/* Bold Accent Header Strip */}
        <div className="h-2 w-full bg-amber-500"></div>

        {/* High Contrast Header */}
        <div className="bg-slate-950 p-5 sm:p-6 text-white relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-xl bg-amber-400 p-2 shadow-lg flex items-center justify-center shrink-0 border-2 border-white">
                <img
                  src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
                  alt="Logo"
                  crossOrigin="anonymous"
                  loading="eager"
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>

              <div>
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                  LAPORAN HASIL BELAJAR RESMI
                </span>
                <h1 className="text-2xl font-black tracking-tight text-white font-serif-brand mt-1">
                  DESSA MENTARI EDUCATION
                </h1>
                <p className="text-xs font-semibold text-amber-300">
                  Tempat Belajar Terpercaya · Les Privat Keluarga Indonesia
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-amber-500/50 p-2.5 rounded-xl text-right shrink-0">
              <div className="flex items-center gap-1.5 justify-end text-amber-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>TERVALIDASI</span>
              </div>
              <span className="font-mono text-[11px] text-white font-bold block mt-0.5">{serialNo}</span>
              <span className="text-[10px] text-slate-400 block">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Bold Body */}
        <div className="p-4 sm:p-5 space-y-3.5 bg-slate-50">
          {/* Identity Card Block */}
          <div className="bg-white p-3.5 rounded-xl border-2 border-slate-900 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="border-r border-slate-200 pr-2">
                <span className="text-[10px] font-black text-amber-600 uppercase">Nama Siswa</span>
                <div className="text-sm font-black text-slate-900 truncate">{report.namaSiswa || 'Kevin Pratama'}</div>
              </div>
              <div className="border-r border-slate-200 pr-2">
                <span className="text-[10px] font-black text-slate-400 uppercase">Jenjang</span>
                <div className="text-xs font-extrabold text-slate-800">{report.jenjang} {report.kelasGrade ? `(${report.kelasGrade})` : ''}</div>
              </div>
              <div className="border-r border-slate-200 pr-2">
                <span className="text-[10px] font-black text-slate-400 uppercase">Mata Pelajaran</span>
                <div className="text-xs font-extrabold text-slate-900 bg-amber-100/70 px-1.5 py-0.5 rounded inline-block">
                  {report.mataPelajaran || 'Matematika'}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Durasi / Status</span>
                <div className="text-xs font-bold text-slate-800">{report.waktuDurasi || '90 Menit'} · {report.statusKehadiran}</div>
              </div>
            </div>
          </div>

          {/* High-Impact Stat Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-xl border-2 border-slate-900 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-slate-700 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Pemahaman
                </span>
                <span className="text-xl font-black text-slate-900">{pemahamanScore}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden my-2 border border-slate-300">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pemahamanScore}%` }}></div>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-center">
                {pemahamanPred.label}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border-2 border-slate-900 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-slate-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Keaktifan
                </span>
                <span className="text-xl font-black text-slate-900">{keaktifanScore}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden my-2 border border-slate-300">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${keaktifanScore}%` }}></div>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-center">
                {keaktifanPred.label}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border-2 border-slate-900 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-slate-700 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  Fokus Belajar
                </span>
                <span className="text-xl font-black text-slate-900">{fokusScore}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden my-2 border border-slate-300">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${fokusScore}%` }}></div>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 text-center">
                {fokusPred.label}
              </span>
            </div>
          </div>

          {/* Materi Block with Bold Accent */}
          <div className="bg-white rounded-xl border-2 border-slate-900 shadow-sm overflow-hidden">
            <div className="bg-slate-900 text-amber-400 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Pokok Bahasan & Materi Pembelajaran Hari Ini</span>
            </div>
            <div className="p-3.5 text-xs font-medium text-slate-800 whitespace-pre-line leading-relaxed">
              {report.materiDipelajari || 'Rincian topik sesi les.'}
            </div>
          </div>

          {/* Evaluasi Block */}
          <div className="bg-white rounded-xl border-2 border-slate-900 shadow-sm overflow-hidden">
            <div className="bg-amber-500 text-slate-950 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evaluasi & Catatan Perkembangan Siswa</span>
            </div>
            <div className="p-3.5 text-xs font-medium text-slate-800 whitespace-pre-line leading-relaxed border-l-4 border-amber-500 bg-amber-50/20 m-2 rounded-r-lg">
              {report.evaluasiSiswa || 'Observasi hasil sesi belajar.'}
            </div>
          </div>

          {/* Homework & Notes */}
          {(report.tugasRumah || report.catatanOrangTua) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {report.tugasRumah && (
                <div className="bg-white p-3 rounded-xl border-2 border-slate-900">
                  <span className="font-black uppercase text-amber-800 text-[10px] block mb-1">PR / Tugas Rumah:</span>
                  <div className="text-slate-800 whitespace-pre-line font-medium leading-relaxed">{report.tugasRumah}</div>
                </div>
              )}
              {report.catatanOrangTua && (
                <div className="bg-white p-3 rounded-xl border-2 border-slate-900">
                  <span className="font-black uppercase text-slate-500 text-[10px] block mb-1">Catatan Orang Tua:</span>
                  <div className="text-slate-700 italic font-medium leading-relaxed">"{report.catatanOrangTua}"</div>
                </div>
              )}
            </div>
          )}

          {/* Photos */}
          {report.fotoDokumentasi && report.fotoDokumentasi.length > 0 && (
            <div className="bg-white p-3 rounded-xl border-2 border-slate-900">
              <div className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-600" />
                <span>Dokumentasi Pembelajaran Berlogo Resmi ({report.fotoDokumentasi.length} Foto)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {report.fotoDokumentasi.map((photo, idx) => (
                  <div key={photo.id || idx} className="rounded-lg border-2 border-slate-900 overflow-hidden bg-white">
                    <img src={photo.url} alt="" className="w-full aspect-4/3 object-cover" crossOrigin="anonymous" />
                    <div className="p-1 text-[8.5px] font-bold text-slate-900 bg-amber-50 truncate">{photo.caption || 'Foto Sesi'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bold Signature Block */}
          <div className="pt-3 border-t-2 border-slate-900 grid grid-cols-2 gap-4 items-end text-xs">
            <div>
              <div className="font-black text-slate-900 uppercase text-xs">Dessa Mentari Education</div>
              <div className="text-[10px] text-slate-500">Pusat Bimbingan Belajar & Les Privat Terpadu</div>
              <div className="text-[10px] text-slate-400 italic mt-1">Mengetahui Orang Tua / Wali Siswa</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-amber-600 block">Tutor Pendamping</span>
              <p className="font-black text-slate-950 text-sm border-b-2 border-slate-900 pb-0.5 inline-block min-w-[140px]">
                {report.namaPengajar || 'Pengajar DME'}
              </p>
              <div className="text-[9.5px] font-mono font-bold text-slate-500 mt-0.5">[ ID Terverifikasi Digital ]</div>
            </div>
          </div>
        </div>

        {/* Bold Footer */}
        <div className="bg-slate-950 text-amber-400 px-5 py-2 text-[10px] font-bold flex justify-between items-center border-t border-amber-500">
          <span>© 2026 Dessa Mentari Education · Hak Cipta Dilindungi</span>
          <span className="font-mono text-white">{serialNo}</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. ELEGANT LAYOUT (CLASSIC INSTITUTIONAL - DEFAULT)
  // ==========================================
  return (
    <div
      id="report-card-container"
      className={`w-full max-w-[760px] mx-auto rounded-xl shadow-2xl overflow-hidden border-2 transition-all duration-300 font-sans print:border-none print:shadow-none print:max-w-none print:w-full ${
        isDark 
          ? 'bg-zinc-900 border-amber-500/40 text-amber-100' 
          : 'bg-white border-slate-300 text-slate-800'
      }`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* TOP SECURITY ACCENT STRIP */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700"></div>

      {/* INSTITUTIONAL LETTERHEAD & BRAND HEADER */}
      <div className={`${t.headerBg} p-5 sm:p-6 relative text-white overflow-hidden border-b border-amber-500/30`}>
        {/* Subtle decorative crest watermark */}
        <div className="absolute right-2 -bottom-10 opacity-10 pointer-events-none">
          <Sun className="w-56 h-56 text-amber-300" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 sm:gap-4">
            {/* Crest Frame with Official Logo */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-white p-2 shadow-lg flex items-center justify-center shrink-0 border-2 border-amber-400/80">
              <img
                src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
                alt="Logo Dessa Mentari Education"
                crossOrigin="anonymous"
                loading="eager"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/30">
                  Lembaga Bimbingan Resmi
                </span>
                <span className="text-[10px] text-slate-300 hidden sm:inline">·</span>
                <span className="text-[10px] text-amber-200/90 font-medium hidden sm:inline">
                  Akreditasi Pembelajaran Berstandar
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif-brand pt-0.5">
                DESSA MENTARI EDUCATION
              </h1>
              <p className="text-xs text-amber-200/90 font-medium">
                Tempat Belajar Terpercaya · Les Privat Keluarga Indonesia
              </p>
            </div>
          </div>

          {/* Official Verification Stamp & Serial */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/15">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 backdrop-blur-xs rounded-full border border-amber-300/40 text-amber-200 text-[11px] font-bold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>DOKUMEN RESMI</span>
            </div>
            <span className="text-[10px] text-slate-300/90 font-mono tracking-wider mt-1">
              {serialNo}
            </span>
          </div>
        </div>

        {/* DOCUMENT TITLE RIBBON */}
        <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-100 font-serif-brand">
              Lembar Evaluasi & Capaian Pembelajaran Siswa
            </span>
          </div>
          <div className="text-[11px] font-medium text-amber-200/80">
            Terbit: {formattedDate}
          </div>
        </div>
      </div>

      {/* BODY CONTENT - STRUCTURED ACADEMIC DOSSIER */}
      <div className={`p-3 sm:p-4 space-y-3 ${isDark ? 'bg-zinc-900 text-zinc-100' : 'bg-slate-50/50 text-slate-800'}`}>

        {/* ACADEMIC DOSSIER TABLE (IDENTITAS SISWA & SESI) */}
        <div className={`rounded-xl border shadow-xs overflow-hidden ${isDark ? 'border-amber-500/30 bg-zinc-850' : 'border-slate-200 bg-white'}`}>
          <div className={`px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-wider border-b flex items-center justify-between ${
            isDark ? 'bg-zinc-800 text-amber-300 border-amber-500/30' : 'bg-slate-100/90 text-slate-700 border-slate-200'
          }`}>
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>Identitas Siswa & Jadwal Pembelajaran</span>
            </div>
            <span className="text-[9.5px] font-mono text-slate-500">FORMAT-DME.A4</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 text-xs">
            {/* Left Column: Student Details */}
            <div className="p-3 space-y-2">
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 font-medium text-[11px] min-w-[100px]">Nama Siswa</span>
                <span className="text-slate-900 font-extrabold text-right text-[13px] truncate">
                  {report.namaSiswa || 'Kevin Pratama'}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-slate-500 font-medium text-[11px] min-w-[100px]">Jenjang & Kelas</span>
                <span className="text-slate-800 font-bold text-right">
                  {report.jenjang || 'SD'} {report.kelasGrade ? `(${report.kelasGrade})` : ''}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-slate-500 font-medium text-[11px] min-w-[100px]">Mata Pelajaran</span>
                <span className="text-amber-900 bg-amber-50 px-2 py-0.5 rounded font-extrabold border border-amber-200 text-right">
                  {report.mataPelajaran || 'Matematika'}
                </span>
              </div>
            </div>

            {/* Right Column: Session & Tutor Details */}
            <div className="p-3 space-y-2">
              <div className="flex justify-between items-center gap-2">
                <span className="text-slate-500 font-medium text-[11px] min-w-[100px]">Tanggal Sesi</span>
                <span className="text-slate-800 font-bold text-right">
                  {formattedDate}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-slate-500 font-medium text-[11px] min-w-[100px]">Durasi / Waktu</span>
                <span className="text-slate-800 font-bold text-right flex items-center gap-1 justify-end">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {report.waktuDurasi || '90 Menit'}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-slate-500 font-medium text-[11px] min-w-[100px]">Status Kehadiran</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {report.statusKehadiran || 'Hadir'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* METRICS & COMPETENCY ASSESSMENT RUBRIC */}
        <div className={`p-3.5 rounded-xl border shadow-xs ${
          isDark 
            ? 'bg-zinc-800/80 border-amber-500/30' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Matriks Indikator Capaian Belajar Siswa
              </h2>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Skala 0 - 100%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Metric 1: Pemahaman */}
            <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Pemahaman Materi
                </span>
                <span className="text-sm font-black text-amber-900">{pemahamanScore}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-1.5">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all"
                  style={{ width: `${pemahamanScore}%` }}
                ></div>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border inline-block text-center ${pemahamanPred.badge}`}>
                {pemahamanPred.label}
              </span>
            </div>

            {/* Metric 2: Keaktifan */}
            <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  Keaktifan Belajar
                </span>
                <span className="text-sm font-black text-emerald-800">{keaktifanScore}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-1.5">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all"
                  style={{ width: `${keaktifanScore}%` }}
                ></div>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border inline-block text-center ${keaktifanPred.badge}`}>
                {keaktifanPred.label}
              </span>
            </div>

            {/* Metric 3: Fokus */}
            <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Target className="w-3 h-3 text-indigo-600" />
                  Fokus & Konsentrasi
                </span>
                <span className="text-sm font-black text-indigo-900">{fokusScore}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-1.5">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${fokusScore}%` }}
                ></div>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border inline-block text-center ${fokusPred.badge}`}>
                {fokusPred.label}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 1: MATERI YANG DIPELAJARI HARI INI */}
        <div className={`rounded-xl border shadow-xs overflow-hidden ${isDark ? 'border-amber-500/30 bg-zinc-850' : 'border-slate-200 bg-white'}`}>
          <div className={`px-4 py-2 border-b flex items-center gap-2 ${t.sectionHeaderBg} ${t.sectionBorder}`}>
            <FileText className="w-4 h-4 text-amber-700" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              Materi & Pokok Bahasan Hari Ini
            </h2>
          </div>
          <div className="p-3.5 text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-line">
            {report.materiDipelajari ? (
              report.materiDipelajari
            ) : (
              <span className="text-slate-400 italic">
                Belum ada rincian materi. Masukkan topik pembahasan sesi les pada formulir input.
              </span>
            )}
          </div>
        </div>

        {/* SECTION 2: EVALUASI & CATATAN PERKEMBANGAN SISWA */}
        <div className={`rounded-xl border shadow-xs overflow-hidden ${isDark ? 'border-amber-500/30 bg-zinc-850' : 'border-slate-200 bg-white'}`}>
          <div className={`px-4 py-2 border-b flex items-center gap-2 ${t.sectionHeaderBg} ${t.sectionBorder}`}>
            <Sparkles className="w-4 h-4 text-amber-700" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              Evaluasi & Catatan Perkembangan Siswa
            </h2>
          </div>
          <div className="p-3.5 text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-line border-l-4 border-amber-500/80 bg-amber-50/20 m-2 rounded-r-lg">
            {report.evaluasiSiswa ? (
              report.evaluasiSiswa
            ) : (
              <span className="text-slate-400 italic">
                Belum ada catatan evaluasi belajar. Masukkan observasi pengajar pada formulir di samping.
              </span>
            )}
          </div>
        </div>

        {/* CONDITIONAL SECTION: PR & CATATAN ORANG TUA */}
        {(report.tugasRumah || report.catatanOrangTua) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {report.tugasRumah && (
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-950 uppercase tracking-wider text-[11px] mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                  <span>PR / Tugas Tindak Lanjut</span>
                </div>
                <div className="text-slate-800 whitespace-pre-line leading-relaxed font-medium">
                  {report.tugasRumah}
                </div>
              </div>
            )}

            {report.catatanOrangTua && (
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/80 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                  <MessageSquareQuote className="w-3.5 h-3.5 text-slate-600" />
                  <span>Pesan Khusus Orang Tua</span>
                </div>
                <div className="text-slate-700 italic whitespace-pre-line leading-relaxed font-medium">
                  "{report.catatanOrangTua}"
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 5: DOKUMENTASI FOTO BERLOGO RESMI */}
        {report.fotoDokumentasi && report.fotoDokumentasi.length > 0 && (
          <div className={`rounded-xl border shadow-xs overflow-hidden ${isDark ? 'border-amber-500/30 bg-zinc-850' : 'border-slate-200 bg-white'}`}>
            <div className={`px-4 py-2 border-b flex items-center justify-between ${t.sectionHeaderBg} ${t.sectionBorder}`}>
              <div className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-700" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  Dokumentasi Pembelajaran Berlogo Resmi
                </h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                {report.fotoDokumentasi.length} Foto Terlampir
              </span>
            </div>

            <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {report.fotoDokumentasi.map((photo, idx) => (
                <div key={photo.id || idx} className="rounded-lg border border-amber-200 overflow-hidden bg-white shadow-2xs flex flex-col">
                  {/* BRANDED HEADER ON FOTO */}
                  <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white px-2 py-1 flex items-center justify-between border-b border-amber-500/30">
                    <div className="flex items-center gap-1 min-w-0">
                      <img
                        src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
                        alt="Logo"
                        crossOrigin="anonymous"
                        loading="eager"
                        className="w-3.5 h-3.5 object-contain shrink-0"
                      />
                      <span className="font-bold text-[8.5px] text-amber-200 truncate font-serif-brand">
                        Dessa Mentari
                      </span>
                    </div>
                    <span className="text-[7px] font-semibold text-amber-300 bg-amber-400/20 px-1 rounded">
                      Keluarga Indonesia
                    </span>
                  </div>

                  {/* Photo Thumbnail */}
                  <div className="aspect-4/3 w-full bg-slate-100 overflow-hidden relative">
                    <img
                      src={photo.url}
                      alt={photo.caption || `Foto Dokumentasi ${idx + 1}`}
                      crossOrigin={photo.url?.startsWith('data:') ? undefined : 'anonymous'}
                      loading="eager"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Caption */}
                  <div className="p-1.5 text-[8.5px] text-slate-700 bg-slate-50 border-t border-slate-100">
                    <div className="font-bold text-slate-900 truncate">
                      {photo.caption || 'Dokumentasi Kegiatan Les'}
                    </div>
                    <div className="text-[7.5px] text-slate-400 flex justify-between">
                      <span>{report.namaSiswa}</span>
                      <span>{report.tanggal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FORMAL ENDORSEMENT & SIGNATURE BLOCK */}
        <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-4 items-end text-xs">
          {/* Left: Institutional Seal & Parent Acknowledgment */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {/* Circular Gold Seal Graphic */}
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-amber-600/70 p-0.5 flex items-center justify-center bg-amber-50">
                <div className="w-full h-full rounded-full bg-amber-600/10 flex flex-col items-center justify-center text-[7px] font-black text-amber-900 text-center leading-tight">
                  <span>RESMI</span>
                  <span className="text-[6px] text-amber-700">DME</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider block text-slate-700">
                  Dessa Mentari Education
                </span>
                <span className="text-[9px] text-slate-500 block leading-tight">
                  Pusat Bimbingan Belajar & Les Privat Terpadu
                </span>
              </div>
            </div>
            <div className="pt-2 text-[10px] text-slate-500 italic">
              Mengetahui Orang Tua / Wali Siswa
            </div>
          </div>

          {/* Right: Tutor Signature Block */}
          <div className="text-right space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
              Pengajar / Tutor Pendamping
            </span>
            <div className="h-8 flex items-center justify-end">
              <span className="text-[11px] font-mono text-amber-800 font-bold bg-amber-50/60 px-2 py-0.5 rounded border border-amber-200/60">
                [ Terverifikasi Digital ]
              </span>
            </div>
            <p className="font-extrabold text-slate-900 text-[12px] border-b-2 border-slate-400 pb-0.5 inline-block min-w-[140px]">
              {report.namaPengajar || 'Pengajar Dessa Mentari'}
            </p>
            <span className="text-[9px] text-slate-400 block">
              ID Sertifikasi Tutor DME
            </span>
          </div>
        </div>
      </div>

      {/* SECURITY FOOTER BAR */}
      <div className={`${t.footerBg} px-5 py-2 flex flex-wrap items-center justify-between text-[9.5px] border-t border-amber-500/20`}>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-medium">
            Dokumen Evaluasi Sah Diterbitkan oleh Dessa Mentari Education
          </span>
        </div>
        <div className="text-amber-200/80 font-mono text-[9px] flex items-center gap-2">
          <span>© 2026 Dessa Mentari Education</span>
          <span>·</span>
          <span>{serialNo}</span>
        </div>
      </div>
    </div>
  );
};

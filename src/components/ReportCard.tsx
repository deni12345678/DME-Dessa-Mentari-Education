import React from 'react';
import { ReportData, CardTheme } from '../types/report';
import { 
  Sun, 
  BookOpen, 
  User, 
  Calendar, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Award,
  FileText,
  MessageSquareQuote,
  Target,
  Camera
} from 'lucide-react';

interface ReportCardProps {
  report: ReportData;
}

const themeStyles: Record<CardTheme, {
  headerBg: string;
  headerText: string;
  accentBg: string;
  accentText: string;
  badgeBg: string;
  badgeBorder: string;
  cardBorder: string;
  sectionHeaderBg: string;
  sectionHeaderText: string;
  footerBg: string;
}> = {
  solar: {
    headerBg: 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700',
    headerText: 'text-white',
    accentBg: 'bg-amber-500',
    accentText: 'text-amber-800',
    badgeBg: 'bg-amber-50 text-amber-700',
    badgeBorder: 'border-amber-200',
    cardBorder: 'border-amber-200',
    sectionHeaderBg: 'bg-amber-500/10',
    sectionHeaderText: 'text-amber-900',
    footerBg: 'bg-amber-900 text-amber-100',
  },
  emerald: {
    headerBg: 'bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-800',
    headerText: 'text-white',
    accentBg: 'bg-emerald-600',
    accentText: 'text-emerald-800',
    badgeBg: 'bg-emerald-50 text-emerald-700',
    badgeBorder: 'border-emerald-200',
    cardBorder: 'border-emerald-200',
    sectionHeaderBg: 'bg-emerald-500/10',
    sectionHeaderText: 'text-emerald-900',
    footerBg: 'bg-emerald-950 text-emerald-100',
  },
  navy: {
    headerBg: 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900',
    headerText: 'text-white',
    accentBg: 'bg-indigo-600',
    accentText: 'text-indigo-800',
    badgeBg: 'bg-indigo-50 text-indigo-700',
    badgeBorder: 'border-indigo-200',
    cardBorder: 'border-indigo-200',
    sectionHeaderBg: 'bg-indigo-500/10',
    sectionHeaderText: 'text-indigo-950',
    footerBg: 'bg-slate-950 text-slate-200',
  },
  pastel: {
    headerBg: 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700',
    headerText: 'text-white',
    accentBg: 'bg-violet-600',
    accentText: 'text-violet-800',
    badgeBg: 'bg-violet-50 text-violet-700',
    badgeBorder: 'border-violet-200',
    cardBorder: 'border-violet-200',
    sectionHeaderBg: 'bg-violet-500/10',
    sectionHeaderText: 'text-violet-900',
    footerBg: 'bg-violet-950 text-violet-100',
  },
  dark: {
    headerBg: 'bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950 border-b border-amber-500/30',
    headerText: 'text-amber-300',
    accentBg: 'bg-amber-500',
    accentText: 'text-amber-400',
    badgeBg: 'bg-zinc-800 text-amber-300',
    badgeBorder: 'border-amber-500/40',
    cardBorder: 'border-amber-500/30',
    sectionHeaderBg: 'bg-amber-500/15',
    sectionHeaderText: 'text-amber-300',
    footerBg: 'bg-zinc-950 text-amber-200 border-t border-amber-500/30',
  },
};

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
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

  const pemahamanScore = report.skorPemahaman ?? 85;
  const keaktifanScore = report.skorKeaktifan ?? 90;
  const fokusScore = report.skorFokus ?? 85;

  return (
    <div
      id="report-card-container"
      className={`w-full max-w-[680px] mx-auto rounded-2xl shadow-xl overflow-hidden border transition-all duration-300 font-sans ${
        isDark 
          ? 'bg-zinc-900 border-amber-500/40 text-amber-100' 
          : 'bg-white border-slate-200 text-slate-800'
      }`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* BRAND HEADER WITH OFFICIAL LOGO */}
      <div className={`${t.headerBg} p-6 relative text-white overflow-hidden`}>
        {/* Background rays */}
        <div className="absolute -right-8 -bottom-10 opacity-15 pointer-events-none">
          <Sun className="w-48 h-48 text-white" />
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            {/* Official Logo Display */}
            <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center shrink-0 border border-white/40">
              <img
                src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
                alt="Logo Dessa Mentari Education"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-amber-200/90 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                DESSA MENTARI EDUCATION
              </div>
              <h1 className={`text-xl sm:text-2xl font-extrabold tracking-tight font-serif-brand ${isDark ? 'text-amber-200' : 'text-white'}`}>
                Laporan Pembelajaran Les Privat
              </h1>
              <p className="text-xs text-white/80 font-medium">
                Tempat Belajar Terpercaya · Sistem Evaluasi Resmi
              </p>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end">
            <span className={`px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[11px] font-semibold tracking-wide border border-white/25 flex items-center gap-1 ${isDark ? 'text-amber-200' : 'text-white'}`}>
              <Award className="w-3.5 h-3.5 text-amber-300" />
              Verified Report
            </span>
          </div>
        </div>
      </div>

      {/* STUDENT & SESSION IDENTITIES GRID */}
      <div className={`p-5 sm:p-6 space-y-5 ${isDark ? 'bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Student Name */}
          <div className={`col-span-2 p-3.5 rounded-xl border shadow-xs flex items-center gap-3 ${isDark ? 'bg-zinc-800/90 border-amber-500/30' : 'bg-white border-slate-200/80'}`}>
            <div className={`p-2.5 rounded-lg shrink-0 ${isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className={`text-[10px] uppercase tracking-wider font-semibold block ${isDark ? 'text-amber-400/80' : 'text-slate-400'}`}>
                Nama Siswa
              </span>
              <p className={`text-sm font-bold truncate ${isDark ? 'text-amber-100' : 'text-slate-900'}`}>
                {report.namaSiswa || 'Kevin Pratama'}
              </p>
              {report.kelasGrade && (
                <span className={`text-[11px] font-medium block ${isDark ? 'text-amber-300/70' : 'text-slate-500'}`}>
                  {report.kelasGrade}
                </span>
              )}
            </div>
          </div>

          {/* Education Level */}
          <div className={`p-3.5 rounded-xl border shadow-xs flex items-center gap-2.5 ${isDark ? 'bg-zinc-800/90 border-amber-500/30' : 'bg-white border-slate-200/80'}`}>
            <div className={`p-2.5 rounded-lg shrink-0 ${isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-50 text-blue-700'}`}>
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className={`text-[10px] uppercase tracking-wider font-semibold block ${isDark ? 'text-amber-400/80' : 'text-slate-400'}`}>
                Jenjang
              </span>
              <p className={`text-sm font-bold truncate ${isDark ? 'text-amber-100' : 'text-slate-900'}`}>
                {report.jenjang || 'SD'}
              </p>
            </div>
          </div>

          {/* Subject */}
          <div className={`p-3.5 rounded-xl border shadow-xs flex items-center gap-2.5 ${isDark ? 'bg-zinc-800/90 border-amber-500/30' : 'bg-white border-slate-200/80'}`}>
            <div className={`p-2.5 rounded-lg shrink-0 ${isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-purple-50 text-purple-700'}`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className={`text-[10px] uppercase tracking-wider font-semibold block ${isDark ? 'text-amber-400/80' : 'text-slate-400'}`}>
                Mata Pelajaran
              </span>
              <p className={`text-sm font-bold truncate ${isDark ? 'text-amber-100' : 'text-slate-900'}`}>
                {report.mataPelajaran || 'Matematika'}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className={`col-span-2 sm:col-span-2 p-3.5 rounded-xl border shadow-xs flex items-center gap-3 ${isDark ? 'bg-zinc-800/90 border-amber-500/30' : 'bg-white border-slate-200/80'}`}>
            <div className={`p-2.5 rounded-lg shrink-0 ${isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-50 text-emerald-700'}`}>
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className={`text-[10px] uppercase tracking-wider font-semibold block ${isDark ? 'text-amber-400/80' : 'text-slate-400'}`}>
                Tanggal Pembelajaran
              </span>
              <p className={`text-xs font-bold ${isDark ? 'text-amber-100' : 'text-slate-900'}`}>
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Duration & Time */}
          <div className={`p-3.5 rounded-xl border shadow-xs flex items-center gap-2.5 ${isDark ? 'bg-zinc-800/90 border-amber-500/30' : 'bg-white border-slate-200/80'}`}>
            <div className={`p-2.5 rounded-lg shrink-0 ${isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-orange-50 text-orange-700'}`}>
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className={`text-[10px] uppercase tracking-wider font-semibold block ${isDark ? 'text-amber-400/80' : 'text-slate-400'}`}>
                Durasi
              </span>
              <p className={`text-xs font-bold truncate ${isDark ? 'text-amber-100' : 'text-slate-900'}`}>
                {report.waktuDurasi || '90 Menit'}
              </p>
            </div>
          </div>

          {/* Attendance */}
          <div className={`p-3.5 rounded-xl border shadow-xs flex items-center gap-2.5 ${isDark ? 'bg-zinc-800/90 border-amber-500/30' : 'bg-white border-slate-200/80'}`}>
            <div className={`p-2.5 rounded-lg shrink-0 ${isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-teal-50 text-teal-700'}`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className={`text-[10px] uppercase tracking-wider font-semibold block ${isDark ? 'text-amber-400/80' : 'text-slate-400'}`}>
                Status
              </span>
              <span className={`inline-block text-xs font-bold truncate ${isDark ? 'text-amber-300' : 'text-teal-700'}`}>
                {report.statusKehadiran || 'Hadir'}
              </span>
            </div>
          </div>
        </div>

        {/* METRICS RATING BADGES BAR */}
        <div className={`border p-3.5 rounded-xl flex items-center justify-around text-center ${
          isDark
            ? 'bg-gradient-to-r from-amber-950/60 via-zinc-900 to-amber-950/60 border-amber-500/40'
            : 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-amber-200'
        }`}>
          <div>
            <span className={`text-[10px] uppercase tracking-wider font-bold block flex items-center justify-center gap-1 ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
              <Award className="w-3 h-3 text-amber-500" /> Pemahaman
            </span>
            <span className={`text-sm font-extrabold ${isDark ? 'text-amber-200' : 'text-amber-800'}`}>{pemahamanScore}%</span>
          </div>

          <div className={`h-7 w-[1px] ${isDark ? 'bg-amber-500/30' : 'bg-amber-200'}`}></div>

          <div>
            <span className={`text-[10px] uppercase tracking-wider font-bold block flex items-center justify-center gap-1 ${isDark ? 'text-amber-300' : 'text-emerald-900'}`}>
              <Sparkles className="w-3 h-3 text-amber-400" /> Keaktifan
            </span>
            <span className={`text-sm font-extrabold ${isDark ? 'text-amber-200' : 'text-emerald-800'}`}>{keaktifanScore}%</span>
          </div>

          <div className={`h-7 w-[1px] ${isDark ? 'bg-amber-500/30' : 'bg-amber-200'}`}></div>

          <div>
            <span className={`text-[10px] uppercase tracking-wider font-bold block flex items-center justify-center gap-1 ${isDark ? 'text-amber-300' : 'text-indigo-900'}`}>
              <Target className="w-3 h-3 text-amber-500" /> Fokus Belajar
            </span>
            <span className={`text-sm font-extrabold ${isDark ? 'text-amber-200' : 'text-indigo-800'}`}>{fokusScore}%</span>
          </div>
        </div>

        {/* SECTION 1: MATERI YANG DIPELAJARI */}
        <div className={`rounded-xl border ${t.cardBorder} ${isDark ? 'bg-zinc-800/90' : 'bg-white'} overflow-hidden shadow-xs`}>
          <div className={`px-4 py-2.5 ${t.sectionHeaderBg} border-b ${t.cardBorder} flex items-center gap-2`}>
            <FileText className={`w-4 h-4 ${t.sectionHeaderText}`} />
            <h2 className={`text-xs font-bold uppercase tracking-wider ${t.sectionHeaderText}`}>
              Materi yang Dipelajari Hari Ini
            </h2>
          </div>
          <div className={`p-4 text-xs leading-relaxed whitespace-pre-line font-medium ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
            {report.materiDipelajari ? (
              report.materiDipelajari
            ) : (
              <span className="text-slate-400 italic">
                Belum ada catatan materi. Masukkan topik pembelajaran hari ini pada formulir.
              </span>
            )}
          </div>
        </div>

        {/* SECTION 2: EVALUASI & PERKEMBANGAN SISWA */}
        <div className={`rounded-xl border ${t.cardBorder} ${isDark ? 'bg-zinc-800/90' : 'bg-white'} overflow-hidden shadow-xs`}>
          <div className={`px-4 py-2.5 ${t.sectionHeaderBg} border-b ${t.cardBorder} flex items-center gap-2`}>
            <Sparkles className={`w-4 h-4 ${t.sectionHeaderText}`} />
            <h2 className={`text-xs font-bold uppercase tracking-wider ${t.sectionHeaderText}`}>
              Perkembangan & Evaluasi Siswa
            </h2>
          </div>
          <div className={`p-4 text-xs leading-relaxed whitespace-pre-line font-medium ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
            {report.evaluasiSiswa ? (
              report.evaluasiSiswa
            ) : (
              <span className="text-slate-400 italic">
                Belum ada catatan evaluasi. Ketik perkembangan keaktifan dan pemahaman siswa di atas.
              </span>
            )}
          </div>
        </div>

        {/* SECTION 3: PR / TUGAS RUMAH (IF ANY) */}
        {report.tugasRumah && report.tugasRumah.trim() !== '' && (
          <div className={`rounded-xl border overflow-hidden shadow-xs ${isDark ? 'border-amber-500/40 bg-amber-950/30' : 'border-amber-200 bg-amber-50/40'}`}>
            <div className={`px-4 py-2 border-b flex items-center gap-2 ${isDark ? 'bg-amber-500/20 border-amber-500/40' : 'bg-amber-100/60 border-amber-200'}`}>
              <BookOpen className={`w-3.5 h-3.5 ${isDark ? 'text-amber-300' : 'text-amber-800'}`} />
              <h2 className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
                PR / Tugas Rumah
              </h2>
            </div>
            <div className={`p-3.5 text-xs whitespace-pre-line font-medium leading-relaxed ${isDark ? 'text-amber-100' : 'text-slate-800'}`}>
              {report.tugasRumah}
            </div>
          </div>
        )}

        {/* SECTION 4: CATATAN UTK ORANG TUA (IF ANY) */}
        {report.catatanOrangTua && report.catatanOrangTua.trim() !== '' && (
          <div className={`rounded-xl border overflow-hidden shadow-xs ${isDark ? 'border-zinc-700 bg-zinc-800/80' : 'border-slate-200 bg-slate-50'}`}>
            <div className={`px-4 py-2 border-b flex items-center gap-2 ${isDark ? 'bg-zinc-700/60 border-zinc-700' : 'bg-slate-200/60 border-slate-200'}`}>
              <MessageSquareQuote className={`w-3.5 h-3.5 ${isDark ? 'text-amber-300' : 'text-slate-700'}`} />
              <h2 className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-amber-200' : 'text-slate-800'}`}>
                Catatan Khusus Orang Tua
              </h2>
            </div>
            <div className={`p-3.5 text-xs whitespace-pre-line italic leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>
              "{report.catatanOrangTua}"
            </div>
          </div>
        )}

        {/* SECTION 5: DOKUMENTASI FOTO KEGIATAN LES (IF ANY) */}
        {report.fotoDokumentasi && report.fotoDokumentasi.length > 0 && (
          <div className={`rounded-xl border overflow-hidden shadow-xs ${isDark ? 'border-amber-500/40 bg-zinc-800/90' : 'border-slate-200 bg-white'}`}>
            <div className={`px-4 py-2 border-b flex items-center justify-between ${t.sectionHeaderBg} ${t.cardBorder}`}>
              <div className="flex items-center gap-2">
                <Camera className={`w-3.5 h-3.5 ${t.sectionHeaderText}`} />
                <h2 className={`text-[11px] font-bold uppercase tracking-wider ${t.sectionHeaderText}`}>
                  Dokumentasi Foto Sesi Les
                </h2>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.badgeBg} border ${t.badgeBorder}`}>
                {report.fotoDokumentasi.length} Foto Lampiran
              </span>
            </div>

            <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {report.fotoDokumentasi.map((photo, idx) => (
                <div key={photo.id || idx} className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex flex-col">
                  <div className="aspect-4/3 w-full bg-slate-200 overflow-hidden relative">
                    <img
                      src={photo.url}
                      alt={photo.caption || `Foto Dokumentasi ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {photo.caption && (
                    <div className="p-1.5 text-[10px] font-medium text-slate-700 truncate bg-white border-t border-slate-100">
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SIGNATURE & BRAND FOOTER WITH SMALL LOGO */}
        <div className={`pt-4 border-t flex items-end justify-between text-xs ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
          <div className="space-y-1">
            <div className={`flex items-center gap-2 font-semibold text-[11px] ${isDark ? 'text-amber-300' : 'text-slate-700'}`}>
              <img
                src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
                alt="Logo"
                className="w-5 h-5 object-contain"
              />
              <span>Dessa Mentari Education</span>
            </div>
            <p className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>
              Tempat Belajar Terpercaya · Les Privat Bergaransi
            </p>
          </div>

          <div className="text-right">
            <span className={`text-[10px] block mb-1 uppercase tracking-wider font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>
              Pengajar / Tutor
            </span>
            <p className={`font-bold pb-0.5 min-w-[120px] ${isDark ? 'text-amber-300 border-b-2 border-amber-500/60' : 'text-slate-900 border-b-2 border-slate-300'}`}>
              {report.namaPengajar || 'Pengajar Dessa Mentari'}
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER BADGE BAR */}
      <div className={`${t.footerBg} px-6 py-3 flex items-center justify-between text-[11px]`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span className="font-medium">Dokumen Resmi Laporan Belajar</span>
        </div>
        <span className="text-white/60 text-[10px] font-mono">
          REF: DME-{new Date().getFullYear()}-{(report.namaSiswa || 'REV').substring(0, 3).toUpperCase()}
        </span>
      </div>
    </div>
  );
};

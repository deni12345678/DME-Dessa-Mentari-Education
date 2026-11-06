import React from 'react';
import { CertificateData } from '../types/report';
import { Award, CheckCircle2, ShieldCheck, Sparkles, Star } from 'lucide-react';

interface CertificateDocumentProps {
  certificate: CertificateData;
  id?: string;
  className?: string;
}

export const CertificateDocument: React.FC<CertificateDocumentProps> = ({
  certificate,
  id = 'certificate-container',
  className = '',
}) => {
  const {
    certificateNumber,
    namaSiswa,
    jenjang,
    kelasGrade,
    sekolah,
    mataPelajaran,
    tipeSertifikat,
    predikat,
    nilaiAkhir,
    deskripsiKompetensi,
    tanggalTerbit,
    kotaTerbit,
    namaKepalaLembaga,
    jabatanKepala,
    namaTutorPengampu,
    jabatanTutor,
    theme = 'gold',
  } = certificate;

  const dateFormatted = new Date(tanggalTerbit || new Date()).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Color schemes based on selected theme
  const themeStyles = {
    gold: {
      outerBorder: 'border-amber-600',
      innerBorder: 'border-amber-500/70',
      accentBg: 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600',
      badgeBg: 'bg-amber-100 text-amber-950 border-amber-300',
      titleColor: 'text-amber-950',
      subTitleColor: 'text-amber-800',
      sealRing: 'border-amber-500 text-amber-700 bg-amber-50',
      highlightBox: 'bg-gradient-to-b from-amber-50/80 via-white to-amber-50/60 border-amber-200',
      primaryText: 'text-slate-900',
      cornerColor: 'text-amber-600',
    },
    navy: {
      outerBorder: 'border-blue-900',
      innerBorder: 'border-amber-500/70',
      accentBg: 'bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900',
      badgeBg: 'bg-blue-50 text-blue-950 border-blue-200',
      titleColor: 'text-blue-950',
      subTitleColor: 'text-blue-800',
      sealRing: 'border-blue-800 text-blue-900 bg-blue-50',
      highlightBox: 'bg-gradient-to-b from-blue-50/60 via-white to-blue-50/40 border-blue-200',
      primaryText: 'text-slate-900',
      cornerColor: 'text-blue-900',
    },
    emerald: {
      outerBorder: 'border-emerald-800',
      innerBorder: 'border-amber-500/70',
      accentBg: 'bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-950',
      badgeBg: 'bg-emerald-50 text-emerald-950 border-emerald-200',
      titleColor: 'text-emerald-950',
      subTitleColor: 'text-emerald-800',
      sealRing: 'border-emerald-700 text-emerald-800 bg-emerald-50',
      highlightBox: 'bg-gradient-to-b from-emerald-50/60 via-white to-emerald-50/40 border-emerald-200',
      primaryText: 'text-slate-900',
      cornerColor: 'text-emerald-800',
    },
  }[theme];

  return (
    <div
      id={id}
      className={`relative bg-[#fffdf9] text-slate-800 p-8 sm:p-10 shadow-2xl rounded-sm print:p-6 print:shadow-none print:m-0 w-full max-w-[1020px] aspect-[1.414/1] flex flex-col justify-between overflow-hidden select-none border-8 ${themeStyles.outerBorder} ${className}`}
      style={{
        fontFamily: "'Inter', sans-serif",
        boxSizing: 'border-box',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #fffdf8 100%)',
      }}
    >
      {/* Decorative Guilloche Corner Borders */}
      <div className={`absolute top-2 left-2 w-16 h-16 border-t-4 border-l-4 ${themeStyles.cornerColor} pointer-events-none opacity-80`} />
      <div className={`absolute top-2 right-2 w-16 h-16 border-t-4 border-r-4 ${themeStyles.cornerColor} pointer-events-none opacity-80`} />
      <div className={`absolute bottom-2 left-2 w-16 h-16 border-b-4 border-l-4 ${themeStyles.cornerColor} pointer-events-none opacity-80`} />
      <div className={`absolute bottom-2 right-2 w-16 h-16 border-b-4 border-r-4 ${themeStyles.cornerColor} pointer-events-none opacity-80`} />

      {/* Thin Inner Ornamental Gold Border */}
      <div className={`absolute inset-3 border border-dashed ${themeStyles.innerBorder} pointer-events-none opacity-60 rounded-xs`} />

      {/* Subtle Background Watermark Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035]">
        <img
          src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
          alt="Watermark DME"
          className="w-96 h-96 object-contain filter grayscale"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {/* ======================================================== */}
      {/* 1. HEADER INSTANSI & KOP RESMI */}
      {/* ======================================================== */}
      <div className="relative z-10 text-center space-y-1.5 pt-1">
        {/* Logo and Institution Title */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-sm border border-amber-300 flex items-center justify-center shrink-0">
            <img
              src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
              alt="Logo Dessa Mentari"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="text-left">
            <h1 className="font-serif-brand font-black text-xl sm:text-2xl text-slate-900 tracking-wider uppercase leading-none">
              Dessa Mentari Education
            </h1>
            <p className="text-[10px] sm:text-[11px] text-amber-700 font-semibold tracking-wide mt-0.5">
              Tempat Belajar Terpercaya · Les Privat Keluarga Indonesia
            </p>
          </div>
        </div>

        {/* Double Ornamental Divider */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <div className="h-[1.5px] w-24 bg-gradient-to-r from-transparent to-amber-500" />
          <div className="flex items-center gap-1 text-amber-600">
            <Sparkles className="w-3.5 h-3.5" />
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="h-[1.5px] w-24 bg-gradient-to-l from-transparent to-amber-500" />
        </div>

        {/* Certificate Main Title */}
        <div className="pt-1">
          <h2
            className={`font-serif-brand font-black text-2xl sm:text-3xl tracking-widest uppercase ${themeStyles.titleColor}`}
            style={{ letterSpacing: '0.18em' }}
          >
            {tipeSertifikat.toUpperCase()}
          </h2>
          <p className="text-[10px] tracking-widest text-slate-500 font-mono font-medium uppercase mt-0.5">
            CERTIFICATE OF ACHIEVEMENT · NO: {certificateNumber}
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. BODY SERTIFIKAT: IDENTITAS SISWA & CAPAIAN */}
      {/* ======================================================== */}
      <div className="relative z-10 text-center my-auto py-2 space-y-2.5">
        <p className="text-xs sm:text-sm text-slate-600 italic font-serif">
          Dengan penuh rasa bangga dan apresiasi, sertifikat ini secara resmi dianugerahkan kepada:
        </p>

        {/* Nama Siswa (Large Calligraphic Serif) */}
        <div className="py-0.5">
          <h3 className="font-serif-brand font-black text-3xl sm:text-4xl text-amber-950 tracking-wide underline decoration-amber-400/60 underline-offset-8">
            {namaSiswa || 'Nama Siswa'}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-2">
            {jenjang} {kelasGrade ? `(${kelasGrade})` : ''} {sekolah ? `· ${sekolah}` : ''}
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-xl mx-auto">
          Atas keberhasilan menuntaskan pembelajaran dan membuktikan penguasaan kompetensi unggul pada bidang studi:
        </p>

        {/* Mata Pelajaran Highlight Box */}
        <div className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-400/25 to-amber-500/15 border border-amber-400/40 shadow-xs">
          <Award className="w-5 h-5 text-amber-700 shrink-0" />
          <span className="font-serif-brand font-black text-base sm:text-lg text-slate-900 tracking-wide">
            {mataPelajaran}
          </span>
        </div>

        {/* Deskripsi Capaian Kompetensi */}
        <div className="max-w-2xl mx-auto px-4 py-2 text-center">
          <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed italic bg-white/70 p-3 rounded-xl border border-slate-200/60 shadow-2xs">
            "{deskripsiKompetensi}"
          </p>
        </div>

        {/* Predikat & Nilai Akhir Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-0.5">
          <div className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-2xs ${themeStyles.badgeBg}`}>
            Predikat: {predikat}
          </div>
          {nilaiAkhir && (
            <div className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-900 text-white shadow-2xs">
              Skor Kompetensi: {nilaiAkhir}/100
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. FOOTER: OFFICIAL EMBOSSED SEAL & SIGNATURES */}
      {/* ======================================================== */}
      <div className="relative z-10 pt-3 border-t border-amber-300/60 mt-auto">
        <div className="grid grid-cols-3 items-end gap-4 text-center">
          {/* Tanda Tangan Kiri: Kepala Lembaga */}
          <div className="flex flex-col items-center">
            <p className="text-[10px] text-slate-500 font-medium">Mengesahkan,</p>
            <p className="text-[11px] font-bold text-slate-800">{jabatanKepala}</p>

            {/* Signature Graphic / Calligraphy Simulation */}
            <div className="h-14 flex items-center justify-center relative my-0.5">
              <span
                className="font-serif italic text-2xl font-bold text-blue-900/90 select-none"
                style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive" }}
              >
                {namaKepalaLembaga.split(',')[0]}
              </span>
            </div>

            <div className="w-36 border-b border-slate-900/80 mb-1" />
            <p className="text-xs font-black text-slate-900 font-serif-brand">
              {namaKepalaLembaga}
            </p>
            <p className="text-[9.5px] text-slate-500">NIP / Reg: DME-DIR-01</p>
          </div>

          {/* Tengah: Official Gold Embossed Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className={`w-20 h-20 rounded-full border-4 border-double flex flex-col items-center justify-center p-1 shadow-md relative ${themeStyles.sealRing}`}>
              <div className="absolute inset-1 border border-dashed border-amber-400/80 rounded-full pointer-events-none" />
              <ShieldCheck className="w-5 h-5 text-amber-600 mb-0.5" />
              <span className="text-[7px] font-black uppercase tracking-tight text-center leading-tight">
                DESSA MENTARI
              </span>
              <span className="text-[6px] font-extrabold text-amber-600 tracking-widest uppercase">
                RESMI · 2026
              </span>
              <div className="flex items-center gap-0.5 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-2 h-2 fill-amber-500 text-amber-500" />
                ))}
              </div>
            </div>
            <p className="text-[9px] font-bold text-slate-600 tracking-wider mt-1.5 uppercase">
              {kotaTerbit}, {dateFormatted}
            </p>
          </div>

          {/* Tanda Tangan Kanan: Tutor Pengampu */}
          <div className="flex flex-col items-center">
            <p className="text-[10px] text-slate-500 font-medium">Tutor Pengampu / Evaluator,</p>
            <p className="text-[11px] font-bold text-slate-800">{jabatanTutor}</p>

            {/* Signature Graphic / Calligraphy Simulation */}
            <div className="h-14 flex items-center justify-center relative my-0.5">
              <span
                className="font-serif italic text-2xl font-bold text-blue-900/90 select-none"
                style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive" }}
              >
                {namaTutorPengampu.split(',')[0]}
              </span>
            </div>

            <div className="w-36 border-b border-slate-900/80 mb-1" />
            <p className="text-xs font-black text-slate-900 font-serif-brand">
              {namaTutorPengampu}
            </p>
            <p className="text-[9.5px] text-slate-500">Divisi Kurikulum DME</p>
          </div>
        </div>

        {/* Legal Bottom Bar */}
        <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[9px] text-slate-400 font-medium">
          <span>Sertifikat Resmi Kompetensi Pembelajaran Les Privat</span>
          <span className="font-bold text-slate-600 font-serif-brand">
            © 2026 Dessa Mentari Education · Terdaftar &amp; Terverifikasi
          </span>
          <span>Validasi ID: {certificateNumber}</span>
        </div>
      </div>
    </div>
  );
};

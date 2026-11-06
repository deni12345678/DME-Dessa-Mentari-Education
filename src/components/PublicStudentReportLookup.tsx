import React, { useState } from 'react';
import { 
  FileSearch, 
  User, 
  Search, 
  Download, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  BookOpen,
  X,
  ExternalLink,
  Sparkles,
  Award,
  GraduationCap
} from 'lucide-react';
import { ReportData, StudentData, CertificateData } from '../types/report';
import { ReportCard } from './ReportCard';
import { CertificateDocument } from './CertificateDocument';
import { downloadCertificateAsPdf, downloadCertificateAsImage } from '../utils/certificateUtils';

interface PublicStudentReportLookupProps {
  reports: ReportData[];
  certificates?: CertificateData[];
  students: StudentData[];
  onDownloadPdf: (report: ReportData) => void;
  onDownloadJpg: (report: ReportData) => void;
  downloadingPdf?: boolean;
  downloadingJpg?: boolean;
}

export const PublicStudentReportLookup: React.FC<PublicStudentReportLookupProps> = ({
  reports,
  certificates = [],
  students,
  onDownloadPdf,
  onDownloadJpg,
  downloadingPdf = false,
  downloadingJpg = false,
}) => {
  const [activeType, setActiveType] = useState<'reports' | 'certificates'>('reports');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(() => {
    return reports.length > 0 ? reports[0] : null;
  });

  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(() => {
    return certificates.length > 0 ? certificates[0] : null;
  });

  const [certDownloadingPdf, setCertDownloadingPdf] = useState(false);
  const [certDownloadingJpg, setCertDownloadingJpg] = useState(false);

  // Filter reports
  const filteredReports = reports.filter((r) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      r.namaSiswa.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      (r.mataPelajaran || '').toLowerCase().includes(q) ||
      (r.tanggal || '').includes(q)
    );
  });

  // Filter certificates
  const filteredCertificates = certificates.filter((c) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      c.namaSiswa.toLowerCase().includes(q) ||
      c.certificateNumber.toLowerCase().includes(q) ||
      (c.mataPelajaran || '').toLowerCase().includes(q)
    );
  });

  const handleDownloadCertPdf = async (cert: CertificateData) => {
    setCertDownloadingPdf(true);
    try {
      await downloadCertificateAsPdf('public-certificate-view', cert);
    } finally {
      setCertDownloadingPdf(false);
    }
  };

  const handleDownloadCertJpg = async (cert: CertificateData) => {
    setCertDownloadingJpg(true);
    try {
      await downloadCertificateAsImage('public-certificate-view', cert, 'jpg');
    } finally {
      setCertDownloadingJpg(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* HEADER SECTION */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
          Portal Transparansi Belajar Wali Murid
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-serif-brand tracking-tight">
          Cek Laporan Belajar &amp; Sertifikat Siswa Online
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Orang tua dapat memantau capaian nilai belajar anak per sesi serta melihat dan mengunduh sertifikat resmi kelulusan kompetensi mata pelajaran.
        </p>

        {/* TYPE TOGGLE: RAPOR SESI vs SERTIFIKAT KELULUSAN */}
        <div className="flex justify-center items-center gap-2 pt-3">
          <button
            onClick={() => setActiveType('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeType === 'reports'
                ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Laporan Sesi Belajar ({filteredReports.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveType('certificates');
              if (!selectedCert && certificates.length > 0) {
                setSelectedCert(certificates[0]);
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeType === 'certificates'
                ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Sertifikat Siswa ({filteredCertificates.length})</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND SELECTOR BAR */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan nama siswa atau mata pelajaran..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
            <span className="font-semibold">Ditemukan:</span>
            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
              {activeType === 'reports' ? `${filteredReports.length} Laporan` : `${filteredCertificates.length} Sertifikat`}
            </span>
          </div>
        </div>

        {/* Quick Student Pill Selector */}
        {students.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-600" />
              Pilih Berdasarkan Siswa Terdaftar:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                  searchTerm === ''
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Semua Siswa
              </button>
              {students.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSearchTerm(st.namaSiswa)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                    searchTerm.toLowerCase() === st.namaSiswa.toLowerCase()
                      ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
                  }`}
                >
                  {st.namaSiswa} ({st.jenjang})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 1. VIEW MODE: LAPORAN SESI BELAJAR */}
      {/* ======================================================== */}
      {activeType === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: LIST OF REPORTS */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Daftar Sesi Pembelajaran
              </h3>
              <span className="text-[11px] text-slate-400">Pilih untuk melihat detail</span>
            </div>

            {filteredReports.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs space-y-2">
                <FileSearch className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Tidak ditemukan laporan belajar dengan kata kunci tersebut.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-amber-700 font-bold underline"
                >
                  Reset pencarian
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
                {filteredReports.map((item) => {
                  const isSelected = selectedReport?.id === item.id;
                  const formattedDate = item.tanggal
                    ? new Date(item.tanggal).toLocaleDateString('id-ID', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : item.tanggal;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedReport(item);
                        if (window.innerWidth < 1024) {
                          const el = document.getElementById('report-card-view');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className={`w-full p-4 rounded-2xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/70 shadow-sm ring-2 ring-amber-400/80'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {item.id}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formattedDate}
                        </span>
                      </div>

                      <div className="text-sm font-black text-slate-900 truncate">
                        {item.namaSiswa}
                      </div>

                      <div className="text-xs text-amber-900 font-semibold mt-0.5">
                        {item.mataPelajaran} · {item.jenjang} {item.kelasGrade ? `(${item.kelasGrade})` : ''}
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Tutor: {item.namaPengajar}</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                          Skor: {item.skorPemahaman ?? 85}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: REPORT CARD PREVIEW */}
          <div id="report-card-view" className="lg:col-span-7 space-y-4 sticky top-24">
            {selectedReport ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                        Rapor Resmi Siap Diunduh
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {selectedReport.namaSiswa} ({selectedReport.tanggal})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => onDownloadPdf(selectedReport)}
                      disabled={downloadingPdf}
                      className="flex-1 sm:flex-none px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <FileText className="w-3.5 h-3.5 text-rose-200" />
                      <span>{downloadingPdf ? 'Membuat...' : 'Unduh PDF (1 Lembar)'}</span>
                    </button>

                    <button
                      onClick={() => onDownloadJpg(selectedReport)}
                      disabled={downloadingJpg}
                      className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-200" />
                      <span>{downloadingJpg ? 'Memproses...' : 'Unduh JPG'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-2 sm:p-4 bg-slate-200/50 rounded-2xl border border-slate-300 shadow-inner flex justify-center overflow-x-auto">
                  <ReportCard report={selectedReport} />
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-700 font-serif-brand">
                  Pilih Sesi Laporan untuk Ditampilkan
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Klik salah satu sesi laporan belajar di kolom kiri untuk melihat rincian evaluasi dan mengunduh berkas resminya.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. VIEW MODE: SERTIFIKAT KELULUSAN & PENGHARGAAN */}
      {/* ======================================================== */}
      {activeType === 'certificates' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: LIST OF CERTIFICATES */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Daftar Sertifikat Terbit
              </h3>
              <span className="text-[11px] text-slate-400">Pilih untuk pratinjau</span>
            </div>

            {filteredCertificates.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs space-y-2">
                <Award className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Belum ada sertifikat yang cocok dengan pencarian.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-amber-700 font-bold underline"
                >
                  Tampilkan Semua
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
                {filteredCertificates.map((cert) => {
                  const isSelected = selectedCert?.id === cert.id;
                  return (
                    <button
                      key={cert.id}
                      onClick={() => {
                        setSelectedCert(cert);
                        if (window.innerWidth < 1024) {
                          const el = document.getElementById('public-cert-preview-area');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className={`w-full p-4 rounded-2xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/70 shadow-sm ring-2 ring-amber-400/80'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          {cert.certificateNumber}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          {cert.tanggalTerbit}
                        </span>
                      </div>

                      <div className="text-sm font-black text-slate-900 truncate font-serif-brand">
                        {cert.namaSiswa}
                      </div>

                      <div className="text-xs text-amber-900 font-semibold mt-0.5">
                        {cert.mataPelajaran} · {cert.jenjang}
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-medium">{cert.predikat.split('(')[0]}</span>
                        <span className="font-bold text-amber-700">Skor: {cert.nilaiAkhir || 90}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: CERTIFICATE DOCUMENT PREVIEW */}
          <div id="public-cert-preview-area" className="lg:col-span-8 space-y-4 sticky top-24">
            {selectedCert ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                        Sertifikat Kelulusan Resmi
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {selectedCert.namaSiswa} — {selectedCert.mataPelajaran}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleDownloadCertPdf(selectedCert)}
                      disabled={certDownloadingPdf}
                      className="flex-1 sm:flex-none px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <FileText className="w-3.5 h-3.5 text-rose-200" />
                      <span>{certDownloadingPdf ? 'Membuat PDF...' : 'Unduh PDF (A4 Landscape)'}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadCertJpg(selectedCert)}
                      disabled={certDownloadingJpg}
                      className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-200" />
                      <span>{certDownloadingJpg ? 'Memproses...' : 'Unduh Gambar (JPG)'}</span>
                    </button>
                  </div>
                </div>

                {/* CERTIFICATE PREVIEW CONTAINER */}
                <div className="p-3 sm:p-5 bg-slate-200/60 rounded-2xl border border-slate-300 shadow-inner flex justify-center overflow-x-auto">
                  <CertificateDocument
                    id="public-certificate-view"
                    certificate={selectedCert}
                  />
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <Award className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-700 font-serif-brand">
                  Pilih Sertifikat untuk Ditampilkan
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Klik salah satu sertifikat di sebelah kiri untuk melihat pratinjau dokumen resmi dan mengunduh berkasnya.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

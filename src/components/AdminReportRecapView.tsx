import React, { useState, useMemo } from 'react';
import { 
  ReportData, 
  StudentData, 
  TeacherData, 
  EducationLevel 
} from '../types/report';
import { 
  FileSpreadsheet, 
  Calendar, 
  User, 
  Search, 
  Filter, 
  Send, 
  Printer, 
  Share2, 
  Copy, 
  Check, 
  Award, 
  Star, 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  X, 
  ChevronRight, 
  Sparkles,
  ExternalLink,
  Clock,
  MapPin,
  TrendingUp,
  Download
} from 'lucide-react';

interface AdminReportRecapViewProps {
  reports: ReportData[];
  students: StudentData[];
  teachers: TeacherData[];
  onSelectReport?: (report: ReportData) => void;
  onDeleteReport?: (id: string) => void;
  contactWA?: string;
}

export const AdminReportRecapView: React.FC<AdminReportRecapViewProps> = ({
  reports,
  students,
  teachers,
  onSelectReport,
  onDeleteReport,
  contactWA = '087879069404',
}) => {
  // Filter States
  const [selectedStudentName, setSelectedStudentName] = useState<string>('all');
  const [selectedTeacherName, setSelectedTeacherName] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'this_month' | 'last_30_days' | 'custom'>('this_month');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State for Parent Recap
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);
  const [recapStudentName, setRecapStudentName] = useState<string>('');
  const [copiedWA, setCopiedWA] = useState(false);

  // Filter Logic
  const filteredReports = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return reports.filter((r) => {
      // 1. Filter Student
      if (selectedStudentName !== 'all' && r.namaSiswa !== selectedStudentName) {
        return false;
      }

      // 2. Filter Teacher
      if (selectedTeacherName !== 'all' && r.namaPengajar !== selectedTeacherName) {
        return false;
      }

      // 3. Filter Date Range
      if (r.tanggal) {
        const d = new Date(r.tanggal);
        if (!isNaN(d.getTime())) {
          if (timeFilter === 'this_month') {
            if (d.getFullYear() !== currentYear || d.getMonth() !== currentMonth) {
              return false;
            }
          } else if (timeFilter === 'last_30_days') {
            const diffDays = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
            if (diffDays > 30 || diffDays < 0) return false;
          } else if (timeFilter === 'custom') {
            if (customStartDate && r.tanggal < customStartDate) return false;
            if (customEndDate && r.tanggal > customEndDate) return false;
          }
        }
      }

      // 4. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          (r.namaSiswa && r.namaSiswa.toLowerCase().includes(q)) ||
          (r.mataPelajaran && r.mataPelajaran.toLowerCase().includes(q)) ||
          (r.materiDipelajari && r.materiDipelajari.toLowerCase().includes(q)) ||
          (r.evaluasiSiswa && r.evaluasiSiswa.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [reports, selectedStudentName, selectedTeacherName, timeFilter, customStartDate, customEndDate, searchQuery]);

  // Aggregate Metrics for filtered reports
  const totalSessions = filteredReports.length;
  const avgPemahaman = totalSessions > 0
    ? Math.round(filteredReports.reduce((acc, r) => acc + (r.skorPemahaman ?? 85), 0) / totalSessions)
    : 0;
  const hadirCount = filteredReports.filter((r) => r.statusKehadiran === 'Hadir').length;
  const attendanceRate = totalSessions > 0 ? Math.round((hadirCount / totalSessions) * 100) : 100;

  // Selected Student for Recap
  const targetStudentForRecap = useMemo(() => {
    if (!recapStudentName) return null;
    return students.find((s) => s.namaSiswa === recapStudentName) || null;
  }, [recapStudentName, students]);

  // Reports specifically for the target student in the recap
  const recapReportsForStudent = useMemo(() => {
    if (!recapStudentName) return [];
    return reports
      .filter((r) => r.namaSiswa === recapStudentName)
      .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
  }, [reports, recapStudentName]);

  const studentAvgScore = recapReportsForStudent.length > 0
    ? Math.round(recapReportsForStudent.reduce((acc, r) => acc + (r.skorPemahaman ?? 85), 0) / recapReportsForStudent.length)
    : 0;

  // Open Recap Modal
  const handleOpenRecapModal = (studentName?: string) => {
    const studentToUse = studentName || (selectedStudentName !== 'all' ? selectedStudentName : (students.length > 0 ? students[0].namaSiswa : ''));
    setRecapStudentName(studentToUse);
    setIsRecapModalOpen(true);
  };

  // Generate WhatsApp Message text for Parents
  const generateParentWhatsAppText = () => {
    if (!targetStudentForRecap && recapReportsForStudent.length === 0) return '';

    const studentName = recapStudentName;
    const parentPhone = targetStudentForRecap?.nomorOrangTua || contactWA;
    const teacherName = recapReportsForStudent[0]?.namaPengajar || 'Tim Tutor DME';
    const jenjang = targetStudentForRecap?.jenjang || recapReportsForStudent[0]?.jenjang || 'SD';
    const grade = targetStudentForRecap?.kelasGrade || recapReportsForStudent[0]?.kelasGrade || '';

    let text = `*REKAPITULASI LAPORAN BELAJAR - DESSA MENTARI EDUCATION*\n`;
    text += `_Tempat Belajar Terpercaya · Les Privat Keluarga Indonesia_\n\n`;
    text += `Yth. Bapak/Ibu Wali dari Ananda *${studentName}*,\n`;
    text += `Berikut kami sampaikan rekapan hasil pembelajaran les privat:\n\n`;
    text += `📌 *Data Siswa:*\n`;
    text += `• Nama Siswa: *${studentName}*\n`;
    text += `• Jenjang / Kelas: ${jenjang} ${grade ? `(${grade})` : ''}\n`;
    text += `• Tutor Pembimbing: ${teacherName}\n`;
    text += `• Total Pertemuan: *${recapReportsForStudent.length} Sesi*\n`;
    text += `• Rerata Pemahaman: *${studentAvgScore}%* (${studentAvgScore >= 90 ? 'A+ Sangat Memuaskan' : studentAvgScore >= 80 ? 'A Baik & Mandiri' : 'B Cukup Baik'})\n\n`;

    text += `📝 *Rincian Setiap Pertemuan:*\n`;
    recapReportsForStudent.slice(-10).forEach((r, idx) => {
      text += `*${idx + 1}. Tgl ${r.tanggal} (${r.mataPelajaran})*\n`;
      text += `   • Materi: ${r.materiDipelajari}\n`;
      text += `   • Nilai Pemahaman: ${r.skorPemahaman ?? 85}%\n`;
      text += `   • Catatan Tutor: ${r.evaluasiSiswa}\n`;
      if (r.tugasRumah) {
        text += `   • PR: ${r.tugasRumah}\n`;
      }
      text += `\n`;
    });

    text += `💡 *Catatan Lembaga:*\n`;
    text += `Ananda menunjukkan perkembangan belajar yang positif. Kami mengapresiasi kerjasama Ayah & Bunda dalam mendampingi belajar di rumah.\n\n`;
    text += `Jika ada pertanyaan terkait jadwal bimbingan atau kurikulum, silakan hubungi admin di WA: 087879069404.\n\n`;
    text += `Terima kasih atas kepercayaannya.\n`;
    text += `_© 2026 Dessa Mentari Education_`;

    return text;
  };

  // Send WhatsApp Direct
  const handleSendParentWhatsApp = () => {
    const rawPhone = targetStudentForRecap?.nomorOrangTua || contactWA;
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const finalPhone = cleanPhone.startsWith('0') ? `62${cleanPhone.slice(1)}` : cleanPhone;
    const text = encodeURIComponent(generateParentWhatsAppText());
    window.open(`https://wa.me/${finalPhone}?text=${text}`, '_blank');
  };

  // Copy WhatsApp Text
  const handleCopyWhatsAppText = () => {
    navigator.clipboard.writeText(generateParentWhatsAppText());
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 2500);
  };

  // Print PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER SECTION */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-amber-500/30 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>Admin Rekapitulasi · Sinkronisasi Laporan Guru</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif-brand tracking-tight text-white">
              Rekapan Pembelajaran & Laporan Orang Tua
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Seluruh laporan yang dikirim guru tersinkronisasi otomatis di sini. Filter per siswa atau rentang waktu, 
              lalu generate rekapan resmi untuk dibagikan ke orang tua murid via WhatsApp atau cetak PDF.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto">
            <button
              onClick={() => handleOpenRecapModal()}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Rekapan Orang Tua</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Total Pertemuan</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 tabular-nums">{totalSessions}</span>
            <span className="text-xs font-semibold text-slate-500">Sesi Selesai</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Rata-rata Pemahaman</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-600 tabular-nums">{avgPemahaman}%</span>
            <span className="text-xs font-bold text-amber-800">
              {avgPemahaman >= 90 ? 'A+ (Istimewa)' : avgPemahaman >= 80 ? 'A (Baik)' : 'B (Cukup)'}
            </span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Tingkat Kehadiran</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-600 tabular-nums">{attendanceRate}%</span>
            <span className="text-xs font-semibold text-emerald-700">Disiplin</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Siswa Terfilter</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-blue-600 tabular-nums">
              {new Set(filteredReports.map((r) => r.namaSiswa)).size}
            </span>
            <span className="text-xs font-semibold text-slate-500">Peserta Didik</span>
          </div>
        </div>
      </div>

      {/* 3. FILTERS & SEARCH CONTROLS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Filter className="w-4 h-4 text-amber-600" />
            <span>Filter Laporan Guru:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by Siswa */}
            <div className="w-full sm:w-auto">
              <select
                value={selectedStudentName}
                onChange={(e) => setSelectedStudentName(e.target.value)}
                className="w-full sm:w-48 px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Semua Siswa</option>
                {students.map((s) => (
                  <option key={s.id} value={s.namaSiswa}>{s.namaSiswa}</option>
                ))}
              </select>
            </div>

            {/* Filter by Guru */}
            <div className="w-full sm:w-auto">
              <select
                value={selectedTeacherName}
                onChange={(e) => setSelectedTeacherName(e.target.value)}
                className="w-full sm:w-48 px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Semua Guru / Tutor</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.namaLengkap}>{t.namaLengkap}</option>
                ))}
              </select>
            </div>

            {/* Time Filter */}
            <div className="w-full sm:w-auto">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as any)}
                className="w-full sm:w-40 px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="this_month">Bulan Ini</option>
                <option value="last_30_days">30 Hari Terakhir</option>
                <option value="all">Semua Periode</option>
                <option value="custom">Rentang Tanggal</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari materi, siswa, mapel..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Custom Date Inputs if timeFilter === 'custom' */}
        {timeFilter === 'custom' && (
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
            <span className="font-bold text-slate-600">Rentang Tanggal:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800"
            />
            <span className="text-slate-400">s/d</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800"
            />
          </div>
        )}
      </div>

      {/* 4. SESSIONS RECAP TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 font-serif-brand">
              Daftar Laporan Pembelajaran Terverifikasi
            </h2>
            <p className="text-xs text-slate-500">
              Menampilkan {filteredReports.length} laporan pertemuan dari tutor lapangan.
            </p>
          </div>

          {selectedStudentName !== 'all' && (
            <button
              onClick={() => handleOpenRecapModal(selectedStudentName)}
              className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Rekap Khusus {selectedStudentName}</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                <th className="py-3 px-3">Sesi / Tanggal</th>
                <th className="py-3 px-3">Siswa & Jenjang</th>
                <th className="py-3 px-3">Guru Pengampu</th>
                <th className="py-3 px-3">Mata Pelajaran & Materi</th>
                <th className="py-3 px-3 text-center">Pemahaman</th>
                <th className="py-3 px-3">Evaluasi & PR</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-600">Tidak ada laporan yang sesuai dengan filter.</p>
                    <p className="text-[11px] text-slate-400">Pilih rentang tanggal lain atau gunakan filter siswa.</p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Sesi & Tanggal */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900">
                        {r.sesiKe ? `Sesi ${r.sesiKe}` : `Sesi #${filteredReports.length - idx}`}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-600" />
                        <span>{r.tanggal}</span>
                      </div>
                    </td>

                    {/* Siswa */}
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-900">{r.namaSiswa}</div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {r.jenjang} {r.kelasGrade ? `(${r.kelasGrade})` : ''}
                      </div>
                    </td>

                    {/* Guru */}
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800 block">{r.namaPengajar}</span>
                    </td>

                    {/* Mapel & Materi */}
                    <td className="py-3 px-3">
                      <span className="font-extrabold text-amber-900 block">{r.mataPelajaran}</span>
                      <p className="text-[11px] text-slate-600 line-clamp-2 max-w-xs">{r.materiDipelajari}</p>
                    </td>

                    {/* Pemahaman */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{r.skorPemahaman ?? 85}%</span>
                      </div>
                    </td>

                    {/* Evaluasi */}
                    <td className="py-3 px-3 max-w-xs">
                      <p className="text-[11px] text-slate-700 line-clamp-2 italic">{r.evaluasiSiswa}</p>
                      {r.tugasRumah && (
                        <p className="text-[10px] text-emerald-700 font-bold mt-0.5 truncate">
                          PR: {r.tugasRumah}
                        </p>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleOpenRecapModal(r.namaSiswa)}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[11px] shadow-2xs whitespace-nowrap"
                        title="Buat Rekapan Orang Tua"
                      >
                        Rekap Siswa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MODAL / OFFICIAL PARENT STATEMENT DOCUMENT */}
      {isRecapModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95">
            {/* Modal Header Bar (Non-Print) */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-xs px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 z-10 no-print">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-serif-brand">
                    Lembar Rekapan Pembelajaran Resmi Orang Tua
                  </h3>
                  <p className="text-xs text-slate-500">
                    Siap dibagikan ke wali murid via WhatsApp atau dicetak sebagai dokumen evaluasi.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsRecapModalOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Selector Siswa in Modal (Non-Print) */}
            <div className="px-6 no-print">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-bold text-slate-700">Pilih Siswa untuk Rekapan:</span>
                <select
                  value={recapStudentName}
                  onChange={(e) => setRecapStudentName(e.target.value)}
                  className="px-3 py-1.5 font-bold rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.namaSiswa}>{s.namaSiswa}</option>
                  ))}
                  {Array.from(new Set(reports.map((r) => r.namaSiswa))).map((name) => (
                    !students.some((s) => s.namaSiswa === name) ? (
                      <option key={name} value={name}>{name}</option>
                    ) : null
                  ))}
                </select>
              </div>
            </div>

            {/* ======================================================== */}
            {/* DOCUMENT BODY (PRINTABLE OFFICIAL STATEMENT) */}
            {/* ======================================================== */}
            <div className="px-6 sm:px-8 py-4 space-y-6 text-slate-900 printable-document">
              {/* INSTITUTION KOP SURAT */}
              <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white p-1 border border-amber-400 shadow-2xs flex items-center justify-center shrink-0">
                    <img
                      src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
                      alt="Logo DME"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif-brand tracking-tight">
                      Dessa Mentari Education
                    </h2>
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                      Tempat Belajar Terpercaya · Les Privat Keluarga Indonesia
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Program Bimbingan Belajar Privat Kurikulum Merdeka & Nasional Plus (TK, SD, SMP, SMA)
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-600 hidden sm:block font-medium">
                  <p className="font-bold text-slate-900">Kantor Layanan Akademik</p>
                  <p>WhatsApp: +62 878-7906-9404</p>
                  <p>DKI Jakarta & Sekitarnya</p>
                </div>
              </div>

              {/* TITLE */}
              <div className="text-center space-y-1">
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900 font-serif-brand">
                  Laporan Rekapitulasi Perkembangan Belajar Siswa
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Dokumen Evaluasi Capaian Pembelajaran & Pendampingan Les Privat Berkala
                </p>
              </div>

              {/* PROFILE SISWA & TUTOR BOX */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Nama Peserta Didik</span>
                  <span className="font-black text-slate-900 text-sm block mt-0.5">{recapStudentName}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">{targetStudentForRecap?.sekolah || 'Siswa Aktif'}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Jenjang & Kelas</span>
                  <span className="font-extrabold text-slate-900 block mt-0.5">
                    {targetStudentForRecap?.jenjang || recapReportsForStudent[0]?.jenjang || 'SD'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {targetStudentForRecap?.kelasGrade || recapReportsForStudent[0]?.kelasGrade || 'Kelas 4'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tutor Penanggung Jawab</span>
                  <span className="font-extrabold text-slate-900 block mt-0.5">
                    {recapReportsForStudent[0]?.namaPengajar || 'Sarah Syahidah Syahrudin, S.Pd'}
                  </span>
                  <span className="text-[10px] text-slate-500">Instruktur Les Privat</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Kontak Orang Tua</span>
                  <span className="font-extrabold text-slate-900 block mt-0.5">
                    {targetStudentForRecap?.nomorOrangTua || '087879069404'}
                  </span>
                  <span className="text-[10px] text-slate-500">{targetStudentForRecap?.namaOrangTua || 'Wali Murid'}</span>
                </div>
              </div>

              {/* SUMMARY STATS BANNER */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Total Sesi Pertemuan</span>
                  <span className="text-2xl font-black text-amber-950 tabular-nums">{recapReportsForStudent.length}</span>
                  <span className="text-[10px] text-amber-700 block">Sesi Tuntas</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Rata-rata Pemahaman</span>
                  <span className="text-2xl font-black text-emerald-700 tabular-nums">{studentAvgScore}%</span>
                  <span className="text-[10px] font-bold text-emerald-800 block">
                    {studentAvgScore >= 90 ? 'A+ (Istimewa)' : studentAvgScore >= 80 ? 'A (Sangat Baik)' : 'B (Baik)'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Tingkat Kehadiran</span>
                  <span className="text-2xl font-black text-slate-900 tabular-nums">100%</span>
                  <span className="text-[10px] text-slate-600 block">Disiplin Tinggi</span>
                </div>
              </div>

              {/* SESSIONS BREAKDOWN TABLE */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 font-serif-brand">
                  Rincian Riwayat Pertemuan Les Privat:
                </h4>

                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 w-16">Sesi</th>
                      <th className="py-2.5 px-3 w-28">Tanggal</th>
                      <th className="py-2.5 px-3">Mata Pelajaran & Materi Pokok</th>
                      <th className="py-2.5 px-3 text-center w-24">Skor Nilai</th>
                      <th className="py-2.5 px-3">Catatan Perkembangan & PR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {recapReportsForStudent.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400">
                          Belum ada catatan pertemuan untuk siswa ini.
                        </td>
                      </tr>
                    ) : (
                      recapReportsForStudent.map((r, idx) => (
                        <tr key={r.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                            #{r.sesiKe || idx + 1}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                            {r.tanggal}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-900 block">{r.mataPelajaran}</span>
                            <span className="text-[11px] text-slate-600 block">{r.materiDipelajari}</span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold">
                            <span className="text-amber-800 font-mono text-xs">{r.skorPemahaman ?? 85}%</span>
                          </td>
                          <td className="py-2.5 px-3 text-[11px]">
                            <p className="text-slate-700">{r.evaluasiSiswa}</p>
                            {r.tugasRumah && (
                              <p className="text-emerald-700 font-bold mt-0.5">PR: {r.tugasRumah}</p>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* CATATAN & REKOMENDASI UNTUK ORANG TUA */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <span className="font-bold text-slate-900 block">Rekomendasi Pembelajaran untuk Orang Tua:</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Ananda <strong>{recapStudentName}</strong> menunjukkan motivasi belajar yang sangat menggembirakan. 
                  Untuk menjaga konsistensi prestasi, disarankan orang tua terus memberikan apresiasi positif dan mendampingi 
                  pengulangan latihan soal selama 15-20 menit setiap hari di rumah.
                </p>
              </div>

              {/* SIGNATURE / PENGESAHAN */}
              <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <p className="text-slate-500">Tutor Pengampu,</p>
                  <div className="h-14 flex items-center justify-center">
                    <span className="font-serif-brand font-bold text-slate-400 italic">Ttd Digital DME</span>
                  </div>
                  <p className="font-bold text-slate-900 border-t border-slate-300 pt-1 inline-block min-w-[160px]">
                    {recapReportsForStudent[0]?.namaPengajar || 'Sarah Syahidah Syahrudin, S.Pd'}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Mengetahui, Direktur Lembaga</p>
                  <div className="h-14 flex items-center justify-center">
                    <span className="font-serif-brand font-bold text-amber-700 italic">Deni Santoso, M.M</span>
                  </div>
                  <p className="font-bold text-slate-900 border-t border-slate-300 pt-1 inline-block min-w-[160px]">
                    Deni Santoso, M.M
                  </p>
                </div>
              </div>

              {/* OFFICIAL FOOTER */}
              <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
                <p>© 2026 Dessa Mentari Education · Hak Cipta Dilindungi Undang-Undang</p>
                <p>Dokumen ini diterbitkan secara sah melalui Sistem Manajemen Bimbingan Belajar Terpadu.</p>
              </div>
            </div>

            {/* MODAL ACTION BAR (NON-PRINT) */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-xs px-6 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 no-print">
              <button
                type="button"
                onClick={handleCopyWhatsAppText}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                {copiedWA ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedWA ? 'Teks Tersalin!' : 'Salin Format Teks WA'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendParentWhatsApp}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Rekapan via WhatsApp ke Orang Tua</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

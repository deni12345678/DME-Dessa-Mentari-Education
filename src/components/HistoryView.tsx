import React, { useState } from 'react';
import { ReportData } from '../types/report';
import { 
  Search, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  BookOpen, 
  Share2, 
  Check, 
  FileSpreadsheet,
  TrendingUp,
  BarChart3,
  Award,
  Sparkles,
  Target,
  User,
  PieChart,
  Download,
  FileText
} from 'lucide-react';
import { copyWhatsAppTextToClipboard } from '../utils/exportImage';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HistoryViewProps {
  reports: ReportData[];
  onSelectReport: (report: ReportData) => void;
  onDeleteReport: (id: string) => void;
  onDownloadReport?: (report: ReportData) => void;
  onDownloadPdf?: (report: ReportData) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  reports,
  onSelectReport,
  onDeleteReport,
  onDownloadReport,
  onDownloadPdf,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  const handleCopyAdminLink = (reportId: string) => {
    const url = `${window.location.origin}${window.location.pathname}?reportId=${reportId}`;
    navigator.clipboard.writeText(url);
    setCopiedLinkId(reportId);
    setTimeout(() => setCopiedLinkId(null), 2500);
  };

  // Extract unique student names
  const studentNames = Array.from(new Set(reports.map((r) => r.namaSiswa).filter(Boolean)));

  // Filter reports list based on search and student dropdown
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.namaSiswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.mataPelajaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.materiDipelajari.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStudent =
      selectedStudentFilter === 'all' || r.namaSiswa === selectedStudentFilter;

    return matchesSearch && matchesStudent;
  });

  // Filter reports specifically for Chart data (chronological order by date)
  const chartReports = (
    selectedStudentFilter === 'all'
      ? reports
      : reports.filter((r) => r.namaSiswa === selectedStudentFilter)
  )
    .slice()
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  // Chart 1: Line Chart Data (Progress Trends)
  const lineChartLabels = chartReports.map((r) => {
    const d = new Date(r.tanggal);
    return isNaN(d.getTime()) ? r.tanggal : `${d.getDate()}/${d.getMonth() + 1}`;
  });

  const lineChartData = {
    labels: lineChartLabels,
    datasets: [
      {
        label: 'Skor Pemahaman (%)',
        data: chartReports.map((r) => r.skorPemahaman ?? 85),
        borderColor: '#d97706', // amber-600
        backgroundColor: 'rgba(217, 119, 6, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Skor Keaktifan (%)',
        data: chartReports.map((r) => r.skorKeaktifan ?? 90),
        borderColor: '#059669', // emerald-600
        backgroundColor: 'rgba(5, 150, 105, 0.05)',
        fill: false,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Skor Fokus (%)',
        data: chartReports.map((r) => r.skorFokus ?? 85),
        borderColor: '#4f46e5', // indigo-600
        backgroundColor: 'rgba(79, 70, 229, 0.05)',
        fill: false,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { family: 'Plus Jakarta Sans', size: 11, weight: 600 },
          usePointStyle: true,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        min: 40,
        max: 100,
        ticks: { stepSize: 10, font: { family: 'Plus Jakarta Sans', size: 10 } },
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
      },
      x: {
        ticks: { font: { family: 'Plus Jakarta Sans', size: 10 } },
        grid: { display: false },
      },
    },
  };

  // Chart 2: Subject Distribution (Doughnut / Bar)
  const subjectCounts: Record<string, number> = {};
  chartReports.forEach((r) => {
    const subj = r.mataPelajaran || 'Lainnya';
    subjectCounts[subj] = (subjectCounts[subj] || 0) + 1;
  });

  const subjectLabels = Object.keys(subjectCounts);
  const subjectDataValues = Object.values(subjectCounts);

  const doughnutData = {
    labels: subjectLabels,
    datasets: [
      {
        data: subjectDataValues,
        backgroundColor: [
          '#f59e0b', // amber
          '#10b981', // emerald
          '#6366f1', // indigo
          '#ec4899', // pink
          '#06b6d4', // cyan
          '#8b5cf6', // purple
          '#f97316', // orange
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { family: 'Plus Jakarta Sans', size: 10 },
          boxWidth: 10,
        },
      },
    },
  };

  // Metrics summary
  const avgPemahaman = chartReports.length
    ? Math.round(
        chartReports.reduce((acc, curr) => acc + (curr.skorPemahaman ?? 85), 0) /
          chartReports.length
      )
    : 0;

  const avgKeaktifan = chartReports.length
    ? Math.round(
        chartReports.reduce((acc, curr) => acc + (curr.skorKeaktifan ?? 90), 0) /
          chartReports.length
      )
    : 0;

  const avgFokus = chartReports.length
    ? Math.round(
        chartReports.reduce((acc, curr) => acc + (curr.skorFokus ?? 85), 0) /
          chartReports.length
      )
    : 0;

  const handleCopyWA = async (report: ReportData) => {
    const ok = await copyWhatsAppTextToClipboard(report);
    if (ok) {
      setCopiedId(report.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* CLOUD FIRESTORE SYNC BANNER FOR ADMIN & TUTORS */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-4 rounded-2xl shadow-sm border border-emerald-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <span>🟢 Firebase Cloud Firestore Connected</span>
            </h4>
            <p className="text-xs text-slate-200 mt-0.5">
              Semua laporan otomatis tersimpan di cloud terpusat. Admin dapat memantau & mengakses link laporan ini secara real-time dari HP/Laptop mana saja.
            </p>
          </div>
        </div>
        <div className="bg-emerald-800/60 px-3 py-1.5 rounded-xl border border-emerald-600/50 text-[11px] font-semibold text-emerald-200 shrink-0">
          Akses Online Admin Active
        </div>
      </div>

      {/* SECTION TITLE & STUDENT FILTER */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif-brand flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-600" />
              Grafik Perkembangan & Riwayat Laporan
            </h2>
            <p className="text-xs text-slate-500">
              Analisis grafik statistik keaktifan dan perkembangan nilai siswa Dessa Mentari Education.
            </p>
          </div>

          {/* Student Filter Dropdown */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-amber-600" />
            <select
              value={selectedStudentFilter}
              onChange={(e) => setSelectedStudentFilter(e.target.value)}
              className="text-xs p-2 rounded-xl border border-amber-300 bg-amber-50/50 font-semibold text-amber-900 focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="all">Semua Siswa ({reports.length} Sesi)</option>
              {studentNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* METRICS SUMMARY CARDS */}
        {chartReports.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-xl text-center space-y-1">
              <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-600" /> Rata-Rata Pemahaman
              </span>
              <p className="text-xl font-extrabold text-amber-900">{avgPemahaman}%</p>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-xl text-center space-y-1">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Rata-Rata Keaktifan
              </span>
              <p className="text-xl font-extrabold text-emerald-900">{avgKeaktifan}%</p>
            </div>

            <div className="bg-indigo-50/80 border border-indigo-200 p-3.5 rounded-xl text-center space-y-1">
              <span className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wider block flex items-center justify-center gap-1">
                <Target className="w-3.5 h-3.5 text-indigo-600" /> Rata-Rata Fokus
              </span>
              <p className="text-xl font-extrabold text-indigo-900">{avgFokus}%</p>
            </div>

            <div className="bg-slate-100 border border-slate-200 p-3.5 rounded-xl text-center space-y-1">
              <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block flex items-center justify-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> Total Sesi Laporan
              </span>
              <p className="text-xl font-extrabold text-slate-900">{chartReports.length} Sesi</p>
            </div>
          </div>
        )}

        {/* CHART.JS GRAPHICS SECTION */}
        {chartReports.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            {/* Chart 1: Line Chart (65% width) */}
            <div className="lg:col-span-8 bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  Grafik Tren Nilai & Keaktifan Belajar (Chart.js)
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  {selectedStudentFilter === 'all' ? 'Semua Siswa' : selectedStudentFilter}
                </span>
              </div>
              <div className="h-64 sm:h-72 w-full">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </div>

            {/* Chart 2: Subject Breakdown Doughnut (35% width) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-emerald-600" />
                  Distribusi Mata Pelajaran
                </h3>
              </div>
              <div className="h-64 sm:h-72 w-full flex items-center justify-center">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-amber-50 rounded-xl text-center text-xs text-amber-800">
            Belum ada data laporan untuk siswa yang dipilih. Tambahkan laporan baru untuk melihat grafik perkembangan.
          </div>
        )}
      </div>

      {/* SEARCHABLE REPORTS LIST */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            Daftar Berkas Laporan ({filteredReports.length})
          </h3>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari siswa atau mata pelajaran..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Tidak ada laporan ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((item) => (
              <div
                key={item.id}
                className="border border-slate-200 hover:border-amber-300 rounded-xl p-4 bg-slate-50/50 hover:bg-white transition-all shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {item.namaSiswa}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-900 rounded-md">
                        {item.jenjang}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                        {item.mataPelajaran}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.tanggal}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteReport(item.id)}
                    title="Hapus Laporan"
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Score Pills Summary */}
                <div className="flex items-center gap-2 text-[11px] font-medium">
                  <span className="px-2 py-0.5 bg-amber-100/70 text-amber-900 rounded-md">
                    Pemahaman: {item.skorPemahaman ?? 85}%
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100/70 text-emerald-900 rounded-md">
                    Keaktifan: {item.skorKeaktifan ?? 90}%
                  </span>
                </div>

                {/* Snippet of Materi */}
                <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 line-clamp-2 italic">
                  "{item.materiDipelajari}"
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                  <button
                    onClick={() => onSelectReport(item)}
                    className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Muat ke Form</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyAdminLink(item.id)}
                      title="Salin Link Direct Admin"
                      className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center gap-1"
                    >
                      {copiedLinkId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3 h-3 text-indigo-600" />
                          <span>Link Admin</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopyWA(item)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3 h-3" />
                          <span>Teks WA</span>
                        </>
                      )}
                    </button>

                    {onDownloadPdf && (
                      <button
                        onClick={() => onDownloadPdf(item)}
                        title="Unduh laporan ini sebagai berkas PDF resmi"
                        className="px-2.5 py-1 text-[11px] font-semibold bg-rose-700 hover:bg-rose-800 text-white rounded-lg transition-all flex items-center gap-1 shadow-2xs"
                      >
                        <FileText className="w-3 h-3 text-white" />
                        <span>Unduh PDF</span>
                      </button>
                    )}

                    {onDownloadReport && (
                      <button
                        onClick={() => onDownloadReport(item)}
                        title="Unduh laporan ini sebagai gambar JPG"
                        className="px-2.5 py-1 text-[11px] font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all flex items-center gap-1 shadow-2xs"
                      >
                        <Download className="w-3 h-3 text-white" />
                        <span>Unduh JPG</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

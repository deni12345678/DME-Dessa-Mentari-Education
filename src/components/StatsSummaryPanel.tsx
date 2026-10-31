import React from 'react';
import { ReportData } from '../types/report';
import { 
  FileCheck2, 
  Award, 
  TrendingUp, 
  CalendarDays, 
  Sparkles,
  BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface StatsSummaryPanelProps {
  reports: ReportData[];
}

export const StatsSummaryPanel: React.FC<StatsSummaryPanelProps> = ({ reports }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const currentMonthName = monthNames[currentMonth];

  // Filter reports created in current month
  const reportsThisMonth = reports.filter((r) => {
    if (!r.tanggal) return false;
    const d = new Date(r.tanggal);
    return !isNaN(d.getTime()) && d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  // Calculate stats
  const totalReports = reports.length;
  
  const relevantReportsForAvg = reportsThisMonth.length > 0 ? reportsThisMonth : reports;
  const avgPemahamanMonth = relevantReportsForAvg.length > 0
    ? Math.round(
        relevantReportsForAvg.reduce((acc, r) => acc + (r.skorPemahaman ?? 85), 0) /
          relevantReportsForAvg.length
      )
    : 0;

  // Prepare chart data for Recharts
  const sortedReports = (reportsThisMonth.length > 0 ? reportsThisMonth : reports)
    .slice()
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  const chartData = sortedReports.map((r) => {
    const d = new Date(r.tanggal);
    const label = !isNaN(d.getTime()) ? `${d.getDate()} ${monthNames[d.getMonth()].slice(0, 3)}` : r.tanggal;
    return {
      tanggal: label,
      siswa: r.namaSiswa ? r.namaSiswa.split(' ')[0] : 'Siswa',
      namaLengkap: r.namaSiswa || 'Siswa',
      pemahaman: r.skorPemahaman ?? 85,
      keaktifan: r.skorKeaktifan ?? 90,
      fokus: r.skorFokus ?? 85,
      mapel: r.mataPelajaran || 'Umum',
    };
  });

  // Category evaluation text
  const getCategoryLabel = (score: number) => {
    if (score >= 90) return 'Sangat Baik (A+)';
    if (score >= 80) return 'Baik (A)';
    if (score >= 70) return 'Cukup (B)';
    return 'Perlu Pendampingan';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5 no-print">
      {/* PANEL TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif-brand">
              Ringkasan Statistik Pembelajaran
            </h2>
            <p className="text-[11px] text-slate-500">
              Ikhtisar laporan & performa pemahaman siswa bulan {currentMonthName} {currentYear}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full self-start sm:self-auto flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Recharts Analytics
        </span>
      </div>

      {/* STAT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Reports */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200/80 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500 text-white shadow-xs shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
              Total Laporan Terbuat
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-amber-950">{totalReports}</span>
              <span className="text-[11px] font-semibold text-amber-700">Berkas Laporan</span>
            </div>
            <p className="text-[10px] text-amber-700/80 mt-0.5">
              {reportsThisMonth.length} laporan di bulan {currentMonthName}
            </p>
          </div>
        </div>

        {/* Avg Comprehension Score This Month */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200/80 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-600 text-white shadow-xs shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
              Rata-Rata Pemahaman ({currentMonthName.slice(0, 3)})
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-emerald-950">{avgPemahamanMonth}%</span>
              <span className="text-[11px] font-bold text-emerald-700">
                {getCategoryLabel(avgPemahamanMonth)}
              </span>
            </div>
            <p className="text-[10px] text-emerald-700/80 mt-0.5">
              Berdasarkan evaluasi skor les privat
            </p>
          </div>
        </div>

        {/* Total Sessions This Month */}
        <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 border border-slate-200 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-slate-900 text-amber-300 shadow-xs shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
              Sesi Les Bulan Ini
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{reportsThisMonth.length}</span>
              <span className="text-[11px] font-semibold text-slate-600">Sesi Selesai</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Dessa Mentari Education
            </p>
          </div>
        </div>
      </div>

      {/* RECHARTS AREA CHART */}
      {chartData.length > 0 && (
        <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              Grafik Recharts: Tren Pemahaman Siswa ({currentMonthName})
            </span>
            <span className="text-[10px] font-medium text-slate-500">
              Skor (%) Per Sesi
            </span>
          </div>

          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="pemahamanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="keaktifanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="tanggal" 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis 
                  domain={[40, 100]} 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="pemahaman" 
                  name="Skor Pemahaman" 
                  stroke="#d97706" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#pemahamanGrad)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="keaktifan" 
                  name="Skor Keaktifan" 
                  stroke="#059669" 
                  strokeWidth={1.5} 
                  strokeDasharray="4 4"
                  fillOpacity={1} 
                  fill="url(#keaktifanGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
        <p className="font-bold text-amber-300">{data.namaLengkap} ({data.tanggal})</p>
        <p className="text-slate-300 text-[11px]">Mapel: <span className="font-semibold text-white">{data.mapel}</span></p>
        <div className="pt-1 border-t border-slate-700 space-y-0.5">
          <p className="text-amber-400 font-bold flex items-center justify-between gap-3">
            <span>Pemahaman:</span>
            <span>{data.pemahaman}%</span>
          </p>
          <p className="text-emerald-400 font-bold flex items-center justify-between gap-3">
            <span>Keaktifan:</span>
            <span>{data.keaktifan}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

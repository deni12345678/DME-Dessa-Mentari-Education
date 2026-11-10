import React, { useState, useMemo } from 'react';
import { ReportData, EducationLevel } from '../types/report';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Award, 
  Calendar, 
  FileCheck2, 
  CheckCircle2, 
  Layers, 
  Activity, 
  Filter, 
  Target,
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  CartesianGrid, 
  ReferenceLine, 
  Legend 
} from 'recharts';

interface StatsSummaryPanelProps {
  reports: ReportData[];
}

type ChartTab = 'progress' | 'volume' | 'attendance' | 'daily';

interface MonthlyStats {
  monthKey: string; // YYYY-MM
  monthLabel: string; // e.g. "Jun 2026"
  fullMonthLabel: string; // e.g. "Juni 2026"
  totalSessions: number;
  uniqueStudents: string[];
  activeStudentsCount: number;
  avgPemahaman: number;
  avgKeaktifan: number;
  avgFokus: number;
  compositeIndex: number;
  hadir: number;
  izin: number;
  reschedule: number;
  attendanceRate: number;
  subjects: string[];
}

export const StatsSummaryPanel: React.FC<StatsSummaryPanelProps> = ({ reports }) => {
  const [activeTab, setActiveTab] = useState<ChartTab>('progress');
  const [levelFilter, setLevelFilter] = useState<'all' | EducationLevel>('all');
  const [timeRange, setTimeRange] = useState<'6m' | 'all'>('6m');

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // 1. Filter reports based on Jenjang
  const filteredReports = useMemo(() => {
    if (levelFilter === 'all') return reports;
    return reports.filter((r) => r.jenjang === levelFilter);
  }, [reports, levelFilter]);

  // 2. Aggregate reports into Monthly Progress timeline
  const monthlyData: MonthlyStats[] = useMemo(() => {
    const map = new Map<string, ReportData[]>();

    filteredReports.forEach((r) => {
      if (!r.tanggal) return;
      const d = new Date(r.tanggal);
      if (isNaN(d.getTime())) return;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const key = `${yyyy}-${mm}`;

      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(r);
    });

    const sortedKeys = Array.from(map.keys()).sort();
    const slicedKeys = timeRange === '6m' ? sortedKeys.slice(-6) : sortedKeys;

    return slicedKeys.map((key) => {
      const list = map.get(key) || [];
      const [yearStr, monthStr] = key.split('-');
      const monthIdx = parseInt(monthStr, 10) - 1;
      const monthLabel = `${monthNames[monthIdx].slice(0, 3)} ${yearStr.slice(2)}`;
      const fullMonthLabel = `${monthNames[monthIdx]} ${yearStr}`;

      const totalSessions = list.length;
      const uniqueStudents = Array.from(new Set(list.map((r) => r.namaSiswa || 'Siswa')));
      
      const sumPemahaman = list.reduce((acc, r) => acc + (r.skorPemahaman ?? 85), 0);
      const sumKeaktifan = list.reduce((acc, r) => acc + (r.skorKeaktifan ?? 85), 0);
      const sumFokus = list.reduce((acc, r) => acc + (r.skorFokus ?? 85), 0);

      const avgPemahaman = totalSessions > 0 ? Math.round((sumPemahaman / totalSessions) * 10) / 10 : 0;
      const avgKeaktifan = totalSessions > 0 ? Math.round((sumKeaktifan / totalSessions) * 10) / 10 : 0;
      const avgFokus = totalSessions > 0 ? Math.round((sumFokus / totalSessions) * 10) / 10 : 0;
      const compositeIndex = Math.round(avgPemahaman * 0.45 + avgKeaktifan * 0.35 + avgFokus * 0.2);

      const hadir = list.filter((r) => r.statusKehadiran === 'Hadir').length;
      const izin = list.filter((r) => r.statusKehadiran === 'Izin / Sakit').length;
      const reschedule = list.filter((r) => r.statusKehadiran === 'Reschedule / Disingkat').length;
      const attendanceRate = totalSessions > 0 ? Math.round((hadir / totalSessions) * 100) : 100;

      const subjects = Array.from(new Set(list.map((r) => r.mataPelajaran || 'Umum')));

      return {
        monthKey: key,
        monthLabel,
        fullMonthLabel,
        totalSessions,
        uniqueStudents,
        activeStudentsCount: uniqueStudents.length,
        avgPemahaman,
        avgKeaktifan,
        avgFokus,
        compositeIndex,
        hadir,
        izin,
        reschedule,
        attendanceRate,
        subjects,
      };
    });
  }, [filteredReports, timeRange]);

  // 3. Overall Administrative KPIs
  const latestMonth = monthlyData[monthlyData.length - 1];
  const prevMonth = monthlyData.length >= 2 ? monthlyData[monthlyData.length - 2] : null;

  // MoM growth in session activity
  const sessionGrowthMoM = useMemo(() => {
    if (!latestMonth || !prevMonth || prevMonth.totalSessions === 0) return 0;
    return Math.round(((latestMonth.totalSessions - prevMonth.totalSessions) / prevMonth.totalSessions) * 100);
  }, [latestMonth, prevMonth]);

  // Total unique students across all periods
  const totalUniqueLearners = useMemo(() => {
    const set = new Set(filteredReports.map((r) => r.namaSiswa || 'Siswa'));
    return set.size;
  }, [filteredReports]);

  // Peak month
  const peakMonth = useMemo(() => {
    if (monthlyData.length === 0) return null;
    return monthlyData.reduce((prev, curr) => (curr.totalSessions > prev.totalSessions ? curr : prev), monthlyData[0]);
  }, [monthlyData]);

  // Overall average scores
  const overallAvgPemahaman = useMemo(() => {
    if (filteredReports.length === 0) return 0;
    const sum = filteredReports.reduce((acc, r) => acc + (r.skorPemahaman ?? 85), 0);
    return Math.round((sum / filteredReports.length) * 10) / 10;
  }, [filteredReports]);

  // Overall attendance rate
  const overallAttendanceRate = useMemo(() => {
    if (filteredReports.length === 0) return 100;
    const hadirCount = filteredReports.filter((r) => r.statusKehadiran === 'Hadir').length;
    return Math.round((hadirCount / filteredReports.length) * 100);
  }, [filteredReports]);

  // 4. Daily sessions data (for the 'daily' granular tab)
  const sortedDailyReports = useMemo(() => {
    return filteredReports
      .slice()
      .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
      .slice(-12); // Last 12 sessions
  }, [filteredReports]);

  const dailyChartData = useMemo(() => {
    return sortedDailyReports.map((r) => {
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
        jenjang: r.jenjang,
      };
    });
  }, [sortedDailyReports]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6 no-print">
      {/* 1. TOP HEADER & ADMINISTRATIVE CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 font-serif-brand">
                Analitik Kemajuan Bulanan & Performa Siswa
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Visualisasi tren pembelajaran berkala (Recharts / D3 engine) untuk pemantauan evaluasi lembaga.
              </p>
            </div>
          </div>
        </div>

        {/* CONTROLS: LEVEL FILTER & TIME RANGE */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Jenjang Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-700">
            <span className="px-2 text-[11px] text-slate-500 font-bold hidden sm:inline">Jenjang:</span>
            {(['all', 'SD', 'SMP', 'SMA', 'TK'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  levelFilter === lvl
                    ? 'bg-white text-slate-950 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl === 'all' ? 'Semua' : lvl}
              </button>
            ))}
          </div>

          {/* Time Range Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-700">
            <button
              onClick={() => setTimeRange('6m')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                timeRange === '6m'
                  ? 'bg-white text-slate-950 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              6 Bulan
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                timeRange === 'all'
                  ? 'bg-white text-slate-950 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
          </div>
        </div>
      </div>

      {/* 2. ADMINISTRATIVE KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Sessions & MoM Growth */}
        <div className="bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-amber-200/80 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Total Sesi Bimbingan
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500 text-white">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-950 tabular-nums">
                {filteredReports.length}
              </span>
              <span className="text-xs font-semibold text-amber-800">Sesi Les</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px]">
              {sessionGrowthMoM >= 0 ? (
                <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +{sessionGrowthMoM}% MoM
                </span>
              ) : (
                <span className="text-rose-700 font-bold flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                  {sessionGrowthMoM}% MoM
                </span>
              )}
              <span className="text-slate-400">vs bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Avg Comprehension Index */}
        <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-200/80 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Rata-Rata Pemahaman
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-950 tabular-nums">
                {overallAvgPemahaman}%
              </span>
              <span className="text-xs font-bold text-emerald-700">
                {overallAvgPemahaman >= 90 ? 'A+ (Istimewa)' : overallAvgPemahaman >= 80 ? 'A (Sangat Baik)' : 'B (Baik)'}
              </span>
            </div>
            <p className="text-[10px] text-emerald-700/90 mt-1">
              Target KKM Standar Lembaga: ≥80%
            </p>
          </div>
        </div>

        {/* Unique Active Learners */}
        <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-200/80 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
              Siswa Aktif Terlibat
            </span>
            <div className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-blue-950 tabular-nums">
                {totalUniqueLearners}
              </span>
              <span className="text-xs font-semibold text-blue-800">Peserta Didik</span>
            </div>
            <p className="text-[10px] text-blue-700/80 mt-1">
              {latestMonth ? `${latestMonth.activeStudentsCount} aktif di ${latestMonth.monthLabel}` : 'Tercatat di sistem'}
            </p>
          </div>
        </div>

        {/* Attendance Efficiency */}
        <div className="bg-gradient-to-br from-violet-50/70 to-purple-50/40 border border-violet-200/80 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-800">
              Tingkat Kehadiran
            </span>
            <div className="p-1.5 rounded-lg bg-violet-600 text-white">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-violet-950 tabular-nums">
                {overallAttendanceRate}%
              </span>
              <span className="text-xs font-semibold text-violet-800">Disiplin</span>
            </div>
            <p className="text-[10px] text-violet-700/80 mt-1">
              {peakMonth ? `Puncak: ${peakMonth.monthLabel} (${peakMonth.totalSessions} sesi)` : 'Kedisiplinan terverifikasi'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE CHART TABS & RECHARTS VIEWPORT */}
      <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-4">
        {/* Navigation Tabs for Visualization Modes */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'progress'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Tren Kemajuan Belajar</span>
            </button>

            <button
              onClick={() => setActiveTab('volume')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'volume'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Volume Sesi & Siswa</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'attendance'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Komposisi Kehadiran</span>
            </button>

            <button
              onClick={() => setActiveTab('daily')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'daily'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Sesi Harian Terkini</span>
            </button>
          </div>

          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-2">
            <span>D3/Recharts Framework</span>
            <span>·</span>
            <span className="text-amber-800 font-bold">
              {monthlyData.length} Bulan Aktif
            </span>
          </div>
        </div>

        {/* TAB 1: TREN KEMAJUAN BELAJAR (MONTHLY PROGRESS COMPOSED CHART) */}
        {activeTab === 'progress' && (
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-1">
              <span className="font-semibold text-slate-800">
                Grafik Perkembangan Skor Pemahaman, Keaktifan, dan Fokus Belajar Siswa per Bulan
              </span>
              <span className="text-[11px] text-slate-500">
                Skala Nilai 0 - 100% · Standar KKM Target: 80%
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pemahamanGradMonth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d97706" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="keaktifanGradMonth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="monthLabel" 
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} 
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[60, 100]} 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip content={<MonthlyProgressTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontWeight: 600 }} 
                  />
                  <ReferenceLine 
                    y={80} 
                    stroke="#ef4444" 
                    strokeDasharray="4 4" 
                    label={{ value: 'Target KKM (80%)', position: 'insideTopLeft', fill: '#ef4444', fontSize: 10, fontWeight: 700 }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="avgPemahaman" 
                    name="Rata-rata Pemahaman" 
                    stroke="#d97706" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#pemahamanGradMonth)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="avgKeaktifan" 
                    name="Rata-rata Keaktifan" 
                    stroke="#059669" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#keaktifanGradMonth)" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgFokus" 
                    name="Tingkat Fokus" 
                    stroke="#6366f1" 
                    strokeWidth={2} 
                    strokeDasharray="4 4" 
                    dot={{ r: 3, fill: '#6366f1' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 2: VOLUME SESI & SISWA AKTIF */}
        {activeTab === 'volume' && (
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-1">
              <span className="font-semibold text-slate-800">
                Pertumbuhan Volume Pertemuan Bimbingan Belajar vs Jumlah Siswa Aktif per Bulan
              </span>
              <span className="text-[11px] text-slate-500">
                Batang: Total Sesi · Garis: Siswa Aktif
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="monthLabel" 
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} 
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis 
                    yAxisId="left"
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#d97706' }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip content={<MonthlyVolumeTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontWeight: 600 }} 
                  />
                  <Bar 
                    yAxisId="left"
                    dataKey="totalSessions" 
                    name="Volume Sesi Bimbingan" 
                    fill="#3b82f6" 
                    radius={[6, 6, 0, 0]} 
                    barSize={32}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="activeStudentsCount" 
                    name="Siswa Aktif Unik" 
                    stroke="#d97706" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#d97706' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 3: KOMPOSISI KEHADIRAN (STACKED BAR CHART) */}
        {activeTab === 'attendance' && (
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-1">
              <span className="font-semibold text-slate-800">
                Distribusi Status Kehadiran Sesi Les (Hadir, Izin/Sakit, Reschedule)
              </span>
              <span className="text-[11px] text-slate-500">
                Kedisiplinan & Rasio Efisiensi Jadwal
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="monthLabel" 
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} 
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip content={<MonthlyAttendanceTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontWeight: 600 }} 
                  />
                  <Bar dataKey="hadir" name="Hadir" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="reschedule" name="Reschedule" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="izin" name="Izin / Sakit" stackId="a" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 4: SESI HARIAN TERKINI */}
        {activeTab === 'daily' && (
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-1">
              <span className="font-semibold text-slate-800">
                Detail Skor Evaluasi Per-Sesi Belajar (12 Sesi Terakhir)
              </span>
              <span className="text-[11px] text-slate-500">
                Menampilkan nama siswa & skor per pertemuan
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyChartData} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dailyPemahamanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d97706" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="tanggal" 
                    tick={{ fontSize: 10, fill: '#64748b' }} 
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[60, 100]} 
                    tick={{ fontSize: 10, fill: '#64748b' }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip content={<DailySessionTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="pemahaman" 
                    name="Skor Pemahaman" 
                    stroke="#d97706" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#dailyPemahamanGrad)" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="keaktifan" 
                    name="Skor Keaktifan" 
                    stroke="#059669" 
                    strokeWidth={1.5} 
                    strokeDasharray="4 4" 
                    dot={{ r: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* 4. SUMMARY TABLE FOR ADMINISTRATIVE AUDITING */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Periode Bulan</th>
              <th className="py-2.5 px-3 text-right">Total Sesi</th>
              <th className="py-2.5 px-3 text-right">Siswa Aktif</th>
              <th className="py-2.5 px-3 text-right">Rerata Pemahaman</th>
              <th className="py-2.5 px-3 text-right">Rerata Keaktifan</th>
              <th className="py-2.5 px-3 text-right">Kehadiran</th>
              <th className="py-2.5 px-3">Status Evaluasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {monthlyData.map((m) => (
              <tr key={m.monthKey} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>{m.fullMonthLabel}</span>
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums font-mono font-semibold">
                  {m.totalSessions} Sesi
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums font-mono">
                  {m.activeStudentsCount} Siswa
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums font-mono font-bold text-amber-700">
                  {m.avgPemahaman}%
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums font-mono font-bold text-emerald-700">
                  {m.avgKeaktifan}%
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums font-mono font-semibold text-slate-700">
                  {m.attendanceRate}%
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-[11px] font-semibold text-slate-600">
                    {m.avgPemahaman >= 90 ? (
                      <span className="text-emerald-700 font-bold">Target Sangat Baik</span>
                    ) : m.avgPemahaman >= 80 ? (
                      <span className="text-blue-700 font-bold">Mencapai KKM</span>
                    ) : (
                      <span className="text-amber-700 font-bold">Dalam Penguatan</span>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// CUSTOM RECHARTS TOOLTIPS FOR DEEP ADMINISTRATIVE INSIGHTS
// -------------------------------------------------------------

const MonthlyProgressTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data: MonthlyStats = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl text-xs space-y-2 border border-slate-700 max-w-xs">
        <div className="border-b border-slate-700 pb-1.5">
          <p className="font-bold text-amber-300 text-sm">{data.fullMonthLabel}</p>
          <p className="text-[11px] text-slate-400">
            {data.totalSessions} sesi bimbingan · {data.activeStudentsCount} siswa aktif
          </p>
        </div>
        <div className="space-y-1 font-mono text-[11px]">
          <div className="flex items-center justify-between text-amber-400 font-bold">
            <span>Rerata Pemahaman:</span>
            <span>{data.avgPemahaman}%</span>
          </div>
          <div className="flex items-center justify-between text-emerald-400 font-bold">
            <span>Rerata Keaktifan:</span>
            <span>{data.avgKeaktifan}%</span>
          </div>
          <div className="flex items-center justify-between text-indigo-400 font-bold">
            <span>Tingkat Fokus:</span>
            <span>{data.avgFokus}%</span>
          </div>
          <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800">
            <span>Rasio Kehadiran:</span>
            <span>{data.attendanceRate}%</span>
          </div>
        </div>
        {data.uniqueStudents.length > 0 && (
          <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-400">
            <span className="font-bold text-slate-300">Siswa Aktif: </span>
            <span>{data.uniqueStudents.slice(0, 3).join(', ')}{data.uniqueStudents.length > 3 ? ` +${data.uniqueStudents.length - 3}` : ''}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const MonthlyVolumeTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data: MonthlyStats = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl text-xs space-y-2 border border-slate-700">
        <p className="font-bold text-blue-300 text-sm">{data.fullMonthLabel}</p>
        <div className="space-y-1 font-mono text-[11px]">
          <div className="flex items-center justify-between gap-4 text-blue-400 font-bold">
            <span>Total Pertemuan Sesi:</span>
            <span>{data.totalSessions} Sesi</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-amber-400 font-bold">
            <span>Peserta Didik Aktif:</span>
            <span>{data.activeStudentsCount} Siswa</span>
          </div>
        </div>
        <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400">
          <span>Mapel diajarkan: {data.subjects.slice(0, 3).join(', ')}</span>
        </div>
      </div>
    );
  }
  return null;
};

const MonthlyAttendanceTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data: MonthlyStats = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl text-xs space-y-2 border border-slate-700">
        <p className="font-bold text-emerald-300 text-sm">{data.fullMonthLabel}</p>
        <div className="space-y-1 font-mono text-[11px]">
          <div className="flex items-center justify-between gap-4 text-emerald-400 font-bold">
            <span>Hadir Penuh:</span>
            <span>{data.hadir} Sesi</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-indigo-400 font-bold">
            <span>Jadwal Reschedule:</span>
            <span>{data.reschedule} Sesi</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-amber-400 font-bold">
            <span>Izin / Sakit:</span>
            <span>{data.izin} Sesi</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-300 pt-1 border-t border-slate-800">
            <span>Tingkat Kehadiran:</span>
            <span>{data.attendanceRate}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const DailySessionTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
        <p className="font-bold text-amber-300">{data.namaLengkap}</p>
        <p className="text-slate-300 text-[11px]">{data.tanggal} · {data.jenjang} · {data.mapel}</p>
        <div className="pt-1 border-t border-slate-700 space-y-0.5 font-mono">
          <p className="text-amber-400 font-bold flex items-center justify-between gap-3">
            <span>Pemahaman:</span>
            <span>{data.pemahaman}%</span>
          </p>
          <p className="text-emerald-400 font-bold flex items-center justify-between gap-3">
            <span>Keaktifan:</span>
            <span>{data.keaktifan}%</span>
          </p>
          <p className="text-indigo-400 font-bold flex items-center justify-between gap-3">
            <span>Fokus:</span>
            <span>{data.fokus}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

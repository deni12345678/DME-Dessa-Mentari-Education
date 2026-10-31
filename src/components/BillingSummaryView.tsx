import React, { useState, useMemo } from 'react';
import { BillingRecord, ReportData, StudentData, EducationLevel, PaymentStatus } from '../types/report';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  RefreshCw, 
  Send, 
  Printer, 
  Download, 
  FileText, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Search, 
  User, 
  Sparkles, 
  ShieldCheck, 
  X, 
  Copy, 
  Check,
  Building,
  Tag
} from 'lucide-react';

interface BillingSummaryViewProps {
  reports: ReportData[];
  students: StudentData[];
  billings: BillingRecord[];
  onSaveBilling: (billing: BillingRecord) => Promise<void>;
  onDeleteBilling: (id: string) => Promise<void>;
}

const DEFAULT_RATES: Record<EducationLevel, number> = {
  'TK': 60000,
  'SD': 75000,
  'SMP': 85000,
  'SMA': 100000,
  'Umum/PAUD': 70000,
};

export const BillingSummaryView: React.FC<BillingSummaryViewProps> = ({
  reports,
  students,
  billings,
  onSaveBilling,
  onDeleteBilling,
}) => {
  const currentMonthKey = new Date().toISOString().substring(0, 7); // "YYYY-MM"
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Custom Rates Map per Student ID or Level
  const [customRates, setCustomRates] = useState<Record<string, number>>({});

  // Active Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBilling, setEditingBilling] = useState<BillingRecord | null>(null);

  const [activeWaModal, setActiveWaModal] = useState<BillingRecord | null>(null);
  const [activeReceiptModal, setActiveReceiptModal] = useState<BillingRecord | null>(null);
  const [copiedWaText, setCopiedWaText] = useState(false);

  // Filter billings by month, student, and payment status
  const filteredBillings = useMemo(() => {
    return billings.filter((b) => {
      const matchesMonth = !selectedMonth || b.bulanTahun.startsWith(selectedMonth);
      const matchesSearch =
        !searchQuery ||
        b.namaSiswa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.mataPelajaran || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || b.statusPembayaran.toLowerCase() === statusFilter.toLowerCase();

      return matchesMonth && matchesSearch && matchesStatus;
    });
  }, [billings, selectedMonth, searchQuery, statusFilter]);

  // Calculated Financial Summaries
  const stats = useMemo(() => {
    let totalLunas = 0;
    let totalBelumBayar = 0;
    let totalSesiHadir = 0;

    filteredBillings.forEach((b) => {
      if (b.statusPembayaran === 'Lunas') {
        totalLunas += b.totalBiaya;
      } else {
        totalBelumBayar += b.totalBiaya;
      }
      totalSesiHadir += b.jumlahHadir;
    });

    return {
      totalRevenue: totalLunas + totalBelumBayar,
      totalLunas,
      totalBelumBayar,
      totalSesiHadir,
      countBillings: filteredBillings.length,
    };
  }, [filteredBillings]);

  // Auto Generate Monthly Billings from Attendance Reports
  const handleAutoGenerateBillings = async () => {
    if (!selectedMonth) {
      alert('Pilih bulan terlebih dahulu.');
      return;
    }

    // Filter reports in selected month (e.g. "2026-10")
    const monthReports = reports.filter((r) => r.tanggal.startsWith(selectedMonth));

    if (monthReports.length === 0) {
      alert(`Tidak ditemukan laporan presensi les pada bulan ${selectedMonth}. Silakan buat laporan di Form terlebih dahulu.`);
      return;
    }

    // Group reports by Student
    const studentGroup: Record<string, ReportData[]> = {};
    monthReports.forEach((r) => {
      const studentKey = r.namaSiswa.trim();
      if (!studentGroup[studentKey]) {
        studentGroup[studentKey] = [];
      }
      studentGroup[studentKey].push(r);
    });

    let generatedCount = 0;

    for (const [namaSiswa, rList] of Object.entries(studentGroup)) {
      // Find registered student data
      const studentMatch = students.find((s) => s.namaSiswa.toLowerCase() === namaSiswa.toLowerCase());
      const jenjang = studentMatch?.jenjang || rList[0].jenjang || 'SD';
      const defaultRate = customRates[namaSiswa] || DEFAULT_RATES[jenjang] || 75000;

      // Count attendances
      const hadirCount = rList.filter((r) => r.statusKehadiran === 'Hadir' || r.statusKehadiran === 'Reschedule / Disingkat').length;
      const izinCount = rList.filter((r) => r.statusKehadiran === 'Izin / Sakit').length;

      // Check existing billing record
      const billingId = `BILL-${selectedMonth}-${namaSiswa.replace(/\s+/g, '_')}`;
      const existing = billings.find((b) => b.id === billingId);

      const totalBiaya = hadirCount * defaultRate;

      const recordToSave: BillingRecord = {
        id: billingId,
        namaSiswa,
        bulanTahun: selectedMonth,
        jenjang,
        mataPelajaran: studentMatch?.mataPelajaran || rList[0].mataPelajaran || 'Matematika',
        namaPengajar: studentMatch?.namaPengajar || rList[0].namaPengajar || 'Pengajar Dessa Mentari',
        tarifPerSesi: existing?.tarifPerSesi || defaultRate,
        jumlahHadir: hadirCount,
        jumlahIzin: izinCount,
        biayaTambahan: existing?.biayaTambahan || 0,
        keteranganBiayaTambahan: existing?.keteranganBiayaTambahan || '',
        diskon: existing?.diskon || 0,
        totalBiaya: (existing?.totalBiaya && existing.totalBiaya > 0) ? existing.totalBiaya : totalBiaya,
        statusPembayaran: existing?.statusPembayaran || 'Belum Bayar',
        tanggalBayar: existing?.tanggalBayar || '',
        metodePembayaran: existing?.metodePembayaran || '',
        nomorKuitansi: existing?.nomorKuitansi || `KUI-${Date.now().toString().substring(6)}`,
        createdAt: existing?.createdAt || new Date().toISOString(),
      };

      await onSaveBilling(recordToSave);
      generatedCount++;
    }

    alert(`Berhasil merekap ${generatedCount} tagihan siswa untuk bulan ${selectedMonth}!`);
  };

  // Toggle Payment Status (Belum Bayar <-> Lunas)
  const handleTogglePaymentStatus = async (billing: BillingRecord) => {
    const nextStatus: PaymentStatus = billing.statusPembayaran === 'Lunas' ? 'Belum Bayar' : 'Lunas';
    const today = new Date().toISOString().split('T')[0];

    const updated: BillingRecord = {
      ...billing,
      statusPembayaran: nextStatus,
      tanggalBayar: nextStatus === 'Lunas' ? today : '',
      metodePembayaran: nextStatus === 'Lunas' ? (billing.metodePembayaran || 'Transfer Bank') : '',
    };

    await onSaveBilling(updated);
  };

  // Build WA Invoice Message
  const getWaInvoiceText = (b: BillingRecord) => {
    const monthFormatted = new Date(`${b.bulanTahun}-01`).toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    });

    return `*INVOICE TAGIHAN BIAYA LES PRIVAT*
*DESSA MENTARI EDUCATION*
----------------------------------------
Kepada Yth. Orang Tua / Wali dari *${b.namaSiswa}*

Berikut kami sampaikan rekapan sesi les & rincian tagihan bulan *${monthFormatted}*:

• *Nama Siswa:* ${b.namaSiswa} (${b.jenjang})
• *Mata Pelajaran:* ${b.mataPelajaran || 'Les Privat'}
• *Jumlah Sesi Hadir:* ${b.jumlahHadir} Sesi
• *Tarif per Sesi:* Rp ${b.tarifPerSesi.toLocaleString('id-ID')}
${b.biayaTambahan ? `• *Biaya Modul/Tambahan:* Rp ${b.biayaTambahan.toLocaleString('id-ID')} (${b.keteranganBiayaTambahan || 'Modul'})\n` : ''}${b.diskon ? `• *Diskon / Potongan:* -Rp ${b.diskon.toLocaleString('id-ID')}\n` : ''}----------------------------------------
*TOTAL TAGIHAN: Rp ${b.totalBiaya.toLocaleString('id-ID')}*
*STATUS: ${b.statusPembayaran === 'Lunas' ? '🟢 LUNAS' : '🔴 BELUM DIBAYAR'}*

💳 *Metode Pembayaran Transfer:*
• Bank BCA / Mandiri / QRIS
• Pengajar: ${b.namaPengajar || 'Deni Santoso, M.M / Sarah Syahidah Syahrudin, S.Pd'}

_Terima kasih atas kepercayaan Bapak/Ibu bersama Dessa Mentari Education!_ 🙏🏻`;
  };

  const handleCopyWaText = (b: BillingRecord) => {
    const text = getWaInvoiceText(b);
    navigator.clipboard.writeText(text);
    setCopiedWaText(true);
    setTimeout(() => setCopiedWaText(false), 2000);
  };

  const handleSendWaDirect = (b: BillingRecord) => {
    const text = encodeURIComponent(getWaInvoiceText(b));
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Save changes from Edit Billing Modal
  const handleSaveEditModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBilling) return;

    // Recalculate total
    const total =
      editingBilling.jumlahHadir * editingBilling.tarifPerSesi +
      (editingBilling.biayaTambahan || 0) -
      (editingBilling.diskon || 0);

    const updated = {
      ...editingBilling,
      totalBiaya: total > 0 ? total : 0,
    };

    await onSaveBilling(updated);
    setIsEditModalOpen(false);
    setEditingBilling(null);
  };

  // Export CSV Financial Recap
  const handleExportCsv = () => {
    if (filteredBillings.length === 0) {
      alert('Tidak ada data tagihan untuk diekspor.');
      return;
    }

    const headers = [
      'ID Tagihan',
      'Nama Siswa',
      'Jenjang',
      'Bulan',
      'Sesi Hadir',
      'Tarif/Sesi (Rp)',
      'Biaya Tambahan (Rp)',
      'Diskon (Rp)',
      'Total Tagihan (Rp)',
      'Status Pembayaran',
      'Tanggal Bayar',
    ];

    const rows = filteredBillings.map((b) => [
      b.id,
      `"${b.namaSiswa}"`,
      b.jenjang,
      b.bulanTahun,
      b.jumlahHadir,
      b.tarifPerSesi,
      b.biayaTambahan || 0,
      b.diskon || 0,
      b.totalBiaya,
      b.statusPembayaran,
      b.tanggalBayar || '-',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekapan_Biaya_Les_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold uppercase tracking-wider text-emerald-300 font-serif-brand">
              Rekapan Sesi & Biaya Les Privat
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Sistem kalkulasi otomatis biaya les bulanan, invoice WhatsApp, kuitansi digital, dan pemantauan pembayaran siswa.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAutoGenerateBillings}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Kalkulasi Otomatis Bulan Ini</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-200 border border-emerald-500/30 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* FINANCIAL STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Estimasi Pendapatan */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Estimasi Tagihan</span>
            <CreditCard className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900">
            Rp {stats.totalRevenue.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {stats.countBillings} Tagihan Siswa Bulan Ini
          </span>
        </div>

        {/* Total Lunas */}
        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 mb-1">
            <span>Sudah Lunas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-emerald-900">
            Rp {stats.totalLunas.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-emerald-700 block mt-0.5 font-medium">
            Status Terbayar
          </span>
        </div>

        {/* Total Belum Bayar */}
        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-900 mb-1">
            <span>Belum Dibayar</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-amber-900">
            Rp {stats.totalBelumBayar.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-amber-700 block mt-0.5 font-medium">
            Perlu Follow Up
          </span>
        </div>

        {/* Total Sesi Terlaksana */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Total Sesi Hadir</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-blue-900">
            {stats.totalSesiHadir} Sesi
          </p>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Presensi Terkalkulasi
          </span>
        </div>
      </div>

      {/* FILTER & TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Month Selector */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-slate-700">Bulan:</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-300 font-bold outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Payment Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setStatusFilter('Belum Bayar')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'Belum Bayar' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-500'
              }`}
            >
              Belum Bayar
            </button>
            <button
              onClick={() => setStatusFilter('Lunas')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'Lunas' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500'
              }`}
            >
              Lunas
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* BILLINGS TABLE */}
      {filteredBillings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
            <DollarSign className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Belum Ada Rekapan Tagihan Bulan Ini</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Klik tombol **Kalkulasi Otomatis Bulan Ini** di atas untuk secara otomatis menghitung sesi hadir dari laporan presensi les siswa.
          </p>
          <button
            onClick={handleAutoGenerateBillings}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Kalkulasi Tagihan Otomatis</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5">Nama Siswa</th>
                  <th className="p-3.5">Jenjang</th>
                  <th className="p-3.5">Presensi Sesi</th>
                  <th className="p-3.5">Tarif / Sesi</th>
                  <th className="p-3.5">Total Tagihan</th>
                  <th className="p-3.5 text-center">Status Bayar</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBillings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div>
                        <span>{b.namaSiswa}</span>
                        <span className="text-[10px] text-slate-400 font-normal block">
                          {b.mataPelajaran || 'Les Privat'} · {b.namaPengajar}
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5 font-semibold text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-bold">
                        {b.jenjang}
                      </span>
                    </td>

                    <td className="p-3.5 font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-800 font-bold rounded border border-blue-200">
                          {b.jumlahHadir} Sesi Hadir
                        </span>
                        {b.jumlahIzin && b.jumlahIzin > 0 ? (
                          <span className="text-[10px] text-slate-400 italic">({b.jumlahIzin} Izin)</span>
                        ) : null}
                      </div>
                    </td>

                    <td className="p-3.5 font-medium text-slate-600">
                      Rp {b.tarifPerSesi.toLocaleString('id-ID')}
                    </td>

                    <td className="p-3.5 font-extrabold text-emerald-900 text-sm">
                      Rp {b.totalBiaya.toLocaleString('id-ID')}
                      {b.biayaTambahan ? (
                        <span className="text-[9px] text-amber-700 bg-amber-50 px-1 rounded block font-normal">
                          +Modul: Rp {b.biayaTambahan.toLocaleString('id-ID')}
                        </span>
                      ) : null}
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleTogglePaymentStatus(b)}
                        title="Klik untuk mengubah status pembayaran"
                        className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all active:scale-95 inline-flex items-center gap-1 ${
                          b.statusPembayaran === 'Lunas'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-2xs'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            b.statusPembayaran === 'Lunas' ? 'bg-emerald-600' : 'bg-amber-600 animate-ping'
                          }`}
                        ></span>
                        <span>{b.statusPembayaran === 'Lunas' ? '✓ Lunas' : '🔴 Belum Bayar'}</span>
                      </button>
                    </td>

                    <td className="p-3.5 text-right space-x-1">
                      {/* WA Invoice */}
                      <button
                        onClick={() => setActiveWaModal(b)}
                        className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors inline-block"
                        title="Kirim Invoice WhatsApp"
                      >
                        <Send className="w-4 h-4" />
                      </button>

                      {/* Receipt Digital */}
                      <button
                        onClick={() => setActiveReceiptModal(b)}
                        className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                        title="Kuitansi Resmi Digital"
                      >
                        <FileText className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => {
                          setEditingBilling(b);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors inline-block"
                        title="Edit rincian tagihan"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={async () => {
                          if (confirm(`Hapus rekapan tagihan untuk ${b.namaSiswa}?`)) {
                            await onDeleteBilling(b.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* WHATSAPP INVOICE MODAL */}
      {activeWaModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8 relative border border-emerald-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Pratinjau Invoice WhatsApp Tagihan
                </h3>
              </div>
              <button
                onClick={() => setActiveWaModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-emerald-950/5 border border-emerald-200 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-800">
              {getWaInvoiceText(activeWaModal)}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleCopyWaText(activeWaModal)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                {copiedWaText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedWaText ? 'Tersalin!' : 'Salin Teks Invoice'}</span>
              </button>

              <button
                onClick={() => handleSendWaDirect(activeWaModal)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Langsung ke WA</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL DIGITAL RECEIPT (KUITANSI) MODAL */}
      {activeReceiptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 my-8 relative border border-amber-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 no-print">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Kuitansi Resmi Pembayaran Les
                </h3>
              </div>
              <button
                onClick={() => setActiveReceiptModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* RECEIPT CARD BODY */}
            <div
              id="kuitansi-receipt-container"
              className="border-2 border-amber-500/80 rounded-2xl p-6 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 space-y-5 relative overflow-hidden"
            >
              {/* Receipt Header */}
              <div className="flex items-center justify-between border-b-2 border-amber-500/30 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
                    alt="Logo"
                    className="h-12 w-auto object-contain"
                  />
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 font-serif-brand">
                      DESSA MENTARI EDUCATION
                    </h2>
                    <p className="text-[10px] text-amber-800 font-medium">
                      Kuitansi Resmi Pembayaran Sesi Les Privat
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">No. Kuitansi</span>
                  <span className="text-xs font-extrabold text-amber-900">{activeReceiptModal.nomorKuitansi}</span>
                </div>
              </div>

              {/* Receipt Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Telah Diterima Dari</span>
                  <p className="font-extrabold text-slate-900 text-sm">{activeReceiptModal.namaSiswa}</p>
                  <span className="text-[11px] text-slate-500">{activeReceiptModal.jenjang} · {activeReceiptModal.mataPelajaran}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Tanggal Pembayaran</span>
                  <p className="font-bold text-slate-800">{activeReceiptModal.tanggalBayar || new Date().toISOString().split('T')[0]}</p>
                  <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                    Metode: {activeReceiptModal.metodePembayaran || 'Transfer Bank'}
                  </span>
                </div>
              </div>

              {/* Calculation Summary Table */}
              <div className="bg-white rounded-xl border border-amber-200 p-3.5 space-y-2 text-xs">
                <div className="flex justify-between font-medium text-slate-700">
                  <span>Sesi Les Hadir ({activeReceiptModal.jumlahHadir} Sesi x Rp {activeReceiptModal.tarifPerSesi.toLocaleString('id-ID')})</span>
                  <span className="font-bold">Rp {(activeReceiptModal.jumlahHadir * activeReceiptModal.tarifPerSesi).toLocaleString('id-ID')}</span>
                </div>

                {activeReceiptModal.biayaTambahan ? (
                  <div className="flex justify-between text-slate-600">
                    <span>Biaya Modul / Tambahan ({activeReceiptModal.keteranganBiayaTambahan || 'Modul'})</span>
                    <span>Rp {activeReceiptModal.biayaTambahan.toLocaleString('id-ID')}</span>
                  </div>
                ) : null}

                {activeReceiptModal.diskon ? (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Potongan / Diskon</span>
                    <span>-Rp {activeReceiptModal.diskon.toLocaleString('id-ID')}</span>
                  </div>
                ) : null}

                <div className="border-t border-amber-200 pt-2 flex justify-between items-center text-sm font-extrabold text-amber-950">
                  <span>TOTAL PEMBAYARAN:</span>
                  <span className="text-base text-emerald-800">Rp {activeReceiptModal.totalBiaya.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Footer Signature Bar */}
              <div className="pt-2 flex items-end justify-between text-xs">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] border border-emerald-300">
                    STATUS: LUNAS ✓
                  </span>
                </div>

                <div className="text-center">
                  <span className="text-[10px] text-slate-400 block mb-3">Admin / Pengajar Resmi</span>
                  <p className="font-bold text-slate-900 border-b border-slate-400 pb-0.5 min-w-[120px]">
                    {activeReceiptModal.namaPengajar || 'Deni Santoso, M.M'}
                  </p>
                </div>
              </div>
            </div>

            {/* Print & Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 no-print">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Print Kuitansi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT BILLING RECORD MODAL */}
      {isEditModalOpen && editingBilling && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 my-8 relative border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Edit Tagihan: {editingBilling.namaSiswa}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditModal} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jumlah Sesi Hadir</label>
                  <input
                    type="number"
                    value={editingBilling.jumlahHadir}
                    onChange={(e) =>
                      setEditingBilling({ ...editingBilling, jumlahHadir: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tarif per Sesi (Rp)</label>
                  <input
                    type="number"
                    value={editingBilling.tarifPerSesi}
                    onChange={(e) =>
                      setEditingBilling({ ...editingBilling, tarifPerSesi: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Biaya Tambahan (Rp)</label>
                  <input
                    type="number"
                    value={editingBilling.biayaTambahan || 0}
                    onChange={(e) =>
                      setEditingBilling({ ...editingBilling, biayaTambahan: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Diskon (Rp)</label>
                  <input
                    type="number"
                    value={editingBilling.diskon || 0}
                    onChange={(e) =>
                      setEditingBilling({ ...editingBilling, diskon: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Pembayaran</label>
                <select
                  value={editingBilling.statusPembayaran}
                  onChange={(e) =>
                    setEditingBilling({ ...editingBilling, statusPembayaran: e.target.value as PaymentStatus })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold outline-none bg-white"
                >
                  <option value="Belum Bayar">Belum Bayar</option>
                  <option value="Lunas">Lunas</option>
                  <option value="Sebagian">Sebagian</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Simpan Tagihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

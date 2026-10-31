import React, { useState, useMemo, useEffect } from 'react';
import { 
  BillingRecord, 
  ReportData, 
  StudentData, 
  EducationLevel, 
  PaymentStatus, 
  FeeCalculationMode,
  ManualSessionItem 
} from '../types/report';
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
  Tag,
  Plus,
  Sliders,
  HelpCircle,
  PenTool,
  CheckCircle,
  AlertCircle,
  Truck,
  BookOpen
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
  const [entryTypeFilter, setEntryTypeFilter] = useState<'all' | 'manual' | 'auto'>('all');
  
  // Custom Standard Rates Map (saved in localStorage)
  const [standardRates, setStandardRates] = useState<Record<EducationLevel, number>>(() => {
    const saved = localStorage.getItem('dme_standard_rates');
    return saved ? JSON.parse(saved) : DEFAULT_RATES;
  });

  // Rates Settings Modal
  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);
  const [tempRates, setTempRates] = useState<Record<EducationLevel, number>>(standardRates);

  // Active Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<BillingRecord>>({});
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  // WhatsApp & Receipt Modals
  const [activeWaModal, setActiveWaModal] = useState<BillingRecord | null>(null);
  const [activeReceiptModal, setActiveReceiptModal] = useState<BillingRecord | null>(null);
  const [copiedWaText, setCopiedWaText] = useState(false);

  // Save standard rates
  const handleSaveRates = () => {
    setStandardRates(tempRates);
    localStorage.setItem('dme_standard_rates', JSON.stringify(tempRates));
    setIsRatesModalOpen(false);
  };

  // Filter billings by month, student, status, and entry type
  const filteredBillings = useMemo(() => {
    return billings.filter((b) => {
      const matchesMonth = !selectedMonth || b.bulanTahun.startsWith(selectedMonth);
      const matchesSearch =
        !searchQuery ||
        b.namaSiswa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.mataPelajaran || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.namaPengajar || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || b.statusPembayaran.toLowerCase() === statusFilter.toLowerCase();
      const matchesType =
        entryTypeFilter === 'all' ||
        (entryTypeFilter === 'manual' && b.isManualEntry) ||
        (entryTypeFilter === 'auto' && !b.isManualEntry);

      return matchesMonth && matchesSearch && matchesStatus && matchesType;
    });
  }, [billings, selectedMonth, searchQuery, statusFilter, entryTypeFilter]);

  // Financial Summaries
  const stats = useMemo(() => {
    let totalLunas = 0;
    let totalBelumBayar = 0;
    let totalSesiHadir = 0;
    let countManual = 0;
    let countAuto = 0;

    filteredBillings.forEach((b) => {
      if (b.statusPembayaran === 'Lunas') {
        totalLunas += b.totalBiaya;
      } else {
        totalBelumBayar += (b.sisaTagihan !== undefined ? b.sisaTagihan : b.totalBiaya);
      }
      totalSesiHadir += b.jumlahHadir || 0;
      if (b.isManualEntry) {
        countManual++;
      } else {
        countAuto++;
      }
    });

    return {
      totalRevenue: totalLunas + totalBelumBayar,
      totalLunas,
      totalBelumBayar,
      totalSesiHadir,
      countBillings: filteredBillings.length,
      countManual,
      countAuto,
    };
  }, [filteredBillings]);

  // Open Create Manual Billing Modal
  const handleOpenCreateManualModal = () => {
    const today = new Date().toISOString().split('T')[0];
    const defaultStudent = students[0];
    const jenjang: EducationLevel = defaultStudent?.jenjang || 'SD';
    const initialRate = standardRates[jenjang] || 75000;

    setFormData({
      id: `MANUAL-${selectedMonth}-${Date.now().toString().slice(-5)}`,
      namaSiswa: defaultStudent?.namaSiswa || '',
      bulanTahun: selectedMonth,
      jenjang,
      mataPelajaran: defaultStudent?.mataPelajaran || 'Matematika',
      namaPengajar: defaultStudent?.namaPengajar || 'Deni Santoso, M.M',
      modeKalkulasi: 'per_sesi',
      tarifPerSesi: initialRate,
      tarifPerJam: Math.round(initialRate / 1.5) || 50000,
      totalJam: 6,
      jumlahHadir: 4,
      jumlahIzin: 0,
      biayaTransport: 0,
      biayaTambahan: 0,
      keteranganBiayaTambahan: '',
      diskon: 0,
      keteranganDiskon: '',
      totalBiayaManual: initialRate * 4,
      totalBiaya: initialRate * 4,
      jumlahTerbayar: 0,
      sisaTagihan: initialRate * 4,
      statusPembayaran: 'Belum Bayar',
      tanggalBayar: '',
      metodePembayaran: 'Transfer Bank BCA',
      nomorKuitansi: `KUI-${Date.now().toString().slice(-6)}`,
      catatan: 'Rekapan sesi les manual Dessa Mentari Education.',
      isManualEntry: true,
      daftarSesiManual: [
        {
          id: `sesi-1`,
          tanggal: today,
          materi: 'Pertemuan Sesi 1',
          durasi: '90 Menit',
          catatan: 'Hadir aktif',
        }
      ],
      createdAt: new Date().toISOString(),
    });

    setIsEditingExisting(false);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (billing: BillingRecord) => {
    setFormData({
      ...billing,
      modeKalkulasi: billing.modeKalkulasi || 'per_sesi',
      tarifPerJam: billing.tarifPerJam || Math.round((billing.tarifPerSesi || 75000) / 1.5) || 50000,
      totalJam: billing.totalJam || (billing.jumlahHadir ? billing.jumlahHadir * 1.5 : 6),
      biayaTransport: billing.biayaTransport || 0,
      daftarSesiManual: billing.daftarSesiManual || [],
      totalBiayaManual: billing.totalBiayaManual || billing.totalBiaya,
      jumlahTerbayar: billing.jumlahTerbayar || 0,
      sisaTagihan: billing.sisaTagihan ?? (billing.statusPembayaran === 'Lunas' ? 0 : billing.totalBiaya),
    });
    setIsEditingExisting(true);
    setIsFormModalOpen(true);
  };

  // Auto Generate Monthly Billings from Attendance Reports
  const handleAutoGenerateBillings = async () => {
    if (!selectedMonth) {
      alert('Pilih bulan terlebih dahulu.');
      return;
    }

    const monthReports = reports.filter((r) => r.tanggal.startsWith(selectedMonth));

    if (monthReports.length === 0) {
      alert(`Tidak ditemukan laporan presensi les pada bulan ${selectedMonth}. Silakan buat laporan di Form terlebih dahulu atau gunakan fitur 'Input Rekap & Sesi Manual'.`);
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
      const studentMatch = students.find((s) => s.namaSiswa.toLowerCase() === namaSiswa.toLowerCase());
      const jenjang = studentMatch?.jenjang || rList[0].jenjang || 'SD';
      const defaultRate = standardRates[jenjang] || 75000;

      const hadirCount = rList.filter((r) => r.statusKehadiran === 'Hadir' || r.statusKehadiran === 'Reschedule / Disingkat').length;
      const izinCount = rList.filter((r) => r.statusKehadiran === 'Izin / Sakit').length;

      const billingId = `BILL-${selectedMonth}-${namaSiswa.replace(/\s+/g, '_')}`;
      const existing = billings.find((b) => b.id === billingId);

      // Create session history items from existing reports
      const autoSessions: ManualSessionItem[] = rList.map((r, idx) => ({
        id: `auto-sesi-${idx}-${r.id}`,
        tanggal: r.tanggal,
        materi: r.materiDipelajari.split('\n')[0] || `${r.mataPelajaran}`,
        durasi: r.waktuDurasi || '90 Menit',
        catatan: r.statusKehadiran,
      }));

      const calculatedTotal = (hadirCount * (existing?.tarifPerSesi || defaultRate)) + (existing?.biayaTransport || 0) + (existing?.biayaTambahan || 0) - (existing?.diskon || 0);

      const recordToSave: BillingRecord = {
        id: billingId,
        namaSiswa,
        bulanTahun: selectedMonth,
        jenjang,
        mataPelajaran: studentMatch?.mataPelajaran || rList[0].mataPelajaran || 'Matematika',
        namaPengajar: studentMatch?.namaPengajar || rList[0].namaPengajar || 'Pengajar Dessa Mentari',
        modeKalkulasi: existing?.modeKalkulasi || 'per_sesi',
        tarifPerSesi: existing?.tarifPerSesi || defaultRate,
        jumlahHadir: hadirCount,
        jumlahIzin: izinCount,
        biayaTransport: existing?.biayaTransport || 0,
        biayaTambahan: existing?.biayaTambahan || 0,
        keteranganBiayaTambahan: existing?.keteranganBiayaTambahan || '',
        diskon: existing?.diskon || 0,
        keteranganDiskon: existing?.keteranganDiskon || '',
        totalBiaya: existing?.totalBiaya ?? (calculatedTotal > 0 ? calculatedTotal : 0),
        totalBiayaManual: existing?.totalBiayaManual || 0,
        jumlahTerbayar: existing?.jumlahTerbayar || 0,
        sisaTagihan: existing?.sisaTagihan ?? (existing?.statusPembayaran === 'Lunas' ? 0 : calculatedTotal),
        statusPembayaran: existing?.statusPembayaran || 'Belum Bayar',
        tanggalBayar: existing?.tanggalBayar || '',
        metodePembayaran: existing?.metodePembayaran || '',
        nomorKuitansi: existing?.nomorKuitansi || `KUI-${Date.now().toString().slice(-6)}`,
        catatan: existing?.catatan || 'Otomatis dihitung dari laporan presensi les.',
        isManualEntry: false,
        daftarSesiManual: existing?.daftarSesiManual && existing.daftarSesiManual.length > 0 ? existing.daftarSesiManual : autoSessions,
        createdAt: existing?.createdAt || new Date().toISOString(),
      };

      await onSaveBilling(recordToSave);
      generatedCount++;
    }

    alert(`Berhasil merekap ${generatedCount} tagihan siswa secara otomatis dari presensi bulan ${selectedMonth}!`);
  };

  // Toggle Payment Status (Belum Bayar <-> Lunas)
  const handleTogglePaymentStatus = async (billing: BillingRecord) => {
    const nextStatus: PaymentStatus = billing.statusPembayaran === 'Lunas' ? 'Belum Bayar' : 'Lunas';
    const today = new Date().toISOString().split('T')[0];

    const updated: BillingRecord = {
      ...billing,
      statusPembayaran: nextStatus,
      tanggalBayar: nextStatus === 'Lunas' ? today : '',
      metodePembayaran: nextStatus === 'Lunas' ? (billing.metodePembayaran || 'Transfer Bank BCA') : '',
      jumlahTerbayar: nextStatus === 'Lunas' ? billing.totalBiaya : 0,
      sisaTagihan: nextStatus === 'Lunas' ? 0 : billing.totalBiaya,
    };

    await onSaveBilling(updated);
  };

  // Build WA Invoice Message
  const getWaInvoiceText = (b: BillingRecord) => {
    let monthFormatted = b.bulanTahun;
    try {
      monthFormatted = new Date(`${b.bulanTahun}-01`).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
      });
    } catch {
      monthFormatted = b.bulanTahun;
    }

    const sessionsList = (b.daftarSesiManual && b.daftarSesiManual.length > 0)
      ? `\n*Rincian Tanggal Pertemuan Sesi:*\n` +
        b.daftarSesiManual.map((s, idx) => `${idx + 1}. ${s.tanggal}: ${s.materi || 'Les Privat'} (${s.durasi || '90 Menit'})`).join('\n') + `\n`
      : '';

    const feeBreakdown = b.modeKalkulasi === 'manual_total'
      ? `• *Paket Les/Biaya Pokok (Manual):* Rp ${(b.totalBiayaManual || b.totalBiaya).toLocaleString('id-ID')}\n• *Total Pertemuan Terlaksana:* ${b.jumlahHadir} Sesi\n`
      : b.modeKalkulasi === 'per_jam'
        ? `• *Mode Perhitungan:* ⏱️ Hitung Per Jam Les\n• *Total Jam Les:* ${b.totalJam || 0} Jam\n• *Tarif per Jam:* Rp ${(b.tarifPerJam || 0).toLocaleString('id-ID')}\n• *Subtotal Jam:* Rp {((b.totalJam || 0) * (b.tarifPerJam || 0)).toLocaleString('id-ID')}\n• *Pertemuan Terlaksana:* ${b.jumlahHadir} Sesi\n`
        : `• *Presensi Sesi Hadir:* ${b.jumlahHadir} Sesi\n• *Tarif per Sesi:* Rp ${b.tarifPerSesi.toLocaleString('id-ID')}\n• *Subtotal Sesi:* Rp ${(b.jumlahHadir * b.tarifPerSesi).toLocaleString('id-ID')}\n`;

    return `*INVOICE TAGIHAN BIAYA LES PRIVAT*
*DESSA MENTARI EDUCATION*
_Tempat Belajar Terpercaya · Les Privat Keluarga Indonesia_
----------------------------------------
Kepada Yth. Orang Tua / Wali dari *${b.namaSiswa}*

Berikut kami sampaikan rekapan sesi les & rincian tagihan bulan *${monthFormatted}*:

• *Nama Siswa:* ${b.namaSiswa} (${b.jenjang})
• *Mata Pelajaran:* ${b.mataPelajaran || 'Les Privat'}
• *Pengajar:* ${b.namaPengajar || 'Tim Pengajar Dessa Mentari'}
• *Tipe Rekap:* ${b.isManualEntry ? '✍️ Rekap Input Manual' : '🤖 Rekap Presensi Otomatis'}
${sessionsList}
*RINCIAN BIAYA LES:*
${feeBreakdown}${b.biayaTransport ? `• *Biaya Transport Pengajar:* Rp ${b.biayaTransport.toLocaleString('id-ID')}\n` : ''}${b.biayaTambahan ? `• *Biaya Modul/Alat Belajar:* Rp ${b.biayaTambahan.toLocaleString('id-ID')} (${b.keteranganBiayaTambahan || 'Modul'})\n` : ''}${b.diskon ? `• *Potongan / Diskon:* -Rp ${b.diskon.toLocaleString('id-ID')} ${b.keteranganDiskon ? `(${b.keteranganDiskon})` : ''}\n` : ''}----------------------------------------
*TOTAL TAGIHAN: Rp ${b.totalBiaya.toLocaleString('id-ID')}*
*STATUS PEMBAYARAN: ${
  b.statusPembayaran === 'Lunas' 
    ? '🟢 LUNAS' 
    : b.statusPembayaran === 'Sebagian' 
      ? `🟡 SEBAGIAN (Terbayar: Rp ${(b.jumlahTerbayar || 0).toLocaleString('id-ID')} · Sisa: Rp ${(b.sisaTagihan || 0).toLocaleString('id-ID')})`
      : '🔴 BELUM DIBAYAR'
}*

💳 *Informasi Pembayaran:*
• Transfer Rekening / QRIS Resmi Dessa Mentari Education
• Konfirmasi setelah transfer mohon mengirimkan bukti transaksi ya Bunda/Ayah.

_Terima kasih atas kepercayaannya mendampingi ananda belajar bersama Dessa Mentari Education!_ 🙏🏻`;
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

  // Form helpers for calculation
  const calculatedTotal = useMemo(() => {
    const mode = formData.modeKalkulasi || 'per_sesi';
    let subtotal = 0;
    if (mode === 'per_sesi') {
      subtotal = (Number(formData.jumlahHadir) || 0) * (Number(formData.tarifPerSesi) || 0);
    } else if (mode === 'per_jam') {
      subtotal = (Number(formData.totalJam) || 0) * (Number(formData.tarifPerJam) || 0);
    } else {
      subtotal = Number(formData.totalBiayaManual) || 0;
    }
    const transport = Number(formData.biayaTransport) || 0;
    const tambahan = Number(formData.biayaTambahan) || 0;
    const diskon = Number(formData.diskon) || 0;
    const finalVal = subtotal + transport + tambahan - diskon;
    return finalVal > 0 ? finalVal : 0;
  }, [
    formData.modeKalkulasi,
    formData.jumlahHadir,
    formData.tarifPerSesi,
    formData.totalJam,
    formData.tarifPerJam,
    formData.totalBiayaManual,
    formData.biayaTransport,
    formData.biayaTambahan,
    formData.diskon,
  ]);

  // Handle Save Form Modal (Create or Edit)
  const handleSaveFormModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaSiswa?.trim()) {
      alert('Nama siswa wajib diisi.');
      return;
    }

    const total = calculatedTotal;
    const status = formData.statusPembayaran || 'Belum Bayar';
    const terbayar = status === 'Lunas' ? total : (Number(formData.jumlahTerbayar) || 0);
    const sisa = status === 'Lunas' ? 0 : Math.max(0, total - terbayar);

    const recordToSave: BillingRecord = {
      id: formData.id || `BILL-${formData.bulanTahun || selectedMonth}-${Date.now().toString().slice(-6)}`,
      namaSiswa: formData.namaSiswa.trim(),
      bulanTahun: formData.bulanTahun || selectedMonth,
      jenjang: formData.jenjang || 'SD',
      mataPelajaran: formData.mataPelajaran || 'Matematika',
      namaPengajar: formData.namaPengajar || 'Deni Santoso, M.M',
      modeKalkulasi: formData.modeKalkulasi || 'per_sesi',
      tarifPerSesi: Number(formData.tarifPerSesi) || 75000,
      tarifPerJam: Number(formData.tarifPerJam) || 0,
      totalJam: Number(formData.totalJam) || 0,
      jumlahHadir: Number(formData.jumlahHadir) || 0,
      jumlahIzin: Number(formData.jumlahIzin) || 0,
      biayaTransport: Number(formData.biayaTransport) || 0,
      biayaTambahan: Number(formData.biayaTambahan) || 0,
      keteranganBiayaTambahan: formData.keteranganBiayaTambahan || '',
      diskon: Number(formData.diskon) || 0,
      keteranganDiskon: formData.keteranganDiskon || '',
      totalBiayaManual: Number(formData.totalBiayaManual) || 0,
      totalBiaya: total,
      jumlahTerbayar: terbayar,
      sisaTagihan: sisa,
      statusPembayaran: status,
      tanggalBayar: status === 'Lunas' ? (formData.tanggalBayar || new Date().toISOString().split('T')[0]) : (formData.tanggalBayar || ''),
      metodePembayaran: formData.metodePembayaran || 'Transfer Bank BCA',
      nomorKuitansi: formData.nomorKuitansi || `KUI-${Date.now().toString().slice(-6)}`,
      catatan: formData.catatan || '',
      isManualEntry: formData.isManualEntry ?? true,
      daftarSesiManual: formData.daftarSesiManual || [],
      createdAt: formData.createdAt || new Date().toISOString(),
    };

    await onSaveBilling(recordToSave);
    setIsFormModalOpen(false);
  };

  // Add a manual session item inside the modal form
  const handleAddSessionItem = () => {
    const currentSessions = formData.daftarSesiManual || [];
    const nextIdx = currentSessions.length + 1;
    const newSession: ManualSessionItem = {
      id: `sesi-${Date.now()}-${nextIdx}`,
      tanggal: new Date().toISOString().split('T')[0],
      materi: `Pertemuan Sesi ${nextIdx}`,
      durasi: '90 Menit',
      catatan: 'Hadir',
    };
    const updated = [...currentSessions, newSession];
    setFormData({
      ...formData,
      daftarSesiManual: updated,
      jumlahHadir: updated.length, // auto sync count
    });
  };

  // Remove a manual session item
  const handleRemoveSessionItem = (idx: number) => {
    const currentSessions = formData.daftarSesiManual || [];
    const updated = currentSessions.filter((_, i) => i !== idx);
    setFormData({
      ...formData,
      daftarSesiManual: updated,
      jumlahHadir: updated.length,
    });
  };

  // Update a single session item
  const handleUpdateSessionItem = (idx: number, field: keyof ManualSessionItem, value: string) => {
    const currentSessions = [...(formData.daftarSesiManual || [])];
    if (currentSessions[idx]) {
      currentSessions[idx] = {
        ...currentSessions[idx],
        [field]: value,
      };
      setFormData({
        ...formData,
        daftarSesiManual: currentSessions,
      });
    }
  };

  // Quick student select autofill
  const handleSelectExistingStudent = (studentName: string) => {
    const found = students.find((s) => s.namaSiswa.toLowerCase() === studentName.toLowerCase());
    if (found) {
      const defaultRate = standardRates[found.jenjang] || 75000;
      setFormData((prev) => ({
        ...prev,
        namaSiswa: found.namaSiswa,
        jenjang: found.jenjang,
        mataPelajaran: found.mataPelajaran || prev.mataPelajaran,
        namaPengajar: found.namaPengajar || prev.namaPengajar,
        tarifPerSesi: defaultRate,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        namaSiswa: studentName,
      }));
    }
  };

  // Export CSV Financial Recap
  const handleExportCsv = () => {
    if (filteredBillings.length === 0) {
      alert('Tidak ada data tagihan untuk diekspor.');
      return;
    }

    const headers = [
      'ID Tagihan',
      'Tipe Rekap',
      'Nama Siswa',
      'Jenjang',
      'Bulan',
      'Mode Kalkulasi',
      'Sesi Hadir',
      'Tarif/Sesi (Rp)',
      'Total Jam',
      'Tarif/Jam (Rp)',
      'Biaya Pokok Manual (Rp)',
      'Transport (Rp)',
      'Biaya Tambahan (Rp)',
      'Diskon (Rp)',
      'Total Tagihan (Rp)',
      'Status Pembayaran',
      'Terbayar (Rp)',
      'Sisa Tagihan (Rp)',
      'Tanggal Bayar',
    ];

    const rows = filteredBillings.map((b) => [
      b.id,
      b.isManualEntry ? 'Manual' : 'Otomatis',
      `"${b.namaSiswa}"`,
      b.jenjang,
      b.bulanTahun,
      b.modeKalkulasi || 'per_sesi',
      b.jumlahHadir,
      b.tarifPerSesi,
      b.totalJam || 0,
      b.tarifPerJam || 0,
      b.totalBiayaManual || 0,
      b.biayaTransport || 0,
      b.biayaTambahan || 0,
      b.diskon || 0,
      b.totalBiaya,
      b.statusPembayaran,
      b.jumlahTerbayar || (b.statusPembayaran === 'Lunas' ? b.totalBiaya : 0),
      b.sisaTagihan || 0,
      b.tanggalBayar || '-',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekapan_Biaya_Les_DessaMentari_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-inner">
            <DollarSign className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold uppercase tracking-wider text-emerald-300 font-serif-brand">
                Rekapan Sesi & Biaya Les Privat
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                Fitur Manual & Otomatis
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Mendukung input rekapan sesi secara manual, input tarif/biaya langsung, serta kalkulasi otomatis dari laporan presensi harian.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleOpenCreateManualModal}
            className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
            title="Buat rekapan sesi dan input biaya secara manual"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Input Rekap & Sesi Manual</span>
          </button>

          <button
            onClick={handleAutoGenerateBillings}
            className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
            title="Kalkulasi otomatis dari laporan presensi les bulan ini"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Auto Rekap Presensi</span>
          </button>

          <button
            onClick={() => {
              setTempRates({ ...standardRates });
              setIsRatesModalOpen(true);
            }}
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-200 border border-emerald-500/30 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            title="Atur tarif standar per jenjang"
          >
            <Sliders className="w-4 h-4" />
            <span>Tarif Jenjang</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            title="Unduh rekapan format Excel / CSV"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
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
          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-medium">
            <span>{stats.countBillings} Tagihan</span>
            <span>•</span>
            <span className="text-amber-700 font-bold">{stats.countManual} Manual</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">{stats.countAuto} Otomatis</span>
          </div>
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
            Pembayaran Diterima
          </span>
        </div>

        {/* Total Belum Bayar */}
        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-900 mb-1">
            <span>Belum Terbayar</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-amber-900">
            Rp {stats.totalBelumBayar.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-amber-700 block mt-0.5 font-medium">
            Perlu Follow Up Orang Tua
          </span>
        </div>

        {/* Total Sesi Terlaksana */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Total Pertemuan Sesi</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-blue-900">
            {stats.totalSesiHadir} Sesi
          </p>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Total Sesi Les Terlaksana
          </span>
        </div>
      </div>

      {/* FILTER & TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-slate-700">Periode:</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs p-1 rounded border-none bg-transparent font-bold outline-none text-slate-900 cursor-pointer"
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
              Semua Status
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
            <button
              onClick={() => setStatusFilter('Sebagian')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'Sebagian' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-500'
              }`}
            >
              Sebagian / DP
            </button>
          </div>

          {/* Entry Type Filter (Auto vs Manual) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setEntryTypeFilter('all')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                entryTypeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Semua Rekap
            </button>
            <button
              onClick={() => setEntryTypeFilter('manual')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                entryTypeFilter === 'manual' ? 'bg-amber-100 text-amber-900 shadow-2xs border border-amber-300' : 'text-slate-500'
              }`}
            >
              ✍️ Input Manual
            </button>
            <button
              onClick={() => setEntryTypeFilter('auto')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                entryTypeFilter === 'auto' ? 'bg-emerald-100 text-emerald-900 shadow-2xs border border-emerald-300' : 'text-slate-500'
              }`}
            >
              🤖 Auto-Presensi
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
            placeholder="Cari siswa, mapel, guru..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* BILLINGS TABLE */}
      {filteredBillings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Belum Ada Rekapan Tagihan Bulan Ini</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Anda dapat membuat rekapan secara manual atau menarik data presensi otomatis dari laporan pembelajaran yang telah diisi.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleOpenCreateManualModal}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-sm inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Input Rekap Sesi & Biaya Manual</span>
            </button>

            <button
              onClick={handleAutoGenerateBillings}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Kalkulasi Otomatis Presensi</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5">Tipe & Siswa</th>
                  <th className="p-3.5">Jenjang</th>
                  <th className="p-3.5">Sesi & Pertemuan</th>
                  <th className="p-3.5">Mode & Tarif Biaya</th>
                  <th className="p-3.5">Total Tagihan</th>
                  <th className="p-3.5 text-center">Status Bayar</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBillings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Nama Siswa & Tipe Rekap */}
                    <td className="p-3.5">
                      <div className="flex items-start gap-2">
                        {b.isManualEntry ? (
                          <span 
                            title="Rekapan ini dibuat secara manual oleh admin/pengajar"
                            className="mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 shrink-0"
                          >
                            ✍️ Manual
                          </span>
                        ) : (
                          <span 
                            title="Rekapan dihitung otomatis dari laporan presensi les"
                            className="mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0"
                          >
                            🤖 Auto
                          </span>
                        )}
                        <div>
                          <span className="font-extrabold text-slate-900 text-sm block leading-snug">
                            {b.namaSiswa}
                          </span>
                          <span className="text-[10px] text-slate-500 font-normal block">
                            {b.mataPelajaran || 'Les Privat'} · {b.namaPengajar}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Jenjang */}
                    <td className="p-3.5 font-semibold text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-bold">
                        {b.jenjang}
                      </span>
                    </td>

                    {/* Presensi Sesi */}
                    <td className="p-3.5 font-semibold text-slate-800">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 font-bold rounded border border-blue-200">
                            {b.jumlahHadir} Sesi Hadir
                          </span>
                          {b.jumlahIzin && b.jumlahIzin > 0 ? (
                            <span className="text-[10px] text-slate-400 italic">({b.jumlahIzin} Izin)</span>
                          ) : null}
                        </div>
                        {b.daftarSesiManual && b.daftarSesiManual.length > 0 && (
                          <span className="text-[10px] text-emerald-700 font-medium block">
                            ✓ {b.daftarSesiManual.length} Pertemuan tercatat
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Mode & Tarif Biaya */}
                    <td className="p-3.5 text-slate-700">
                      {b.modeKalkulasi === 'manual_total' ? (
                        <div>
                          <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded text-[10px] font-bold block w-fit mb-0.5">
                            Paket / Nominal Manual
                          </span>
                          <span className="font-bold text-slate-900">
                            Rp {(b.totalBiayaManual || b.totalBiaya).toLocaleString('id-ID')}
                          </span>
                        </div>
                      ) : b.modeKalkulasi === 'per_jam' ? (
                        <div>
                          <span className="px-1.5 py-0.5 bg-sky-50 text-sky-800 border border-sky-200 rounded text-[10px] font-bold block w-fit mb-0.5">
                            ⏱️ Hitung Per Jam
                          </span>
                          <span className="font-bold text-slate-900">
                            Rp {(b.tarifPerJam || 0).toLocaleString('id-ID')}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            / jam ({b.totalJam || 0} Jam Total)
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-bold text-slate-800">
                            Rp {b.tarifPerSesi.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[10px] text-slate-400 block">/ sesi pertemuan</span>
                        </div>
                      )}
                    </td>

                    {/* Total Tagihan */}
                    <td className="p-3.5 font-extrabold text-emerald-950 text-sm">
                      <div>
                        <span>Rp {b.totalBiaya.toLocaleString('id-ID')}</span>
                        {b.biayaTransport ? (
                          <span className="text-[9px] text-blue-700 bg-blue-50 px-1 rounded block font-normal mt-0.5">
                            +Transport: Rp {b.biayaTransport.toLocaleString('id-ID')}
                          </span>
                        ) : null}
                        {b.biayaTambahan ? (
                          <span className="text-[9px] text-amber-700 bg-amber-50 px-1 rounded block font-normal mt-0.5">
                            +Modul: Rp {b.biayaTambahan.toLocaleString('id-ID')}
                          </span>
                        ) : null}
                        {b.diskon ? (
                          <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1 rounded block font-normal mt-0.5">
                            -Diskon: Rp {b.diskon.toLocaleString('id-ID')}
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {/* Status Bayar */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleTogglePaymentStatus(b)}
                        title="Klik untuk mengubah status pembayaran"
                        className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all active:scale-95 inline-flex items-center gap-1 ${
                          b.statusPembayaran === 'Lunas'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-2xs'
                            : b.statusPembayaran === 'Sebagian'
                              ? 'bg-blue-100 text-blue-900 border-blue-300'
                              : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            b.statusPembayaran === 'Lunas' 
                              ? 'bg-emerald-600' 
                              : b.statusPembayaran === 'Sebagian'
                                ? 'bg-blue-600'
                                : 'bg-amber-600 animate-ping'
                          }`}
                        ></span>
                        <span>
                          {b.statusPembayaran === 'Lunas' 
                            ? '✓ Lunas' 
                            : b.statusPembayaran === 'Sebagian'
                              ? '🟡 Sebagian'
                              : '🔴 Belum Bayar'}
                        </span>
                      </button>
                      {b.statusPembayaran === 'Sebagian' && (
                        <span className="text-[9px] text-slate-500 block mt-0.5 font-medium">
                          Sisa: Rp {(b.sisaTagihan || 0).toLocaleString('id-ID')}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
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
                        onClick={() => handleOpenEditModal(b)}
                        className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors inline-block"
                        title="Edit rincian sesi dan biaya"
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

      {/* MODAL: INPUT / EDIT REKAPAN SESI & BIAYA SECARA MANUAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8 relative border border-emerald-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {isEditingExisting ? 'Edit Rekapan Sesi & Biaya' : 'Input Rekapan Sesi & Biaya Les Manual'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Atur nama siswa, tanggal bulan, jumlah sesi, mode tarif, serta biaya manual lainnya.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFormModal} className="space-y-4 text-xs">
              {/* SECTION 1: DATA SISWA & PERIODE */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>Informasi Siswa & Periode Les</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Nama Siswa */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nama Siswa <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-1">
                      <input
                        type="text"
                        required
                        value={formData.namaSiswa || ''}
                        onChange={(e) => setFormData({ ...formData, namaSiswa: e.target.value })}
                        placeholder="Contoh: Ananda Kevin Pratama"
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-bold outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                      {students.length > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <span>Pilih dari siswa aktif:</span>
                          <select
                            onChange={(e) => {
                              if (e.target.value) handleSelectExistingStudent(e.target.value);
                            }}
                            className="bg-transparent font-bold text-amber-700 underline outline-none cursor-pointer"
                          >
                            <option value="">-- Pilih Siswa --</option>
                            {students.map((s) => (
                              <option key={s.id} value={s.namaSiswa}>
                                {s.namaSiswa} ({s.jenjang})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Periode Bulan */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Bulan & Tahun Tagihan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="month"
                      required
                      value={formData.bulanTahun || selectedMonth}
                      onChange={(e) => setFormData({ ...formData, bulanTahun: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Jenjang */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Jenjang Pendidikan</label>
                    <select
                      value={formData.jenjang || 'SD'}
                      onChange={(e) => {
                        const newJenjang = e.target.value as EducationLevel;
                        const newRate = standardRates[newJenjang] || 75000;
                        setFormData({
                          ...formData,
                          jenjang: newJenjang,
                          tarifPerSesi: newRate,
                        });
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold outline-none bg-white"
                    >
                      <option value="TK">TK</option>
                      <option value="SD">SD</option>
                      <option value="SMP">SMP</option>
                      <option value="SMA">SMA</option>
                      <option value="Umum/PAUD">Umum / PAUD</option>
                    </select>
                  </div>

                  {/* Mata Pelajaran */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                    <input
                      type="text"
                      value={formData.mataPelajaran || ''}
                      onChange={(e) => setFormData({ ...formData, mataPelajaran: e.target.value })}
                      placeholder="Contoh: Matematika & IPAS"
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold outline-none bg-white"
                    />
                  </div>

                  {/* Pengajar */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pengajar / Tutor</label>
                    <input
                      type="text"
                      value={formData.namaPengajar || ''}
                      onChange={(e) => setFormData({ ...formData, namaPengajar: e.target.value })}
                      placeholder="Deni Santoso, M.M"
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold outline-none bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: MODE PERHITUNGAN BIAYA LES (MANUAL VS PER SESI) */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-extrabold text-amber-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-amber-700" />
                    <span>Mode Perhitungan & Tarif Biaya</span>
                  </h4>

                  {/* Toggle Mode */}
                  <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-lg border border-amber-300">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, modeKalkulasi: 'per_sesi' })}
                      className={`px-2.5 py-1 text-[11px] font-extrabold rounded transition-all ${
                        formData.modeKalkulasi !== 'manual_total' && formData.modeKalkulasi !== 'per_jam'
                          ? 'bg-amber-500 text-slate-950 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Hitung Per Sesi (Sesi × Tarif)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, modeKalkulasi: 'per_jam' })}
                      className={`px-2.5 py-1 text-[11px] font-extrabold rounded transition-all ${
                        formData.modeKalkulasi === 'per_jam'
                          ? 'bg-sky-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ⏱️ Hitung Per Jam (Jam × Tarif/Jam)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, modeKalkulasi: 'manual_total' })}
                      className={`px-2.5 py-1 text-[11px] font-extrabold rounded transition-all ${
                        formData.modeKalkulasi === 'manual_total'
                          ? 'bg-purple-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ✍️ Nominal Manual (Paket)
                    </button>
                  </div>
                </div>

                {formData.modeKalkulasi === 'manual_total' ? (
                  /* MODE MANUAL TOTAL / BORONGAN */
                  <div className="bg-white p-3 rounded-xl border border-purple-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-purple-900 font-bold text-xs">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>Input Nominal Biaya Les Manual (Paket Bulanan / Kesepakatan)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Nominal Biaya Pokok Les (Rp)
                        </label>
                        <input
                          type="number"
                          value={formData.totalBiayaManual || 0}
                          onChange={(e) =>
                            setFormData({ ...formData, totalBiayaManual: Number(e.target.value) })
                          }
                          className="w-full p-2.5 rounded-xl border border-purple-300 font-extrabold text-base text-purple-950 outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Misal: 600000"
                        />
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Terbilang: Rp {(Number(formData.totalBiayaManual) || 0).toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Jumlah Pertemuan Terlaksana (Sesi)
                        </label>
                        <input
                          type="number"
                          value={formData.jumlahHadir ?? 4}
                          onChange={(e) =>
                            setFormData({ ...formData, jumlahHadir: Number(e.target.value) })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 font-bold outline-none"
                        />
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Dicantumkan di kuitansi dan invoice WhatsApp
                        </span>
                      </div>
                    </div>
                  </div>
                ) : formData.modeKalkulasi === 'per_jam' ? (
                  /* MODE HITUNGAN PER JAM */
                  <div className="bg-white p-3 rounded-xl border border-sky-300 space-y-3">
                    <div className="flex items-center gap-1.5 text-sky-900 font-bold text-xs">
                      <Clock className="w-4 h-4 text-sky-600" />
                      <span>Perhitungan Les Berdasarkan Akumulasi Jam (Jam Les × Tarif per Jam)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Total Jam Les (Jam)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          value={formData.totalJam ?? 6}
                          onChange={(e) =>
                            setFormData({ ...formData, totalJam: Number(e.target.value) })
                          }
                          className="w-full p-2.5 rounded-xl border border-sky-300 font-extrabold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                          placeholder="Misal: 6 atau 8.5"
                        />
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Bisa pecahan (e.g. 7.5 jam)
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Tarif per Jam (Rp)
                        </label>
                        <input
                          type="number"
                          step="1000"
                          value={formData.tarifPerJam ?? 50000}
                          onChange={(e) =>
                            setFormData({ ...formData, tarifPerJam: Number(e.target.value) })
                          }
                          className="w-full p-2.5 rounded-xl border border-sky-300 font-extrabold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                          placeholder="Misal: 50000"
                        />
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Rp {(Number(formData.tarifPerJam) || 0).toLocaleString('id-ID')} / jam
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Subtotal Jam
                        </label>
                        <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 font-extrabold text-sky-950 text-sm">
                          Rp {((Number(formData.totalJam) || 0) * (Number(formData.tarifPerJam) || 0)).toLocaleString('id-ID')}
                        </div>
                        <span className="text-[10px] text-sky-700 block mt-0.5 font-medium">
                          {(formData.totalJam || 0)} jam × Rp {(formData.tarifPerJam || 0).toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Total Sesi Terlaksana
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.jumlahHadir ?? 4}
                          onChange={(e) =>
                            setFormData({ ...formData, jumlahHadir: Number(e.target.value) })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 font-bold outline-none"
                        />
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Pertemuan untuk rekapan
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* MODE PER SESI */
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-amber-200">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Jumlah Sesi Hadir
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.jumlahHadir ?? 4}
                        onChange={(e) =>
                          setFormData({ ...formData, jumlahHadir: Number(e.target.value) })
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-extrabold text-slate-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Tarif per Sesi (Rp)
                      </label>
                      <input
                        type="number"
                        step="1000"
                        value={formData.tarifPerSesi || 75000}
                        onChange={(e) =>
                          setFormData({ ...formData, tarifPerSesi: Number(e.target.value) })
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-extrabold text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Rp {(Number(formData.tarifPerSesi) || 0).toLocaleString('id-ID')} / sesi
                      </span>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Subtotal Sesi
                      </label>
                      <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 font-extrabold text-slate-800 text-sm">
                        Rp {((Number(formData.jumlahHadir) || 0) * (Number(formData.tarifPerSesi) || 0)).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                )}

                {/* PENYESUAIAN BIAYA: TRANSPORT, MODUL, DISKON */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Biaya Transport */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Transport Guru (Rp)</span>
                    </label>
                    <input
                      type="number"
                      step="5000"
                      value={formData.biayaTransport || 0}
                      onChange={(e) =>
                        setFormData({ ...formData, biayaTransport: Number(e.target.value) })
                      }
                      className="w-full p-2 rounded-xl border border-slate-300 font-bold outline-none"
                      placeholder="0"
                    />
                  </div>

                  {/* Biaya Modul / Tambahan */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                      <span>Modul / Materi (Rp)</span>
                    </label>
                    <input
                      type="number"
                      step="5000"
                      value={formData.biayaTambahan || 0}
                      onChange={(e) =>
                        setFormData({ ...formData, biayaTambahan: Number(e.target.value) })
                      }
                      className="w-full p-2 rounded-xl border border-slate-300 font-bold outline-none"
                      placeholder="0"
                    />
                  </div>

                  {/* Diskon / Potongan */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Diskon / Potongan (Rp)</span>
                    </label>
                    <input
                      type="number"
                      step="5000"
                      value={formData.diskon || 0}
                      onChange={(e) =>
                        setFormData({ ...formData, diskon: Number(e.target.value) })
                      }
                      className="w-full p-2 rounded-xl border border-slate-300 font-bold outline-none text-emerald-800"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* LIVE TOTAL BANNER */}
                <div className="p-3 bg-emerald-900 text-white rounded-xl flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                      Total Akhir Tagihan:
                    </span>
                    <span className="text-lg font-black tracking-wide text-white">
                      Rp {calculatedTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-800/80 text-[10px] font-bold text-emerald-200 border border-emerald-700">
                    Kalkulasi Otomatis
                  </span>
                </div>
              </div>

              {/* SECTION 3: RINCIAN DAFTAR SESI MANUAL (OPSIONAL) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Rincian Pertemuan Sesi (Opsional)</span>
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Tambahkan tanggal dan materi sesi jika ingin melampirkan daftar kehadiran di invoice WA & kuitansi.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSessionItem}
                    className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Sesi</span>
                  </button>
                </div>

                {formData.daftarSesiManual && formData.daftarSesiManual.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {formData.daftarSesiManual.map((sesi, idx) => (
                      <div
                        key={sesi.id || idx}
                        className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-2"
                      >
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-[10px] shrink-0">
                          {idx + 1}
                        </span>

                        <input
                          type="date"
                          value={sesi.tanggal}
                          onChange={(e) => handleUpdateSessionItem(idx, 'tanggal', e.target.value)}
                          className="p-1.5 border border-slate-200 rounded-lg font-bold text-[11px] outline-none"
                        />

                        <input
                          type="text"
                          value={sesi.materi || ''}
                          onChange={(e) => handleUpdateSessionItem(idx, 'materi', e.target.value)}
                          placeholder="Materi yang dipelajari..."
                          className="flex-1 p-1.5 border border-slate-200 rounded-lg text-[11px] outline-none"
                        />

                        <input
                          type="text"
                          value={sesi.durasi || '90 Menit'}
                          onChange={(e) => handleUpdateSessionItem(idx, 'durasi', e.target.value)}
                          placeholder="90 Menit"
                          className="w-24 p-1.5 border border-slate-200 rounded-lg text-[11px] outline-none font-medium"
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveSessionItem(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"
                          title="Hapus baris sesi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-3 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400 text-[11px]">
                    Belum ada daftar rincian tanggal sesi. Klik **+ Tambah Sesi** di atas jika ingin melampirkan tanggal-tanggal pertemuan.
                  </div>
                )}
              </div>

              {/* SECTION 4: STATUS PEMBAYARAN & PEMBUKUAN */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Status Pembayaran & Kuitansi</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Status Pembayaran</label>
                    <select
                      value={formData.statusPembayaran || 'Belum Bayar'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          statusPembayaran: e.target.value as PaymentStatus,
                          tanggalBayar: e.target.value === 'Lunas' ? new Date().toISOString().split('T')[0] : formData.tanggalBayar,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold outline-none bg-white"
                    >
                      <option value="Belum Bayar">🔴 Belum Bayar</option>
                      <option value="Lunas">🟢 Lunas</option>
                      <option value="Sebagian">🟡 Sebagian / DP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Metode Pembayaran</label>
                    <select
                      value={formData.metodePembayaran || 'Transfer Bank BCA'}
                      onChange={(e) => setFormData({ ...formData, metodePembayaran: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold outline-none bg-white"
                    >
                      <option value="Transfer Bank BCA">Transfer Bank BCA</option>
                      <option value="Transfer Mandiri">Transfer Mandiri</option>
                      <option value="Transfer BNI / BRI">Transfer BNI / BRI</option>
                      <option value="QRIS Dessa Mentari">QRIS Dessa Mentari</option>
                      <option value="Tunai / Cash">Tunai / Cash</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nomor Kuitansi</label>
                    <input
                      type="text"
                      value={formData.nomorKuitansi || ''}
                      onChange={(e) => setFormData({ ...formData, nomorKuitansi: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold outline-none bg-white"
                    />
                  </div>
                </div>

                {formData.statusPembayaran === 'Sebagian' && (
                  <div className="grid grid-cols-2 gap-3 bg-blue-50 p-3 rounded-xl border border-blue-200">
                    <div>
                      <label className="block font-bold text-blue-900 mb-1">Nominal Terbayar (DP)</label>
                      <input
                        type="number"
                        value={formData.jumlahTerbayar || 0}
                        onChange={(e) =>
                          setFormData({ ...formData, jumlahTerbayar: Number(e.target.value) })
                        }
                        className="w-full p-2 rounded-xl border border-blue-300 font-bold outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-blue-900 mb-1">Sisa Tagihan Belum Dibayar</label>
                      <div className="p-2 rounded-xl bg-white border border-blue-300 font-extrabold text-blue-900">
                        Rp {Math.max(0, calculatedTotal - (Number(formData.jumlahTerbayar) || 0)).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{isEditingExisting ? 'Simpan Perubahan' : 'Simpan Rekapan Manual'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ATUR TARIF STANDAR JENJANG */}
      {isRatesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative border border-emerald-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Tarif Dasar Standar Per Sesi
                </h3>
              </div>
              <button
                onClick={() => setIsRatesModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Tarif dasar ini digunakan saat menghitung otomatis rekapan presensi atau membuat tagihan baru.
            </p>

            <div className="space-y-3 text-xs">
              {(['TK', 'SD', 'SMP', 'SMA', 'Umum/PAUD'] as EducationLevel[]).map((level) => (
                <div key={level} className="flex items-center justify-between gap-3">
                  <span className="font-bold text-slate-800 w-28">{level}:</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">Rp</span>
                    <input
                      type="number"
                      step="5000"
                      value={tempRates[level] || 0}
                      onChange={(e) =>
                        setTempRates({ ...tempRates, [level]: Number(e.target.value) })
                      }
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 font-extrabold outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setIsRatesModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleSaveRates}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-xs"
              >
                Simpan Tarif
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PRATINJAU INVOICE WHATSAPP */}
      {activeWaModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8 relative border border-emerald-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Pratinjau Pesan Tagihan WhatsApp
                </h3>
              </div>
              <button
                onClick={() => setActiveWaModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-emerald-950/5 border border-emerald-200 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-800 max-h-96 overflow-y-auto">
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

      {/* MODAL: KUITANSI RESMI DIGITAL DESSA MENTARI EDUCATION */}
      {activeReceiptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 my-8 relative border border-amber-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 no-print">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Kuitansi Resmi Digital Dessa Mentari
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
                    <p className="text-[10px] text-amber-800 font-bold">
                      Tempat Belajar Terpercaya · Les Privat Keluarga Indonesia
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
                    Metode: {activeReceiptModal.metodePembayaran || 'Transfer Bank BCA'}
                  </span>
                </div>
              </div>

              {/* Calculation Summary Table */}
              <div className="bg-white rounded-xl border border-amber-200 p-3.5 space-y-2 text-xs">
                {activeReceiptModal.modeKalkulasi === 'manual_total' ? (
                  <div className="flex justify-between font-medium text-slate-700">
                    <span>Biaya Pokok Les Privat ({activeReceiptModal.jumlahHadir} Sesi Pertemuan)</span>
                    <span className="font-bold">Rp {(activeReceiptModal.totalBiayaManual || activeReceiptModal.totalBiaya).toLocaleString('id-ID')}</span>
                  </div>
                ) : activeReceiptModal.modeKalkulasi === 'per_jam' ? (
                  <div className="flex justify-between font-medium text-slate-700">
                    <span>Biaya Les Per Jam ({activeReceiptModal.totalJam || 0} Jam x Rp {(activeReceiptModal.tarifPerJam || 0).toLocaleString('id-ID')})</span>
                    <span className="font-bold">Rp {((activeReceiptModal.totalJam || 0) * (activeReceiptModal.tarifPerJam || 0)).toLocaleString('id-ID')}</span>
                  </div>
                ) : (
                  <div className="flex justify-between font-medium text-slate-700">
                    <span>Sesi Les Hadir ({activeReceiptModal.jumlahHadir} Sesi x Rp {activeReceiptModal.tarifPerSesi.toLocaleString('id-ID')})</span>
                    <span className="font-bold">Rp {(activeReceiptModal.jumlahHadir * activeReceiptModal.tarifPerSesi).toLocaleString('id-ID')}</span>
                  </div>
                )}

                {activeReceiptModal.biayaTransport ? (
                  <div className="flex justify-between text-slate-600">
                    <span>Biaya Transport Pengajar</span>
                    <span className="font-bold">Rp {activeReceiptModal.biayaTransport.toLocaleString('id-ID')}</span>
                  </div>
                ) : null}

                {activeReceiptModal.biayaTambahan ? (
                  <div className="flex justify-between text-slate-600">
                    <span>Biaya Modul / Materi ({activeReceiptModal.keteranganBiayaTambahan || 'Modul Pembelajaran'})</span>
                    <span className="font-bold">Rp {activeReceiptModal.biayaTambahan.toLocaleString('id-ID')}</span>
                  </div>
                ) : null}

                {activeReceiptModal.diskon ? (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Potongan / Diskon {activeReceiptModal.keteranganDiskon ? `(${activeReceiptModal.keteranganDiskon})` : ''}</span>
                    <span className="font-bold">-Rp {activeReceiptModal.diskon.toLocaleString('id-ID')}</span>
                  </div>
                ) : null}

                <div className="border-t border-amber-200 pt-2 flex justify-between items-center text-sm font-extrabold text-amber-950">
                  <span>TOTAL BIAYA:</span>
                  <span className="text-base text-emerald-800">Rp {activeReceiptModal.totalBiaya.toLocaleString('id-ID')}</span>
                </div>

                {activeReceiptModal.statusPembayaran === 'Sebagian' && (
                  <div className="border-t border-dashed border-amber-200 pt-1 flex justify-between text-xs text-blue-900 font-bold">
                    <span>Telah Dibayar (DP): Rp {(activeReceiptModal.jumlahTerbayar || 0).toLocaleString('id-ID')}</span>
                    <span>Sisa: Rp {(activeReceiptModal.sisaTagihan || 0).toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>

              {/* Footer Signature Bar */}
              <div className="pt-2 flex items-end justify-between text-xs">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full font-extrabold text-[11px] border ${
                    activeReceiptModal.statusPembayaran === 'Lunas'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    STATUS: {activeReceiptModal.statusPembayaran.toUpperCase()} ✓
                  </span>
                </div>

                <div className="text-center">
                  <span className="text-[10px] text-slate-400 block mb-3">Admin / Pengajar Les</span>
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
                <span>Cetak / Simpan PDF Kuitansi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

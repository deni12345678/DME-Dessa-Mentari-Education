import React, { useState, useEffect } from 'react';
import { 
  CertificateData, 
  StudentData, 
  EducationLevel, 
  CertificateTheme, 
  CertificateType 
} from '../types/report';
import { 
  SUBJECT_PRESETS, 
  getCertificatePresetForSubject, 
  generateCertificateNumber,
  downloadCertificateAsPdf,
  downloadCertificateAsImage,
  generateCertificateWhatsAppText
} from '../utils/certificateUtils';
import { CertificateDocument } from './CertificateDocument';
import { 
  Award, 
  FileText, 
  Download, 
  Share2, 
  Printer, 
  Save, 
  RefreshCw, 
  Check, 
  Sparkles, 
  UserCheck, 
  Trash2, 
  Search,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

interface CertificateManagerViewProps {
  students: StudentData[];
  savedCertificates: CertificateData[];
  onSaveCertificate: (cert: CertificateData) => void;
  onDeleteCertificate: (id: string) => void;
  selectedStudentForCert?: StudentData | null;
}

export const CertificateManagerView: React.FC<CertificateManagerViewProps> = ({
  students,
  savedCertificates,
  onSaveCertificate,
  onDeleteCertificate,
  selectedStudentForCert,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'history'>('create');
  const [searchHistory, setSearchHistory] = useState('');

  // Initial certificate state
  const [currentCert, setCurrentCert] = useState<CertificateData>(() => {
    const preset = getCertificatePresetForSubject('Matematika', 'Syifa Azzarqaa', 'SD');
    return {
      id: `CERT-${Date.now()}`,
      certificateNumber: generateCertificateNumber(savedCertificates.length + 1),
      namaSiswa: 'Syifa Azzarqaa',
      jenjang: 'SD',
      kelasGrade: 'Kelas 4 SD',
      sekolah: 'SD Islam Terpadu',
      mataPelajaran: 'Matematika',
      tipeSertifikat: 'Kelulusan Kursus',
      predikat: preset.predicate,
      nilaiAkhir: preset.score,
      deskripsiKompetensi: preset.description,
      tanggalTerbit: new Date().toISOString().split('T')[0],
      kotaTerbit: 'Indonesia',
      namaKepalaLembaga: 'Deni Santoso, M.M',
      jabatanKepala: 'Direktur Lembaga',
      namaTutorPengampu: 'Sarah Syahidah Syahrudin, S.Pd',
      jabatanTutor: 'Instruktur Pengampu',
      theme: 'gold',
      nomorWAOrangTua: '081234567890',
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
  });

  // When a student is passed directly from student management
  useEffect(() => {
    if (selectedStudentForCert) {
      applyStudentToCertificate(selectedStudentForCert);
      setActiveSubTab('create');
    }
  }, [selectedStudentForCert]);

  // Loading & notification states
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);

  // Apply student data to certificate
  const applyStudentToCertificate = (student: StudentData) => {
    const rawSub = student.mataPelajaran || 'Matematika';
    const firstSubject = rawSub.split(/[,&]/)[0].trim() || 'Matematika';
    const preset = getCertificatePresetForSubject(firstSubject, student.namaSiswa, student.jenjang);

    setCurrentCert((prev) => ({
      ...prev,
      studentId: student.id,
      namaSiswa: student.namaSiswa,
      jenjang: student.jenjang,
      kelasGrade: student.kelasGrade || prev.kelasGrade,
      sekolah: student.sekolah || prev.sekolah,
      mataPelajaran: firstSubject,
      nomorWAOrangTua: student.nomorOrangTua || prev.nomorWAOrangTua,
      predikat: preset.predicate,
      nilaiAkhir: preset.score,
      deskripsiKompetensi: preset.description,
    }));
  };

  // Handler when subject changes - auto generates competencies
  const handleSubjectChange = (newSubject: string) => {
    const preset = getCertificatePresetForSubject(newSubject, currentCert.namaSiswa, currentCert.jenjang);
    setCurrentCert((prev) => ({
      ...prev,
      mataPelajaran: newSubject,
      predikat: preset.predicate,
      nilaiAkhir: preset.score,
      deskripsiKompetensi: preset.description,
    }));
  };

  // Regeneration helper
  const handleRegenerateDescription = () => {
    const preset = getCertificatePresetForSubject(
      currentCert.mataPelajaran,
      currentCert.namaSiswa,
      currentCert.jenjang
    );
    setCurrentCert((prev) => ({
      ...prev,
      predikat: preset.predicate,
      nilaiAkhir: preset.score,
      deskripsiKompetensi: preset.description,
    }));
  };

  // Regenerate serial number
  const handleRegenerateCertNumber = () => {
    setCurrentCert((prev) => ({
      ...prev,
      certificateNumber: generateCertificateNumber(savedCertificates.length + 1),
    }));
  };

  // Export PDF
  const handleDownloadPdf = async (certToExport = currentCert) => {
    setDownloadingPdf(true);
    try {
      await downloadCertificateAsPdf('certificate-container', certToExport);
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Export Image
  const handleDownloadImage = async (format: 'jpg' | 'png' = 'jpg', certToExport = currentCert) => {
    setDownloadingImage(true);
    try {
      await downloadCertificateAsImage('certificate-container', certToExport, format);
    } finally {
      setDownloadingImage(false);
    }
  };

  // Native Browser Print
  const handlePrint = () => {
    window.print();
  };

  // Save to database
  const handleSave = () => {
    const toSave: CertificateData = {
      ...currentCert,
      createdAt: new Date().toISOString(),
    };
    onSaveCertificate(toSave);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // WhatsApp share
  const handleShareWhatsApp = (certToShare = currentCert) => {
    const text = generateCertificateWhatsAppText(certToShare);
    const cleanPhone = certToShare.nomorWAOrangTua
      ? certToShare.nomorWAOrangTua.replace(/[^0-9]/g, '')
      : '';
    const encoded = encodeURIComponent(text);
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  // Copy WhatsApp text
  const handleCopyWhatsApp = async (certToCopy = currentCert) => {
    const text = generateCertificateWhatsAppText(certToCopy);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedWa(true);
      setTimeout(() => setCopiedWa(false), 2000);
    } catch {
      // fallback
    }
  };

  // Filter history
  const filteredHistory = savedCertificates.filter((c) => {
    const q = searchHistory.toLowerCase();
    return (
      c.namaSiswa.toLowerCase().includes(q) ||
      c.mataPelajaran.toLowerCase().includes(q) ||
      c.certificateNumber.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white p-5 rounded-2xl shadow-sm border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold font-serif-brand tracking-wide">
                Generator Sertifikat Pembelajaran Otomatis
              </h2>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                A4 Landscape
              </span>
            </div>
            <p className="text-xs text-amber-100/90 mt-1 max-w-xl">
              Terbitkan sertifikat kelulusan &amp; penghargaan resmi Dessa Mentari Education. Capaian kompetensi otomatis terisi sesuai mata pelajaran yang dipilih.
            </p>
          </div>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center bg-black/25 p-1 rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => setActiveSubTab('create')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'create'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Buat Sertifikat</span>
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Riwayat Diterbitkan</span>
            <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full">
              {savedCertificates.length}
            </span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: CREATE & LIVE PREVIEW */}
      {/* ======================================================== */}
      {activeSubTab === 'create' && (
        <div className="space-y-6">
          {/* Action Toolbar above Certificate Preview */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Pratinjau Sertifikat Resmi (A4 Landscape)
              </span>
            </div>

            {/* Main Export Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSave}
                className="px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersimpan di Cloud!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-amber-600" />
                    <span>Simpan ke Database</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleDownloadPdf()}
                disabled={downloadingPdf}
                className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-800 hover:to-red-700 rounded-xl transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <FileText className="w-4 h-4 text-rose-200" />
                <span>{downloadingPdf ? 'Membuat PDF...' : 'Unduh PDF Resmi'}</span>
              </button>

              <button
                onClick={() => handleDownloadImage('jpg')}
                disabled={downloadingImage}
                className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-amber-200" />
                <span>{downloadingImage ? 'Mengunduh...' : 'Unduh JPG'}</span>
              </button>

              <button
                onClick={() => handleShareWhatsApp()}
                className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-200" />
                <span>Kirim WA</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
                title="Cetak langsung ke printer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Cetak</span>
              </button>
            </div>
          </div>

          {/* Form & Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: CERTIFICATE SETTINGS FORM */}
            <div className="lg:col-span-5 space-y-4 no-print">
              {/* Card 1: Student & Subject Selector */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Identitas Murid &amp; Mata Pelajaran
                    </h3>
                  </div>
                  <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Auto-Preset Aktif
                  </span>
                </div>

                {/* Quick Select From Registered Students */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilih Cepat dari Murid Terdaftar:
                  </label>
                  <select
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 font-medium"
                    onChange={(e) => {
                      const found = students.find((s) => s.id === e.target.value);
                      if (found) applyStudentToCertificate(found);
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      -- Pilih Murid Kursus --
                    </option>
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.namaSiswa} ({st.jenjang} - {st.mataPelajaran || 'Umum'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Student Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Siswa:
                  </label>
                  <input
                    type="text"
                    value={currentCert.namaSiswa}
                    onChange={(e) =>
                      setCurrentCert({ ...currentCert, namaSiswa: e.target.value })
                    }
                    placeholder="Contoh: Syifa Azzarqaa"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-amber-500 font-bold text-slate-900"
                  />
                </div>

                {/* Jenjang & Kelas */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jenjang:
                    </label>
                    <select
                      value={currentCert.jenjang}
                      onChange={(e) =>
                        setCurrentCert({
                          ...currentCert,
                          jenjang: e.target.value as EducationLevel,
                        })
                      }
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white font-medium"
                    >
                      <option value="TK">TK / PAUD</option>
                      <option value="SD">SD</option>
                      <option value="SMP">SMP</option>
                      <option value="SMA">SMA</option>
                      <option value="Umum/PAUD">Umum / Persiapan Ujian</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kelas / Grade:
                    </label>
                    <input
                      type="text"
                      value={currentCert.kelasGrade || ''}
                      onChange={(e) =>
                        setCurrentCert({ ...currentCert, kelasGrade: e.target.value })
                      }
                      placeholder="Contoh: Kelas 4 SD"
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5"
                    />
                  </div>
                </div>

                {/* Sekolah Asal */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sekolah Asal (Opsional):
                  </label>
                  <input
                    type="text"
                    value={currentCert.sekolah || ''}
                    onChange={(e) =>
                      setCurrentCert({ ...currentCert, sekolah: e.target.value })
                    }
                    placeholder="Contoh: SD Islam Terpadu Al-Azhar"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5"
                  />
                </div>

                {/* MATA PELAJARAN (TRIGGER OTOMATIS) */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-900">
                      Mata Pelajaran (Preset Otomatis):
                    </label>
                    <span className="text-[10px] text-amber-700 font-medium">
                      Mengubah ini akan memperbarui kompetensi
                    </span>
                  </div>
                  <select
                    value={currentCert.mataPelajaran}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    className="w-full text-xs font-bold text-amber-950 bg-amber-50/70 border border-amber-300 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500"
                  >
                    {Object.keys(SUBJECT_PRESETS).map((subKey) => (
                      <option key={subKey} value={subKey}>
                        {subKey}
                      </option>
                    ))}
                    <option value="Lainnya">-- Mata Pelajaran Lainnya --</option>
                  </select>
                </div>

                {/* Nomor WA Orang Tua */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp Orang Tua (Untuk Kirim Ucapan):
                  </label>
                  <input
                    type="text"
                    value={currentCert.nomorWAOrangTua || ''}
                    onChange={(e) =>
                      setCurrentCert({ ...currentCert, nomorWAOrangTua: e.target.value })
                    }
                    placeholder="Contoh: 081234567890"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5"
                  />
                </div>
              </div>

              {/* Card 2: Competency, Predicate, Score & Description */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Capaian &amp; Predikat Kelulusan
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleRegenerateDescription}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                    title="Buat ulang kalimat kompetensi otomatis"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Kalimat</span>
                  </button>
                </div>

                {/* Tipe Sertifikat & Predikat */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tipe Sertifikat:
                    </label>
                    <select
                      value={currentCert.tipeSertifikat}
                      onChange={(e) =>
                        setCurrentCert({
                          ...currentCert,
                          tipeSertifikat: e.target.value as CertificateType,
                        })
                      }
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white font-medium"
                    >
                      <option value="Kelulusan Kursus">Kelulusan Kursus</option>
                      <option value="Pencapaian Prestasi">Pencapaian Prestasi</option>
                      <option value="Ketuntasan Modul">Ketuntasan Modul</option>
                      <option value="Apresiasi & Motivasi">Apresiasi &amp; Motivasi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Predikat:
                    </label>
                    <select
                      value={currentCert.predikat}
                      onChange={(e) =>
                        setCurrentCert({ ...currentCert, predikat: e.target.value })
                      }
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white font-medium"
                    >
                      <option value="Sangat Memuaskan (A)">Sangat Memuaskan (A)</option>
                      <option value="Lulus dengan Pujian (Honors)">Lulus dengan Pujian (Honors)</option>
                      <option value="Distinction with Honors">Distinction with Honors</option>
                      <option value="Memuaskan (B)">Memuaskan (B)</option>
                      <option value="Mumtaz (Istimewa)">Mumtaz (Istimewa)</option>
                    </select>
                  </div>
                </div>

                {/* Nilai Akhir & Nomor Sertifikat */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nilai / Skor Akhir (0-100):
                    </label>
                    <input
                      type="number"
                      value={currentCert.nilaiAkhir || ''}
                      onChange={(e) =>
                        setCurrentCert({ ...currentCert, nilaiAkhir: Number(e.target.value) })
                      }
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5 font-bold"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        No. Registrasi:
                      </label>
                      <button
                        type="button"
                        onClick={handleRegenerateCertNumber}
                        className="text-[10px] text-amber-700 font-bold hover:underline"
                      >
                        Acak No
                      </button>
                    </div>
                    <input
                      type="text"
                      value={currentCert.certificateNumber}
                      onChange={(e) =>
                        setCurrentCert({ ...currentCert, certificateNumber: e.target.value })
                      }
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5 font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Deskripsi Kalimat Kompetensi (Editable) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Deskripsi Capaian Kompetensi (Dapat Diedit):
                  </label>
                  <textarea
                    rows={4}
                    value={currentCert.deskripsiKompetensi}
                    onChange={(e) =>
                      setCurrentCert({
                        ...currentCert,
                        deskripsiKompetensi: e.target.value,
                      })
                    }
                    className="w-full text-xs rounded-xl border border-slate-300 p-3 leading-relaxed focus:ring-2 focus:ring-amber-500 font-sans"
                  />
                </div>
              </div>

              {/* Card 3: Theme, Signatures & Date */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Tema Desain &amp; Pejabat Penandatangan
                  </h3>
                </div>

                {/* Theme Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Pilihan Tema Bingkai Sertifikat:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'gold', label: 'Royal Classic Gold', color: 'from-amber-500 to-yellow-600', ring: 'ring-amber-500' },
                      { id: 'navy', label: 'Presidential Navy', color: 'from-blue-900 to-slate-900', ring: 'ring-blue-600' },
                      { id: 'emerald', label: 'Emerald Distinction', color: 'from-emerald-800 to-teal-900', ring: 'ring-emerald-600' },
                    ].map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() =>
                          setCurrentCert({ ...currentCert, theme: th.id as CertificateTheme })
                        }
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          currentCert.theme === th.id
                            ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-2 ring-amber-400'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`h-3 w-full rounded-md bg-gradient-to-r ${th.color} mb-1.5`} />
                        <span className="text-[11px] font-bold text-slate-900 block leading-tight">
                          {th.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tanggal & Kota */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Terbit:
                    </label>
                    <input
                      type="date"
                      value={currentCert.tanggalTerbit}
                      onChange={(e) =>
                        setCurrentCert({ ...currentCert, tanggalTerbit: e.target.value })
                      }
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kota Pengesahan:
                    </label>
                    <input
                      type="text"
                      value={currentCert.kotaTerbit}
                      onChange={(e) =>
                        setCurrentCert({ ...currentCert, kotaTerbit: e.target.value })
                      }
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5"
                    />
                  </div>
                </div>

                {/* Dewan Pengajar / Penandatangan */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Kepala Lembaga (Kiri):
                      </label>
                      <input
                        type="text"
                        value={currentCert.namaKepalaLembaga}
                        onChange={(e) =>
                          setCurrentCert({
                            ...currentCert,
                            namaKepalaLembaga: e.target.value,
                          })
                        }
                        className="w-full text-xs rounded-xl border border-slate-300 p-2 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Tutor Pengampu (Kanan):
                      </label>
                      <input
                        type="text"
                        value={currentCert.namaTutorPengampu}
                        onChange={(e) =>
                          setCurrentCert({
                            ...currentCert,
                            namaTutorPengampu: e.target.value,
                          })
                        }
                        className="w-full text-xs rounded-xl border border-slate-300 p-2 font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CERTIFICATE DOCUMENT PREVIEW */}
            <div className="lg:col-span-7 space-y-4 sticky top-24">
              <div className="bg-slate-100/90 p-4 sm:p-6 rounded-2xl border border-slate-300/80 shadow-inner flex flex-col items-center justify-center overflow-x-auto">
                <CertificateDocument
                  id="certificate-container"
                  certificate={currentCert}
                />
              </div>

              {/* Bottom Quick Help Card */}
              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-xs text-amber-950 space-y-1.5 no-print">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Tips Cetak &amp; Ekspor Sertifikat:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900 pl-1 leading-relaxed">
                  <li>
                    <strong>Unduh PDF Resmi:</strong> Dihasilkan dalam format <strong>A4 Landscape (297 x 210 mm)</strong> proporsional yang pas untuk dicetak atau dibingkai pigura.
                  </li>
                  <li>
                    <strong>Kirim WhatsApp Orang Tua:</strong> Sistem otomatis menyusun pesan ucapan selamat resmi lengkap dengan rincian predikat dan capaian siswa.
                  </li>
                  <li>
                    <strong>Simpan ke Cloud:</strong> Simpan sertifikat agar tersimpan di database lembaga dan riwayat sertifikat dapat dilihat kembali kapan pun.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: CERTIFICATE HISTORY & REGISTRY */}
      {/* ======================================================== */}
      {activeSubTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 no-print">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-serif-brand">
                Daftar Sertifikat Diterbitkan ({savedCertificates.length})
              </h3>
              <p className="text-xs text-slate-500">
                Arsip sertifikat kelulusan dan penghargaan belajar murid Dessa Mentari Education
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama / mata pelajaran..."
                value={searchHistory}
                onChange={(e) => setSearchHistory(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Award className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-600">
                Belum ada sertifikat yang tersimpan.
              </p>
              <p className="text-xs text-slate-400">
                Buka tab "Buat Sertifikat" untuk menerbitkan sertifikat pertama Ananda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/20 transition-all space-y-3 relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md font-bold">
                        {item.certificateNumber}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-1 font-serif-brand">
                        {item.namaSiswa}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {item.jenjang} · {item.mataPelajaran}
                      </p>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                      {item.predikat.split('(')[0].trim()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 italic bg-white p-2 rounded-lg border border-slate-200/60">
                    "{item.deskripsiKompetensi}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/60">
                    <span>Terbit: {item.tanggalTerbit}</span>
                    <span className="font-bold text-amber-700">Skor: {item.nilaiAkhir || 90}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        setCurrentCert(item);
                        setActiveSubTab('create');
                      }}
                      className="px-2.5 py-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-all flex items-center gap-1"
                      title="Buka sertifikat ini di editor"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Buka</span>
                    </button>

                    <button
                      onClick={() => handleShareWhatsApp(item)}
                      className="p-1.5 text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-all"
                      title="Kirim pesan ucapan ke WhatsApp Orang Tua"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteCertificate(item.id)}
                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                      title="Hapus dari riwayat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

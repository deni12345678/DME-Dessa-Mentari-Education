import React, { useState, useEffect } from 'react';
import { ReportData, TeacherSettings, StudentData, PhotoItem } from './types/report';
import { Header, ActiveTabType } from './components/Header';
import { ReportForm } from './components/ReportForm';
import { ReportCard } from './components/ReportCard';
import { AiAssistantModal } from './components/AiAssistantModal';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { GuideView } from './components/GuideView';
import { AiVideoStudio } from './components/AiVideoStudio';
import { StatsSummaryPanel } from './components/StatsSummaryPanel';
import { StudentManagementView } from './components/StudentManagementView';
import { PhotoGalleryView } from './components/PhotoGalleryView';
import { 
  downloadReportAsImage, 
  copyWhatsAppTextToClipboard, 
  openWhatsAppDirect 
} from './utils/exportImage';
import {
  testConnection,
  saveReportToCloud,
  deleteReportFromCloud,
  subscribeReportsFromCloud,
  saveStudentToCloud,
  deleteStudentFromCloud,
  subscribeStudentsFromCloud,
  savePhotoToCloud,
  deletePhotoFromCloud,
  subscribePhotosFromCloud
} from './lib/firebase';
import { 
  Download, 
  Share2, 
  Check, 
  Printer, 
  Save, 
  RotateCcw,
  Eye,
  FileImage,
  Send,
  Cloud,
  X,
  ExternalLink
} from 'lucide-react';

const DEFAULT_SETTINGS: TeacherSettings = {
  namaPengajar: 'Deni Santoso, M.M',
  nomorWA: '',
  defaultTheme: 'solar',
  lembagaName: 'Dessa Mentari Education',
  lembagaTagline: 'Bright Learning & Private Tutoring System',
  contactInfo: 'Dessa Mentari Education',
};

const SEED_REPORTS: ReportData[] = [
  {
    id: 'RPT-101',
    namaSiswa: 'Ananda Kevin Pratama',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-10-10',
    waktuDurasi: '90 Menit',
    jenjang: 'SD',
    kelasGrade: 'Kelas 4 SD',
    mataPelajaran: 'Matematika',
    statusKehadiran: 'Hadir',
    skorPemahaman: 75,
    skorKeaktifan: 80,
    skorFokus: 70,
    materiDipelajari: 'Pengenalan Pecahan Biasa & Pecahan Senilai.',
    evaluasiSiswa: 'Kevin mengikuti sesi les dengan cukup baik. Perlu pengulangan konsep dasar penyebut pecahan.',
    tugasRumah: 'Halaman 15 No 1-5',
    theme: 'solar',
    createdAt: '2026-10-10T10:00:00.000Z',
  },
  {
    id: 'RPT-102',
    namaSiswa: 'Ananda Kevin Pratama',
    namaPengajar: 'Sarah Syahidah Syahrudin, S.Pd',
    tanggal: '2026-10-15',
    waktuDurasi: '90 Menit',
    jenjang: 'SD',
    kelasGrade: 'Kelas 4 SD',
    mataPelajaran: 'Matematika',
    statusKehadiran: 'Hadir',
    skorPemahaman: 85,
    skorKeaktifan: 90,
    skorFokus: 85,
    materiDipelajari: 'Perkalian Desimal & Pecahan Campuran.',
    evaluasiSiswa: 'Peningkatan pesat! Kevin mampu mengerjakan 7 dari 10 latihan soal cerita dengan mandiri.',
    tugasRumah: 'Halaman 22 No 1-4',
    theme: 'solar',
    createdAt: '2026-10-15T10:00:00.000Z',
  },
  {
    id: 'RPT-103',
    namaSiswa: 'Ananda Kevin Pratama',
    namaPengajar: 'Sarah Syahidah Syahrudin, S.Pd',
    tanggal: '2026-10-22',
    waktuDurasi: '90 Menit',
    jenjang: 'SD',
    kelasGrade: 'Kelas 4 SD',
    mataPelajaran: 'Bahasa Inggris',
    statusKehadiran: 'Hadir',
    skorPemahaman: 90,
    skorKeaktifan: 95,
    skorFokus: 90,
    materiDipelajari: 'Vocabulary Unit 4: Daily Activities & Present Tense.',
    evaluasiSiswa: 'Sangat percaya diri dalam mengucapkan kalimat Bahasa Inggris. Hafalan kosa kata meningkat pesat.',
    theme: 'solar',
    createdAt: '2026-10-22T10:00:00.000Z',
  },
  {
    id: 'RPT-104',
    namaSiswa: 'Siti Aisyah',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-10-18',
    waktuDurasi: '90 Menit',
    jenjang: 'SMP',
    kelasGrade: 'Kelas 8 SMP',
    mataPelajaran: 'IPA',
    statusKehadiran: 'Hadir',
    skorPemahaman: 92,
    skorKeaktifan: 88,
    skorFokus: 95,
    materiDipelajari: 'Sistem Pencernaan Manusia & Uji Nutrisi Makanan.',
    evaluasiSiswa: 'Aisyah sangat fokus dan teliti dalam memahami organ pencernaan serta enzim pencernaan.',
    theme: 'emerald',
    createdAt: '2026-10-18T10:00:00.000Z',
  },
];

const SEED_STUDENTS: StudentData[] = [
  {
    id: 'STU-001',
    namaSiswa: 'Ananda Kevin Pratama',
    panggilan: 'Kevin',
    jenjang: 'SD',
    kelasGrade: 'Kelas 4 SD',
    sekolah: 'SDN Mentari 01',
    namaOrangTua: 'Ibu Ratna',
    nomorOrangTua: '081234567890',
    alamat: 'Jl. Mentari Raya No. 12',
    mataPelajaran: 'Matematika & Bahasa Inggris',
    hariLes: 'Senin & Kamis',
    jamLes: '15.30 - 17.00 WIB',
    namaPengajar: 'Sarah Syahidah Syahrudin, S.Pd',
    status: 'Aktif',
    catatanKhusus: 'Sangat menyukai soal gambar & matematika. Sangat cepat paham jika diberi ilustrasi visual.',
    createdAt: '2026-10-01T08:00:00.000Z',
  },
  {
    id: 'STU-002',
    namaSiswa: 'Siti Aisyah',
    panggilan: 'Aisyah',
    jenjang: 'SMP',
    kelasGrade: 'Kelas 8 SMP',
    sekolah: 'SMP Negeri 2',
    namaOrangTua: 'Bpk. Ahmad',
    nomorOrangTua: '085711223344',
    alamat: 'Komp. Dessa Asri Blok B3',
    mataPelajaran: 'IPA & Fisika',
    hariLes: 'Selasa & Jumat',
    jamLes: '16.00 - 17.30 WIB',
    namaPengajar: 'Deni Santoso, M.M',
    status: 'Aktif',
    catatanKhusus: 'Fokus tinggi dan mandiri. Rajin mengerjakan tugas praktikum IPA.',
    createdAt: '2026-10-02T08:00:00.000Z',
  },
  {
    id: 'STU-003',
    namaSiswa: 'Bimo Utomo',
    panggilan: 'Bimo',
    jenjang: 'SMA',
    kelasGrade: 'Kelas 11 SMA',
    sekolah: 'SMA Negeri 1',
    namaOrangTua: 'Ibu Dewi',
    nomorOrangTua: '081987654321',
    alamat: 'Jl. Kebon Jeruk No. 45',
    mataPelajaran: 'Kimia & Matematika Lanjut',
    hariLes: 'Rabu & Sabtu',
    jamLes: '18.30 - 20.00 WIB',
    namaPengajar: 'Deni Santoso, M.M',
    status: 'Aktif',
    catatanKhusus: 'Persiapan SNBT & Ujian Sekolah.',
    createdAt: '2026-10-05T08:00:00.000Z',
  },
  {
    id: 'STU-004',
    namaSiswa: 'Clarissa Puteri',
    panggilan: 'Caca',
    jenjang: 'TK',
    kelasGrade: 'TK B',
    sekolah: 'TK Pembina',
    namaOrangTua: 'Ibu Maya',
    nomorOrangTua: '087766554433',
    alamat: 'Jl. Bunga Melati No. 8',
    mataPelajaran: 'Calistung / Cisritung',
    hariLes: 'Senin & Rabu',
    jamLes: '14.00 - 15.15 WIB',
    namaPengajar: 'Sarah Syahidah Syahrudin, S.Pd',
    status: 'Aktif',
    catatanKhusus: 'Belajar membaca & mewarnai angka. Perlu variasi media belajar lagu anak.',
    createdAt: '2026-10-08T08:00:00.000Z',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('create');
  const [settings, setSettings] = useState<TeacherSettings>(() => {
    const saved = localStorage.getItem('dme_teacher_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const getTodayDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [report, setReport] = useState<ReportData>(() => ({
    id: `RPT-${Date.now()}`,
    namaSiswa: 'Ananda Kevin Pratama',
    namaPengajar: settings.namaPengajar || 'Deni Santoso, M.M',
    tanggal: getTodayDate(),
    waktuDurasi: '90 Menit (15.30 - 17.00 WIB)',
    jenjang: 'SD',
    kelasGrade: 'Kelas 4 SD',
    mataPelajaran: 'Matematika',
    statusKehadiran: 'Hadir',
    skorPemahaman: 90,
    skorKeaktifan: 95,
    skorFokus: 88,
    materiDipelajari: '• Operasi Hitung Pecahan Campuran & Desimal\n• Latihan Soal Cerita Perkalian pecahan tingkat lanjut.',
    evaluasiSiswa: 'Kevin sangat aktif dan antusias selama sesi les. Kevin mampu memahami konsep perkalian desimal dengan cepat dan dapat menyelesaikan 8 dari 10 soal latihan secara mandiri.',
    tugasRumah: 'Mengerjakan 5 soal pecahan desimal di buku halaman 42.',
    catatanOrangTua: 'Mohon Ananda dibantu mengulang latihan hafalan perkalian 7 dan 8 di rumah ya Bund.',
    theme: settings.defaultTheme || 'solar',
    createdAt: new Date().toISOString(),
  }));

  const [savedReports, setSavedReports] = useState<ReportData[]>(() => {
    const saved = localStorage.getItem('dme_saved_reports');
    return saved ? JSON.parse(saved) : SEED_REPORTS;
  });

  const [students, setStudents] = useState<StudentData[]>(() => {
    const saved = localStorage.getItem('dme_registered_students');
    return saved ? JSON.parse(saved) : SEED_STUDENTS;
  });

  const [standalonePhotos, setStandalonePhotos] = useState<PhotoItem[]>(() => {
    const saved = localStorage.getItem('dme_standalone_photos');
    return saved ? JSON.parse(saved) : [];
  });

  const [downloading, setDownloading] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [saveReportSuccess, setSaveReportSuccess] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [adminLinkCopied, setAdminLinkCopied] = useState(false);
  const [directLinkReport, setDirectLinkReport] = useState<ReportData | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState(true);

  const handleCopyAdminPortalLink = () => {
    const adminUrl = `${window.location.origin}${window.location.pathname}?mode=admin`;
    navigator.clipboard.writeText(adminUrl);
    setAdminLinkCopied(true);
    setTimeout(() => setAdminLinkCopied(false), 2500);
  };

  // Initialize Firebase Cloud test and subscribe to real-time reports, students & photos
  useEffect(() => {
    testConnection();

    const unsubscribeReports = subscribeReportsFromCloud(
      (cloudReports) => {
        setIsCloudSyncing(false);
        if (cloudReports.length > 0) {
          setSavedReports(cloudReports);
        } else {
          // If cloud is empty on initial provision, sync seed reports to cloud
          SEED_REPORTS.forEach((seed) => {
            saveReportToCloud(seed).catch(console.error);
          });
        }
      },
      (err) => {
        console.warn('Firebase reports sync listener warning:', err);
        setIsCloudSyncing(false);
      }
    );

    const unsubscribeStudents = subscribeStudentsFromCloud(
      (cloudStudents) => {
        if (cloudStudents.length > 0) {
          setStudents(cloudStudents);
        } else {
          // Seed cloud with initial registered students
          SEED_STUDENTS.forEach((seed) => {
            saveStudentToCloud(seed).catch(console.error);
          });
        }
      },
      (err) => {
        console.warn('Firebase students sync listener warning:', err);
      }
    );

    const unsubscribePhotos = subscribePhotosFromCloud(
      (cloudPhotos) => {
        if (cloudPhotos.length > 0) {
          setStandalonePhotos(cloudPhotos);
        }
      },
      (err) => {
        console.warn('Firebase photos sync listener warning:', err);
      }
    );

    return () => {
      unsubscribeReports();
      unsubscribeStudents();
      unsubscribePhotos();
    };
  }, []);

  // Parse URL query parameter for direct report link (e.g. ?reportId=RPT-101)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reportIdParam = params.get('reportId');
    if (reportIdParam && savedReports.length > 0) {
      const found = savedReports.find((r) => r.id === reportIdParam);
      if (found) {
        setDirectLinkReport(found);
      }
    }
  }, [savedReports]);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('dme_teacher_settings', JSON.stringify(settings));
  }, [settings]);

  // Sync saved reports to localStorage
  useEffect(() => {
    localStorage.setItem('dme_saved_reports', JSON.stringify(savedReports));
  }, [savedReports]);

  // Sync registered students to localStorage
  useEffect(() => {
    localStorage.setItem('dme_registered_students', JSON.stringify(students));
  }, [students]);

  // Sync standalone photos to localStorage
  useEffect(() => {
    localStorage.setItem('dme_standalone_photos', JSON.stringify(standalonePhotos));
  }, [standalonePhotos]);

  const handleSaveStudent = (studentToSave: StudentData) => {
    setStudents((prev) => {
      const idx = prev.findIndex((s) => s.id === studentToSave.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = studentToSave;
        return copy;
      }
      return [studentToSave, ...prev];
    });

    // Save to Cloud Firestore
    saveStudentToCloud(studentToSave).catch((err) => {
      console.error('Failed to sync student to cloud:', err);
    });
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    deleteStudentFromCloud(id).catch((err) => {
      console.error('Failed to delete student from cloud:', err);
    });
  };

  const handleUploadPhoto = async (photo: PhotoItem) => {
    setStandalonePhotos((prev) => [photo, ...prev]);
    await savePhotoToCloud(photo);
  };

  const handleDeletePhoto = async (id: string) => {
    setStandalonePhotos((prev) => prev.filter((p) => p.id !== id));
    await deletePhotoFromCloud(id);
  };

  const handleSelectStudentForReport = (student: StudentData) => {
    setReport((prev) => ({
      ...prev,
      namaSiswa: student.namaSiswa,
      jenjang: student.jenjang,
      kelasGrade: student.kelasGrade || prev.kelasGrade,
      namaPengajar: student.namaPengajar || prev.namaPengajar,
      mataPelajaran: student.mataPelajaran || prev.mataPelajaran,
    }));
    setActiveTab('create');
  };

  const handleReportChange = (updated: Partial<ReportData>) => {
    setReport((prev) => ({ ...prev, ...updated }));
  };

  const handleDownloadImage = async (format: 'jpg' | 'png' = 'jpg') => {
    setDownloading(true);
    const filename = `Laporan_Les_${report.namaSiswa.replace(/\s+/g, '_')}_${report.tanggal}`;
    const ok = await downloadReportAsImage('report-card-container', filename, format);
    setDownloading(false);
    if (!ok) {
      alert('Gagal mengunduh gambar laporan. Silakan coba lagi.');
    }
  };

  const handleCopyTextWA = async () => {
    const ok = await copyWhatsAppTextToClipboard(report);
    if (ok) {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    }
  };

  const handleOpenWA = () => {
    openWhatsAppDirect(report, settings.nomorWA);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToHistory = () => {
    const reportToSave = {
      ...report,
      id: report.id || `RPT-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    const existingIndex = savedReports.findIndex((r) => r.id === reportToSave.id);
    let updatedList: ReportData[];
    if (existingIndex >= 0) {
      updatedList = [...savedReports];
      updatedList[existingIndex] = reportToSave;
    } else {
      updatedList = [reportToSave, ...savedReports];
    }
    setSavedReports(updatedList);
    
    // Save to Cloud Firestore for Admin and multi-device access
    saveReportToCloud(reportToSave).catch((err) => {
      console.error('Failed to sync report to cloud:', err);
    });

    setSaveReportSuccess(true);
    setTimeout(() => setSaveReportSuccess(false), 2500);
  };

  const handleResetForm = () => {
    if (confirm('Apakah Anda yakin ingin mengosongkan formulir laporan?')) {
      setReport({
        id: `RPT-${Date.now()}`,
        namaSiswa: '',
        namaPengajar: settings.namaPengajar || 'Deni Santoso, M.M',
        tanggal: getTodayDate(),
        waktuDurasi: '90 Menit',
        jenjang: 'SD',
        kelasGrade: '',
        mataPelajaran: 'Matematika',
        statusKehadiran: 'Hadir',
        skorPemahaman: 85,
        skorKeaktifan: 85,
        skorFokus: 85,
        materiDipelajari: '',
        evaluasiSiswa: '',
        tugasRumah: '',
        catatanOrangTua: '',
        theme: settings.defaultTheme || 'solar',
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleSelectFromHistory = (selected: ReportData) => {
    setReport(selected);
    setActiveTab('create');
  };

  const handleDeleteHistoryReport = (id: string) => {
    if (confirm('Hapus laporan ini dari riwayat dan Cloud Database?')) {
      setSavedReports((prev) => prev.filter((r) => r.id !== id));
      deleteReportFromCloud(id).catch((err) => {
        console.error('Failed to delete report from cloud:', err);
      });
    }
  };

  const totalPhotosCount = standalonePhotos.length + savedReports.reduce((acc, r) => acc + (r.fotoDokumentasi?.length || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* HEADER NAVBAR */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onDownloadJpg={() => handleDownloadImage('jpg')}
        downloading={downloading}
        onCopyAdminLink={handleCopyAdminPortalLink}
        adminLinkCopied={adminLinkCopied}
        studentsCount={students.length}
        photosCount={totalPhotosCount}
      />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'create' && (
          <div className="space-y-6">
            {/* ADMIN PORTAL WELCOME BANNER */}
            <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                  <span className="text-lg">🔑</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-300">
                      Portal Input Laporan Admin — Dessa Mentari Education
                    </h3>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                      🟢 Cloud Sync Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1">
                    Sebagai Admin, Anda dapat mengisi laporan pembelajaran untuk pengajar (Deni Santoso, M.M / Sarah Syahidah Syahrudin, S.Pd). Seluruh data langsung tersimpan otomatis ke Cloud Database.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyAdminPortalLink}
                className="px-3.5 py-2 text-xs font-extrabold text-amber-950 bg-amber-300 hover:bg-amber-200 active:scale-95 rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <span>{adminLinkCopied ? '✓ Link Admin Tersalin!' : '🔗 Salin Link Direct Admin'}</span>
              </button>
            </div>

            <StatsSummaryPanel reports={savedReports} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* FORM INPUTS (LEFT COLUMN) */}
              <div className="lg:col-span-6 space-y-4 no-print">
                <ReportForm
                  report={report}
                  onChange={handleReportChange}
                  onOpenAiAssistant={() => setIsAiModalOpen(true)}
                  registeredStudents={students}
                />

                {/* Reset & Quick Actions Bar */}
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Form</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveToHistory}
                    className="px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-600" />
                    <span>{saveReportSuccess ? 'Tersimpan!' : 'Simpan ke Riwayat'}</span>
                  </button>
                </div>
              </div>

              {/* LIVE CARD PREVIEW & EXPORT ACTIONS (RIGHT COLUMN) */}
              <div className="lg:col-span-6 space-y-4 sticky top-20">
                {/* Action Toolbar above Card */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 no-print">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Pratinjau Kartu Laporan
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Tampilan Ekspor JPG
                    </span>
                  </div>

                  {/* Primary Export Action Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => handleDownloadImage('jpg')}
                      disabled={downloading}
                      className="px-3 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <Download className="w-4 h-4 text-amber-200" />
                      <span>Unduh JPG</span>
                    </button>

                    <button
                      onClick={() => handleDownloadImage('png')}
                      disabled={downloading}
                      className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <FileImage className="w-4 h-4 text-slate-300" />
                      <span>Unduh PNG</span>
                    </button>

                    <button
                      onClick={handleCopyTextWA}
                      className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex flex-col items-center justify-center gap-1"
                    >
                      {copiedSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-200" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4 text-emerald-200" />
                          <span>Salin Teks WA</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleOpenWA}
                      className="px-3 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex flex-col items-center justify-center gap-1"
                    >
                      <Send className="w-4 h-4 text-teal-200" />
                      <span>Kirim WA</span>
                    </button>
                  </div>

                  {/* Print Action Secondary */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={handlePrint}
                      className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak / Print Versi PDF</span>
                    </button>
                  </div>
                </div>

                {/* CARD PREVIEW RENDERER */}
                <div className="p-2 sm:p-4 bg-slate-200/50 rounded-2xl border border-slate-300/80 shadow-inner flex justify-center">
                  <ReportCard report={report} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <PhotoGalleryView
            reports={savedReports}
            standalonePhotos={standalonePhotos}
            students={students}
            onUploadPhoto={handleUploadPhoto}
            onDeletePhoto={handleDeletePhoto}
          />
        )}

        {activeTab === 'video' && <AiVideoStudio report={report} />}

        {activeTab === 'history' && (
          <HistoryView
            reports={savedReports}
            onSelectReport={handleSelectFromHistory}
            onDeleteReport={handleDeleteHistoryReport}
          />
        )}

        {activeTab === 'students' && (
          <StudentManagementView
            students={students}
            reports={savedReports}
            onSaveStudent={handleSaveStudent}
            onDeleteStudent={handleDeleteStudent}
            onSelectStudentForReport={handleSelectStudentForReport}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={(newSet) => setSettings(newSet)}
          />
        )}

        {activeTab === 'guide' && <GuideView />}
      </main>

      {/* DIRECT ONLINE REPORT VIEWER MODAL FOR ADMIN */}
      {directLinkReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8 relative border border-amber-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    Akses Laporan Online Admin
                  </h3>
                  <p className="text-xs text-slate-500">
                    Membuka laporan langsung dari Firebase Cloud Database
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setDirectLinkReport(null);
                  window.history.pushState({}, '', window.location.pathname);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center bg-slate-100 p-4 rounded-xl border border-slate-200 overflow-x-auto">
              <ReportCard report={directLinkReport} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setReport(directLinkReport);
                  setDirectLinkReport(null);
                  setActiveTab('create');
                  window.history.pushState({}, '', window.location.pathname);
                }}
                className="px-4 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-all flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka & Edit di Form</span>
              </button>

              <button
                onClick={() => {
                  setDirectLinkReport(null);
                  window.history.pushState({}, '', window.location.pathname);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI EVALUATOR ASSISTANT MODAL */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        namaSiswa={report.namaSiswa}
        jenjang={report.jenjang}
        mataPelajaran={report.mataPelajaran}
        materi={report.materiDipelajari}
        currentEvaluasi={report.evaluasiSiswa}
        catatanOrangTua={report.catatanOrangTua}
        onApply={(aiData) => {
          handleReportChange({
            ...(aiData.evaluasiSiswa ? { evaluasiSiswa: aiData.evaluasiSiswa } : {}),
            ...(aiData.tugasRumah ? { tugasRumah: aiData.tugasRumah } : {}),
            ...(aiData.catatanOrangTua ? { catatanOrangTua: aiData.catatanOrangTua } : {}),
          });
        }}
      />

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p className="font-semibold text-slate-700">
            Dessa Mentari Education © {new Date().getFullYear()} — Generator Laporan Pembelajaran & AI Video Studio
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Pengajar Resmi: Deni Santoso, M.M & Sarah Syahidah Syahrudin, S.Pd
          </p>
        </div>
      </footer>
    </div>
  );
}

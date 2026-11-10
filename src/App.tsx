import React, { useState, useEffect, useMemo } from 'react';
import { ReportData, TeacherSettings, StudentData, PhotoItem, BillingRecord, CertificateData, TeacherData } from './types/report';
import { Header, ActiveTabType } from './components/Header';
import { PublicNavbar, PublicTabType } from './components/PublicNavbar';
import { PublicHomeView } from './components/PublicHomeView';
import { PublicAboutView } from './components/PublicAboutView';
import { PublicStudentReportLookup } from './components/PublicStudentReportLookup';
import { AdminHeader, AdminTabType } from './components/AdminHeader';
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
import { BillingSummaryView } from './components/BillingSummaryView';
import { CertificateManagerView } from './components/CertificateManagerView';
import { TeacherManagementView } from './components/TeacherManagementView';
import { TeacherReportSubmissionView } from './components/TeacherReportSubmissionView';
import { AdminReportRecapView } from './components/AdminReportRecapView';
import { TeacherDashboardView } from './components/TeacherDashboardView';
import { TeacherLoginModal } from './components/TeacherLoginModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { InstitutionView } from './components/InstitutionView';
import { 
  downloadReportAsImage, 
  downloadReportAsPdf,
  shareReportFile,
  buildReportFilename,
  copyWhatsAppTextToClipboard, 
  openWhatsAppDirect 
} from './utils/exportImage';
import { exportReportToExcel } from './utils/exportExcel';
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
  subscribePhotosFromCloud,
  saveBillingToCloud,
  deleteBillingFromCloud,
  subscribeBillingsFromCloud,
  saveCertificateToCloud,
  deleteCertificateFromCloud,
  subscribeCertificatesFromCloud,
  saveTeacherToCloud,
  deleteTeacherFromCloud,
  subscribeTeachersFromCloud
} from './lib/firebase';
import { 
  Download, 
  Share2, 
  Check, 
  Award,
  Printer, 
  Save, 
  RotateCcw,
  Eye,
  FileImage,
  Send,
  Cloud,
  X,
  ExternalLink,
  FileText,
  FileSpreadsheet,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const DEFAULT_SETTINGS: TeacherSettings = {
  namaPengajar: 'Deni Santoso, M.M',
  nomorWA: '6287879069404',
  defaultTheme: 'solar',
  defaultLayout: 'elegant',
  lembagaName: 'Dessa Mentari Education',
  lembagaTagline: 'Bright Learning & Private Tutoring System',
  contactInfo: 'Dessa Mentari Education',
};

const SEED_REPORTS: ReportData[] = [
  // JUNI 2026
  {
    id: 'RPT-0601',
    namaSiswa: 'Ananda Kevin Pratama',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-06-12',
    waktuDurasi: '90 Menit',
    jenjang: 'SD',
    kelasGrade: 'Kelas 4 SD',
    mataPelajaran: 'Matematika',
    statusKehadiran: 'Hadir',
    skorPemahaman: 76,
    skorKeaktifan: 80,
    skorFokus: 75,
    materiDipelajari: 'Pengenalan Operasi Bilangan Bulat & Garis Bilangan.',
    evaluasiSiswa: 'Mulai memahami konsep nilai tempat dan bilangan negatif secara perlahan.',
    theme: 'solar',
    createdAt: '2026-06-12T10:00:00.000Z',
  },
  {
    id: 'RPT-0602',
    namaSiswa: 'Siti Aisyah',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-06-20',
    waktuDurasi: '90 Menit',
    jenjang: 'SMP',
    kelasGrade: 'Kelas 8 SMP',
    mataPelajaran: 'IPA',
    statusKehadiran: 'Hadir',
    skorPemahaman: 82,
    skorKeaktifan: 85,
    skorFokus: 88,
    materiDipelajari: 'Pengenalan Klasifikasi Makhluk Hidup & Mikroskop.',
    evaluasiSiswa: 'Aisyah sangat teliti dalam mengamati diagram sel hewan dan tumbuhan.',
    theme: 'emerald',
    createdAt: '2026-06-20T10:00:00.000Z',
  },
  {
    id: 'RPT-0603',
    namaSiswa: 'Bimo Utomo',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-06-26',
    waktuDurasi: '90 Menit',
    jenjang: 'SMA',
    kelasGrade: 'Kelas 11 SMA',
    mataPelajaran: 'Kimia',
    statusKehadiran: 'Hadir',
    skorPemahaman: 80,
    skorKeaktifan: 82,
    skorFokus: 80,
    materiDipelajari: 'Teori Struktur Atom & Konfigurasi Elektron Bohr.',
    evaluasiSiswa: 'Konsep kulit atom dapat diselesaikan dengan baik, latihan nomor atom tuntas.',
    theme: 'navy',
    createdAt: '2026-06-26T10:00:00.000Z',
  },

  // JULI 2026
  {
    id: 'RPT-0701',
    namaSiswa: 'Ananda Kevin Pratama',
    namaPengajar: 'Sarah Syahidah Syahrudin, S.Pd',
    tanggal: '2026-07-08',
    waktuDurasi: '90 Menit',
    jenjang: 'SD',
    kelasGrade: 'Kelas 4 SD',
    mataPelajaran: 'Matematika',
    statusKehadiran: 'Hadir',
    skorPemahaman: 80,
    skorKeaktifan: 84,
    skorFokus: 82,
    materiDipelajari: 'Pecahan Senilai & Penyederhanaan Pecahan.',
    evaluasiSiswa: 'Mulai terbiasa membagi pembilang dan penyebut dengan FPB.',
    theme: 'solar',
    createdAt: '2026-07-08T10:00:00.000Z',
  },
  {
    id: 'RPT-0702',
    namaSiswa: 'Siti Aisyah',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-07-15',
    waktuDurasi: '90 Menit',
    jenjang: 'SMP',
    kelasGrade: 'Kelas 8 SMP',
    mataPelajaran: 'IPA',
    statusKehadiran: 'Hadir',
    skorPemahaman: 86,
    skorKeaktifan: 88,
    skorFokus: 90,
    materiDipelajari: 'Sistem Rangka & Persendian pada Manusia.',
    evaluasiSiswa: 'Dapat membedakan sendi engsel, peluru, dan putar dengan tepat.',
    theme: 'emerald',
    createdAt: '2026-07-15T10:00:00.000Z',
  },
  {
    id: 'RPT-0703',
    namaSiswa: 'Clarissa Puteri',
    namaPengajar: 'Sarah Syahidah Syahrudin, S.Pd',
    tanggal: '2026-07-22',
    waktuDurasi: '75 Menit',
    jenjang: 'TK',
    kelasGrade: 'TK B',
    mataPelajaran: 'Calistung / Cisritung',
    statusKehadiran: 'Hadir',
    skorPemahaman: 85,
    skorKeaktifan: 90,
    skorFokus: 80,
    materiDipelajari: 'Mengenal Huruf Vokal A-I-U-E-O & Menulis Angka 1-10.',
    evaluasiSiswa: 'Caca ceria dan senang mewarnai kartu huruf.',
    theme: 'pastel',
    createdAt: '2026-07-22T10:00:00.000Z',
  },
  {
    id: 'RPT-0704',
    namaSiswa: 'Bimo Utomo',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-07-29',
    waktuDurasi: '90 Menit',
    jenjang: 'SMA',
    kelasGrade: 'Kelas 11 SMA',
    mataPelajaran: 'Kimia',
    statusKehadiran: 'Hadir',
    skorPemahaman: 84,
    skorKeaktifan: 85,
    skorFokus: 86,
    materiDipelajari: 'Sistem Periodik Unsur & Jari-jari Atom.',
    evaluasiSiswa: 'Mampu menjelaskan tren keelektronegatifan satu periode.',
    theme: 'navy',
    createdAt: '2026-07-29T10:00:00.000Z',
  },

  // AGUSTUS 2026
  {
    id: 'RPT-0801',
    namaSiswa: 'Ananda Kevin Pratama',
    namaPengajar: 'Sarah Syahidah Syahrudin, S.Pd',
    tanggal: '2026-08-04',
    waktuDurasi: '90 Menit',
    jenjang: 'SD',
    kelasGrade: 'Kelas 4 SD',
    mataPelajaran: 'Matematika',
    statusKehadiran: 'Hadir',
    skorPemahaman: 82,
    skorKeaktifan: 88,
    skorFokus: 85,
    materiDipelajari: 'Operasi Penjumlahan & Pengurangan Pecahan Biasa.',
    evaluasiSiswa: 'Ketelitian menghitung KPK penyebut semakin mantap.',
    theme: 'solar',
    createdAt: '2026-08-04T10:00:00.000Z',
  },
  {
    id: 'RPT-0802',
    namaSiswa: 'Siti Aisyah',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-08-11',
    waktuDurasi: '90 Menit',
    jenjang: 'SMP',
    kelasGrade: 'Kelas 8 SMP',
    mataPelajaran: 'IPA',
    statusKehadiran: 'Hadir',
    skorPemahaman: 88,
    skorKeaktifan: 90,
    skorFokus: 92,
    materiDipelajari: 'Gerak Lurus Beraturan (GLB) & Hukum Newton I-II.',
    evaluasiSiswa: 'Mampu mengaplikasikan rumus F = m.a pada soal gerak.',
    theme: 'emerald',
    createdAt: '2026-08-11T10:00:00.000Z',
  },
  {
    id: 'RPT-0803',
    namaSiswa: 'Clarissa Puteri',
    namaPengajar: 'Sarah Syahidah Syahrudin, S.Pd',
    tanggal: '2026-08-18',
    waktuDurasi: '75 Menit',
    jenjang: 'TK',
    kelasGrade: 'TK B',
    mataPelajaran: 'Calistung / Cisritung',
    statusKehadiran: 'Hadir',
    skorPemahaman: 88,
    skorKeaktifan: 92,
    skorFokus: 85,
    materiDipelajari: 'Membaca 2 Suku Kata Terbuka (ba, bi, bu, be, bo).',
    evaluasiSiswa: 'Lafal membaca sangat jelas, antusias menyusun balok kata.',
    theme: 'pastel',
    createdAt: '2026-08-18T10:00:00.000Z',
  },
  {
    id: 'RPT-0804',
    namaSiswa: 'Bimo Utomo',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-08-23',
    waktuDurasi: '90 Menit',
    jenjang: 'SMA',
    kelasGrade: 'Kelas 11 SMA',
    mataPelajaran: 'Matematika',
    statusKehadiran: 'Hadir',
    skorPemahaman: 86,
    skorKeaktifan: 88,
    skorFokus: 88,
    materiDipelajari: 'Persamaan Trigonometri Dasar & Sudut Berelasi.',
    evaluasiSiswa: 'Mampu menemukan himpunan penyelesaian sudut kuadran I-IV.',
    theme: 'navy',
    createdAt: '2026-08-23T10:00:00.000Z',
  },
  {
    id: 'RPT-0805',
    namaSiswa: 'Ananda Kevin Pratama',
    namaPengajar: 'Sarah Syahidah Syahrudin, S.Pd',
    tanggal: '2026-08-28',
    waktuDurasi: '90 Menit',
    jenjang: 'SD',
    kelasGrade: 'Kelas 4 SD',
    mataPelajaran: 'Bahasa Inggris',
    statusKehadiran: 'Hadir',
    skorPemahaman: 85,
    skorKeaktifan: 90,
    skorFokus: 86,
    materiDipelajari: 'Greetings, Family Members & Simple Introductions.',
    evaluasiSiswa: 'Percaya diri memperkenalkan anggota keluarga dalam Bahasa Inggris.',
    theme: 'solar',
    createdAt: '2026-08-28T10:00:00.000Z',
  },

  // SEPTEMBER 2026
  {
    id: 'RPT-0901',
    namaSiswa: 'Ananda Kevin Pratama',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-09-03',
    waktuDurasi: '90 Menit',
    jenjang: 'SD',
    kelasGrade: 'Kelas 4 SD',
    mataPelajaran: 'Matematika',
    statusKehadiran: 'Hadir',
    skorPemahaman: 86,
    skorKeaktifan: 90,
    skorFokus: 88,
    materiDipelajari: 'Perkalian Pecahan & Konversi Pecahan ke Desimal.',
    evaluasiSiswa: 'Kevin sudah mampu mengubah penyebut kelipatan 10 menjadi desimal.',
    theme: 'solar',
    createdAt: '2026-09-03T10:00:00.000Z',
  },
  {
    id: 'RPT-0902',
    namaSiswa: 'Siti Aisyah',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-09-10',
    waktuDurasi: '90 Menit',
    jenjang: 'SMP',
    kelasGrade: 'Kelas 8 SMP',
    mataPelajaran: 'IPA',
    statusKehadiran: 'Hadir',
    skorPemahaman: 90,
    skorKeaktifan: 92,
    skorFokus: 92,
    materiDipelajari: 'Usaha & Pesawat Sederhana (Tuas, Katrol, Bidang Miring).',
    evaluasiSiswa: 'Perhitungan keuntungan mekanis tuas sangat cepat dan tepat.',
    theme: 'emerald',
    createdAt: '2026-09-10T10:00:00.000Z',
  },
  {
    id: 'RPT-0903',
    namaSiswa: 'Clarissa Puteri',
    namaPengajar: 'Sarah Syahidah Syahrudin, S.Pd',
    tanggal: '2026-09-14',
    waktuDurasi: '75 Menit',
    jenjang: 'TK',
    kelasGrade: 'TK B',
    mataPelajaran: 'Calistung / Cisritung',
    statusKehadiran: 'Hadir',
    skorPemahaman: 90,
    skorKeaktifan: 94,
    skorFokus: 88,
    materiDipelajari: 'Penjumlahan Bergambar 1-10 & Menulis Kata Sederhana.',
    evaluasiSiswa: 'Caca sudah bisa menghitung jumlah apel bergambar tanpa bantuan jari.',
    theme: 'pastel',
    createdAt: '2026-09-14T10:00:00.000Z',
  },
  {
    id: 'RPT-0904',
    namaSiswa: 'Bimo Utomo',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-09-19',
    waktuDurasi: '90 Menit',
    jenjang: 'SMA',
    kelasGrade: 'Kelas 11 SMA',
    mataPelajaran: 'Kimia',
    statusKehadiran: 'Hadir',
    skorPemahaman: 88,
    skorKeaktifan: 90,
    skorFokus: 90,
    materiDipelajari: 'Ikatan Kovalen Polar & Non-Polar serta Ikatan Logam.',
    evaluasiSiswa: 'Pemahaman bentuk geometri molekul VSEPR sangat tajam.',
    theme: 'navy',
    createdAt: '2026-09-19T10:00:00.000Z',
  },
  {
    id: 'RPT-0905',
    namaSiswa: 'Ananda Kevin Pratama',
    namaPengajar: 'Sarah Syahidah Syahrudin, S.Pd',
    tanggal: '2026-09-24',
    waktuDurasi: '90 Menit',
    jenjang: 'SD',
    kelasGrade: 'Kelas 4 SD',
    mataPelajaran: 'Bahasa Inggris',
    statusKehadiran: 'Hadir',
    skorPemahaman: 88,
    skorKeaktifan: 92,
    skorFokus: 90,
    materiDipelajari: 'Telling Time (O’clock, Half Past, Quarter To) & Daily Routines.',
    evaluasiSiswa: 'Sangat fasih menyebutkan jam aktivitas sekolah dan bangun tidur.',
    theme: 'solar',
    createdAt: '2026-09-24T10:00:00.000Z',
  },
  {
    id: 'RPT-0906',
    namaSiswa: 'Siti Aisyah',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-09-28',
    waktuDurasi: '90 Menit',
    jenjang: 'SMP',
    kelasGrade: 'Kelas 8 SMP',
    mataPelajaran: 'IPA',
    statusKehadiran: 'Hadir',
    skorPemahaman: 92,
    skorKeaktifan: 90,
    skorFokus: 94,
    materiDipelajari: 'Struktur Jaringan Tumbuhan: Xilem, Floem, Stomata.',
    evaluasiSiswa: 'Aisyah mampu menggambarkan penampang melintang akar dan batang dikotil.',
    theme: 'emerald',
    createdAt: '2026-09-28T10:00:00.000Z',
  },

  // OKTOBER 2026
  {
    id: 'RPT-1001',
    namaSiswa: 'Ananda Kevin Pratama',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-10-10',
    waktuDurasi: '90 Menit',
    jenjang: 'SD',
    kelasGrade: 'Kelas 4 SD',
    mataPelajaran: 'Matematika',
    statusKehadiran: 'Hadir',
    skorPemahaman: 88,
    skorKeaktifan: 90,
    skorFokus: 86,
    materiDipelajari: 'Pengenalan Pecahan Campuran & Operasi Hitung Campuran.',
    evaluasiSiswa: 'Kevin mengikuti sesi les dengan sangat baik. Pengulangan konsep penyebut membuahkan hasil.',
    theme: 'solar',
    createdAt: '2026-10-10T10:00:00.000Z',
  },
  {
    id: 'RPT-1002',
    namaSiswa: 'Ananda Kevin Pratama',
    namaPengajar: 'Sarah Syahidah Syahrudin, S.Pd',
    tanggal: '2026-10-15',
    waktuDurasi: '90 Menit',
    jenjang: 'SD',
    kelasGrade: 'Kelas 4 SD',
    mataPelajaran: 'Matematika',
    statusKehadiran: 'Hadir',
    skorPemahaman: 90,
    skorKeaktifan: 92,
    skorFokus: 90,
    materiDipelajari: 'Perkalian Desimal & Pecahan Campuran Lanjutan.',
    evaluasiSiswa: 'Peningkatan pesat! Kevin mampu mengerjakan 8 dari 10 latihan soal cerita secara mandiri.',
    theme: 'solar',
    createdAt: '2026-10-15T10:00:00.000Z',
  },
  {
    id: 'RPT-1003',
    namaSiswa: 'Siti Aisyah',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-10-18',
    waktuDurasi: '90 Menit',
    jenjang: 'SMP',
    kelasGrade: 'Kelas 8 SMP',
    mataPelajaran: 'IPA',
    statusKehadiran: 'Hadir',
    skorPemahaman: 94,
    skorKeaktifan: 90,
    skorFokus: 96,
    materiDipelajari: 'Sistem Pencernaan Manusia & Uji Nutrisi Makanan.',
    evaluasiSiswa: 'Aisyah sangat fokus dan teliti dalam memahami enzim pencernaan lambung dan usus halus.',
    theme: 'emerald',
    createdAt: '2026-10-18T10:00:00.000Z',
  },
  {
    id: 'RPT-1004',
    namaSiswa: 'Ananda Kevin Pratama',
    namaPengajar: 'Sarah Syahidah Syahrudin, S.Pd',
    tanggal: '2026-10-22',
    waktuDurasi: '90 Menit',
    jenjang: 'SD',
    kelasGrade: 'Kelas 4 SD',
    mataPelajaran: 'Bahasa Inggris',
    statusKehadiran: 'Hadir',
    skorPemahaman: 92,
    skorKeaktifan: 95,
    skorFokus: 92,
    materiDipelajari: 'Vocabulary Unit 4: Daily Activities & Simple Present Tense.',
    evaluasiSiswa: 'Sangat percaya diri dalam melafalkan kalimat Bahasa Inggris, pronoun he/she/it tuntas.',
    theme: 'solar',
    createdAt: '2026-10-22T10:00:00.000Z',
  },
  {
    id: 'RPT-1005',
    namaSiswa: 'Bimo Utomo',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-10-25',
    waktuDurasi: '90 Menit',
    jenjang: 'SMA',
    kelasGrade: 'Kelas 11 SMA',
    mataPelajaran: 'Matematika',
    statusKehadiran: 'Hadir',
    skorPemahaman: 90,
    skorKeaktifan: 92,
    skorFokus: 92,
    materiDipelajari: 'Limit Fungsi Aljabar & Pemfaktoran Bentuk Akar.',
    evaluasiSiswa: 'Teknik merasionalkan penyebut akar dikuasai dengan sangat lancar.',
    theme: 'navy',
    createdAt: '2026-10-25T10:00:00.000Z',
  },
  {
    id: 'RPT-1006',
    namaSiswa: 'Clarissa Puteri',
    namaPengajar: 'Sarah Syahidah Syahrudin, S.Pd',
    tanggal: '2026-10-29',
    waktuDurasi: '75 Menit',
    jenjang: 'TK',
    kelasGrade: 'TK B',
    mataPelajaran: 'Calistung / Cisritung',
    statusKehadiran: 'Hadir',
    skorPemahaman: 94,
    skorKeaktifan: 96,
    skorFokus: 90,
    materiDipelajari: 'Membaca Kalimat Pendek 3 Kata & Pengurangan Dasar 1-10.',
    evaluasiSiswa: 'Mampu membaca "Ibu beli bolu" dengan lancar tanpa mengeja satu per satu.',
    theme: 'pastel',
    createdAt: '2026-10-29T10:00:00.000Z',
  },

  // NOVEMBER 2026
  {
    id: 'RPT-1101',
    namaSiswa: 'Ananda Kevin Pratama',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-11-02',
    waktuDurasi: '90 Menit',
    jenjang: 'SD',
    kelasGrade: 'Kelas 4 SD',
    mataPelajaran: 'Matematika',
    statusKehadiran: 'Hadir',
    skorPemahaman: 92,
    skorKeaktifan: 95,
    skorFokus: 92,
    materiDipelajari: 'Geometri Bangun Datar: Keliling & Luas Persegi serta Persegi Panjang.',
    evaluasiSiswa: 'Menemukan rumus keliling secara induktif dan menyelesaikan 5 soal variasi.',
    theme: 'solar',
    createdAt: '2026-11-02T10:00:00.000Z',
  },
  {
    id: 'RPT-1102',
    namaSiswa: 'Siti Aisyah',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-11-04',
    waktuDurasi: '90 Menit',
    jenjang: 'SMP',
    kelasGrade: 'Kelas 8 SMP',
    mataPelajaran: 'IPA',
    statusKehadiran: 'Hadir',
    skorPemahaman: 95,
    skorKeaktifan: 92,
    skorFokus: 96,
    materiDipelajari: 'Sistem Peredaran Darah Manusia: Jantung, Pembuluh, & Golongan Darah.',
    evaluasiSiswa: 'Aisyah menguasai sirkulasi peredaran darah besar dan kecil dengan sempurna.',
    theme: 'emerald',
    createdAt: '2026-11-04T10:00:00.000Z',
  },
  {
    id: 'RPT-1103',
    namaSiswa: 'Clarissa Puteri',
    namaPengajar: 'Sarah Syahidah Syahrudin, S.Pd',
    tanggal: '2026-11-05',
    waktuDurasi: '75 Menit',
    jenjang: 'TK',
    kelasGrade: 'TK B',
    mataPelajaran: 'Calistung / Cisritung',
    statusKehadiran: 'Hadir',
    skorPemahaman: 95,
    skorKeaktifan: 98,
    skorFokus: 92,
    materiDipelajari: 'Membaca Cerita Bergambar & Menghitung Belanja Mainan Sederhana.',
    evaluasiSiswa: 'Sangat mandiri dan percaya diri menjawab tebak kata bergambar.',
    theme: 'pastel',
    createdAt: '2026-11-05T10:00:00.000Z',
  },
  {
    id: 'RPT-1104',
    namaSiswa: 'Bimo Utomo',
    namaPengajar: 'Deni Santoso, M.M',
    tanggal: '2026-11-06',
    waktuDurasi: '90 Menit',
    jenjang: 'SMA',
    kelasGrade: 'Kelas 11 SMA',
    mataPelajaran: 'Kimia',
    statusKehadiran: 'Hadir',
    skorPemahaman: 92,
    skorKeaktifan: 94,
    skorFokus: 94,
    materiDipelajari: 'Termokimia: Entalpi Reaksi & Hukum Hess.',
    evaluasiSiswa: 'Diagram tingkat energi dan diagram siklus Hess dikerjakan dengan cermat.',
    theme: 'navy',
    createdAt: '2026-11-06T10:00:00.000Z',
  },
  {
    id: 'RPT-1105',
    namaSiswa: 'Ananda Kevin Pratama',
    namaPengajar: 'Sarah Syahidah Syahrudin, S.Pd',
    tanggal: '2026-11-07',
    waktuDurasi: '90 Menit',
    jenjang: 'SD',
    kelasGrade: 'Kelas 4 SD',
    mataPelajaran: 'Bahasa Inggris',
    statusKehadiran: 'Hadir',
    skorPemahaman: 94,
    skorKeaktifan: 96,
    skorFokus: 94,
    materiDipelajari: 'Comparative & Superlative Adjectives (bigger, taller, the best).',
    evaluasiSiswa: 'Membandingkan benda di ruangan les dengan aturan imbuhan -er dan -est.',
    theme: 'solar',
    createdAt: '2026-11-07T10:00:00.000Z',
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
    nomorOrangTua: '087879069404',
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

const SEED_CERTIFICATES: CertificateData[] = [
  {
    id: 'CERT-001',
    certificateNumber: 'DME/CERT/2026/X/0028',
    studentId: 'STU-001',
    namaSiswa: 'Syifa Azzarqaa',
    jenjang: 'SD',
    kelasGrade: 'Kelas 4 SD',
    sekolah: 'SD Islam Terpadu Al-Fath',
    mataPelajaran: 'Matematika',
    tipeSertifikat: 'Kelulusan Kursus',
    predikat: 'Lulus dengan Pujian (Honors)',
    nilaiAkhir: 94,
    deskripsiKompetensi: 'Diberikan kepada Ananda Syifa Azzarqaa atas dedikasi dan penguasaan komprehensif pada bidang studi Matematika jenjang SD. Telah tuntas menguasai konsep operasi hitung pecahan, bilangan desimal, keliling dan luas bangun datar, serta kecakapan bernalar logis memecahkan soal cerita kontekstual secara mandiri.',
    tanggalTerbit: '2026-10-28',
    kotaTerbit: 'Indonesia',
    namaKepalaLembaga: 'Deni Santoso, M.M',
    jabatanKepala: 'Direktur Lembaga',
    namaTutorPengampu: 'Sarah Syahidah Syahrudin, S.Pd',
    jabatanTutor: 'Instruktur Pengampu',
    theme: 'gold',
    nomorWAOrangTua: '087879069404',
    isVerified: true,
    createdAt: '2026-10-28T09:00:00.000Z',
  },
  {
    id: 'CERT-002',
    certificateNumber: 'DME/CERT/2026/X/0034',
    studentId: 'STU-004',
    namaSiswa: 'Clarissa Puteri',
    jenjang: 'TK',
    kelasGrade: 'TK B',
    sekolah: 'TK Pembina',
    mataPelajaran: 'Calistung / Cisritung',
    tipeSertifikat: 'Kelulusan Kursus',
    predikat: 'Sangat Memuaskan (A)',
    nilaiAkhir: 96,
    deskripsiKompetensi: 'Diberikan kepada Ananda Clarissa Puteri atas keberhasilannya menyelesaikan seluruh modul Program Calistung & Motorik Ceria dengan predikat istimewa. Ananda telah menunjukkan kemandirian luar biasa dalam membaca lancar suku kata dan kalimat sederhana, kerapian menulis huruf abjad serta angka, dan kecakapan berhitung dasar penjumlahan serta pengurangan 1-100 secara antusias.',
    tanggalTerbit: '2026-10-30',
    kotaTerbit: 'Indonesia',
    namaKepalaLembaga: 'Deni Santoso, M.M',
    jabatanKepala: 'Direktur Lembaga',
    namaTutorPengampu: 'Sarah Syahidah Syahrudin, S.Pd',
    jabatanTutor: 'Instruktur Pengampu',
    theme: 'emerald',
    nomorWAOrangTua: '087766554433',
    isVerified: true,
    createdAt: '2026-10-30T10:00:00.000Z',
  }
];

const SEED_TEACHERS: TeacherData[] = [
  {
    id: 'TCH-001',
    namaLengkap: 'Deni Santoso',
    gelar: 'M.M',
    email: 'deni.santoso@dessamentari.id',
    nomorWA: '6287879069404',
    mataPelajaran: ['Matematika', 'IPA', 'Fisika', 'Kimia'],
    jenjang: ['SD', 'SMP', 'SMA'],
    areaDomisili: 'Jakarta Selatan & Depok (Online & Datang ke Rumah)',
    status: 'Aktif',
    username: 'deni.santoso',
    initialPassword: 'DME-Deni#2026',
    catatanKhusus: 'Direktur Lembaga & Instruktur Senior Eksakta',
    createdAt: '2026-06-01T08:00:00.000Z',
  },
  {
    id: 'TCH-002',
    namaLengkap: 'Sarah Syahidah Syahrudin',
    gelar: 'S.Pd',
    email: 'sarah.syahidah@dessamentari.id',
    nomorWA: '6287879069404',
    mataPelajaran: ['Bahasa Inggris', 'Matematika', 'Calistung / Cisritung', 'IPAS (Ilmu Pengetahuan Alam & Sosial)'],
    jenjang: ['TK', 'SD', 'SMP'],
    areaDomisili: 'Tangerang Selatan, BSD & Bintaro',
    status: 'Aktif',
    username: 'sarah.syahidah',
    initialPassword: 'DME-Sarah#2026',
    catatanKhusus: 'Spesialis Pendampingan Siswa SD, Calistung Ceria & English for Kids',
    createdAt: '2026-06-02T08:00:00.000Z',
  },
  {
    id: 'TCH-003',
    namaLengkap: 'Rizky Ramadhan',
    gelar: 'S.Si',
    email: 'rizky.ramadhan@dessamentari.id',
    nomorWA: '6285711223344',
    mataPelajaran: ['IPA', 'Fisika', 'Biologi', 'Kimia'],
    jenjang: ['SMP', 'SMA'],
    areaDomisili: 'Jakarta Timur & Bekasi',
    status: 'Aktif',
    username: 'rizky.ramadhan',
    initialPassword: 'DME-Rizky#2026',
    catatanKhusus: 'Tutor Olimpiade Sains & Persiapan Ujian Sekolah',
    createdAt: '2026-07-01T08:00:00.000Z',
  },
  {
    id: 'TCH-004',
    namaLengkap: 'Nadia Maharani',
    gelar: 'S.Hum',
    email: 'nadia.maharani@dessamentari.id',
    nomorWA: '6281987654321',
    mataPelajaran: ['Bahasa Jepang', 'Bahasa Inggris', 'Bahasa Indonesia'],
    jenjang: ['SD', 'SMP', 'SMA'],
    areaDomisili: 'Jakarta Barat & Online',
    status: 'Aktif',
    username: 'nadia.maharani',
    initialPassword: 'DME-Nadia#2026',
    catatanKhusus: 'Pengajar Bahasa Asing & Persiapan Sertifikasi JLPT N5-N4',
    createdAt: '2026-08-15T08:00:00.000Z',
  },
];

export default function App() {
  const [viewMode, setViewMode] = useState<'public' | 'admin' | 'teacher'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'admin' || params.get('reportId')) return 'admin';
      if (params.get('mode') === 'teacher') return 'teacher';
      const stored = localStorage.getItem('dme_view_mode');
      if (stored === 'admin' || stored === 'teacher') return stored as 'public' | 'admin' | 'teacher';
    }
    return 'public';
  });

  const [activeTeacherId, setActiveTeacherId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const teacherParam = params.get('teacherId');
      if (teacherParam) return teacherParam;
      const stored = localStorage.getItem('dme_active_teacher_id');
      if (stored) return stored;
    }
    return 'TCH-002'; // Default initial demo teacher Sarah Syahidah Syahrudin, S.Pd
  });

  const [isTeacherLoginModalOpen, setIsTeacherLoginModalOpen] = useState(false);

  const [publicTab, setPublicTab] = useState<PublicTabType>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['home', 'about', 'packages', 'calculator', 'student-report', 'register', 'faq'].includes(tabParam)) {
        return tabParam as PublicTabType;
      }
      const stored = localStorage.getItem('dme_public_tab');
      if (stored && ['home', 'about', 'packages', 'calculator', 'student-report', 'register', 'faq'].includes(stored)) {
        return stored as PublicTabType;
      }
    }
    return 'home';
  });

  const [adminTab, setAdminTab] = useState<AdminTabType>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dme_admin_tab');
      if (stored && ['create', 'teachers', 'recap', 'students', 'certificates', 'billing', 'photos', 'video', 'history', 'settings', 'guide'].includes(stored)) {
        return stored as AdminTabType;
      }
    }
    return 'create';
  });

  const [settings, setSettings] = useState<TeacherSettings>(() => {
    const saved = localStorage.getItem('dme_teacher_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.nomorWA || parsed.nomorWA.includes('81234567890')) {
          parsed.nomorWA = '6287879069404';
        }
        return parsed;
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_SETTINGS;
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
    cardLayout: settings.defaultLayout || 'elegant',
    createdAt: new Date().toISOString(),
  }));

  const [savedReports, setSavedReports] = useState<ReportData[]>(() => {
    const saved = localStorage.getItem('dme_saved_reports');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // If the cached reports list only has the old <=4 seed items, upgrade to the rich multi-month SEED_REPORTS
          if (parsed.length <= 4) {
            return SEED_REPORTS;
          }
          // If user added new custom reports, merge with SEED_REPORTS ensuring all seed IDs exist
          const existingIds = new Set(parsed.map((r: ReportData) => r.id));
          const missingSeeds = SEED_REPORTS.filter((s) => !existingIds.has(s.id));
          return [...parsed, ...missingSeeds];
        }
      } catch (e) {
        // fallback
      }
    }
    return SEED_REPORTS;
  });

  const [students, setStudents] = useState<StudentData[]>(() => {
    const saved = localStorage.getItem('dme_registered_students');
    return saved ? JSON.parse(saved) : SEED_STUDENTS;
  });

  const [teachers, setTeachers] = useState<TeacherData[]>(() => {
    const saved = localStorage.getItem('dme_registered_teachers');
    return saved ? JSON.parse(saved) : SEED_TEACHERS;
  });

  const activeTeacher = useMemo(() => {
    const found = teachers.find((t) => t.id === activeTeacherId);
    return found || teachers[0] || SEED_TEACHERS[0];
  }, [teachers, activeTeacherId]);

  const [standalonePhotos, setStandalonePhotos] = useState<PhotoItem[]>(() => {
    const saved = localStorage.getItem('dme_standalone_photos');
    return saved ? JSON.parse(saved) : [];
  });

  const [billings, setBillings] = useState<BillingRecord[]>(() => {
    const saved = localStorage.getItem('dme_billing_records');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedCertificates, setSavedCertificates] = useState<CertificateData[]>(() => {
    const saved = localStorage.getItem('dme_saved_certificates');
    return saved ? JSON.parse(saved) : SEED_CERTIFICATES;
  });

  const [selectedStudentForCert, setSelectedStudentForCert] = useState<StudentData | null>(null);

  const [downloading, setDownloading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
    filename?: string;
  } | null>(null);
  const [imagePreviewModal, setImagePreviewModal] = useState<{
    url: string;
    filename: string;
    format: 'jpg' | 'png';
    blob?: Blob;
  } | null>(null);
  const [createInputMode, setCreateInputMode] = useState<'quick-guru' | 'visual-card'>('quick-guru');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [saveReportSuccess, setSaveReportSuccess] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(() => {
    if (typeof window !== 'undefined') {
      const isStandalone =
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        (window.navigator as any).standalone === true;
      if (isStandalone) return false;
    }
    return localStorage.getItem('dme_hide_install_banner') !== 'true';
  });
  const [adminLinkCopied, setAdminLinkCopied] = useState(false);
  const [directLinkReport, setDirectLinkReport] = useState<ReportData | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState(true);

  const handleCopyAdminPortalLink = () => {
    const adminUrl = `${window.location.origin}${window.location.pathname}?mode=admin`;
    navigator.clipboard.writeText(adminUrl);
    setAdminLinkCopied(true);
    setTimeout(() => setAdminLinkCopied(false), 2500);
  };

  // Initialize Firebase Cloud test and subscribe to real-time reports, students, photos, billings & certificates
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

    const unsubscribeBillings = subscribeBillingsFromCloud(
      (cloudBillings) => {
        if (cloudBillings.length > 0) {
          setBillings(cloudBillings);
        }
      },
      (err) => {
        console.warn('Firebase billings sync listener warning:', err);
      }
    );

    const unsubscribeCertificates = subscribeCertificatesFromCloud(
      (cloudCerts) => {
        if (cloudCerts.length > 0) {
          setSavedCertificates(cloudCerts);
        } else {
          SEED_CERTIFICATES.forEach((seed) => {
            saveCertificateToCloud(seed).catch(console.error);
          });
        }
      },
      (err) => {
        console.warn('Firebase certificates sync listener warning:', err);
      }
    );

    const unsubscribeTeachers = subscribeTeachersFromCloud(
      (cloudTeachers) => {
        if (cloudTeachers.length > 0) {
          setTeachers(cloudTeachers);
        } else {
          SEED_TEACHERS.forEach((seed) => {
            saveTeacherToCloud(seed).catch(console.error);
          });
        }
      },
      (err) => {
        console.warn('Firebase teachers sync listener warning:', err);
      }
    );

    return () => {
      unsubscribeReports();
      unsubscribeStudents();
      unsubscribeTeachers();
      unsubscribePhotos();
      unsubscribeBillings();
      unsubscribeCertificates();
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

  // Auto-dismiss downloadNotice after 7 seconds
  useEffect(() => {
    if (downloadNotice) {
      const timer = setTimeout(() => {
        setDownloadNotice(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [downloadNotice]);

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

  // Sync registered teachers to localStorage
  useEffect(() => {
    localStorage.setItem('dme_registered_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('dme_active_teacher_id', activeTeacherId);
  }, [activeTeacherId]);

  // Sync viewMode, publicTab, and adminTab to localStorage
  useEffect(() => {
    localStorage.setItem('dme_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('dme_public_tab', publicTab);
  }, [publicTab]);

  useEffect(() => {
    localStorage.setItem('dme_admin_tab', adminTab);
  }, [adminTab]);

  // Sync standalone photos to localStorage
  useEffect(() => {
    localStorage.setItem('dme_standalone_photos', JSON.stringify(standalonePhotos));
  }, [standalonePhotos]);

  // Sync billings to localStorage
  useEffect(() => {
    localStorage.setItem('dme_billing_records', JSON.stringify(billings));
  }, [billings]);

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

  const handleSaveTeacher = (teacherToSave: TeacherData) => {
    setTeachers((prev) => {
      const idx = prev.findIndex((t) => t.id === teacherToSave.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = teacherToSave;
        return copy;
      }
      return [teacherToSave, ...prev];
    });

    saveTeacherToCloud(teacherToSave).catch((err) => {
      console.error('Failed to sync teacher to cloud:', err);
    });
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    deleteTeacherFromCloud(id).catch((err) => {
      console.error('Failed to delete teacher from cloud:', err);
    });
  };

  const handleSaveReportFromSubmission = (newReport: ReportData) => {
    setSavedReports((prev) => {
      const existingIdx = prev.findIndex((r) => r.id === newReport.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newReport;
        return copy;
      }
      return [newReport, ...prev];
    });
    setReport(newReport);
    saveReportToCloud(newReport).catch((err) => {
      console.error('Failed to sync new report to cloud:', err);
    });
    setSaveReportSuccess(true);
    setTimeout(() => setSaveReportSuccess(false), 2500);
  };

  const handleUploadPhoto = async (photo: PhotoItem) => {
    setStandalonePhotos((prev) => [photo, ...prev]);
    await savePhotoToCloud(photo);
  };

  const handleDeletePhoto = async (id: string) => {
    setStandalonePhotos((prev) => prev.filter((p) => p.id !== id));
    await deletePhotoFromCloud(id);
  };

  const handleSaveBilling = async (billing: BillingRecord) => {
    setBillings((prev) => {
      const idx = prev.findIndex((b) => b.id === billing.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = billing;
        return copy;
      }
      return [billing, ...prev];
    });

    await saveBillingToCloud(billing);
  };

  const handleDeleteBilling = async (id: string) => {
    setBillings((prev) => prev.filter((b) => b.id !== id));
    await deleteBillingFromCloud(id);
  };

  const handleSaveCertificate = async (cert: CertificateData) => {
    setSavedCertificates((prev) => {
      const idx = prev.findIndex((c) => c.id === cert.id);
      let updated: CertificateData[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = cert;
      } else {
        updated = [cert, ...prev];
      }
      localStorage.setItem('dme_saved_certificates', JSON.stringify(updated));
      return updated;
    });

    try {
      await saveCertificateToCloud(cert);
    } catch (err) {
      console.warn('Could not save certificate to cloud, saved in localStorage:', err);
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    setSavedCertificates((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem('dme_saved_certificates', JSON.stringify(updated));
      return updated;
    });

    try {
      await deleteCertificateFromCloud(id);
    } catch (err) {
      console.warn('Could not delete certificate from cloud:', err);
    }
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
    setViewMode('admin');
    setAdminTab('create');
  };

  const handleReportChange = (updated: Partial<ReportData>) => {
    setReport((prev) => ({ ...prev, ...updated }));
  };

  const handleDownloadImage = async (format: 'jpg' | 'png' = 'jpg', targetReport?: ReportData) => {
    setDownloading(true);
    try {
      const activeReport = targetReport || report;

      if (!targetReport && (viewMode !== 'admin' || adminTab !== 'create')) {
        setViewMode('admin');
        setAdminTab('create');
        await new Promise((r) => setTimeout(r, 350));
      }

      const result = await downloadReportAsImage('report-card-container', activeReport, format);

      if (result.success) {
        setDownloadNotice({
          type: 'success',
          title: `Berhasil Mengunduh ${format.toUpperCase()}!`,
          message: `Berkas ${result.filename} berhasil disimpan. Anda juga dapat melihat pratinjau di bawah ini untuk menyimpan langsung ke galeri HP.`,
          filename: result.filename,
        });

        // Open image preview modal so user can view/long-press save/share to WhatsApp directly
        if (result.blobUrl || result.dataUrl) {
          setImagePreviewModal({
            url: result.blobUrl || result.dataUrl!,
            filename: result.filename,
            format,
            blob: result.blob,
          });
        }
      } else {
        setDownloadNotice({
          type: 'error',
          title: `Gagal Mengunduh ${format.toUpperCase()}`,
          message: result.error || 'Terjadi kendala saat merender gambar. Silakan gunakan opsi Unduh PDF (1 Lembar Pas).',
          filename: result.filename,
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('Download handler error:', err);
      setDownloadNotice({
        type: 'error',
        title: 'Gagal Memproses Gambar',
        message: `Terjadi kendala: ${errorMsg}. Silakan coba opsi Unduh PDF.`,
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPdf = async (targetReport?: ReportData) => {
    setDownloadingPdf(true);
    try {
      const activeReport = targetReport || report;

      if (!targetReport && (viewMode !== 'admin' || adminTab !== 'create')) {
        setViewMode('admin');
        setAdminTab('create');
        await new Promise((r) => setTimeout(r, 350));
      }

      const result = await downloadReportAsPdf('report-card-container', activeReport);

      if (result.success) {
        setDownloadNotice({
          type: 'success',
          title: 'Berhasil Mengunduh PDF (1 Lembar Pas)!',
          message: `Dokumen resmi ${result.filename} berhasil disimpan ke folder Download perangkat Anda.`,
          filename: result.filename,
        });
      } else {
        setDownloadNotice({
          type: 'error',
          title: 'Gagal Mengunduh PDF',
          message: result.error || 'Gagal menyusun PDF. Silakan gunakan menu Cetak Browser.',
          filename: result.filename,
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('Download PDF error:', err);
      setDownloadNotice({
        type: 'error',
        title: 'Gagal Mengunduh PDF',
        message: `Terjadi kendala: ${errorMsg}. Silakan gunakan menu Cetak Browser.`,
      });
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadExcel = (targetReport?: ReportData) => {
    const activeReport = targetReport || report;
    const result = exportReportToExcel(activeReport);
    if (result.success) {
      setDownloadNotice({
        type: 'success',
        title: 'Berhasil Mengunduh Excel (.xlsx)!',
        message: `Berkas spreadsheet ${result.filename} berhasil disimpan ke folder Download perangkat Anda.`,
        filename: result.filename,
      });
    } else {
      setDownloadNotice({
        type: 'error',
        title: 'Gagal Mengunduh Excel',
        message: result.error || 'Terjadi kendala saat menyusun berkas Excel.',
        filename: result.filename,
      });
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
        cardLayout: settings.defaultLayout || 'elegant',
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleSelectFromHistory = (selected: ReportData) => {
    setReport(selected);
    setViewMode('admin');
    setAdminTab('create');
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
  const unpaidBillingsCount = billings.filter((b) => b.statusPembayaran === 'Belum Bayar').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* CONDITIONAL HEADER: PUBLIC WEBSITE NAVBAR OR ADMIN OPERATIONAL HEADER */}
      {viewMode === 'public' ? (
        <PublicNavbar
          activeTab={publicTab}
          onTabChange={setPublicTab}
          onGoToAdmin={() => {
            setViewMode('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onGoToTeacher={() => setIsTeacherLoginModalOpen(true)}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          contactPhone={settings.nomorWA || '6287879069404'}
          registeredStudentsCount={students.length}
        />
      ) : viewMode === 'admin' ? (
        <AdminHeader
          adminTab={adminTab}
          onAdminTabChange={setAdminTab}
          onExitAdmin={() => {
            setViewMode('public');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onGoToTeacherPortal={() => {
            setViewMode('teacher');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onDownloadJpg={() => handleDownloadImage('jpg')}
          downloading={downloading}
          onDownloadPdf={() => handleDownloadPdf()}
          downloadingPdf={downloadingPdf}
          onCopyAdminLink={handleCopyAdminPortalLink}
          adminLinkCopied={adminLinkCopied}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          studentsCount={students.length}
          teachersCount={teachers.length}
          certificatesCount={savedCertificates.length}
          photosCount={totalPhotosCount}
          unpaidCount={unpaidBillingsCount}
        />
      ) : null}

      {/* PWA INSTALL BANNER */}
      {showInstallBanner && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2.5 text-xs shadow-xs no-print">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-base">📱</span>
              <span className="font-medium">
                <strong>Tempel di Layar HP:</strong> Pasang aplikasi Dessa Mentari Education langsung di layar utama smartphone Anda dengan logo resmi untuk akses cepat tanpa perlu mengetik alamat link.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsInstallModalOpen(true)}
                className="px-3 py-1 bg-white text-amber-950 font-extrabold rounded-lg hover:bg-amber-50 active:scale-95 transition-all text-[11px] shadow-2xs whitespace-nowrap"
              >
                Pasang Sekarang
              </button>
              <button
                onClick={() => {
                  setShowInstallBanner(false);
                  localStorage.setItem('dme_hide_install_banner', 'true');
                }}
                className="p-1 hover:bg-white/20 rounded-md transition-colors text-white/80 hover:text-white"
                title="Tutup pemberitahuan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ======================================================== */}
        {/* 1. PUBLIC FRONT-FACING WEBSITE (TAMPILAN DEPAN LEMBAGA)   */}
        {/* ======================================================== */}
        {viewMode === 'public' && (
          <div>
            {publicTab === 'home' && (
              <PublicHomeView
                settings={settings}
                onNavigateTab={(tab) => {
                  setPublicTab(tab as PublicTabType);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onGoToAdmin={() => {
                  setViewMode('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {publicTab === 'about' && (
              <PublicAboutView
                settings={settings}
                onNavigateTab={(tab) => {
                  setPublicTab(tab as PublicTabType);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {publicTab === 'packages' && (
              <InstitutionView
                settings={settings}
                initialSection="packages"
                onRegisterStudent={handleSaveStudent}
                onGoToReportForm={() => setViewMode('admin')}
              />
            )}

            {publicTab === 'calculator' && (
              <InstitutionView
                settings={settings}
                initialSection="calculator"
                onRegisterStudent={handleSaveStudent}
                onGoToReportForm={() => setViewMode('admin')}
              />
            )}

            {publicTab === 'student-report' && (
              <PublicStudentReportLookup
                reports={savedReports}
                certificates={savedCertificates}
                students={students}
                onDownloadPdf={handleDownloadPdf}
                onDownloadJpg={(r) => handleDownloadImage('jpg', r)}
                downloadingPdf={downloadingPdf}
                downloadingJpg={downloading}
              />
            )}

            {publicTab === 'register' && (
              <InstitutionView
                settings={settings}
                initialSection="register"
                onRegisterStudent={handleSaveStudent}
                onGoToReportForm={() => setViewMode('admin')}
              />
            )}

            {publicTab === 'faq' && (
              <InstitutionView
                settings={settings}
                initialSection="faq"
                onRegisterStudent={handleSaveStudent}
                onGoToReportForm={() => setViewMode('admin')}
              />
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. ADMIN PORTAL (SISTEM INPUT & OPERASIONAL GURU/PENGELOLA) */}
        {/* ======================================================== */}
        {viewMode === 'admin' && (
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
                      Fitur Admin Operasional — Dessa Mentari Education
                    </h3>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                      🟢 Cloud Sync Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1">
                    Sistem input laporan belajar siswa, data murid privat, billing honor, galeri foto, dan arsip dokumen resmi.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('public');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3 py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all"
                >
                  🌐 Lihat Web Depan
                </button>
                <button
                  type="button"
                  onClick={handleCopyAdminPortalLink}
                  className="px-3 py-2 text-xs font-extrabold text-amber-950 bg-amber-300 hover:bg-amber-200 active:scale-95 rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                >
                  <span>{adminLinkCopied ? '✓ Link Tersalin!' : '🔗 Salin Link Admin'}</span>
                </button>
              </div>
            </div>

            {adminTab === 'create' && (
              <div className="space-y-6">
                {/* SUB-VIEW SWITCHER: GURU INPUT VS VISUAL CARD DESIGNER */}
                <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setCreateInputMode('quick-guru')}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        createInputMode === 'quick-guru'
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      <span>📝 Mode Guru (Input Selesai Mengajar)</span>
                      <span className="bg-slate-900/10 text-[10px] px-1.5 py-0.5 rounded font-extrabold">Praktis</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateInputMode('visual-card')}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        createInputMode === 'visual-card'
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      <span>🎨 Mode Kartu & Desain Visual</span>
                      <span className="bg-slate-900/10 text-[10px] px-1.5 py-0.5 rounded font-extrabold">Ekspor</span>
                    </button>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-2 px-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Tersinkronisasi otomatis ke Dashboard Admin & Rekapan Orang Tua</span>
                  </div>
                </div>

                {createInputMode === 'quick-guru' ? (
                  <TeacherReportSubmissionView
                    students={students}
                    teachers={teachers}
                    onSaveReport={handleSaveReportFromSubmission}
                    currentTeacherName={settings.namaPengajar}
                  />
                ) : (
                  <>
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
                          Tampilan Ekspor JPG & PDF
                        </span>
                      </div>

                      {/* Primary Export Action Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                        <button
                          onClick={() => handleDownloadPdf()}
                          disabled={downloadingPdf || downloading}
                          className="px-2.5 py-2.5 bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-800 hover:to-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50 relative group"
                        >
                          <span className="absolute -top-1.5 right-1 px-1.5 py-0.2 bg-amber-300 text-amber-950 font-black text-[8px] rounded-full uppercase tracking-wider shadow-2xs">
                            1 Lembar
                          </span>
                          <FileText className="w-4 h-4 text-rose-200" />
                          <span>{downloadingPdf ? 'Membuat...' : 'PDF Resmi'}</span>
                        </button>

                        <button
                          onClick={() => handleDownloadExcel()}
                          className="px-2.5 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex flex-col items-center justify-center gap-1"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                          <span>Unduh Excel</span>
                        </button>

                        <button
                          onClick={() => handleDownloadImage('jpg')}
                          disabled={downloading || downloadingPdf}
                          className="px-2.5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                        >
                          <Download className="w-4 h-4 text-amber-200" />
                          <span>{downloading ? 'Mengunduh...' : 'Unduh JPG'}</span>
                        </button>

                        <button
                          onClick={() => handleDownloadImage('png')}
                          disabled={downloading || downloadingPdf}
                          className="px-2.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                        >
                          <FileImage className="w-4 h-4 text-slate-300" />
                          <span>Unduh PNG</span>
                        </button>

                        <button
                          onClick={handleCopyTextWA}
                          className="px-2.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex flex-col items-center justify-center gap-1"
                        >
                          {copiedSuccess ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-200" />
                              <span>Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-4 h-4 text-emerald-200" />
                              <span>Salin WA</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={handleOpenWA}
                          className="px-2.5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex flex-col items-center justify-center gap-1"
                        >
                          <Send className="w-4 h-4 text-teal-200" />
                          <span>Kirim WA</span>
                        </button>
                      </div>

                      {/* Print Action Secondary */}
                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                        <span className="italic">💡 Rekomendasi: Gunakan <strong>Unduh PDF</strong> untuk hasil jernih dan anti-gagal di HP.</span>
                        <button
                          onClick={handlePrint}
                          className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 shrink-0 ml-2"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Cetak Browser</span>
                        </button>
                      </div>
                    </div>

                    {/* CARD PREVIEW RENDERER */}
                    <div className="p-2 sm:p-4 bg-slate-200/50 rounded-2xl border border-slate-300/80 shadow-inner flex justify-center">
                      <ReportCard report={report} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

            {adminTab === 'billing' && (
              <BillingSummaryView
                reports={savedReports}
                students={students}
                billings={billings}
                onSaveBilling={handleSaveBilling}
                onDeleteBilling={handleDeleteBilling}
              />
            )}

            {adminTab === 'video' && <AiVideoStudio report={report} />}

            {adminTab === 'history' && (
              <HistoryView
                reports={savedReports}
                onSelectReport={handleSelectFromHistory}
                onDeleteReport={handleDeleteHistoryReport}
                onDownloadReport={(item) => {
                  setReport(item);
                  setViewMode('admin');
                  setAdminTab('create');
                  setTimeout(() => {
                    handleDownloadImage('jpg', item);
                  }, 300);
                }}
                onDownloadPdf={(item) => {
                  setReport(item);
                  setViewMode('admin');
                  setAdminTab('create');
                  setTimeout(() => {
                    handleDownloadPdf(item);
                  }, 300);
                }}
                onDownloadExcel={(item) => {
                  handleDownloadExcel(item);
                }}
              />
            )}

            {adminTab === 'students' && (
              <StudentManagementView
                students={students}
                reports={savedReports}
                onSaveStudent={handleSaveStudent}
                onDeleteStudent={handleDeleteStudent}
                onSelectStudentForReport={handleSelectStudentForReport}
                onSelectStudentForCertificate={(st) => {
                  setSelectedStudentForCert(st);
                  setAdminTab('certificates');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {adminTab === 'certificates' && (
              <CertificateManagerView
                students={students}
                savedCertificates={savedCertificates}
                onSaveCertificate={handleSaveCertificate}
                onDeleteCertificate={handleDeleteCertificate}
                selectedStudentForCert={selectedStudentForCert}
              />
            )}

            {adminTab === 'photos' && (
              <PhotoGalleryView
                reports={savedReports}
                standalonePhotos={standalonePhotos}
                students={students}
                onUploadPhoto={handleUploadPhoto}
                onDeletePhoto={handleDeletePhoto}
              />
            )}

            {adminTab === 'settings' && (
              <SettingsView
                settings={settings}
                onSaveSettings={(newSet) => setSettings(newSet)}
              />
            )}

            {adminTab === 'guide' && <GuideView />}

            {adminTab === 'teachers' && (
              <TeacherManagementView
                teachers={teachers}
                onSaveTeacher={handleSaveTeacher}
                onDeleteTeacher={handleDeleteTeacher}
              />
            )}

            {adminTab === 'recap' && (
              <AdminReportRecapView
                reports={savedReports}
                students={students}
                teachers={teachers}
                onSelectReport={handleSelectFromHistory}
                onDeleteReport={handleDeleteHistoryReport}
                contactWA={settings.nomorWA || '087879069404'}
              />
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. TEACHER PORTAL (DASBOR KHUSUS GURU TERPUSAT)          */}
        {/* ======================================================== */}
        {viewMode === 'teacher' && activeTeacher && (
          <TeacherDashboardView
            teacher={activeTeacher}
            allTeachers={teachers}
            students={students}
            reports={savedReports}
            onSaveReport={handleSaveReportFromSubmission}
            onSaveStudent={handleSaveStudent}
            onUpdateTeacherProfile={handleSaveTeacher}
            onSwitchTeacher={(newTchId) => {
              setActiveTeacherId(newTchId);
            }}
            onLogout={() => {
              setViewMode('public');
              localStorage.setItem('dme_view_mode', 'public');
            }}
            onGoToAdmin={() => {
              setViewMode('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToPublic={() => {
              setViewMode('public');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            contactWA={settings.nomorWA || '087879069404'}
          />
        )}
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

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setReport(directLinkReport);
                    setDirectLinkReport(null);
                    setViewMode('admin');
                    setAdminTab('create');
                    window.history.pushState({}, '', window.location.pathname);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di Form</span>
                </button>

                <button
                  onClick={() => handleDownloadPdf(directLinkReport)}
                  disabled={downloadingPdf}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-200" />
                  <span>{downloadingPdf ? 'Membuat...' : 'Unduh PDF'}</span>
                </button>

                <button
                  onClick={() => handleDownloadImage('jpg', directLinkReport)}
                  disabled={downloading}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-amber-200" />
                  <span>Unduh JPG</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setDirectLinkReport(null);
                  window.history.pushState({}, '', window.location.pathname);
                }}
                className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
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

      {/* PWA INSTALL / TEMPEL DI LAYAR HP MODAL */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* RESPONSIVE DOWNLOAD PROCESSING OVERLAY */}
      {(downloading || downloadingPdf) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center space-y-3 border border-amber-300">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900 font-serif-brand">
              {downloadingPdf ? 'Menyusun Dokumen PDF Resmi...' : 'Menyiapkan Gambar Laporan...'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {downloadingPdf 
                ? 'Memformat berkas ke ukuran standar A4 presisi satu halaman agar rapi saat dicetak atau disimpan.' 
                : 'Merender kartu beresolusi tinggi dengan logo resmi untuk kemudahan dibagikan ke WhatsApp.'}
            </p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-full w-3/4 animate-pulse rounded-full"></div>
            </div>
            <span className="text-[10px] text-slate-400 block pt-1">
              Mohon tunggu beberapa detik...
            </span>
          </div>
        </div>
      )}

      {/* DOWNLOAD RESULT NOTIFICATION TOAST (BERHASIL / GAGAL) */}
      {downloadNotice && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
            downloadNotice.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500 text-white'
              : 'bg-rose-950/95 border-rose-500 text-white'
          }`}>
            <div className={`p-2 rounded-xl shrink-0 ${
              downloadNotice.type === 'success' ? 'bg-emerald-600/30 text-emerald-400' : 'bg-rose-600/30 text-rose-400'
            }`}>
              {downloadNotice.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-bold tracking-tight">
                {downloadNotice.title}
              </h5>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                {downloadNotice.message}
              </p>
              {downloadNotice.filename && (
                <div className="mt-2 inline-block px-2.5 py-1 rounded-lg bg-black/40 border border-white/20 text-[11px] font-mono font-medium text-amber-200 truncate max-w-full">
                  📄 {downloadNotice.filename}
                </div>
              )}
            </div>

            <button
              onClick={() => setDownloadNotice(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL PRATINJAU & SIMPAN GAMBAR JPG/PNG UNTUK HP */}
      {imagePreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 my-auto border border-amber-300 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileImage className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-serif-brand">
                    Laporan Gambar Siap ({imagePreviewModal.format.toUpperCase()})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Nama file: {imagePreviewModal.filename}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setImagePreviewModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gambar Preview */}
            <div className="bg-slate-100 rounded-xl p-2 border border-slate-200 max-h-[50vh] overflow-y-auto flex justify-center">
              <img
                src={imagePreviewModal.url}
                alt="Pratinjau Laporan"
                className="rounded-lg shadow-sm max-w-full h-auto object-contain"
              />
            </div>

            {/* Petunjuk Pengguna HP */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              💡 <strong>Tips Simpan di HP:</strong> Jika unduhan otomatis tidak muncul di galeri, Anda bisa <strong>tekan dan tahan (long-press) gambar di atas</strong> lalu pilih <em>"Download gambar"</em> atau <em>"Simpan ke Galeri"</em>.
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
              {imagePreviewModal.blob && typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={() => {
                    if (imagePreviewModal.blob) {
                      shareReportFile(imagePreviewModal.blob, imagePreviewModal.filename);
                    }
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Kirim ke WhatsApp / Galeri</span>
                </button>
              )}

              <a
                href={imagePreviewModal.url}
                download={imagePreviewModal.filename}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5 border border-slate-300"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Unduh Ulang</span>
              </a>

              <button
                onClick={() => setImagePreviewModal(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-10 pb-8 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            {/* Kolom 1: Profil Lembaga */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-white p-1 border-2 border-orange-400 flex items-center justify-center shrink-0">
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
                  <h4 className="font-sans font-black text-white text-base">
                    Bimbel<span className="text-[#0047BA] bg-white px-1.5 py-0.2 rounded ml-1 text-sm font-black">DME</span> · Dessa Mentari Education
                  </h4>
                  <p className="text-[11px] text-orange-400 font-bold">
                    Tempat Belajar Terpercaya · Les Privat Keluarga Indonesia
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                Bimbingan belajar premium &amp; les privat datang ke rumah dan online untuk jenjang TK/PAUD, SD, SMP, hingga SMA &amp; UTBK/SNBT dengan metode personal 1-on-1.
              </p>
              <div className="text-[11px] text-slate-400 pt-1">
                <span className="text-slate-300 font-semibold">Dewan Pengajar Resmi:</span> Deni Santoso, M.M &amp; Sarah Syahidah Syahrudin, S.Pd
              </div>
            </div>

            {/* Kolom 2: Navigasi Website */}
            <div className="space-y-2.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Informasi &amp; Layanan
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <button
                    onClick={() => {
                      setViewMode('public');
                      setPublicTab('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition-colors"
                  >
                    • Beranda Utama
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setViewMode('public');
                      setPublicTab('about');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition-colors"
                  >
                    • Tentang Kami &amp; Visi Misi
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setViewMode('public');
                      setPublicTab('packages');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition-colors"
                  >
                    • Pilihan Paket Kursus
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setViewMode('public');
                      setPublicTab('calculator');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition-colors"
                  >
                    • Simulasi Biaya Les
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setViewMode('public');
                      setPublicTab('student-report');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition-colors text-amber-300 font-medium"
                  >
                    • Cek Laporan Belajar Siswa
                  </button>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Kontak & Portal Admin/Guru */}
            <div className="space-y-2.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Konsultasi &amp; Akses Pengajar
              </h5>
              <div className="space-y-2 text-xs text-slate-400">
                <p>📍 Layanan Guru Datang ke Rumah &amp; Online Interaktif</p>
                <p>💬 Konsultasi WA: 0878-7906-9404</p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setIsTeacherLoginModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-sm"
                  >
                    <span>👨‍🏫 Portal Guru</span>
                  </button>

                  <button
                    onClick={() => {
                      setViewMode(viewMode === 'admin' ? 'public' : 'admin');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-all shadow-sm border border-slate-700"
                  >
                    <span>{viewMode === 'admin' ? '🌐 Ke Web Depan' : '🔐 Admin Pusat'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <p className="font-bold text-slate-400 font-serif-brand">
              © 2026 Dessa Mentari Education. Hak Cipta Dilindungi Undang-Undang.
            </p>
            <p className="text-[11px] text-slate-500">
              Sistem Manajemen Pendidikan &amp; Rapor Belajar Les Privat Mandiri
            </p>
          </div>
        </div>
      </footer>

      {/* TEACHER LOGIN & ACCOUNT PICKER MODAL */}
      <TeacherLoginModal
        isOpen={isTeacherLoginModalOpen}
        onClose={() => setIsTeacherLoginModalOpen(false)}
        teachers={teachers}
        onSelectTeacher={(selectedTeacher) => {
          setActiveTeacherId(selectedTeacher.id);
          setViewMode('teacher');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        contactWA={settings.nomorWA || '087879069404'}
      />
    </div>
  );
}

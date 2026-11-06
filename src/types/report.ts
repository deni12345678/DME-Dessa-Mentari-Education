export type EducationLevel = 'TK' | 'SD' | 'SMP' | 'SMA' | 'Umum/PAUD';

export type SubjectOption = 
  | 'Matematika'
  | 'IPAS (Ilmu Pengetahuan Alam & Sosial)'
  | 'Bahasa Indonesia'
  | 'IPA'
  | 'IPS'
  | 'PPKn'
  | 'Bahasa Inggris'
  | 'Bahasa Jepang'
  | 'Calistung / Cisritung'
  | 'TIK / Komputer'
  | 'Fisika'
  | 'Kimia'
  | 'Biologi'
  | 'Ekonomi / Akuntansi'
  | 'Lainnya';

export type AttendanceStatus = 'Hadir' | 'Reschedule / Disingkat' | 'Izin / Sakit';

export type CardTheme = 'solar' | 'emerald' | 'navy' | 'pastel' | 'dark';

export type CardLayout = 'elegant' | 'bold' | 'minimalist';

export interface PhotoItem {
  id: string;
  url: string; // Base64 data URL or web image URL
  caption?: string;
  namaSiswa?: string;
  tanggal?: string;
  namaPengajar?: string;
  mataPelajaran?: string;
  createdAt?: string;
}

export interface ReportData {
  id: string;
  namaSiswa: string;
  namaPengajar: string;
  tanggal: string; // YYYY-MM-DD
  waktuDurasi: string; // e.g. "90 Menit (15.30 - 17.00)"
  jenjang: EducationLevel;
  kelasGrade?: string; // e.g. "Kelas 4"
  mataPelajaran: SubjectOption | string;
  statusKehadiran: AttendanceStatus;
  
  // Numerical metrics for Chart.js progress visualization
  skorPemahaman?: number; // 0 - 100
  skorKeaktifan?: number; // 0 - 100
  skorFokus?: number; // 0 - 100

  materiDipelajari: string;
  evaluasiSiswa: string;
  tugasRumah?: string;
  catatanOrangTua?: string;
  fotoDokumentasi?: PhotoItem[];
  theme: CardTheme;
  cardLayout?: CardLayout;
  createdAt: string;
}

export type StudentStatus = 'Aktif' | 'Cuti' | 'Alumni';

export interface StudentData {
  id: string;
  namaSiswa: string;
  panggilan?: string;
  jenjang: EducationLevel;
  kelasGrade?: string;
  sekolah?: string;
  namaOrangTua?: string;
  nomorOrangTua?: string;
  alamat?: string;
  mataPelajaran?: string;
  hariLes?: string;
  jamLes?: string;
  namaPengajar?: string;
  status: StudentStatus;
  catatanKhusus?: string;
  createdAt: string;
}

export interface TeacherSettings {
  namaPengajar: string;
  nomorWA?: string;
  defaultTheme: CardTheme;
  defaultLayout?: CardLayout;
  lembagaName: string;
  lembagaTagline: string;
  contactInfo: string;
}

export type PaymentStatus = 'Belum Bayar' | 'Lunas' | 'Sebagian';

export interface ManualSessionItem {
  id: string;
  tanggal: string; // YYYY-MM-DD
  materi?: string;
  durasi?: string; // e.g. "90 Menit"
  catatan?: string;
}

export type FeeCalculationMode = 'per_sesi' | 'per_jam' | 'manual_total';

export interface BillingRecord {
  id: string;
  namaSiswa: string;
  bulanTahun: string; // e.g. "2026-10" or "Oktober 2026"
  jenjang: EducationLevel;
  mataPelajaran?: string;
  namaPengajar?: string;
  
  // Fee calculation options
  modeKalkulasi?: FeeCalculationMode; // 'per_sesi' (sesi x tarif), 'per_jam' (jam x tarif/jam), or 'manual_total' (direct input)
  tarifPerSesi: number; // e.g. 75000
  tarifPerJam?: number; // e.g. 50000
  totalJam?: number; // e.g. 6 or 8.5
  jumlahHadir: number;
  jumlahIzin?: number;
  
  biayaTambahan?: number; // Biaya modul / transport / lainnya
  keteranganBiayaTambahan?: string;
  biayaTransport?: number; // Biaya transport pengajar
  diskon?: number; // Potongan biaya
  keteranganDiskon?: string;
  
  totalBiaya: number; // Final total amount
  totalBiayaManual?: number; // Direct manual override amount if modeKalkulasi === 'manual_total'
  jumlahTerbayar?: number; // Amount already paid (for DP or partial payment)
  sisaTagihan?: number; // totalBiaya - (jumlahTerbayar || 0)
  
  statusPembayaran: PaymentStatus;
  tanggalBayar?: string;
  metodePembayaran?: string;
  nomorKuitansi?: string;
  catatan?: string;
  
  isManualEntry?: boolean; // true if created manually without auto-aggregation
  daftarSesiManual?: ManualSessionItem[]; // optional list of manual session meetings
  createdAt: string;
}

export type CertificateType = 
  | 'Kelulusan Kursus' 
  | 'Pencapaian Prestasi' 
  | 'Ketuntasan Modul' 
  | 'Apresiasi & Motivasi';

export type CertificateTheme = 'gold' | 'navy' | 'emerald';

export interface CertificateData {
  id: string;
  certificateNumber: string;
  studentId?: string;
  namaSiswa: string;
  jenjang: EducationLevel;
  kelasGrade?: string;
  sekolah?: string;
  mataPelajaran: SubjectOption | string;
  tipeSertifikat: CertificateType;
  predikat: string;
  nilaiAkhir?: number | string;
  deskripsiKompetensi: string;
  tanggalTerbit: string;
  kotaTerbit: string;
  namaKepalaLembaga: string;
  jabatanKepala: string;
  namaTutorPengampu: string;
  jabatanTutor: string;
  theme: CertificateTheme;
  nomorWAOrangTua?: string;
  isVerified?: boolean;
  createdAt: string;
}


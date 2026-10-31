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
  lembagaName: string;
  lembagaTagline: string;
  contactInfo: string;
}

export type PaymentStatus = 'Belum Bayar' | 'Lunas' | 'Sebagian';

export interface BillingRecord {
  id: string;
  namaSiswa: string;
  bulanTahun: string; // e.g. "2026-10" or "Oktober 2026"
  jenjang: EducationLevel;
  mataPelajaran?: string;
  namaPengajar?: string;
  tarifPerSesi: number; // e.g. 75000
  jumlahHadir: number;
  jumlahIzin?: number;
  biayaTambahan?: number;
  keteranganBiayaTambahan?: string;
  diskon?: number;
  totalBiaya: number; // (jumlahHadir * tarifPerSesi) + biayaTambahan - diskon
  statusPembayaran: PaymentStatus;
  tanggalBayar?: string;
  metodePembayaran?: string;
  nomorKuitansi?: string;
  catatan?: string;
  createdAt: string;
}

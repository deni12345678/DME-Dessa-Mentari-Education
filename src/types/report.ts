export type EducationLevel = 'TK' | 'SD' | 'SMP' | 'SMA' | 'Umum/PAUD';

export type SubjectOption = 
  | 'Matematika'
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
  theme: CardTheme;
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

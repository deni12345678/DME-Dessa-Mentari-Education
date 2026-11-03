import * as XLSX from 'xlsx';
import { ReportData } from '../types/report';
import { buildReportFilename } from './exportPdf';

function getScorePredicateLabel(score: number): string {
  if (score >= 90) return 'Amat Baik (A)';
  if (score >= 75) return 'Baik (B)';
  if (score >= 60) return 'Cukup (C)';
  return 'Perlu Bimbingan (D)';
}

function getScoreDescription(score: number, aspectName: string): string {
  if (score >= 90) return `Siswa menunjukkan penguasaan ${aspectName} yang sangat memuaskan.`;
  if (score >= 75) return `Siswa memahami ${aspectName} dengan baik dan konsisten.`;
  if (score >= 60) return `Pemahaman ${aspectName} cukup baik, perlu latihan rutin.`;
  return `Memerlukan pendampingan intensif pada ${aspectName}.`;
}

/**
 * Generates and downloads a clean, beautifully formatted Excel (.xlsx) report file.
 */
export function exportReportToExcel(report: ReportData): { success: boolean; filename: string; error?: string } {
  const filename = buildReportFilename(report, 'xlsx');

  try {
    const formattedDate = report.tanggal
      ? new Date(report.tanggal).toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : report.tanggal || '-';

    const pemahamanScore = report.skorPemahaman ?? 85;
    const keaktifanScore = report.skorKeaktifan ?? 90;
    const fokusScore = report.skorFokus ?? 85;

    // Build structured data array for SheetJS
    const sheetData: (string | number)[][] = [
      ['DESSA MENTARI EDUCATION'],
      ['Pusat Bimbingan Belajar & Les Privat Terpadu - Keluarga Indonesia'],
      ['LEMBAR EVALUASI & CAPAIAN PEMBELAJARAN SISWA'],
      [''], // Blank row
      ['IDENTITAS SISWA & SESI PEMBELAJARAN'],
      ['Nama Siswa', report.namaSiswa || '-', 'Tanggal Sesi', formattedDate],
      ['Jenjang & Kelas', `${report.jenjang || 'SD'} ${report.kelasGrade ? `(${report.kelasGrade})` : ''}`, 'Durasi / Waktu', report.waktuDurasi || '90 Menit'],
      ['Mata Pelajaran', report.mataPelajaran || 'Matematika', 'Status Kehadiran', report.statusKehadiran || 'Hadir'],
      ['Nama Tutor / Pengajar', report.namaPengajar || 'Pengajar DME', 'No. Registrasi', `DME-EVL/${report.tanggal?.split('-')[0] || '2026'}/${(report.id || 'RPT').slice(-4).toUpperCase()}`],
      [''], // Blank row
      ['MATRIKS INDIKATOR CAPAIAN BELAJAR SISWA'],
      ['No', 'Aspek Penilaian / Indikator', 'Skor (0-100)', 'Predikat', 'Catatan Ketercapaian Perkembangan'],
      [1, 'Pemahaman Materi Pembelajaran', pemahamanScore, getScorePredicateLabel(pemahamanScore), getScoreDescription(pemahamanScore, 'materi')],
      [2, 'Keaktifan & Partisipasi Belajar', keaktifanScore, getScorePredicateLabel(keaktifanScore), getScoreDescription(keaktifanScore, 'keaktifan')],
      [3, 'Fokus, Konsentrasi & Ketelitian', fokusScore, getScorePredicateLabel(fokusScore), getScoreDescription(fokusScore, 'fokus & konsentrasi')],
      [''], // Blank row
      ['MATERI & POKOK BAHASAN HARI INI'],
      [report.materiDipelajari || 'Belum ada rincian materi.'],
      [''], // Blank row
      ['EVALUASI & CATATAN PERKEMBANGAN TUTOR'],
      [report.evaluasiSiswa || 'Belum ada catatan evaluasi.'],
      [''], // Blank row
    ];

    if (report.tugasRumah) {
      sheetData.push(['TUGAS MANDIRI / PR TINDAK LANJUT']);
      sheetData.push([report.tugasRumah]);
      sheetData.push(['']);
    }

    if (report.catatanOrangTua) {
      sheetData.push(['PESAN KHUSUS UNTUK ORANG TUA']);
      sheetData.push([report.catatanOrangTua]);
      sheetData.push(['']);
    }

    sheetData.push(['PENGESAHAN DOKUMEN RESMI']);
    sheetData.push(['Mengetahui Orang Tua / Wali Siswa', '', 'Pengajar / Tutor Pendamping', report.namaPengajar || 'Pengajar DME']);
    sheetData.push(['Dessa Mentari Education', '', 'Status Verifikasi', 'Terverifikasi Digital (Resmi)']);
    sheetData.push(['']);
    sheetData.push(['© 2026 Dessa Mentari Education · Tempat Belajar Terpercaya · Les Privat Keluarga Indonesia']);

    // Create Worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Set Column Widths (Auto-fit & proportional padding)
    worksheet['!cols'] = [
      { wch: 6 },  // Col A: No
      { wch: 38 }, // Col B: Aspek / Key
      { wch: 16 }, // Col C: Skor / Val
      { wch: 20 }, // Col D: Predikat / Key2
      { wch: 55 }, // Col E: Catatan / Val2
    ];

    // Merge Header Cells for Title
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // Title
      { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, // Subtitle
      { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }, // Document Title
      { s: { r: 4, c: 0 }, e: { r: 4, c: 4 } }, // Section Identitas
      { s: { r: 10, c: 0 }, e: { r: 10, c: 4 } }, // Section Matriks
      { s: { r: 16, c: 0 }, e: { r: 16, c: 4 } }, // Section Materi
      { s: { r: 17, c: 0 }, e: { r: 17, c: 4 } }, // Content Materi
      { s: { r: 19, c: 0 }, e: { r: 19, c: 4 } }, // Section Evaluasi
      { s: { r: 20, c: 0 }, e: { r: 20, c: 4 } }, // Content Evaluasi
    ];

    // Create Workbook and Append Worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Pembelajaran');

    // Write & Download File
    XLSX.writeFile(workbook, filename);

    return { success: true, filename };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error exporting Excel file:', err);
    return { success: false, filename, error: errorMsg };
  }
}

import html2canvas from 'html2canvas';
import { ReportData } from '../types/report';

/**
 * Downloads the specified DOM container as a high-resolution JPG or PNG image.
 */
export async function downloadReportAsImage(
  elementId: string,
  filename: string,
  format: 'jpg' | 'png' = 'jpg'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found for export.`);
    return false;
  }

  try {
    // Render at 3x scale for crystal-clear readability on phones and Retina displays
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      windowWidth: 800, // Normalized canvas width
    });

    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const quality = format === 'jpg' ? 0.95 : undefined;
    const dataUrl = canvas.toDataURL(mimeType, quality);

    const safeFilename = filename.replace(/[^a-zA-Z0-9_-]/g, '_');
    const finalName = `${safeFilename}.${format}`;

    const link = document.createElement('a');
    link.download = finalName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Error generating image via html2canvas:', err);
    return false;
  }
}

/**
 * Generates a clean, formatted text summary suitable for WhatsApp messaging.
 */
export function generateWhatsAppText(report: ReportData): string {
  const dateFormatted = new Date(report.tanggal).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `*LAPORAN PEMBELAJARAN LES PRIVAT*
*DESSA MENTARI EDUCATION*
✨ *Bright Learning & Tutoring System*
================================

👤 *Nama Siswa:* ${report.namaSiswa} ${report.kelasGrade ? `(${report.kelasGrade})` : ''}
📅 *Tanggal:* ${dateFormatted || report.tanggal}
🎓 *Jenjang:* ${report.jenjang}
📚 *Mata Pelajaran:* ${report.mataPelajaran}
⏰ *Durasi/Waktu:* ${report.waktuDurasi || '90 Menit'}
👨‍🏫 *Pengajar (Tutor):* ${report.namaPengajar}
📌 *Status Kehadiran:* ${report.statusKehadiran}

================================
📖 *MATERI YANG DIPELAJARI:*
${report.materiDipelajari}

⭐ *EVALUASI & PERKEMBANGAN SISWA:*
${report.evaluasiSiswa}
${report.tugasRumah ? `\n📝 *PR / TUGAS RUMAH:*\n${report.tugasRumah}` : ''}
${report.catatanOrangTua ? `\n💬 *CATATAN UNTUK ORANG TUA:*\n${report.catatanOrangTua}` : ''}

================================
_Terima kasih atas kepercayaan Ibu/Bapak kepada Dessa Mentari Education. Semoga ananda senantiasa berprestasi!_ 🌟`;
}

/**
 * Copies WhatsApp report text to user clipboard.
 */
export async function copyWhatsAppTextToClipboard(report: ReportData): Promise<boolean> {
  const text = generateWhatsAppText(report);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

/**
 * Opens WhatsApp Web or App with prefilled text.
 */
export function openWhatsAppDirect(report: ReportData, phoneNumber?: string) {
  const text = encodeURIComponent(generateWhatsAppText(report));
  const cleanPhone = phoneNumber ? phoneNumber.replace(/[^0-9]/g, '') : '';
  const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
  window.open(url, '_blank');
}

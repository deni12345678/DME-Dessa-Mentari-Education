import html2canvas from 'html2canvas';
import { ReportData } from '../types/report';
import { captureElementToCanvas, downloadReportAsPdf } from './exportPdf';

export { downloadReportAsPdf, captureElementToCanvas };

/**
 * Downloads the specified DOM container as a high-resolution JPG or PNG image.
 * Uses progressive scale down (scale 2 -> 1.5 -> 1) to prevent mobile browser memory errors,
 * and sanitizes image tags so cross-origin or data URL images do not taint the canvas.
 */
export async function downloadReportAsImage(
  elementId: string,
  filename: string,
  format: 'jpg' | 'png' = 'jpg'
): Promise<boolean> {
  const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
  const quality = format === 'jpg' ? 0.95 : undefined;
  const isJpg = format === 'jpg';

  try {
    const canvas = await captureElementToCanvas(elementId, isJpg ? '#ffffff' : 'transparent');
    if (!canvas) {
      console.error(`Failed to capture canvas for element #${elementId}`);
      return false;
    }

    const safeFilename = filename.replace(/[^a-zA-Z0-9_-]/g, '_');
    const finalName = `${safeFilename}.${format}`;

    // Attempt 1: Modern Blob URL (best for mobile memory management)
    if (canvas.toBlob) {
      try {
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, mimeType, quality);
        });

        if (blob) {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = finalName;
          link.href = blobUrl;
          link.target = '_self';
          link.rel = 'noopener';
          document.body.appendChild(link);
          link.click();

          setTimeout(() => {
            if (link.parentNode) {
              document.body.removeChild(link);
            }
            URL.revokeObjectURL(blobUrl);
          }, 1500);

          return true;
        }
      } catch (blobErr) {
        console.warn('Canvas toBlob failed, falling back to dataURL:', blobErr);
      }
    }

    // Attempt 2: Data URL fallback
    try {
      const dataUrl = canvas.toDataURL(mimeType, quality);
      const link = document.createElement('a');
      link.download = finalName;
      link.href = dataUrl;
      link.target = '_self';
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
      }, 1500);

      return true;
    } catch (dataUrlErr) {
      console.error('Data URL export failed:', dataUrlErr);
      return false;
    }
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

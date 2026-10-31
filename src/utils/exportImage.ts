import { ReportData } from '../types/report';
import { captureElementToCanvas, downloadReportAsPdf } from './exportPdf';

export { downloadReportAsPdf, captureElementToCanvas };

/**
 * Downloads the specified DOM element as a high-resolution JPG or PNG image.
 * Uses optimized blob generation for instant, fluid mobile download.
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

    // Modern Blob download (avoids heavy string memory allocation on mobile devices)
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
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();

          setTimeout(() => {
            if (link.parentNode) {
              document.body.removeChild(link);
            }
            URL.revokeObjectURL(blobUrl);
          }, 1000);

          return true;
        }
      } catch (blobErr) {
        console.warn('Blob export failed, trying dataURL:', blobErr);
      }
    }

    // Direct dataURL fallback
    try {
      const dataUrl = canvas.toDataURL(mimeType, quality);
      const link = document.createElement('a');
      link.download = finalName;
      link.href = dataUrl;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
      }, 1000);

      return true;
    } catch (dataUrlErr) {
      console.error('DataURL export failed:', dataUrlErr);
      return false;
    }
  } catch (err) {
    console.error('Error generating image:', err);
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

  return `*LEMBAR LAPORAN EVALUASI BELAJAR SISWA*
*DESSA MENTARI EDUCATION*
✨ *Tempat Belajar Terpercaya · Les Privat Keluarga Indonesia*
================================

👤 *Nama Siswa:* ${report.namaSiswa} ${report.kelasGrade ? `(${report.kelasGrade})` : ''}
📅 *Tanggal Sesi:* ${dateFormatted || report.tanggal}
🎓 *Jenjang:* ${report.jenjang}
📚 *Mata Pelajaran:* ${report.mataPelajaran}
⏰ *Durasi/Waktu:* ${report.waktuDurasi || '90 Menit'}
👨‍🏫 *Tutor Pendamping:* ${report.namaPengajar}
📌 *Status Kehadiran:* ${report.statusKehadiran}

================================
📊 *MATRIKS CAPAIAN BELAJAR:*
• Pemahaman Materi: ${report.skorPemahaman ?? 85}%
• Keaktifan Belajar: ${report.skorKeaktifan ?? 90}%
• Fokus & Konsentrasi: ${report.skorFokus ?? 85}%

================================
📖 *POKOK BAHASAN / MATERI:*
${report.materiDipelajari}

⭐ *EVALUASI & OBSERVASI PERKEMBANGAN:*
${report.evaluasiSiswa}
${report.tugasRumah ? `\n📝 *PR / TUGAS MANDIRI:*\n${report.tugasRumah}` : ''}
${report.catatanOrangTua ? `\n💬 *CATATAN ORANG TUA:*\n${report.catatanOrangTua}` : ''}

================================
_Dokumen evaluasi berkala diterbitkan resmi oleh Dessa Mentari Education. Terima kasih atas kepercayaan Ayah/Bunda!_ 🌟`;
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

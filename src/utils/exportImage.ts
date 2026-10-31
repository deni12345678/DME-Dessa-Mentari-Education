import { ReportData } from '../types/report';
import { captureElementToCanvas, downloadReportAsPdf, buildReportFilename } from './exportPdf';

export { downloadReportAsPdf, captureElementToCanvas, buildReportFilename };

export interface ImageExportResult {
  success: boolean;
  filename: string;
  format: 'jpg' | 'png';
  dataUrl?: string;
  blobUrl?: string;
  blob?: Blob;
  error?: string;
}

/**
 * Robustly downloads the specified element as JPG or PNG.
 * Filename is customized strictly according to the student's name and session date.
 */
export async function downloadReportAsImage(
  elementId: string,
  report: ReportData,
  format: 'jpg' | 'png' = 'jpg'
): Promise<ImageExportResult> {
  const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
  const quality = format === 'jpg' ? 0.95 : undefined;
  const isJpg = format === 'jpg';
  const finalFilename = buildReportFilename(report, format);

  try {
    const canvas = await captureElementToCanvas(elementId, isJpg ? '#ffffff' : 'transparent');
    if (!canvas) {
      console.error(`Failed to capture canvas for element #${elementId}`);
      return { 
        success: false, 
        filename: finalFilename, 
        format, 
        error: 'Gagal mengambil gambar canvas. Periksa koneksi dan elemen.' 
      };
    }

    let exportedBlob: Blob | undefined;
    let blobUrl: string | undefined;
    let dataUrl: string | undefined;

    // 1. Try to produce Blob
    if (canvas.toBlob) {
      try {
        const b = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, mimeType, quality);
        });
        if (b) {
          exportedBlob = b;
          blobUrl = URL.createObjectURL(b);
        }
      } catch (blobErr) {
        console.warn('toBlob conversion encountered error:', blobErr);
      }
    }

    // 2. Try to produce DataURL
    try {
      dataUrl = canvas.toDataURL(mimeType, quality);
    } catch (dataUrlErr) {
      console.warn('toDataURL conversion encountered error:', dataUrlErr);
    }

    const downloadTargetUrl = blobUrl || dataUrl;
    if (!downloadTargetUrl) {
      return {
        success: false,
        filename: finalFilename,
        format,
        error: 'Tidak dapat menghasilkan berkas gambar dari canvas.',
      };
    }

    // 3. Trigger programmatic download
    try {
      const link = document.createElement('a');
      link.download = finalFilename;
      link.href = downloadTargetUrl;
      link.setAttribute('download', finalFilename);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
      }, 1000);
    } catch (clickErr) {
      console.warn('Direct link click download triggered warning:', clickErr);
    }

    return {
      success: true,
      filename: finalFilename,
      format,
      dataUrl,
      blobUrl,
      blob: exportedBlob,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error generating image:', err);
    return {
      success: false,
      filename: finalFilename,
      format,
      error: errorMsg,
    };
  }
}

/**
 * Triggers native mobile sharing (WhatsApp, Google Photos, Files) if supported.
 */
export async function shareReportFile(
  blob: Blob,
  filename: string,
  title = 'Laporan Pembelajaran Les Privat'
): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.canShare) {
    try {
      const file = new File([blob], filename, { type: blob.type });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title,
          text: `Berikut adalah berkas ${filename} dari Dessa Mentari Education.`,
        });
        return true;
      }
    } catch (err) {
      console.warn('Web Share API aborted or failed:', err);
    }
  }
  return false;
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

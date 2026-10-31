import html2canvas from 'html2canvas';
import { ReportData } from '../types/report';

/**
 * Downloads the specified DOM container as a high-resolution JPG or PNG image.
 * Uses Blob and ObjectURL with cross-origin handling and fallback retries.
 */
export async function downloadReportAsImage(
  elementId: string,
  filename: string,
  format: 'jpg' | 'png' = 'jpg'
): Promise<boolean> {
  let element = document.getElementById(elementId);
  
  // If element not immediately found, wait up to 300ms for DOM mounting
  if (!element) {
    await new Promise((r) => setTimeout(r, 300));
    element = document.getElementById(elementId);
  }

  if (!element) {
    console.error(`Element #${elementId} not found for export.`);
    return false;
  }

  try {
    // Wait for any child <img> tags to finish loading
    const images = Array.from(element.querySelectorAll('img'));
    if (images.length > 0) {
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve(true);
          return new Promise((resolve) => {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            setTimeout(() => resolve(false), 2000); // 2s safety timeout
          });
        })
      );
    }

    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const quality = format === 'jpg' ? 0.95 : undefined;
    const isJpg = format === 'jpg';

    // Helper to capture with html2canvas
    const capture = async (scaleFactor: number) => {
      return await html2canvas(element as HTMLElement, {
        scale: scaleFactor,
        useCORS: true,
        allowTaint: false, // CRITICAL: NEVER allow taint, otherwise toDataURL/toBlob throws SecurityError!
        backgroundColor: isJpg ? '#ffffff' : null,
        logging: false,
        imageTimeout: 10000,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          const clonedEl = clonedDoc.getElementById(elementId);
          if (clonedEl) {
            clonedEl.style.transform = 'none';
            clonedEl.style.maxWidth = '680px';
          }
        },
      });
    };

    let canvas: HTMLCanvasElement;
    try {
      // Primary attempt at scale 2 (ultra sharp ~1360px without exceeding mobile canvas RAM)
      canvas = await capture(2);
    } catch (primaryErr) {
      console.warn('html2canvas scale 2 failed, retrying at scale 1.5:', primaryErr);
      // Secondary fallback attempt at scale 1.5 for memory-constrained mobile devices
      canvas = await capture(1.5);
    }

    const safeFilename = filename.replace(/[^a-zA-Z0-9_-]/g, '_');
    const finalName = `${safeFilename}.${format}`;

    // Convert canvas to Blob (preferred for mobile browsers)
    let downloaded = false;
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
          document.body.appendChild(link);
          link.click();

          setTimeout(() => {
            if (link.parentNode) {
              document.body.removeChild(link);
            }
            URL.revokeObjectURL(blobUrl);
          }, 1500);

          downloaded = true;
          return true;
        }
      } catch (blobErr) {
        console.warn('Canvas toBlob failed, falling back to dataURL:', blobErr);
      }
    }

    // Fallback using toDataURL if toBlob was unsupported
    if (!downloaded) {
      const dataUrl = canvas.toDataURL(mimeType, quality);
      const link = document.createElement('a');
      link.download = finalName;
      link.href = dataUrl;
      link.target = '_self';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
      }, 1500);
      return true;
    }

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

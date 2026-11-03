import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ReportData } from '../types/report';

/**
 * Builds a clean, reliable filename based strictly on the student's name and date.
 * Example: Laporan_Les_Syifa_Azzarqaa_2026-10-31
 */
export function buildReportFilename(report: ReportData, extension?: string): string {
  const student = (report.namaSiswa || 'Siswa')
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_');

  const rawDate = report.tanggal || new Date().toISOString().split('T')[0];
  const date = rawDate.trim().replace(/[^a-zA-Z0-9_-]/g, '_');

  const base = `Laporan_Les_${student}_${date}`;
  return extension ? `${base}.${extension}` : base;
}

/**
 * Converts an image element to a base64 data URL to completely prevent CORS/tainting issues.
 */
async function inlineImageToDataUrl(img: HTMLImageElement): Promise<void> {
  if (!img.src || img.src.startsWith('data:')) {
    img.removeAttribute('crossorigin');
    return;
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width || 200;
    canvas.height = img.naturalHeight || img.height || 200;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      img.src = dataUrl;
      img.removeAttribute('crossorigin');
      return;
    }
  } catch (canvasErr) {
    console.warn('Canvas drawImage for inlining failed, falling back to fetch:', canvasErr);
  }

  try {
    const res = await fetch(img.src);
    const blob = await res.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    img.src = dataUrl;
    img.removeAttribute('crossorigin');
  } catch (fetchErr) {
    console.warn('Fetch fallback for image inlining failed:', fetchErr);
    img.removeAttribute('crossorigin');
  }
}

/**
 * Prepares and sanitizes cloned element before canvas capture.
 */
async function sanitizeClonedElement(clonedEl: HTMLElement) {
  clonedEl.style.transform = 'none';
  clonedEl.style.boxSizing = 'border-box';
  clonedEl.style.margin = '0 auto';
  clonedEl.style.backgroundColor = '#ffffff';

  // Sanitize all images inside the clone
  const clonedImgs = Array.from(clonedEl.querySelectorAll('img'));
  for (const img of clonedImgs) {
    await inlineImageToDataUrl(img);
    img.style.maxWidth = '100%';
    img.loading = 'eager';
  }
}

/**
 * Fast, reliable element capture using html2canvas without canvas tainting.
 */
export async function captureElementToCanvas(
  elementId: string,
  backgroundColor = '#ffffff'
): Promise<HTMLCanvasElement | null> {
  let element = document.getElementById(elementId);
  if (!element) {
    await new Promise((r) => setTimeout(r, 150));
    element = document.getElementById(elementId);
  }

  if (!element) {
    console.error(`Element #${elementId} not found for capture.`);
    return null;
  }

  // Pre-wait for images on the original element
  const imgs = Array.from(element.querySelectorAll('img'));
  if (imgs.length > 0) {
    await Promise.all(
      imgs.map((img) => {
        if (img.complete && img.naturalHeight !== 0) return Promise.resolve(true);
        return new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          setTimeout(() => resolve(false), 1200);
        });
      })
    );
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const scale = isMobile ? 1.5 : 2;

  try {
    const canvas = await html2canvas(element as HTMLElement, {
      scale,
      useCORS: true,
      allowTaint: false,
      backgroundColor,
      logging: false,
      imageTimeout: 7000,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.offsetWidth || 760,
      onclone: async (clonedDoc) => {
        // Strip all stylesheets to completely prevent oklch/oklab color parsing crashes in html2canvas
        const stylesheets = Array.from(clonedDoc.querySelectorAll('link[rel="stylesheet"], style'));
        for (const sheet of stylesheets) {
          sheet.remove();
        }

        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          await sanitizeClonedElement(clonedEl);
        }
      },
    });

    if (canvas && canvas.width > 0 && canvas.height > 0) {
      return canvas;
    }
  } catch (err) {
    console.warn('Initial html2canvas scale attempt failed:', err);
  }

  // Fallback with scale 1 if device memory is constrained
  try {
    const canvas = await html2canvas(element as HTMLElement, {
      scale: 1,
      useCORS: true,
      allowTaint: false,
      backgroundColor,
      logging: false,
      imageTimeout: 5000,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.offsetWidth || 760,
      onclone: async (clonedDoc) => {
        const stylesheets = Array.from(clonedDoc.querySelectorAll('link[rel="stylesheet"], style'));
        for (const sheet of stylesheets) {
          sheet.remove();
        }

        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          await sanitizeClonedElement(clonedEl);
        }
      },
    });
    return canvas;
  } catch (lastErr) {
    console.error('All html2canvas attempts failed:', lastErr);
    return null;
  }
}

export interface PdfExportResult {
  success: boolean;
  filename: string;
  error?: string;
}

/**
 * Downloads the report as an official, strictly SINGLE-PAGE A4 PDF document.
 */
export async function downloadReportAsPdf(
  elementId: string,
  report: ReportData
): Promise<PdfExportResult> {
  const finalFilename = buildReportFilename(report, 'pdf');

  try {
    const canvas = await captureElementToCanvas(elementId, '#ffffff');
    if (!canvas) {
      console.warn('Canvas capture returned null, triggering browser print fallback.');
      window.print();
      return { success: true, filename: finalFilename };
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth(); // 210 mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm
    const margin = 5; // 5mm margin
    const maxContentWidth = pageWidth - margin * 2; // 200 mm
    const maxContentHeight = pageHeight - margin * 2; // 287 mm

    const naturalHeight = (canvas.height * maxContentWidth) / canvas.width;

    let finalWidth = maxContentWidth;
    let finalHeight = naturalHeight;

    if (finalHeight > maxContentHeight) {
      const scaleFactor = maxContentHeight / finalHeight;
      finalHeight = maxContentHeight;
      finalWidth = maxContentWidth * scaleFactor;
    }

    const xOffset = margin + (maxContentWidth - finalWidth) / 2;
    const yOffset = margin + (maxContentHeight - finalHeight) / 2;

    pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'FAST');
    pdf.save(finalFilename);
    return { success: true, filename: finalFilename };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error generating single-page PDF:', err);
    try {
      window.print();
      return { success: true, filename: finalFilename };
    } catch {
      return { success: false, filename: finalFilename, error: errorMsg };
    }
  }
}

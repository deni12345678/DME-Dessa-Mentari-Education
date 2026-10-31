import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ReportData } from '../types/report';

/**
 * Safely sanitizes cloned elements before canvas capture to prevent CORS errors,
 * missing image issues, or memory limits on mobile devices.
 */
function sanitizeClonedElement(clonedEl: HTMLElement, elementId: string) {
  clonedEl.style.transform = 'none';
  clonedEl.style.maxWidth = '680px';
  clonedEl.style.width = '100%';
  clonedEl.style.boxSizing = 'border-box';
  clonedEl.style.margin = '0 auto';

  // Sanitize all images inside the clone
  const clonedImgs = Array.from(clonedEl.querySelectorAll('img'));
  clonedImgs.forEach((img) => {
    // Remove crossorigin on data: or blob: urls which confuses some mobile browsers
    if (img.src && (img.src.startsWith('data:') || img.src.startsWith('blob:'))) {
      img.removeAttribute('crossorigin');
    } else if (img.src) {
      img.crossOrigin = 'anonymous';
    }

    // Ensure display is block or inline-block and no broken layout
    img.style.maxWidth = '100%';
    img.loading = 'eager';
  });
}

/**
 * Captures an element using html2canvas with progressive fallback scales (2 -> 1.5 -> 1)
 * to prevent mobile GPU/memory crashes.
 */
export async function captureElementToCanvas(
  elementId: string,
  backgroundColor = '#ffffff'
): Promise<HTMLCanvasElement | null> {
  let element = document.getElementById(elementId);
  if (!element) {
    await new Promise((r) => setTimeout(r, 300));
    element = document.getElementById(elementId);
  }

  if (!element) {
    console.error(`Element #${elementId} not found for capture.`);
    return null;
  }

  // Pre-wait for any images to settle
  const imgs = Array.from(element.querySelectorAll('img'));
  if (imgs.length > 0) {
    await Promise.all(
      imgs.map((img) => {
        if (img.complete) return Promise.resolve(true);
        return new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          setTimeout(() => resolve(false), 2000);
        });
      })
    );
  }

  const scalesToTry = [2, 1.5, 1];

  for (const scale of scalesToTry) {
    try {
      const canvas = await html2canvas(element as HTMLElement, {
        scale,
        useCORS: true,
        allowTaint: false,
        backgroundColor,
        logging: false,
        imageTimeout: 8000,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          const clonedEl = clonedDoc.getElementById(elementId);
          if (clonedEl) {
            sanitizeClonedElement(clonedEl, elementId);
          }
        },
      });

      if (canvas && canvas.width > 0 && canvas.height > 0) {
        return canvas;
      }
    } catch (err) {
      console.warn(`html2canvas failed at scale ${scale}:`, err);
    }
  }

  // Last-resort fallback: try with allowTaint: true if CORS was the only blocker
  try {
    const canvas = await html2canvas(element as HTMLElement, {
      scale: 1,
      useCORS: false,
      allowTaint: true,
      backgroundColor,
      logging: false,
      imageTimeout: 5000,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          sanitizeClonedElement(clonedEl, elementId);
        }
      },
    });
    return canvas;
  } catch (lastErr) {
    console.error('All html2canvas capture attempts failed:', lastErr);
    return null;
  }
}

/**
 * Downloads the specified DOM container as a high-quality A4 PDF document.
 * Returns true if download was successfully initiated, false otherwise.
 */
export async function downloadReportAsPdf(
  elementId: string,
  filename: string,
  report?: ReportData
): Promise<boolean> {
  try {
    const canvas = await captureElementToCanvas(elementId, '#ffffff');
    if (!canvas) {
      // If canvas capture failed, offer fallback window.print()
      console.warn('Canvas capture returned null, triggering fallback print flow.');
      window.print();
      return true;
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
    const margin = 8; // 8mm margin
    const contentWidth = pageWidth - margin * 2; // 194 mm
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    if (contentHeight <= pageHeight - margin * 2) {
      // Fits on a single A4 page
      const yOffset = margin + (pageHeight - margin * 2 - contentHeight) / 2;
      pdf.addImage(imgData, 'JPEG', margin, yOffset > margin ? yOffset : margin, contentWidth, contentHeight, undefined, 'FAST');
    } else {
      // Content exceeds single page height: split cleanly across pages
      let remainingHeight = contentHeight;
      let position = 0;
      const usablePageHeight = pageHeight - margin * 2;

      while (remainingHeight > 0) {
        pdf.addImage(imgData, 'JPEG', margin, margin - position, contentWidth, contentHeight, undefined, 'FAST');
        remainingHeight -= usablePageHeight;
        position += usablePageHeight;

        if (remainingHeight > 0) {
          pdf.addPage();
        }
      }
    }

    const safeFilename = filename.replace(/[^a-zA-Z0-9_-]/g, '_');
    const finalFilename = `${safeFilename}.pdf`;

    // Download PDF directly
    pdf.save(finalFilename);
    return true;
  } catch (err) {
    console.error('Error generating PDF:', err);
    // Fallback to print-to-PDF if jsPDF encounters an unrecoverable mobile issue
    try {
      window.print();
      return true;
    } catch {
      return false;
    }
  }
}

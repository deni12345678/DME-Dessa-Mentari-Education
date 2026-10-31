import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ReportData } from '../types/report';

/**
 * Prepares and sanitizes cloned element before canvas capture.
 * Fixes width to standard 760px for consistent high-definition A4 rendering across all mobile screen sizes.
 */
function sanitizeClonedElement(clonedEl: HTMLElement) {
  clonedEl.style.transform = 'none';
  clonedEl.style.width = '760px';
  clonedEl.style.maxWidth = '760px';
  clonedEl.style.minWidth = '760px';
  clonedEl.style.boxSizing = 'border-box';
  clonedEl.style.margin = '0 auto';
  clonedEl.style.borderRadius = '12px';

  // Sanitize all images inside the clone
  const clonedImgs = Array.from(clonedEl.querySelectorAll('img'));
  clonedImgs.forEach((img) => {
    if (img.src && (img.src.startsWith('data:') || img.src.startsWith('blob:'))) {
      img.removeAttribute('crossorigin');
    } else if (img.src) {
      img.crossOrigin = 'anonymous';
    }
    img.style.maxWidth = '100%';
    img.loading = 'eager';
  });
}

/**
 * Fast, responsive element capture using html2canvas.
 * Uses smart scaling (1.5x on mobile, 2x on desktop) to optimize speed and avoid UI freeze.
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

  // Ensure images are loaded
  const imgs = Array.from(element.querySelectorAll('img'));
  if (imgs.length > 0) {
    await Promise.all(
      imgs.map((img) => {
        if (img.complete && img.naturalHeight !== 0) return Promise.resolve(true);
        return new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          setTimeout(() => resolve(false), 1500);
        });
      })
    );
  }

  // Fast mobile-friendly scale selection
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const initialScale = isMobile ? 1.5 : 2;

  try {
    const canvas = await html2canvas(element as HTMLElement, {
      scale: initialScale,
      useCORS: true,
      allowTaint: false,
      backgroundColor,
      logging: false,
      imageTimeout: 6000,
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          sanitizeClonedElement(clonedEl);
        }
      },
    });

    if (canvas && canvas.width > 0 && canvas.height > 0) {
      return canvas;
    }
  } catch (err) {
    console.warn('Initial canvas capture failed, retrying with scale 1:', err);
  }

  // Quick fallback at scale 1 if device ran low on GPU memory
  try {
    const canvas = await html2canvas(element as HTMLElement, {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor,
      logging: false,
      imageTimeout: 5000,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          sanitizeClonedElement(clonedEl);
        }
      },
    });
    return canvas;
  } catch (lastErr) {
    console.error('All html2canvas attempts failed:', lastErr);
    return null;
  }
}

/**
 * Downloads the report as an official, single-page A4 PDF document.
 * Guarantees single-page fit without spilling onto page 2.
 */
export async function downloadReportAsPdf(
  elementId: string,
  filename: string,
  report?: ReportData
): Promise<boolean> {
  try {
    const canvas = await captureElementToCanvas(elementId, '#ffffff');
    if (!canvas) {
      console.warn('Canvas capture returned null, triggering browser print fallback.');
      window.print();
      return true;
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.96);

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth(); // 210 mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm
    const margin = 6; // 6mm margin for clean spacious border
    const maxContentWidth = pageWidth - margin * 2; // 198 mm
    const maxContentHeight = pageHeight - margin * 2; // 285 mm

    const naturalContentHeight = (canvas.height * maxContentWidth) / canvas.width;

    // Single Page Fit Check:
    // If the content is within 125% of the page height, scale it down slightly
    // so it fits on EXACTLY 1 PAGE rather than creating an awkward 2-page document.
    if (naturalContentHeight <= maxContentHeight * 1.25) {
      const scaleDown = naturalContentHeight > maxContentHeight 
        ? maxContentHeight / naturalContentHeight 
        : 1;

      const finalWidth = maxContentWidth * scaleDown;
      const finalHeight = naturalContentHeight * scaleDown;
      const xOffset = margin + (maxContentWidth - finalWidth) / 2;
      const yOffset = margin + (maxContentHeight - finalHeight) / 2;

      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'FAST');
    } else {
      // Very long report (multiple photo appendices) -> paginate cleanly
      let remainingHeight = naturalContentHeight;
      let position = 0;

      while (remainingHeight > 0) {
        pdf.addImage(
          imgData, 
          'JPEG', 
          margin, 
          margin - position, 
          maxContentWidth, 
          naturalContentHeight, 
          undefined, 
          'FAST'
        );
        remainingHeight -= maxContentHeight;
        position += maxContentHeight;

        if (remainingHeight > 0) {
          pdf.addPage();
        }
      }
    }

    const safeFilename = filename.replace(/[^a-zA-Z0-9_-]/g, '_');
    const finalFilename = `${safeFilename}.pdf`;

    pdf.save(finalFilename);
    return true;
  } catch (err) {
    console.error('Error generating PDF:', err);
    try {
      window.print();
      return true;
    } catch {
      return false;
    }
  }
}

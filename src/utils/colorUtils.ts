/**
 * Robust Color Sanitizer for HTML2Canvas & Print Engines.
 * 
 * Tailwind CSS v4 and modern browsers emit CSS colors in 'oklch' and 'oklab' color spaces.
 * html2canvas fails with "Attempting to parse an unsupported color function 'oklab'" 
 * because its internal CSS parser only recognizes sRGB formats (rgb, rgba, hex, hsl).
 * 
 * This utility converts all oklab/oklch colors to standard sRGB rgb/rgba formats
 * both via browser Canvas 2D color resolution and mathematical gamma-corrected fallback.
 */

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function oklabToRgb(L: number, a: number, b: number, alpha = 1): string {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r = +4.0767434036 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const toSRGB = (c: number) => {
    const clamped = clamp01(c);
    return clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  };

  const R = Math.round(toSRGB(r) * 255);
  const G = Math.round(toSRGB(g) * 255);
  const B = Math.round(toSRGB(bl) * 255);

  if (alpha < 1) {
    return `rgba(${R}, ${G}, ${B}, ${alpha})`;
  }
  return `rgb(${R}, ${G}, ${B})`;
}

export function oklchToRgb(L: number, C: number, H: number, alpha = 1): string {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  return oklabToRgb(L, a, b, alpha);
}

let canvasHelper: HTMLCanvasElement | null = null;
let ctxHelper: CanvasRenderingContext2D | null = null;

function getCanvasCtx(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null;
  if (!canvasHelper) {
    canvasHelper = document.createElement('canvas');
    canvasHelper.width = 1;
    canvasHelper.height = 1;
    ctxHelper = canvasHelper.getContext('2d');
  }
  return ctxHelper;
}

/**
 * Replaces any oklch(...) or oklab(...) in a color string with valid rgb(...) or rgba(...).
 */
export function sanitizeColorString(val: string): string {
  if (!val || typeof val !== 'string') return val;
  if (!val.includes('oklab') && !val.includes('oklch')) {
    return val;
  }

  const ctx = getCanvasCtx();

  return val.replace(/(oklch|oklab)\(([^)]+)\)/g, (fullMatch, fn, innerArgs) => {
    // 1. Try browser canvas resolution first (fast and native)
    if (ctx) {
      try {
        ctx.fillStyle = '#000000';
        ctx.fillStyle = fullMatch;
        const resolved = ctx.fillStyle;
        if (resolved && !resolved.includes('oklab') && !resolved.includes('oklch')) {
          return resolved;
        }
      } catch {
        // Continue to JS math fallback
      }
    }

    // 2. Exact mathematical sRGB fallback
    try {
      // Split by whitespace or slash: e.g. "0.7 0.15 140 / 0.8" or "0.7 0.15 140"
      const parts = innerArgs
        .trim()
        .replace(/,/g, ' ')
        .split(/[\s/]+/)
        .map((p: string) => {
          if (p.endsWith('%')) {
            return parseFloat(p) / 100;
          }
          return parseFloat(p);
        })
        .filter((n: number) => !isNaN(n));

      if (parts.length >= 3) {
        const [p1, p2, p3, p4] = parts;
        const alpha = p4 !== undefined ? p4 : 1;
        if (fn === 'oklch') {
          return oklchToRgb(p1, p2, p3, alpha);
        } else {
          return oklabToRgb(p1, p2, p3, alpha);
        }
      }
    } catch {
      // ignore
    }

    // Fallback safe dark slate
    return '#1e293b';
  });
}

/**
 * Patches a cloned document window so that all getComputedStyle calls
 * return sRGB colors, preventing html2canvas parser crashes completely.
 */
export function patchClonedDocumentStyles(clonedDoc: Document): void {
  const win = clonedDoc.defaultView || window;
  if (!win) return;

  const originalGetComputedStyle = win.getComputedStyle.bind(win);

  win.getComputedStyle = function (elt: Element, pseudoElt?: string | null) {
    const computed = originalGetComputedStyle(elt, pseudoElt);

    return new Proxy(computed, {
      get(target, prop: string | symbol) {
        const originalVal = (target as any)[prop];
        if (typeof originalVal === 'function') {
          if (prop === 'getPropertyValue') {
            return (propertyName: string) => {
              const val = target.getPropertyValue(propertyName);
              return sanitizeColorString(val);
            };
          }
          return originalVal.bind(target);
        }
        if (typeof originalVal === 'string') {
          return sanitizeColorString(originalVal);
        }
        return originalVal;
      },
    });
  };

  // Also sanitize any inline styles in <style> tags in the cloned document
  const styles = Array.from(clonedDoc.querySelectorAll('style'));
  for (const s of styles) {
    if (s.textContent && (s.textContent.includes('oklch') || s.textContent.includes('oklab'))) {
      s.textContent = sanitizeColorString(s.textContent);
    }
  }
}

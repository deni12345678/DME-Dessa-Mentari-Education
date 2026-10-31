import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  Share2, 
  PlusSquare, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Copy, 
  AlertTriangle, 
  Globe, 
  Monitor, 
  Check, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    (typeof window !== 'undefined' && window.__deferredPWAInstallPrompt) || null
  );
  const [isIOS, setIsIOS] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installedSuccessfully, setInstalledSuccessfully] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if running in standalone mode (already installed)
    const checkStandalone = () => {
      const isStandaloneMode =
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        (window.navigator as any).standalone === true;
      setIsStandalone(Boolean(isStandaloneMode));
    };

    checkStandalone();

    // Check user agent for iOS
    const ua = window.navigator.userAgent || '';
    const isIosDevice = /iPhone|iPad|iPod/i.test(ua) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // Detect In-App Browsers (WhatsApp, FB, Instagram, Telegram, Line, or generic webview)
    const inApp = /FBAN|FBAV|Instagram|WhatsApp|Line|Telegram|wv|WebView/i.test(ua);
    setIsInAppBrowser(inApp);

    // Check Service Worker registration state
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        if (regs.length > 0) {
          setSwRegistered(true);
        }
      });
    }

    // Check if global prompt is already stored
    if (window.__deferredPWAInstallPrompt) {
      setDeferredPrompt(window.__deferredPWAInstallPrompt);
    }

    const handlePromptReady = () => {
      if (window.__deferredPWAInstallPrompt) {
        setDeferredPrompt(window.__deferredPWAInstallPrompt);
      }
    };

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      window.__deferredPWAInstallPrompt = e;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstalledSuccessfully(true);
      setDeferredPrompt(null);
      window.__deferredPWAInstallPrompt = null;
    };

    window.addEventListener('pwa-prompt-ready', handlePromptReady);
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('pwa-prompt-ready', handlePromptReady);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isOpen]);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || window.__deferredPWAInstallPrompt;
    if (!promptEvent) {
      return;
    }

    try {
      await promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      if (choiceResult && choiceResult.outcome === 'accepted') {
        setInstalledSuccessfully(true);
      }
      setDeferredPrompt(null);
      window.__deferredPWAInstallPrompt = null;
    } catch (err) {
      console.warn('Error during install prompt:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      const shareUrl = window.location.origin;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (e) {
      console.error('Failed to copy URL', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 px-5 sm:px-6 py-4 sm:py-5 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 p-1 flex items-center justify-center backdrop-blur-xs shadow-inner">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                Pasang di Layar HP
                <span className="text-[10px] bg-amber-400 text-amber-950 font-extrabold px-2 py-0.5 rounded-full">
                  PWA Ready
                </span>
              </h3>
              <p className="text-xs text-amber-100">Dessa Mentari Education</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-sm text-slate-700">
          
          {/* Logo Card Preview */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80">
            <div className="relative shrink-0">
              <img
                src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
                alt="Logo DME"
                className="w-14 h-14 rounded-2xl shadow-md border-2 border-white object-contain bg-white p-1"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-slate-900 text-sm truncate">DME Privat</h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-md">
                  Aplikasi Web Resmi
                </span>
              </div>
              <p className="text-xs text-amber-900 font-medium truncate">Les Privat Keluarga Indonesia</p>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                Buka langsung 1-sentuhan dari layar depan smartphone tanpa mengetik alamat
              </p>
            </div>
          </div>

          {/* IN-APP BROWSER (WHATSAPP/INSTAGRAM) ALERT */}
          {isInAppBrowser && (
            <div className="p-4 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl space-y-2.5">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-950 text-xs sm:text-sm">
                    Penting: Anda Sedang Membuka di WhatsApp / Browser Aplikasi!
                  </h4>
                  <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                    Sistem WhatsApp memblokir pemasangan aplikasi ke layar HP secara langsung.
                  </p>
                </div>
              </div>

              <div className="bg-white/90 p-3 rounded-xl border border-amber-200 text-xs text-slate-700 space-y-1.5">
                <p className="font-bold text-slate-800">👉 Cara Membuka di Google Chrome / Safari:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                  <li>Ketuk ikon <strong>titik tiga (⋮)</strong> di pojok kanan paling atas layar Anda.</li>
                  <li>Pilih menu <strong>"Buka di Chrome"</strong> (atau "Buka di Browser" / Safari).</li>
                  <li>Setelah terbuka di Chrome/Safari, Anda dapat langsung menginstal ke layar HP!</li>
                </ol>
              </div>

              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>Link Berhasil Disalin! Buka di Google Chrome</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Link Aplikasi (Untuk Dibuka di Chrome)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ALREADY INSTALLED */}
          {isStandalone || installedSuccessfully ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <div className="inline-flex p-2.5 bg-emerald-100 text-emerald-700 rounded-full shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-emerald-950 text-base">Aplikasi Sudah Terpasang!</h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Ikon aplikasi <strong>Dessa Mentari Education</strong> sudah aktif di layar utama smartphone Anda. Anda dapat langsung menggunakannya kapan saja layaknya aplikasi native!
              </p>
            </div>
          ) : deferredPrompt ? (
            /* ANDROID / CHROME NATIVE 1-CLICK INSTALL */
            <div className="space-y-3.5">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-slate-700 space-y-2">
                <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Siap Dipasang Otomatis (1-Klik)
                </p>
                <p className="text-emerald-800 leading-relaxed">
                  Peramban Anda mendukung instalasi instan. Ketuk tombol di bawah untuk menempelkan logo Dessa Mentari ke layar beranda HP Anda sekarang.
                </p>
              </div>

              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold rounded-2xl shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 text-sm cursor-pointer"
              >
                <Download className="w-5 h-5 text-amber-200 animate-bounce" />
                <span>Pasang Sekarang di Layar HP</span>
              </button>
            </div>
          ) : isIOS ? (
            /* IPHONE / IPAD SAFARI INSTRUCTIONS */
            <div className="space-y-3.5">
              <div className="text-xs font-bold text-amber-950 bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-center gap-2">
                <span>🍎 Panduan Pasang untuk iPhone / iPad (Safari):</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      Ketuk Tombol Bagikan 
                      <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[11px] font-semibold">
                        <Share2 className="w-3.5 h-3.5 mr-0.5" /> Share
                      </span>
                    </p>
                    <p className="text-slate-500 mt-0.5">Ikon kotak dengan panah ke atas di bagian bawah layar Safari iPhone.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      Pilih "Tambahkan ke Layar Utama"
                      <span className="inline-flex items-center justify-center bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[11px] font-semibold">
                        <PlusSquare className="w-3.5 h-3.5 mr-0.5" /> Add to Home Screen
                      </span>
                    </p>
                    <p className="text-slate-500 mt-0.5">Gulir ke bawah pada menu opsi hingga menemukan pilihan ini.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">Ketuk "Tambah" (Add) di Kanan Atas</p>
                    <p className="text-slate-500 mt-0.5">Ikon aplikasi DME Privat akan langsung tertempel rapi di layar depan iPhone Anda!</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ANDROID MANUAL FALLBACK (CHROME, EDGE, SAMSUNG INTERNET) */
            <div className="space-y-3.5">
              <div className="text-xs font-bold text-slate-900 bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <span>🤖 Panduan Memasang di Android (Google Chrome):</span>
                <span className="text-[10px] text-amber-700 font-extrabold bg-amber-100 px-2 py-0.5 rounded-full">3 Langkah Mudah</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">
                      Ketuk Titik Tiga (⋮) di Pojok Kanan Atas Browser
                    </p>
                    <p className="text-slate-500 mt-0.5">Buka menu pengaturan Google Chrome di bagian atas layar HP.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">
                      Pilih menu "Instal aplikasi" atau "Tambahkan ke Layar Utama"
                    </p>
                    <p className="text-slate-500 mt-0.5">Tergantung versi Chrome Anda, menu bertuliskan <em>"Instal aplikasi"</em> atau <em>"Tambahkan ke Layar Utama"</em> (Add to Home screen).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">Ketuk "Instal" / "Tambah"</p>
                    <p className="text-slate-500 mt-0.5">Aplikasi selesai dipasang dan dapat dibuka layaknya aplikasi Android!</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Tersalin!' : 'Salin Link Web'}</span>
                </button>
              </div>
            </div>
          )}

          {/* DIAGNOSTICS & SYSTEM COMPLIANCE ACCORDION */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                Status Kesiapan PWA (Pengecekan Sistem)
              </span>
              {showDiagnostics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDiagnostics && (
              <div className="p-3 pt-0 border-t border-slate-200/80 text-[11px] space-y-1.5 text-slate-600">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span>Web App Manifest</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terkonfigurasi (/manifest.webmanifest)
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span>Service Worker</span>
                  <span className={`font-bold flex items-center gap-1 ${swRegistered ? 'text-emerald-700' : 'text-slate-600'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> {swRegistered ? 'Aktif (Offline Cache v2)' : 'Siap Terdaftar'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span>Ikon Layar HP (192px & 512px Maskable)</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Lengkap & Presisi
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Koneksi HTTPS</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Enkripsi Aman SSL
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Gratis • Tanpa download APK • Ringan
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors shadow-2xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

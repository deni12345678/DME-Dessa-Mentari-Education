import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Share2, PlusSquare, CheckCircle2, X, Sparkles, ExternalLink } from 'lucide-react';

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
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installedSuccessfully, setInstalledSuccessfully] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const checkStandalone = () => {
      const isStandaloneMode =
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        (window.navigator as any).standalone === true;
      setIsStandalone(Boolean(isStandaloneMode));
    };

    checkStandalone();

    // Check if iOS
    const ua = window.navigator.userAgent;
    const isIosDevice = /iPhone|iPad|iPod/i.test(ua) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setInstalledSuccessfully(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setInstalledSuccessfully(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.warn('Error during install prompt:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 p-1 flex items-center justify-center backdrop-blur-xs shadow-inner">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                Pasang di Layar HP
                <span className="text-[10px] bg-amber-400 text-amber-950 font-extrabold px-1.5 py-0.5 rounded-full">
                  PWA
                </span>
              </h3>
              <p className="text-xs text-amber-100">Dessa Mentari Education</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
          {/* Logo Card Preview */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80">
            <div className="relative">
              <img
                src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
                alt="Logo DME"
                className="w-16 h-16 rounded-2xl shadow-md border-2 border-white object-contain bg-white p-1"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-slate-900 text-sm">DME Privat</h4>
              <p className="text-xs text-amber-900 font-medium line-clamp-1">Les Privat Keluarga Indonesia</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Buka langsung 1-klik dari layar HP tanpa browser</p>
            </div>
          </div>

          {isStandalone || installedSuccessfully ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <div className="inline-flex p-2 bg-emerald-100 text-emerald-700 rounded-full">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-emerald-900 text-base">Aplikasi Sudah Terpasang!</h4>
              <p className="text-xs text-emerald-800">
                Ikon aplikasi Dessa Mentari Education sudah ada di layar utama smartphone Anda. Anda dapat langsung membukanya kapan saja!
              </p>
            </div>
          ) : deferredPrompt ? (
            /* Android / Chrome 1-Click Install */
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Keuntungan Memasang di HP:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                  <li>Muncul di layar depan HP dengan logo resmi DME.</li>
                  <li>Tampilan layar penuh profesional tanpa bilah navigasi browser.</li>
                  <li>Akses cepat untuk guru & orang tua mengisi atau melihat laporan.</li>
                </ul>
              </div>

              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-2xl shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Download className="w-5 h-5 text-amber-200" />
                <span>Pasang Sekarang di Layar HP</span>
              </button>
            </div>
          ) : isIOS ? (
            /* iOS Safari Instructions */
            <div className="space-y-4">
              <div className="text-xs font-semibold text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-center gap-2">
                <span>🍎 Petunjuk Khusus Pengguna iPhone / iPad (Safari):</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">
                      Ketuk tombol Bagikan <Share2 className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> (Share)
                    </p>
                    <p className="text-slate-500 mt-0.5">Tombol kotak bertanda panah ke atas di bagian bawah layar Safari.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">
                      Pilih "Tambahkan ke Layar Utama" <PlusSquare className="w-3.5 h-3.5 inline text-slate-700 mx-0.5" />
                    </p>
                    <p className="text-slate-500 mt-0.5">Gulir ke bawah pada menu bagikan dan pilih opsi berlambang tambah (+).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Ketuk "Tambah" (Add) di Kanan Atas</p>
                    <p className="text-slate-500 mt-0.5">Aplikasi dengan logo Dessa Mentari akan segera muncul di layar utama iPhone Anda.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Android manual instructions (Chrome / Samsung / WhatsApp in-app browser) */
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-800 bg-slate-100 p-3 rounded-xl border border-slate-200">
                <span>🤖 Panduan Memasang di Android / Google Chrome:</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Ketuk Titik Tiga (⋮) di Pojok Kanan Atas</p>
                    <p className="text-slate-500 mt-0.5">Buka menu peramban Chrome di bagian atas layar HP.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">
                      Pilih "Instal aplikasi" atau "Tambahkan ke Layar Utama"
                    </p>
                    <p className="text-slate-500 mt-0.5">Pilih opsi tambah ke beranda/home screen.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Konfirmasi "Instal" / "Tambah"</p>
                    <p className="text-slate-500 mt-0.5">Ikon logo Dessa Mentari Education akan langsung menempel di layar depan HP Anda!</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <p className="text-[11px] text-amber-900 font-medium">
                  💡 Tips: Jika membuka link dari dalam aplikasi WhatsApp atau Instagram, pilih menu <strong>"Buka di Chrome"</strong> terlebih dahulu agar bisa diinstal ke layar utama.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors shadow-2xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

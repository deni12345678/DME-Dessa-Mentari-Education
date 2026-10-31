import React, { useState } from 'react';
import { Sparkles, Loader2, Wand2, X, Check, BookOpen, Home, MessageSquareHeart } from 'lucide-react';
import { EducationLevel, SubjectOption } from '../types/report';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  namaSiswa: string;
  jenjang: EducationLevel;
  mataPelajaran: SubjectOption | string;
  materi: string;
  currentEvaluasi: string;
  catatanOrangTua?: string;
  onApply: (generatedData: { evaluasiSiswa?: string; tugasRumah?: string; catatanOrangTua?: string }) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  namaSiswa,
  jenjang,
  mataPelajaran,
  materi,
  currentEvaluasi,
  catatanOrangTua,
  onApply,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  
  const [generatedEval, setGeneratedEval] = useState<string>('');
  const [generatedPR, setGeneratedPR] = useState<string>('');
  const [generatedCatatanOrtu, setGeneratedCatatanOrtu] = useState<string>('');

  const [customPrompt, setCustomPrompt] = useState<string>(currentEvaluasi || '');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setErrorText(null);
    try {
      const response = await fetch('/api/generate-eval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          namaSiswa: namaSiswa || 'Siswa',
          jenjang: jenjang || 'SD',
          mataPelajaran: mataPelajaran || 'Matematika',
          materi: materi || 'Materi pembelajaran hari ini',
          draftEvaluasi: customPrompt || currentEvaluasi || 'Memahami materi dengan baik dan aktif bertanyajawab.',
          catatanOrangTua: catatanOrangTua || '',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat menghubungi server AI.');
      }

      setGeneratedEval(data.evaluasiSiswa || data.evaluationText || '');
      setGeneratedPR(data.tugasRumah || '');
      setGeneratedCatatanOrtu(data.catatanOrangTua || '');
    } catch (err: any) {
      console.error('AI generate error:', err);
      setErrorText(err.message || 'Gagal memproses rekomendasi evaluasi AI.');
    } finally {
      setLoading(false);
    }
  };

  const hasResult = !!(generatedEval || generatedPR || generatedCatatanOrtu);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-bold text-base font-serif-brand">AI Asisten Laporan Dessa Mentari</h3>
              <p className="text-xs text-amber-100">Susun Evaluasi, PR Tugas Rumah & Catatan Orang Tua Otomatis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
            <span className="font-bold block">Siswa: {namaSiswa || 'Siswa'} | Mapel: {mataPelajaran} ({jenjang})</span>
            <p className="text-amber-800">
              AI akan secara cerdas menyusun <b>Evaluasi Perkembangan</b>, <b>Rekomendasi PR</b>, dan <b>Catatan Khusus Orang Tua</b> sekaligus!
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Poin Pemicu / Catatan Singkat Pengajar:
            </label>
            <textarea
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Contoh: Sangat aktif, selesai tepat waktu, beri PR latihan perkalian desimal 5 soal."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-amber-700 hover:to-orange-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
                <span>Menyusun Evaluasi, PR & Catatan Ortu...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-amber-200" />
                <span>Generate Evaluasi + PR + Catatan Ortu AI</span>
              </>
            )}
          </button>

          {errorText && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {errorText}
            </div>
          )}

          {hasResult && (
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <label className="block text-xs font-extrabold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Check className="w-4 h-4 text-emerald-600" />
                Hasil Rekomendasi AI Lengkap:
              </label>

              {/* 1. Evaluasi Perkembangan */}
              {generatedEval && (
                <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Evaluasi & Perkembangan Siswa:
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {generatedEval}
                  </p>
                </div>
              )}

              {/* 2. PR / Tugas Rumah */}
              {generatedPR && (
                <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                    <Home className="w-3.5 h-3.5 text-amber-600" /> PR / Tugas Rumah Disarankan:
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {generatedPR}
                  </p>
                </div>
              )}

              {/* 3. Catatan Khusus Orang Tua */}
              {generatedCatatanOrtu && (
                <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-indigo-900 flex items-center gap-1">
                    <MessageSquareHeart className="w-3.5 h-3.5 text-indigo-600" /> Catatan Khusus Orang Tua:
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {generatedCatatanOrtu}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Batal
          </button>

          <button
            onClick={() => {
              if (hasResult) {
                onApply({
                  evaluasiSiswa: generatedEval,
                  tugasRumah: generatedPR,
                  catatanOrangTua: generatedCatatanOrtu,
                });
                onClose();
              }
            }}
            disabled={!hasResult}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            Terapkan Semua ke Form Laporan
          </button>
        </div>
      </div>
    </div>
  );
};

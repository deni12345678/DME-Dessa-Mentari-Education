import React, { useState } from 'react';
import { TeacherSettings, CardTheme } from '../types/report';
import { Save, User, Phone, Palette, CheckCircle, UserCheck } from 'lucide-react';

interface SettingsViewProps {
  settings: TeacherSettings;
  onSaveSettings: (newSettings: TeacherSettings) => void;
}

const PRESET_TEACHERS = [
  'Deni Santoso, M.M',
  'Sarah Syahidah Syahrudin, S.Pd'
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [form, setForm] = useState<TeacherSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 max-w-2xl mx-auto">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900 font-serif-brand">
          Pengaturan Profil & Preset Pengajar
        </h2>
        <p className="text-xs text-slate-500">
          Atur nama pengajar dan preferensi default agar tidak perlu mengetik ulang setiap kali membuat laporan baru.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nama Pengajar Default */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <User className="w-4 h-4 text-amber-500" />
            Nama Lengkap Pengajar / Tutor Default
          </label>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-2 pb-1">
            {PRESET_TEACHERS.map((tName) => (
              <button
                key={tName}
                type="button"
                onClick={() => setForm({ ...form, namaPengajar: tName })}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1 ${
                  form.namaPengajar === tName
                    ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{tName}</span>
              </button>
            ))}
          </div>

          <input
            type="text"
            value={form.namaPengajar}
            onChange={(e) => setForm({ ...form, namaPengajar: e.target.value })}
            placeholder="Contoh: Deni Santoso, M.M atau Sarah Syahidah Syahrudin, S.Pd"
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        {/* WhatsApp Default Ortu */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-emerald-600" />
            No. WhatsApp Kontak Lembaga / Admin (Opsional)
          </label>
          <input
            type="text"
            value={form.nomorWA || ''}
            onChange={(e) => setForm({ ...form, nomorWA: e.target.value })}
            placeholder="Contoh: 6281234567890"
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Gunakan format internasional (contoh: 62812...) untuk membuka WhatsApp otomatis.
          </p>
        </div>

        {/* Tema Warna Kartu Default */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-purple-600" />
            Tema Warna Kartu Default
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'solar', name: 'Mentari Amber', desc: 'Warna hangat Oranye & Emas' },
              { id: 'emerald', name: 'Emerald Teal', desc: 'Hijau Segar & Mint' },
              { id: 'navy', name: 'Royal Navy', desc: 'Biru Navy Elegan & Emas' },
              { id: 'pastel', name: 'Pastel Lavender', desc: 'Ungu & Violet Lembut' },
              { id: 'dark', name: 'Modern Dark', desc: 'Palet Gelap Elegan & Aksen Emas' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setForm({ ...form, defaultTheme: t.id as CardTheme })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  form.defaultTheme === t.id
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold text-slate-900">{t.name}</div>
                <div className="text-[11px] text-slate-500">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Variasi Layout Kartu Laporan (Elegant, Bold, Minimalist) */}
        <div className="border-t border-slate-100 pt-4">
          <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-base">📐</span>
              <span>Variasi Format & Layout Kartu Laporan</span>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              Pilihan Dinamis
            </span>
          </label>
          <p className="text-[11px] text-slate-500 mb-3">
            Pilih struktur visual laporan pembelajaran yang paling sesuai dengan kebutuhan lembaga dan karakter siswa.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'elegant',
                name: 'Elegant (Resmi)',
                badge: 'Standar Lembaga',
                desc: 'Kop formal mewah dengan segel ganda, kartu dossier akademik, dan stempel melingkar resmi DME.',
                accent: 'from-amber-700 to-amber-900',
              },
              {
                id: 'bold',
                name: 'Bold (Modern)',
                badge: 'Kontras Tinggi',
                desc: 'Desain modern berani dengan kotak skor metrik besar, border tegas, dan visibilitas tinggi di layar HP.',
                accent: 'from-slate-900 to-amber-600',
              },
              {
                id: 'minimalist',
                name: 'Minimalist (Clean)',
                badge: 'Japandi Simpel',
                desc: 'Gaya bersih modern, garis tipis presisi, tipografi lapang, serta tampilan ringan dan rapi.',
                accent: 'from-slate-700 to-slate-900',
              },
            ].map((lay) => {
              const isSelected = (form.defaultLayout || 'elegant') === lay.id;
              return (
                <button
                  key={lay.id}
                  type="button"
                  onClick={() => setForm({ ...form, defaultLayout: lay.id as any })}
                  className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-400 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[9.5px] font-black uppercase px-1.5 py-0.5 rounded text-white bg-gradient-to-r ${lay.accent}`}>
                        {lay.badge}
                      </span>
                      {isSelected && (
                        <span className="text-amber-600 font-bold text-xs">✓ Terpilih</span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-900">{lay.name}</div>
                    <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">{lay.desc}</div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Ukuran A4 1 Halaman</span>
                    <span>PDF & JPG Ready</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Pengaturan berhasil disimpan!
            </span>
          ) : (
            <span></span>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  );
};

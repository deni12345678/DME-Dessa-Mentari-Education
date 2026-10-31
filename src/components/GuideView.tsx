import React from 'react';
import { Sun, CheckCircle2, Download, MessageSquare, Sparkles, Wand2 } from 'lucide-react';

export const GuideView: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 max-w-3xl mx-auto">
      <div className="border-b border-slate-100 pb-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
          <Sun className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif-brand">
            Panduan Pengajar & SOP Laporan Les Privat
          </h2>
          <p className="text-xs text-slate-500">
            Standar Pelayanan Laporan Pembelajaran "Dessa Mentari Education"
          </p>
        </div>
      </div>

      <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
        {/* Step 1 */}
        <div className="flex gap-4">
          <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-xs">
            1
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">Pengisian Data Laporan yang Akurat</h3>
            <p>
              Setiap kali selesai mengajar (bisa via HP langsung di lokasi les atau rumah), buka aplikasi ini dan lengkapi <b>Nama Siswa</b>, <b>Tanggal</b>, <b>Jenjang</b>, dan <b>Mata Pelajaran</b>.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4">
          <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-xs">
            2
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">Gunakan AI Asisten Evaluasi untuk Kalimat Santun</h3>
            <p>
              Jika Anda bingung menyusun kalimat evaluasi untuk disampaikan ke orang tua, klik tombol <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Bantu Polesan Evaluasi AI</span>. Cukup ketik kata kunci singkat, AI akan menyusun kalimat santun, memotivasi, dan profesional.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4">
          <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-xs">
            3
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">Ekspor ke Format Gambar (JPG/PNG)</h3>
            <p>
              Tekan tombol <b>"Unduh Gambar (JPG)"</b> di bagian atas atau bawah pratinjau kartu. File gambar beresolusi tinggi akan diunduh secara otomatis ke HP/Laptop Anda dan siap dikirimkan melalui WhatsApp kepada orang tua siswa.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex gap-4">
          <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-xs">
            4
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">Kirim via WhatsApp (Teks + Gambar)</h3>
            <p>
              Anda bisa menggunakan tombol <b>"Salin Teks WA"</b> untuk menyalin rangkuman teks berformat emoji indah, kemudian lampirkan bersama gambar kartu laporan yang telah diunduh.
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex gap-4">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center shrink-0 text-xs">
            5
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">Rekapan Sesi & Biaya Les (Per Sesi, Per Jam, & Manual)</h3>
            <p>
              Pada tab <b>"Rekap & Biaya"</b>, Anda dapat memilih mode perhitungan biaya les: <b>Hitung Per Sesi (Sesi × Tarif)</b>, <b>Hitung Per Jam (Total Jam × Tarif/Jam)</b> untuk les berdasarkan durasi waktu riil, atau <b>Nominal Manual (Paket Bulanan)</b>. Anda juga dapat mencatat daftar pertemuan manual, transport, modul, potongan diskon, membuat invoice WhatsApp, dan mencetak kuitansi resmi digital.
            </p>
          </div>
        </div>
      </div>

      {/* Quote Banner */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium italic">
        "Laporan pembelajaran yang transparan dan komunikatif adalah kunci kepercayaan orang tua siswa kepada lembaga Dessa Mentari Education."
      </div>
    </div>
  );
};

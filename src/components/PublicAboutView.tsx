import React from 'react';
import { 
  Target, 
  Compass, 
  Award, 
  CheckCircle2, 
  UserCheck, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  HeartHandshake,
  Users,
  Building,
  Star
} from 'lucide-react';
import { TeacherSettings } from '../types/report';

interface PublicAboutViewProps {
  settings: TeacherSettings;
  onNavigateTab: (tab: 'packages' | 'register') => void;
}

export const PublicAboutView: React.FC<PublicAboutViewProps> = ({
  settings,
  onNavigateTab
}) => {
  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. HEADER SECTION */}
      <section className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
          Profil & Rekam Jejak Lembaga
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-serif-brand tracking-tight">
          Tentang Dessa Mentari Education
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Lembaga bimbingan belajar dan kursus privat terpercaya yang mengedepankan pendekatan personal, pemahaman konsep mendalam, dan pembentukan karakter anak Indonesia.
        </p>
      </section>

      {/* 2. LATAR BELAKANG & FILOSOFI */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 flex justify-center">
          <div className="relative">
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/20 p-4 border-2 border-amber-300 flex items-center justify-center shadow-lg">
              <img
                src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
                alt="Logo DME"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-slate-950 text-amber-300 px-3 py-1 rounded-xl text-xs font-bold border border-amber-400 shadow-md">
              Didirikan Sejak 2026
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-4">
          <span className="text-xs uppercase tracking-wider font-extrabold text-amber-700">
            Filosofi Nama "Dessa Mentari"
          </span>
          <h2 className="text-2xl font-black text-slate-900 font-serif-brand">
            Sinar Terang Ilmu untuk Keluarga Indonesia
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Nama <strong>Dessa Mentari Education</strong> terinspirasi dari filosofi matahari terbit (*Mentari*) yang senantiasa memancarkan kehangatan, harapan, dan energi pencerahan di setiap sudut lingkungan keluarga (*Dessa*).
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Kami meyakini bahwa setiap anak memiliki potensi kecerdasan yang unik. Melalui metode bimbingan privat tatap muka langsung di rumah (*in-home tutoring*), kami hadir mendampingi anak mengatasi kesulitan belajar, menumbuhkan rasa percaya diri, dan mencintai ilmu pengetahuan tanpa rasa cemas.
          </p>

          <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200">
              <strong className="text-slate-900 block font-bold">1-on-1 Personalized</strong>
              <span className="text-slate-500 text-[11px]">Satu anak dibimbing satu pengajar ahli</span>
            </div>
            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200">
              <strong className="text-slate-900 block font-bold">Akuntabilitas Rapor</strong>
              <span className="text-slate-500 text-[11px]">Laporan tertulis resmi per sesi pertemuan</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISI & 5 MISI STRATEGIS */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-amber-500/30 shadow-xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-300/40">
            Arah & Landasan
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-serif-brand text-white">
            Visi & Misi Strategis
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* VISI */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs font-black uppercase text-amber-300 tracking-wider block">
                Visi Lembaga
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-serif-brand text-white">
                Mencetak Generasi Cerdas, Mandiri & Berkarakter Mulia
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                "Menjadi lembaga pendidikan non-formal dan bimbingan belajar privat terdepan, terpercaya, dan ramah keluarga di Indonesia yang membantu setiap anak menemukan potensi terbaiknya melalui pendekatan belajar yang menyenangkan, berkarakter, dan berkesinambungan."
              </p>
            </div>

            <div className="pt-4 border-t border-white/15 text-[11px] font-mono text-amber-300">
              © 2026 DESSA MENTARI EDUCATION
            </div>
          </div>

          {/* MISI */}
          <div className="lg:col-span-7 bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/15 space-y-3">
            <span className="text-xs font-black uppercase text-amber-300 tracking-wider block mb-2">
              5 Misi Utama Lembaga:
            </span>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <strong className="text-white block font-bold">Pendekatan Belajar Personal (Personalized Learning)</strong>
                  <span className="text-slate-300 text-xs">Menyesuaikan tempo dan metode mengajar sesuai keunikan, daya tangkap, dan gaya belajar masing-masing anak.</span>
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <strong className="text-white block font-bold">Pendidik Berdedikasi & Terverifikasi</strong>
                  <span className="text-slate-300 text-xs">Menghadirkan tutor yang berpendidikan tinggi, sabar, komunikatif, dan memiliki etika pengajaran ramah anak.</span>
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <strong className="text-white block font-bold">Transparansi Laporan & Rapor Sesi Resmi</strong>
                  <span className="text-slate-300 text-xs">Memberikan laporan perkembangan komprehensif (1 lembar PDF & foto) kepada orang tua di setiap akhir sesi les.</span>
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 text-xs">
                  4
                </span>
                <div>
                  <strong className="text-white block font-bold">Penguatan Karakter & Rasa Percaya Diri</strong>
                  <span className="text-slate-300 text-xs">Tidak hanya mengejar nilai angka, namun membiasakan anak menyukai proses belajar dan berani mencoba tantangan.</span>
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 text-xs">
                  5
                </span>
                <div>
                  <strong className="text-white block font-bold">Kemitraan Erat dengan Orang Tua Siswa</strong>
                  <span className="text-slate-300 text-xs">Membina komunikasi terbuka dua arah demi keselarasan bimbingan antara rumah dan pendamping les privat.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NILAI DME STARS */}
        <div className="pt-4 border-t border-white/15">
          <h4 className="text-center text-xs font-black uppercase tracking-wider text-amber-300 mb-4">
            Nilai Luhur Lembaga: DME STARS
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
            <div className="p-3 bg-white/10 rounded-xl border border-white/15">
              <span className="text-amber-400 font-black text-sm block">S - Smart</span>
              <span className="text-slate-300 text-[11px]">Cerdas & analitis dalam belajar</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/15">
              <span className="text-amber-400 font-black text-sm block">T - Trustworthy</span>
              <span className="text-slate-300 text-[11px]">Amanah & dapat dipercaya</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/15">
              <span className="text-amber-400 font-black text-sm block">A - Active</span>
              <span className="text-slate-300 text-[11px]">Aktif & kreatif mengeksplorasi</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/15">
              <span className="text-amber-400 font-black text-sm block">R - Respectful</span>
              <span className="text-slate-300 text-[11px]">Sopan, santun & berakhlak</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/15 col-span-2 sm:col-span-1">
              <span className="text-amber-400 font-black text-sm block">S - Sincere</span>
              <span className="text-slate-300 text-[11px]">Tulus & ikhlas mengabdi</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROFIL PENGAJAR UTAMA & TIM TUTOR */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Pendidik Terpercaya
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif-brand">
            Profil Pengajar & Tutor Pendamping
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Dikelola dan diampu oleh tenaga pendidik profesional yang berpengalaman dalam mendampingi ratusan siswa meraih prestasi sekolah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Tutor 1: Deni Santoso */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4 hover:border-amber-400 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-amber-300">
                  DS
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Kepala Pengajar & Konsultan
                  </span>
                  <h3 className="text-lg font-black text-slate-900 font-serif-brand mt-0.5">
                    Deni Santoso, M.M
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    ID Sertifikasi Tutor: DME-TTR-001
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Berpengalaman lebih dari 8 tahun dalam mendampingi siswa jenjang SD, SMP, SMA, dan kursus komputer terapan. Memiliki spesialisasi dalam metode penyederhanaan rumus Matematika, penalaran Sains/Fisika, serta literasi teknologi informasi ramah anak.
              </p>

              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-slate-800 block">Bidang Bimbingan Utama:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Matematika SD & SMP', 'TIK / Komputer Terapan', 'IPA Fisika', 'Persiapan Ujian Sekolah'].map((b, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      ✓ {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-700 font-bold">
              <span>● Status Tutor: Aktif & Mengajar</span>
              <span>Terverifikasi Digital</span>
            </div>
          </div>

          {/* Tutor 2: Sarah Syahidah Syahrudin */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4 hover:border-amber-400 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-emerald-300">
                  SS
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Koordinator Kurikulum & Pengajar
                  </span>
                  <h3 className="text-lg font-black text-slate-900 font-serif-brand mt-0.5">
                    Sarah Syahidah Syahrudin, S.Pd
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    ID Sertifikasi Tutor: DME-TTR-002
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Lulusan sarjana kependidikan dengan fokus spesialisasi pada metode pembelajaran Calistung Ceria anak usia dini (TK) serta bimbingan Bahasa Inggris dan tematik SD. Sangat telaten, sabar, dan komunikatif dalam menciptakan suasana belajar yang ramah anak.
              </p>

              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-slate-800 block">Bidang Bimbingan Utama:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Calistung Ceria (TK/PAUD)', 'Bahasa Inggris Dasar', 'Tematik Terpadu SD', 'Pendidikan Karakter'].map((b, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      ✓ {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-700 font-bold">
              <span>● Status Tutor: Aktif & Mengajar</span>
              <span>Terverifikasi Digital</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="bg-amber-50 rounded-3xl p-8 border border-amber-200 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif-brand">
          Ingin Bergabung Bersama Keluarga Besar Dessa Mentari Education?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Pilih paket bimbingan yang tepat dan jadwalkan sesi les privat pertama putra/putri Anda bersama tutor terbaik kami.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigateTab('packages')}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all"
          >
            Lihat Paket Kursus
          </button>
          <button
            onClick={() => onNavigateTab('register')}
            className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all"
          >
            Daftar Sekarang
          </button>
        </div>
      </section>
    </div>
  );
};

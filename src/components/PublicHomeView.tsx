import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  MessageCircle, 
  Calculator, 
  FileText, 
  Star, 
  Users, 
  Clock, 
  ChevronRight, 
  HeartHandshake,
  Award,
  Zap,
  MapPin,
  Laptop,
  Check,
  ArrowRight
} from 'lucide-react';
import { COURSE_PACKAGES, CoursePackage } from './InstitutionView';
import { TeacherSettings } from '../types/report';

interface PublicHomeViewProps {
  settings: TeacherSettings;
  onNavigateTab: (tab: 'about' | 'packages' | 'calculator' | 'student-report' | 'register' | 'faq') => void;
  onGoToAdmin: () => void;
}

type HeroGradeLevel = 'sd' | 'smp' | 'sma' | 'tk';

export const PublicHomeView: React.FC<PublicHomeViewProps> = ({
  settings,
  onNavigateTab,
  onGoToAdmin,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<HeroGradeLevel>('sd');

  const handleConsultWhatsApp = (topic?: string) => {
    const phone = (settings.nomorWA || '6281234567890').replace(/[^0-9]/g, '');
    const topicText = topic ? `tentang ${topic}` : 'mengenai bimbingan les privat Bimbel DME (Dessa Mentari Education)';
    const text = encodeURIComponent(
      `Halo Admin Bimbel DME (Dessa Mentari Education),\n\nSaya ingin berkonsultasi ${topicText} untuk putra/putri saya.\nBisa mohon informasi jadwal tutor dan biayanya?\n\nTerima kasih!`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  // Grade level dynamic copy, with 'sd' matching the user's reference image exactly
  const gradeHeroContent = {
    sd: {
      headline: 'Bimbel SD, Fokus Belajar Akademik SD Semua Mata Pelajaran, OSN SD Matematika IPA IPS, dan TKA SD',
      subhead: 'Bimbel Online & Privat Ke Rumah',
      description: 'Bimbingan belajar premium SD, Privat untuk anak kelas 1-6 SD semua mata pelajaran Matematika, IPA, IPS, Bahasa Indonesia, Bahasa Inggris, PPKn dan mapel lain, untuk semua kurikulum Nasional (Merdeka, K13), Nasional Plus, dan Internasional (IB, Cambridge, Singapore, dll). Program Les Privat SD Terbaik untuk belajar mapel Akademik SD, Olimpiade atau OSN SD, hingga persiapan Tes Kemampuan Akademik (TKA) SD.',
      badge: 'FOKUS AKADEMIK SD KELAS 1-6',
    },
    smp: {
      headline: 'Bimbel SMP, Kuasai Konsep Eksakta Matematika & IPA, Sukses Ujian Sekolah dan OSN SMP',
      subhead: 'Bimbel Online & Privat Ke Rumah',
      description: 'Bimbingan belajar intensif jenjang SMP kelas 7-9 untuk Matematika, IPA (Fisika & Biologi), IPS, Bahasa Inggris, dan Bahasa Indonesia. Memperkuat pondasi logika analitis, tugas sekolah, ujian semester, serta persiapan masuk SMA Negeri favorit & Unggulan.',
      badge: 'BIMBEL PRESTASI SMP KELAS 7-9',
    },
    sma: {
      headline: 'Bimbel SMA & Alumni, Sukses SNBT/UTBK, Saintek, Soshum, Kedinasan & Ujian Masuk PTN',
      subhead: 'Bimbel Online & Privat Ke Rumah',
      description: 'Program persiapan tuntas masuk PTN impian. Pendampingan personal intensif TPS (Tes Potensi Skolastik), Literasi Bahasa, Penalaran Matematika, Fisika, Kimia, Biologi, Ekonomi, Geografi, dan Sosiologi bersama tentor ahli berorientasi skor maksimal.',
      badge: 'PERSIAPAN INTENSIF SNBT & PTN',
    },
    tk: {
      headline: 'Bimbel Calistung Ceria, Fondasi Membaca, Menulis & Berhitung Cepat Anak Usia Dini',
      subhead: 'Guru Sabar Datang Ke Rumah & Online',
      description: 'Metode belajar menyenangkan (fun learning) tanpa paksaan untuk ananda usia 4-7 tahun. Melatih motorik halus, membaca suku kata lancar, menulis rapi, dan berhitung dasar penjumlahan serta pengurangan dengan media lagu dan flashcard edukatif.',
      badge: 'CALISTUNG & MOTORIK TK/PAUD',
    },
  }[selectedGrade];

  return (
    <div className="space-y-14 sm:space-y-20 pb-20 font-sans">
      {/* ======================================================== */}
      {/* 1. HERO SECTION (MATCHING THE REFERENCE IMAGE EXACTLY) */}
      {/* ======================================================== */}
      <section className="relative bg-white pt-4 pb-8 sm:py-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT COLUMN: HEADLINE, SUBHEADLINE & DESCRIPTION */}
            <div className="lg:col-span-7 space-y-4 text-left">
              {/* Grade Selector Switcher */}
              <div className="flex flex-wrap items-center gap-1.5 pb-1">
                {[
                  { id: 'sd', label: 'Bimbel SD' },
                  { id: 'smp', label: 'Bimbel SMP' },
                  { id: 'sma', label: 'Bimbel SMA & SNBT' },
                  { id: 'tk', label: 'TK Calistung' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedGrade(item.id as HeroGradeLevel)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      selectedGrade === item.id
                        ? 'bg-[#0047BA] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Big Bold Headline in Deep Royal Blue */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[46px] font-black text-[#0047BA] leading-[1.18] tracking-tight">
                {gradeHeroContent.headline}
              </h1>

              {/* Sub-headline in Dark Slate/Black */}
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {gradeHeroContent.subhead}
              </h2>

              {/* Descriptive Body Paragraph */}
              <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed max-w-2xl font-normal">
                {gradeHeroContent.description}
              </p>

              {/* Call-to-action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3.5">
                {/* Orange Pill Button from Reference Image */}
                <button
                  onClick={() => onNavigateTab('register')}
                  className="bg-[#EB5E00] hover:bg-[#D35400] text-white font-extrabold px-8 py-3.5 rounded-full text-base shadow-md transition-all active:scale-95 hover:shadow-lg"
                >
                  Daftar Sekarang
                </button>

                {/* Secondary WhatsApp consultation button */}
                <button
                  onClick={() => handleConsultWhatsApp(gradeHeroContent.badge)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-full text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-200" />
                  <span>Konsultasi WA Gratis</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-semibold border-t border-slate-100">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Kurikulum Merdeka &amp; K13
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Guru Datang ke Rumah
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Rapor Sesi &amp; Sertifikat Resmi
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: HERO GRAPHIC MATCHING REFERENCE IMAGE */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-full max-w-[500px]">
                {/* Featured Cropped Illustration from Reference Image */}
                <div className="relative rounded-2xl overflow-hidden flex items-center justify-center">
                  <img
                    src="/assets/aistudio/hero_student_illustration.png"
                    alt="Bimbel SD Online dan Privat Ke Rumah"
                    className="w-full h-auto object-contain select-none"
                    onError={(e) => {
                      // Fallback SVG graphic if image path differs
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                {/* Overlapping Badge for live credibility */}
                <div className="absolute -bottom-4 left-6 bg-white py-2.5 px-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black">
                    ⭐
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">
                      98% Tingkat Kepuasan Siswa
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Nilai Rapor Naik Signifikan
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. PILAR KEUNGGULAN BIMBEL DME */}
      {/* ======================================================== */}
      <section className="bg-slate-50 py-12 rounded-3xl border border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-[#0047BA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Mengapa Memilih Kami?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
              Metode Belajar Terpercaya Les Privat Keluarga Indonesia
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Kombinasi pendampingan personal, kurikulum fleksibel, dan pelaporan capaian belajar yang transparan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <MapPin className="w-6 h-6 text-orange-600" />,
                title: 'Guru Datang Ke Rumah',
                desc: 'Tutor profesional datang langsung ke kediaman Anda. Hemat waktu perjalanan, ananda belajar aman dan nyaman.',
                bg: 'bg-orange-50 border-orange-200',
              },
              {
                icon: <Laptop className="w-6 h-6 text-blue-600" />,
                title: 'Daring Interaktif 1-on-1',
                desc: 'Pilihan kelas online tatap muka interaktif dengan papan tulis digital canggih dan rekaman materi lengkap.',
                bg: 'bg-blue-50 border-blue-200',
              },
              {
                icon: <FileText className="w-6 h-6 text-emerald-600" />,
                title: 'Rapor Sesi Transparan',
                desc: 'Setiap selesai belajar, pengajar menerbitkan lembar laporan evaluasi berkala langsung ke WhatsApp orang tua.',
                bg: 'bg-emerald-50 border-emerald-200',
              },
              {
                icon: <Award className="w-6 h-6 text-amber-600" />,
                title: 'Sertifikat Kompetensi',
                desc: 'Sertifikat resmi kelulusan modul & penghargaan belajar yang dapat diunduh dalam format PDF A4 & gambar HD.',
                bg: 'bg-amber-50 border-amber-200',
              },
            ].map((pilar, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all space-y-3"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${pilar.bg}`}>
                  {pilar.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {pilar.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pilar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. PROGRAM & LAYANAN UNGGULAN (TK s.d SMA) */}
      {/* ======================================================== */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#EB5E00]">
              Pilihan Program
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Program Kursus &amp; Les Privat Unggulan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Dirancang sesuai tahap perkembangan anak dengan pendampingan intensif pengajar berpengalaman.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('packages')}
            className="text-xs font-bold text-[#0047BA] hover:text-blue-800 flex items-center gap-1 shrink-0 group"
          >
            <span>Lihat Semua 6 Paket Kursus</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSE_PACKAGES.slice(0, 3).map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-slate-200 hover:border-orange-400 p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#EB5E00] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                    {pkg.level}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {pkg.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-[#0047BA] transition-colors">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {pkg.tagline}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-700 mb-2">
                    Mata Pelajaran:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {pkg.subjects.map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  {pkg.features.slice(0, 3).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Investasi Les:</span>
                  <div className="text-right">
                    <span className="text-base font-black text-[#EB5E00]">
                      Rp {pkg.pricePerSession.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-400 block">/ sesi 90 menit</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onNavigateTab('register')}
                    className="w-full py-2.5 bg-[#0047BA] hover:bg-[#003896] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
                  >
                    Daftar Sekarang
                  </button>
                  <button
                    onClick={() => handleConsultWhatsApp(pkg.name)}
                    className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl transition-all"
                  >
                    Tanya WA
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. TRANSPARANSI EVALUASI & SERTIFIKAT SISWA */}
      {/* ======================================================== */}
      <section className="bg-gradient-to-r from-[#0047BA] to-blue-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Layanan Eksklusif Orang Tua
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Cek Rapor Sesi &amp; Sertifikat Belajar Anak Secara Online
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-xl">
              Ayah &amp; Bunda dapat memantau setiap perkembangan belajar ananda secara transparan. Mulai dari catatan evaluasi guru per pertemuan hingga sertifikat kelulusan kompetensi resmi yang bisa langsung diunduh dalam format PDF 1-halaman A4.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('student-report')}
                className="bg-[#EB5E00] hover:bg-[#D35400] text-white font-extrabold px-6 py-3 rounded-full text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                Cek Rapor &amp; Sertifikat Online
              </button>
              <button
                onClick={() => onNavigateTab('calculator')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-full text-xs sm:text-sm border border-white/30 transition-all"
              >
                Simulasi Biaya Les
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="bg-white text-slate-800 p-5 rounded-2xl shadow-2xl max-w-xs w-full space-y-3 border-2 border-amber-300">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                  DME/CERT/2026/XI
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">Terverifikasi ✓</span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Sertifikat Resmi</div>
                <div className="text-sm font-black text-slate-900 font-serif-brand">Syifa Azzarqaa</div>
                <div className="text-[11px] text-[#0047BA] font-semibold">Matematika &amp; Sains SD</div>
              </div>
              <div className="text-[10px] text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-200">
                "Telah tuntas menguasai konsep pecahan, aljabar dasar, dan penalaran logis."
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 pt-1">
                <span>Predikat: Sangat Memuaskan</span>
                <span className="text-orange-600">Skor: 94/100</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. TESTIMONI ORANG TUA SISWA */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-[#EB5E00]">
            Ulasan Wali Murid
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Apa Kata Ayah &amp; Bunda?
          </h2>
          <p className="text-xs text-slate-500">
            Pengalaman nyata keluarga Indonesia belajar bersama tim tutor Dessa Mentari Education.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              nama: 'Ibu Ratna Dewi',
              anak: 'Bunda dari Althaf (Kelas 5 SD)',
              testi: 'Alhamdulillah sejak ikut les privat SD di Bimbel DME, nilai ulangan Matematika dan IPA ananda meningkat drastis dari 65 jadi 92. Tutornya sangat sabar dan laporannya transparan tiap sesi.',
              rating: 5,
            },
            {
              nama: 'Bapak Hendra Wijaya',
              anak: 'Ayah dari Clarissa (TK B Calistung)',
              testi: 'Sebelumnya Clarissa susah diajak belajar membaca. Guru privat dari DME sangat ramah dan memakai metode menyanyi. Sekarang anak saya sudah lancar membaca buku cerita sendiri!',
              rating: 5,
            },
            {
              nama: 'Ibu Maya Sabrina',
              anak: 'Bunda dari Kevin (Kelas 12 SMA)',
              testi: 'Sangat terbantu untuk persiapan ujian sekolah dan SNBT. Latihan soal TPS terstruktur dan tips cara cepatnya sangat mudah dipahami. Terima kasih Dessa Mentari!',
              rating: 5,
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed italic">
                "{t.testi}"
              </p>
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-black text-slate-900">{t.nama}</div>
                <div className="text-[11px] text-slate-400">{t.anak}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. FLOATING WHATSAPP BUTTON (MATCHING REFERENCE IMAGE) */}
      {/* ======================================================== */}
      <a
        href={`https://wa.me/${(settings.nomorWA || '6281234567890').replace(/[^0-9]/g, '')}?text=Halo%20Admin%20Bimbel%20DME,%20saya%20ingin%20konsultasi%20les%20privat.`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        aria-label="Chat WhatsApp Konsultasi"
        title="Hubungi Admin WhatsApp"
      >
        <MessageCircle className="w-8 h-8 fill-white text-white" />
        <span className="absolute right-16 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
          Konsultasi WhatsApp Sekarang
        </span>
      </a>
    </div>
  );
};

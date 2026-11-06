import { jsPDF } from 'jspdf';
import { CertificateData, EducationLevel } from '../types/report';
import { captureElementToCanvas } from './exportPdf';

/**
 * Builds a clean filename for certificate export.
 * Example: Sertifikat_Matematika_Syifa_Azzarqaa_2026
 */
export function buildCertificateFilename(cert: CertificateData, extension?: string): string {
  const student = (cert.namaSiswa || 'Siswa')
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_');

  const subject = (cert.mataPelajaran || 'Kompetensi')
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_');

  const year = cert.tanggalTerbit ? cert.tanggalTerbit.slice(0, 4) : '2026';

  const base = `Sertifikat_${subject}_${student}_${year}`;
  return extension ? `${base}.${extension}` : base;
}

/**
 * Generates an official, sequential-like certificate number.
 * Example: DME/CERT/2026/XI/0048
 */
export function generateCertificateNumber(index = 1): string {
  const now = new Date();
  const year = now.getFullYear();
  const monthRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][now.getMonth()];
  const padded = String(index).padStart(4, '0');
  return `DME/CERT/${year}/${monthRoman}/${padded}`;
}

export interface SubjectPreset {
  subjectKey: string;
  displaySubject: string;
  defaultTitle: string;
  defaultPredicate: string;
  defaultScore: number;
  descriptionTemplate: (studentName: string, jenjang?: string) => string;
  category: 'Dasar' | 'Eksakta' | 'Bahasa' | 'Keagamaan' | 'Teknologi' | 'Umum';
}

/**
 * Rich predefined competency profiles mapped to each course/subject.
 */
export const SUBJECT_PRESETS: Record<string, SubjectPreset> = {
  'Calistung / Cisritung': {
    subjectKey: 'Calistung / Cisritung',
    displaySubject: 'Calistung Ceria & Motorik Anak',
    defaultTitle: 'Sertifikat Kelulusan Membaca & Berhitung Ceria',
    defaultPredicate: 'Sangat Memuaskan (A)',
    defaultScore: 95,
    category: 'Dasar',
    descriptionTemplate: (name, jenjang) =>
      `Diberikan kepada Ananda ${name || 'Siswa'} atas keberhasilannya menyelesaikan seluruh modul Program Calistung & Motorik Ceria dengan predikat istimewa. Ananda telah menunjukkan kemandirian luar biasa dalam membaca lancar suku kata dan kalimat sederhana, kerapian menulis huruf abjad serta angka, dan kecakapan berhitung dasar penjumlahan serta pengurangan 1-100 secara antusias.`
  },
  'Matematika': {
    subjectKey: 'Matematika',
    displaySubject: 'Matematika Dasar & Penalaran Logika',
    defaultTitle: 'Sertifikat Penguasaan Konsep & Penalaran Matematika',
    defaultPredicate: 'Lulus dengan Pujian (Honors)',
    defaultScore: 92,
    category: 'Eksakta',
    descriptionTemplate: (name, jenjang) =>
      `Diberikan kepada Ananda ${name || 'Siswa'} atas dedikasi dan penguasaan komprehensif pada bidang studi Matematika jenjang ${jenjang || 'Sekolah'}. Telah tuntas menguasai konsep operasi hitung bilangan, geometri, aljabar, pengolahan data, serta kecakapan bernalar logis dalam memecahkan masalah kontekstual (Problem Solving) secara kritis, kreatif, dan mandiri.`
  },
  'IPA': {
    subjectKey: 'IPA',
    displaySubject: 'Ilmu Pengetahuan Alam (IPA Sains)',
    defaultTitle: 'Sertifikat Keunggulan Sains & Eksplorasi Inkuiri',
    defaultPredicate: 'Sangat Memuaskan (A)',
    defaultScore: 90,
    category: 'Eksakta',
    descriptionTemplate: (name, jenjang) =>
      `Diberikan kepada Ananda ${name || 'Siswa'} atas pencapaian luar biasa dalam menuntaskan modul Ilmu Pengetahuan Alam (IPA). Ananda telah menguasai konsep-konsep sains fundamental mengenai makhluk hidup, energi, materi, serta tata surya dengan kemampuan observasi saintifik, inkuiri kritis, dan kecintaan pada eksplorasi ilmu pengetahuan.`
  },
  'IPAS (Ilmu Pengetahuan Alam & Sosial)': {
    subjectKey: 'IPAS (Ilmu Pengetahuan Alam & Sosial)',
    displaySubject: 'IPAS (Ilmu Pengetahuan Alam & Sosial)',
    defaultTitle: 'Sertifikat Ketuntasan Pembelajaran IPAS Terpadu',
    defaultPredicate: 'Sangat Memuaskan (A)',
    defaultScore: 91,
    category: 'Eksakta',
    descriptionTemplate: (name, jenjang) =>
      `Diberikan kepada Ananda ${name || 'Siswa'} atas keberhasilannya menguasai materi IPAS Terpadu jenjang ${jenjang || 'SD/SMP'}. Mencakup pemahaman gejala alam, keanekaragaman hayati, interaksi lingkungan sosial-budaya masyarakat, dan pelestarian kearifan lokal dengan sikap ilmiah dan kepedulian lingkungan yang tinggi.`
  },
  'Bahasa Inggris': {
    subjectKey: 'Bahasa Inggris',
    displaySubject: 'English Language & Active Communication',
    defaultTitle: 'Certificate of English Fluency & Communication',
    defaultPredicate: 'Distinction with Honors',
    defaultScore: 94,
    category: 'Bahasa',
    descriptionTemplate: (name) =>
      `Proudly presented to ${name || 'the student'} for demonstrating outstanding dedication and mastering core English proficiency skills, including active daily conversation, listening comprehension, essential grammar mastery, and rich vocabulary expansion with remarkable confidence and pronunciation.`
  },
  'Fisika': {
    subjectKey: 'Fisika',
    displaySubject: 'Fisika Eksakta & Analisis Fisis',
    defaultTitle: 'Sertifikat Penguasaan Konsep & Analisis Fisika',
    defaultPredicate: 'Sangat Memuaskan (A)',
    defaultScore: 90,
    category: 'Eksakta',
    descriptionTemplate: (name, jenjang) =>
      `Diberikan kepada Ananda ${name || 'Siswa'} atas penguasaan mendalam materi Fisika jenjang ${jenjang || 'SMP/SMA'}. Telah menuntaskan pemahaman konsep mekanika gerak, hukum Newton, fluida, termodinamika, dan listrik-magnet dengan ketajaman kalkulasi matematis serta daya analisis fisis yang teruji.`
  },
  'Kimia': {
    subjectKey: 'Kimia',
    displaySubject: 'Kimia Terapan & Reaksi Materi',
    defaultTitle: 'Sertifikat Kompetensi Pemahaman Konsep Kimia',
    defaultPredicate: 'Sangat Memuaskan (A)',
    defaultScore: 89,
    category: 'Eksakta',
    descriptionTemplate: (name, jenjang) =>
      `Diberikan kepada Ananda ${name || 'Siswa'} atas ketuntasan pembelajaran bidang studi Kimia. Mencakup pemahaman struktur atom, sistem periodik unsur, ikatan kimia, stoikiometri, kinetika reaksi, dan larutan asam-basa dengan pemahaman konseptual yang kokoh dan daya nalar ilmiah yang unggul.`
  },
  'Biologi': {
    subjectKey: 'Biologi',
    displaySubject: 'Biologi & Ilmu Hayati Terpadu',
    defaultTitle: 'Sertifikat Keunggulan Ilmu Hayati & Biologi',
    defaultPredicate: 'Sangat Memuaskan (A)',
    defaultScore: 92,
    category: 'Eksakta',
    descriptionTemplate: (name, jenjang) =>
      `Diberikan kepada Ananda ${name || 'Siswa'} atas keberhasilan menguasai materi Biologi dan Ilmu Hayati. Menunjukkan kompetensi istimewa dalam memahami organisasi kehidupan, struktur sel dan jaringan, genetika molekuler, fisiologi sistem tubuh, dan ekologi lingkungan hidup.`
  },
  'Bahasa Indonesia': {
    subjectKey: 'Bahasa Indonesia',
    displaySubject: 'Bahasa Indonesia & Literasi Menulis Kritis',
    defaultTitle: 'Sertifikat Literasi Berbahasa & Komunikasi Efektif',
    defaultPredicate: 'Sangat Memuaskan (A)',
    defaultScore: 93,
    category: 'Bahasa',
    descriptionTemplate: (name) =>
      `Diberikan kepada Ananda ${name || 'Siswa'} atas kecakapan dan ketuntasan dalam pembelajaran Bahasa Indonesia. Memiliki keterampilan unggul dalam membaca pemahaman teks kompleks, menulis karangan terstruktur sesuai kaidah tata bahasa, serta berkomunikasi secara santun dan persuasif.`
  },
  'IPS': {
    subjectKey: 'IPS',
    displaySubject: 'Ilmu Pengetahuan Sosial (IPS)',
    defaultTitle: 'Sertifikat Pemahaman Sosial & Sejarah Terpadu',
    defaultPredicate: 'Memuaskan (A-)',
    defaultScore: 88,
    category: 'Umum',
    descriptionTemplate: (name) =>
      `Diberikan kepada Ananda ${name || 'Siswa'} atas keberhasilan menuntaskan materi Ilmu Pengetahuan Sosial, mencakup pemahaman dinamika keruangan geografis, kronologi sejarah bangsa, interaksi ekonomi, dan keteraturan sosial masyarakat secara berwawasan luas.`
  },
  'PPKn': {
    subjectKey: 'PPKn',
    displaySubject: 'Pendidikan Pancasila & Kewarganegaraan',
    defaultTitle: 'Sertifikat Karakter Pancasila & Kepemimpinan',
    defaultPredicate: 'Sangat Memuaskan (A)',
    defaultScore: 95,
    category: 'Umum',
    descriptionTemplate: (name) =>
      `Diberikan kepada Ananda ${name || 'Siswa'} atas pengamalan nilai-nilai luhur Pancasila, pemahaman konstitusi, etika kebangsaan, dan penumbuhan karakter kepemimpinan yang berakhlak mulia serta berbudi pekerti luhur.`
  },
  'TIK / Komputer': {
    subjectKey: 'TIK / Komputer',
    displaySubject: 'Teknologi Informasi & Literasi Komputer',
    defaultTitle: 'Sertifikat Keterampilan Komputer & Digital Literacy',
    defaultPredicate: 'Sangat Memuaskan (A)',
    defaultScore: 93,
    category: 'Teknologi',
    descriptionTemplate: (name) =>
      `Diberikan kepada Ananda ${name || 'Siswa'} atas kelulusan pada program Literasi Digital & Komputer Dasar. Telah menguasai pengoperasian komputer, aplikasi perkantoran (olah dokumen & angka), pencarian informasi aman berbasis internet, serta logika komputasi awal.`
  },
  'Tahsin & Al-Qur\'an': {
    subjectKey: 'Tahsin & Al-Qur\'an',
    displaySubject: 'Tahsin, Tajwid & Tilawah Al-Qur\'an',
    defaultTitle: 'Sertifikat Kelulusan Tahsin & Tilawah Al-Qur\'an',
    defaultPredicate: 'Mumtaz (Istimewa)',
    defaultScore: 96,
    category: 'Keagamaan',
    descriptionTemplate: (name) =>
      `Diberikan kepada Ananda ${name || 'Siswa'} atas ketekunan dan keberhasilannya menyelesaikan bimbingan Tahsin dan Tartil Al-Qur'an. Ananda telah menguasai makharijul huruf dengan fasih, hukum-hukum tajwid dasar, kelancaran membaca Al-Qur'an secara tartil, dan hafalan surat-surat pilihan Juz 'Amma.`
  },
  'Persiapan SNBT / UTBK': {
    subjectKey: 'Persiapan SNBT / UTBK',
    displaySubject: 'Intensif Sukses SNBT & Tes Skolastik',
    defaultTitle: 'Sertifikat Ketuntasan Program Intensif SNBT & TPS',
    defaultPredicate: 'Lulus dengan Pujian (Honors)',
    defaultScore: 91,
    category: 'Eksakta',
    descriptionTemplate: (name) =>
      `Diberikan kepada Ananda ${name || 'Siswa'} atas partisipasi aktif dan penguasaan subtes Kemampuan Skolastik (TPS), Literasi Bahasa Indonesia, Literasi Bahasa Inggris, dan Penalaran Matematika dalam Program Intensif Sukses SNBT / Masuk Perguruan Tinggi Negeri.`
  }
};

/**
 * Resolves preset for any given subject string, with fuzzy matching and fallback.
 */
export function getCertificatePresetForSubject(
  rawSubject: string,
  studentName = '',
  jenjang: EducationLevel = 'SD'
): {
  title: string;
  predicate: string;
  score: number;
  description: string;
} {
  const clean = (rawSubject || '').trim();

  // 1. Direct match
  if (SUBJECT_PRESETS[clean]) {
    const item = SUBJECT_PRESETS[clean];
    return {
      title: item.defaultTitle,
      predicate: item.defaultPredicate,
      score: item.defaultScore,
      description: item.descriptionTemplate(studentName, jenjang)
    };
  }

  // 2. Fuzzy match
  const lower = clean.toLowerCase();
  for (const [key, item] of Object.entries(SUBJECT_PRESETS)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return {
        title: item.defaultTitle,
        predicate: item.defaultPredicate,
        score: item.defaultScore,
        description: item.descriptionTemplate(studentName, jenjang)
      };
    }
  }

  // Special keywords
  if (lower.includes('calis') || lower.includes('baca') || lower.includes('tk') || lower.includes('paud')) {
    const p = SUBJECT_PRESETS['Calistung / Cisritung'];
    return { title: p.defaultTitle, predicate: p.defaultPredicate, score: p.defaultScore, description: p.descriptionTemplate(studentName, jenjang) };
  }
  if (lower.includes('inggris') || lower.includes('english')) {
    const p = SUBJECT_PRESETS['Bahasa Inggris'];
    return { title: p.defaultTitle, predicate: p.defaultPredicate, score: p.defaultScore, description: p.descriptionTemplate(studentName, jenjang) };
  }
  if (lower.includes('quran') || lower.includes('ngaji') || lower.includes('tahsin') || lower.includes('agama')) {
    const p = SUBJECT_PRESETS['Tahsin & Al-Qur\'an'];
    return { title: p.defaultTitle, predicate: p.defaultPredicate, score: p.defaultScore, description: p.descriptionTemplate(studentName, jenjang) };
  }
  if (lower.includes('mat')) {
    const p = SUBJECT_PRESETS['Matematika'];
    return { title: p.defaultTitle, predicate: p.defaultPredicate, score: p.defaultScore, description: p.descriptionTemplate(studentName, jenjang) };
  }

  // 3. Elegant default fallback
  return {
    title: `Sertifikat Pencapaian Kompetensi ${clean || 'Pembelajaran'}`,
    predicate: 'Sangat Memuaskan (A)',
    score: 90,
    description: `Diberikan kepada Ananda ${studentName || 'Siswa'} atas partisipasi luar biasa, ketekunan, dan penguasaan kompetensi pada bidang studi ${clean || 'Pembelajaran'} jenjang ${jenjang}. Ananda telah menunjukkan peningkatan kemampuan kognitif, kedisiplinan belajar, dan karakter positif yang membanggakan.`
  };
}

/**
 * Downloads the certificate container as an exact A4 Landscape (297 x 210 mm) PDF.
 */
export async function downloadCertificateAsPdf(
  elementId: string,
  cert: CertificateData
): Promise<{ success: boolean; filename: string; error?: string }> {
  const filename = buildCertificateFilename(cert, 'pdf');

  try {
    const canvas = await captureElementToCanvas(elementId, '#ffffff');
    if (!canvas) {
      window.print();
      return { success: true, filename };
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Landscape A4: 297mm width, 210mm height
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth(); // 297 mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 210 mm

    const margin = 5; // 5mm clean border margin
    const maxContentWidth = pageWidth - margin * 2; // 287 mm
    const maxContentHeight = pageHeight - margin * 2; // 200 mm

    const naturalHeight = (canvas.height * maxContentWidth) / canvas.width;

    let finalWidth = maxContentWidth;
    let finalHeight = naturalHeight;

    if (finalHeight > maxContentHeight) {
      const scaleFactor = maxContentHeight / finalHeight;
      finalHeight = maxContentHeight;
      finalWidth = maxContentWidth * scaleFactor;
    }

    const xOffset = margin + (maxContentWidth - finalWidth) / 2;
    const yOffset = margin + (maxContentHeight - finalHeight) / 2;

    pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'FAST');
    pdf.save(filename);
    return { success: true, filename };
  } catch (err) {
    console.error('Error generating landscape certificate PDF:', err);
    try {
      window.print();
      return { success: true, filename };
    } catch {
      return { success: false, filename, error: String(err) };
    }
  }
}

/**
 * Downloads the certificate container as an HD JPG or PNG image.
 */
export async function downloadCertificateAsImage(
  elementId: string,
  cert: CertificateData,
  format: 'jpg' | 'png' = 'jpg'
): Promise<{ success: boolean; filename: string; url?: string; error?: string }> {
  const filename = buildCertificateFilename(cert, format);
  const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
  const quality = format === 'jpg' ? 0.96 : undefined;

  try {
    const canvas = await captureElementToCanvas(elementId, '#ffffff');
    if (!canvas) {
      return { success: false, filename, error: 'Gagal mengambil tampilan kanvas sertifikat.' };
    }

    const dataUrl = canvas.toDataURL(mimeType, quality);
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (link.parentNode) link.parentNode.removeChild(link);
    }, 1000);

    return { success: true, filename, url: dataUrl };
  } catch (err) {
    console.error('Error generating certificate image:', err);
    return { success: false, filename, error: String(err) };
  }
}

/**
 * Builds a congratulations WhatsApp message ready to be sent to parents.
 */
export function generateCertificateWhatsAppText(cert: CertificateData): string {
  const dateFormatted = new Date(cert.tanggalTerbit).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `🎓 *SELAMAT! SERTIFIKAT KELULUSAN & PENGHARGAAN BELAJAR*
*DESSA MENTARI EDUCATION*
✨ *Tempat Belajar Terpercaya · Les Privat Keluarga Indonesia*
================================

Kepada Yth. Bapak/Ibu Orang Tua dari Ananda *${cert.namaSiswa}*,

Dengan penuh rasa bangga dan apresiasi, kami menyampaikan bahwa Ananda telah berhasil menyelesaikan evaluasi dan meraih penghargaan resmi:

📜 *No. Sertifikat:* ${cert.certificateNumber}
👤 *Nama Siswa:* ${cert.namaSiswa} ${cert.kelasGrade ? `(${cert.kelasGrade})` : ''}
📚 *Mata Pelajaran:* ${cert.mataPelajaran}
⭐ *Predikat Capaian:* ${cert.predikat}
🎯 *Skor Kompetensi:* ${cert.nilaiAkhir || '95'}/100
📅 *Tanggal Terbit:* ${dateFormatted}

📝 *Catatan Capaian Kompetensi:*
"${cert.deskripsiKompetensi}"

👨‍🏫 *Disahkan Oleh:*
• ${cert.namaKepalaLembaga} (${cert.jabatanKepala})
• ${cert.namaTutorPengampu} (${cert.jabatanTutor})

================================
Berkas sertifikat resmi (PDF & Gambar HD) telah diterbitkan dan dapat diunduh untuk portofolio prestasi Ananda. Terima kasih atas kepercayaan Ayah/Bunda kepada Dessa Mentari Education! 🌟`;
}

import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

// Initialize Gemini SDK server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API endpoint to generate polished student evaluations using Gemini AI
app.post('/api/generate-eval', async (req, res) => {
  try {
    const { namaSiswa, jenjang, mataPelajaran, materi, draftEvaluasi, catatanOrangTua } = req.body;

    if (!namaSiswa || !mataPelajaran) {
      return res.status(400).json({ error: 'Nama siswa dan mata pelajaran diperlukan.' });
    }

    const prompt = `Anda adalah asisten AI resmi dari lembaga les privat "Dessa Mentari Education".
Tugas Anda adalah membuat 3 komponen laporan pembelajaran yang santun, profesional, dan memotivasi orang tua:

1. evaluasiSiswa: Catatan perkembangan, keaktifan, dan tingkat pemahaman siswa (2-3 kalimat hangat & apresiatif).
2. tugasRumah: Rekomendasi PR/tugas rumah yang konkret & sesuai materi yang dipelajari (1-2 kalimat).
3. catatanOrangTua: Pesan khusus/himbauan ringan untuk orang tua di rumah agar mendampingi ananda (1-2 kalimat).

Detail Pembelajaran:
- Nama Siswa: ${namaSiswa}
- Jenjang Pendidikan: ${jenjang || 'SD'}
- Mata Pelajaran: ${mataPelajaran}
- Materi Hari Ini: ${materi || 'Materi pelajaran reguler'}
- Poin Guru/Catatan: ${draftEvaluasi || 'Siswa mengikuti les dengan baik dan memahami materi dasar.'}
${catatanOrangTua ? `- Catatan Orangtua Tambahan: ${catatanOrangTua}` : ''}

Output dalam format JSON valid tanpa tanda markdown tambahan:
{
  "evaluasiSiswa": "...",
  "tugasRumah": "...",
  "catatanOrangTua": "..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const resultText = response.text ? response.text.trim() : '{}';
    const parsedJSON = JSON.parse(resultText);

    return res.json({
      evaluationText: parsedJSON.evaluasiSiswa || '',
      evaluasiSiswa: parsedJSON.evaluasiSiswa || '',
      tugasRumah: parsedJSON.tugasRumah || '',
      catatanOrangTua: parsedJSON.catatanOrangTua || ''
    });
  } catch (error: any) {
    console.error('Error generating AI evaluation:', error);
    return res.status(500).json({
      error: 'Gagal menyusun evaluasi otomatis dari AI.',
      details: error?.message || 'Terjadi kesalahan pada server.',
    });
  }
});

// API endpoint for AI Video Studio processing (Auto Subtitles, Highlight Analysis, Enhancement Suggestions)
app.post('/api/video-ai', async (req, res) => {
  try {
    const { namaSiswa, mataPelajaran, materi, videoDuration, transcriptText } = req.body;

    const prompt = `Anda adalah sistem "AI Video Studio" dari lembaga les privat "Dessa Mentari Education".
Tugas Anda adalah memproses data dokumentasi video pembelajaran dan menghasilkan:
1. Subtitle otomatis berstempel waktu (timestamps) dalam Bahasa Indonesia yang rapi, menarik, dan ramah untuk orang tua.
2. Momen Highlight penting (misal 00:05 - "Ananda berhasil menjawab soal pecahan", 00:15 - "Praktek membaca kosa kata").
3. Rekomendasi Peningkatan AI (Kualitas Vokal, Pencahayaan, dan Stabilisasi).

Data Pembelajaran:
- Siswa: ${namaSiswa || 'Siswa'}
- Mata Pelajaran: ${mataPelajaran || 'Umum'}
- Topik Pembelajaran: ${materi || 'Sesi Belajar Privat'}
- Durasi Video: ${videoDuration || '30 detik'}
${transcriptText ? `- Teks Catatan Suara: ${transcriptText}` : ''}

Berikan respons JSON valid dengan struktur berikut:
{
  "subtitles": [
    {"start": "00:01", "end": "00:05", "text": "Halo Ibu/Bapak, ini dokumentasi belajar ananda ${namaSiswa || 'Siswa'} hari ini."},
    {"start": "00:06", "end": "00:12", "text": "Ananda sedang berlatih ${materi || 'materi pelajaran'} dengan sangat antusias."},
    {"start": "00:13", "end": "00:20", "text": "Alhamdulillah, ananda berhasil menyelesaikan latihan soal dengan mandiri!"}
  ],
  "highlights": [
    {"time": "00:02", "title": "Pembukaan & Pemanasan Soal"},
    {"time": "00:10", "title": "Momen Keberhasilan Menjawab Soal"},
    {"time": "00:18", "title": "Apresiasi & Refleksi Belajar"}
  ],
  "enhancementPreset": {
    "audioNoiseReduction": "95%",
    "lightingBoost": "+15%",
    "colorGrading": "Mentari Vivid Learning",
    "stabilizationScore": "Optimum"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    const resultText = response.text ? response.text.trim() : '{}';
    const parsedData = JSON.parse(resultText);

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error in AI Video Studio processing:', error);
    return res.status(500).json({
      error: 'Gagal memproses AI Video Studio.',
      details: error?.message || 'Terjadi kesalahan pada server.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    
    // Fallback to index.html for SPA routing
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(url, `<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <title>Dessa Mentari Education - Generator Laporan Les Privat</title>
    <meta name="description" content="Aplikasi resmi Dessa Mentari Education: Pembuatan Laporan Pembelajaran Les Privat, Dokumentasi Foto, AI Video Studio, dan Rekapan Sesi Les Privat Keluarga Indonesia." />

    <!-- Open Graph / WhatsApp / Facebook Share Previews with Official Logo -->
    <meta property="og:title" content="Dessa Mentari Education - Les Privat Keluarga Indonesia" />
    <meta property="og:description" content="Portal resmi Laporan Pembelajaran, Dokumentasi Belajar, AI Video Studio, dan Rekapan Sesi Les Privat Keluarga Indonesia." />
    <meta property="og:image" content="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:type" content="website" />

    <!-- Twitter Card Previews -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Dessa Mentari Education - Les Privat Keluarga Indonesia" />
    <meta name="twitter:description" content="Portal resmi Laporan Pembelajaran, Dokumentasi Belajar, AI Video Studio, dan Rekapan Sesi Les Privat Keluarga Indonesia." />
    <meta name="twitter:image" content="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png" />

    <!-- App Favicon & PWA Icons -->
    <link rel="icon" type="image/png" href="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png" />
    <link rel="shortcut icon" href="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png" />
    <link rel="apple-touch-icon" href="/pwa-192x192.png" />
    <link rel="apple-touch-icon" sizes="192x192" href="/pwa-192x192.png" />
    <link rel="apple-touch-icon" sizes="512x512" href="/pwa-512x512.png" />

    <!-- PWA Web App Manifest -->
    <link rel="manifest" href="/manifest.webmanifest" />
    <meta name="theme-color" content="#b45309" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Dessa Mentari" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, () => {
    console.log(`Server Dessa Mentari Education running on port ${PORT}`);
  });
}

startServer();

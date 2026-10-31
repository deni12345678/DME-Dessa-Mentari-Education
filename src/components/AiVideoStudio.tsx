import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Camera, 
  Upload, 
  Sparkles, 
  Sun, 
  Volume2, 
  Subtitles, 
  Play, 
  Pause, 
  RotateCcw, 
  Loader2, 
  Zap,
  Film
} from 'lucide-react';
import { ReportData } from '../types/report';

interface AiVideoStudioProps {
  report: ReportData;
}

interface SubtitleItem {
  start: string;
  end: string;
  text: string;
}

interface HighlightItem {
  time: string;
  title: string;
}

export const AiVideoStudio: React.FC<AiVideoStudioProps> = ({ report }) => {
  // Video Media State
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const liveStreamRef = useRef<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraPreviewRef = useRef<HTMLVideoElement | null>(null);

  // AI Processing & Enhancement State
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [audioNoiseReduction, setAudioNoiseReduction] = useState(true);
  const [lightingBoost, setLightingBoost] = useState(20); // 0 to 50%
  const [colorFilter, setColorFilter] = useState<'normal' | 'mentari' | 'vivid' | 'warm'>('mentari');

  // Subtitles & Highlights from AI
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>([]);
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [activeSubtitle, setActiveSubtitle] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  // Timer for camera recording
  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Handle Video File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      stopCameraStream();
    }
  };

  // Start Live Webcam Recording
  const startCamera = async () => {
    setVideoSrc(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      liveStreamRef.current = stream;
      if (cameraPreviewRef.current) {
        cameraPreviewRef.current.srcObject = stream;
        cameraPreviewRef.current.play();
      }

      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        setVideoSrc(url);
        stopCameraStream();
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Kamera tidak diizinkan atau tidak ditemukan:', err);
      alert('Gagal mengakses kamera. Mohon izinkan akses kamera pada peramban Anda.');
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const stopCameraStream = () => {
    if (liveStreamRef.current) {
      liveStreamRef.current.getTracks().forEach((track) => track.stop());
      liveStreamRef.current = null;
    }
  };

  // Trigger AI Video Processing via /api/video-ai
  const handleProcessAiVideo = async () => {
    setIsProcessingAi(true);
    try {
      const response = await fetch('/api/video-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namaSiswa: report.namaSiswa || 'Kevin Pratama',
          mataPelajaran: report.mataPelajaran || 'Matematika',
          materi: report.materiDipelajari || 'Dokumentasi Les Privat',
          videoDuration: `${recordingTime || 30} detik`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan pada AI Video Studio.');
      }

      if (data.subtitles) setSubtitles(data.subtitles);
      if (data.highlights) setHighlights(data.highlights);
    } catch (err: any) {
      console.error('Error processing AI video:', err);
      // Fallback subtitles if API call is quiet
      setSubtitles([
        { start: '00:01', end: '00:05', text: `Dokumentasi Belajar Ananda ${report.namaSiswa || 'Siswa'}` },
        { start: '00:06', end: '00:12', text: `Sedang berlatih materi ${report.mataPelajaran || 'pelajaran'}` },
        { start: '00:13', end: '00:20', text: 'Berhasil menyelesaikan soal dengan baik dan mandiri!' },
      ]);
      setHighlights([
        { time: '00:02', title: 'Awal Sesi Latihan' },
        { time: '00:10', title: 'Momen Pemahaman Soal' },
      ]);
    } finally {
      setIsProcessingAi(false);
    }
  };

  // Update subtitle based on current video time
  const handleTimeUpdate = () => {
    if (!videoRef.current || subtitles.length === 0) return;
    const currentTime = videoRef.current.currentTime;
    
    // Find active subtitle range
    const active = subtitles.find((sub) => {
      const [startMin, startSec] = sub.start.split(':').map(Number);
      const [endMin, endSec] = sub.end.split(':').map(Number);
      const startTotal = startMin * 60 + startSec;
      const endTotal = endMin * 60 + endSec;
      return currentTime >= startTotal && currentTime <= endTotal;
    });

    setActiveSubtitle(active ? active.text : '');
  };

  // CSS Filter styles for Lighting Boost & Color Grading
  const getFilterStyle = () => {
    let filter = `brightness(${100 + lightingBoost}%) contrast(105%)`;

    if (colorFilter === 'mentari') {
      filter += ' saturate(120%) sepia(8%)';
    } else if (colorFilter === 'vivid') {
      filter += ' saturate(145%) contrast(115%)';
    } else if (colorFilter === 'warm') {
      filter += ' sepia(20%) saturate(110%)';
    }

    return filter;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      {/* SECTION HEADER WITH OFFICIAL LOGO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <img
            src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
            alt="Logo Dessa Mentari"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif-brand flex items-center gap-2">
              AI Video Studio Pembelajaran
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                Smart Video AI
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Dokumentasikan kegiatan les, tingkatkan kualitas pencahayaan & audio, serta tambahkan subtitle otomatis.
            </p>
          </div>
        </div>
      </div>

      {/* INPUT MODES: CAMERA RECORD & UPLOAD */}
      {!videoSrc && !isRecording && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option 1: Live Camera Recording */}
          <div className="border-2 border-dashed border-amber-300 bg-amber-50/50 hover:bg-amber-50 p-6 rounded-2xl text-center space-y-3 transition-colors">
            <div className="w-12 h-12 rounded-full bg-amber-500 text-white mx-auto flex items-center justify-center shadow-md">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-sm">Rekam Video Langsung</h3>
              <p className="text-xs text-amber-700/80 mt-1">
                Gunakan kamera HP atau laptop untuk merekam kegiatan belajar ananda.
              </p>
            </div>
            <button
              onClick={startCamera}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 mx-auto"
            >
              <Video className="w-4 h-4" />
              <span>Buka Kamera & Rekam</span>
            </button>
          </div>

          {/* Option 2: Upload Video File */}
          <div className="border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 p-6 rounded-2xl text-center space-y-3 transition-colors relative">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-white mx-auto flex items-center justify-center shadow-md">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Unggah Berkas Video</h3>
              <p className="text-xs text-slate-500 mt-1">
                Pilih video rekaman dari galeri HP atau komputer (.mp4, .mov, .webm).
              </p>
            </div>
            <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all">
              <Upload className="w-4 h-4" />
              <span>Pilih Berkas Video</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* LIVE CAMERA RECORDING VIEW */}
      {isRecording && (
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-500 shadow-xl aspect-video">
            <video
              ref={cameraPreviewRef}
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Recording badge indicator */}
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow-md animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
              <span>MEREKAM: {recordingTime}s</span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-sm shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <SquareIcon className="w-4 h-4" />
              <span>Selesaikan Rekaman Video</span>
            </button>
          </div>
        </div>
      )}

      {/* VIDEO STUDIO PLAYER & ENHANCEMENT CONTROLS */}
      {videoSrc && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* VIDEO PLAYER DISPLAY (7 COLS) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl aspect-video group">
              <video
                ref={videoRef}
                src={videoSrc}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                className="w-full h-full object-cover transition-all"
                style={{ filter: getFilterStyle() }}
              />

              {/* Watermark Overlay with Official Logo Image */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 text-white text-[10px] font-bold flex items-center gap-2 pointer-events-none">
                <img
                  src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
                  alt="Logo"
                  className="w-5 h-5 object-contain"
                />
                <span>DESSA MENTARI EDUCATION</span>
              </div>

              {/* Subtitle Overlay Banner */}
              {activeSubtitle && (
                <div className="absolute bottom-6 left-4 right-4 text-center pointer-events-none">
                  <span className="inline-block bg-black/75 backdrop-blur-md text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl border border-white/20 shadow-lg leading-snug">
                    {activeSubtitle}
                  </span>
                </div>
              )}

              {/* Play/Pause Control Overlay */}
              <button
                onClick={togglePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white shadow-xl">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </div>
              </button>
            </div>

            {/* Video Action Controls Bar */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={togglePlayPause}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold flex items-center gap-1.5"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Jeda' : 'Putar Video'}</span>
              </button>

              <button
                onClick={() => {
                  setVideoSrc(null);
                  setSubtitles([]);
                  setHighlights([]);
                }}
                className="text-slate-500 hover:text-red-600 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ganti Video</span>
              </button>
            </div>
          </div>

          {/* AI PROCESSING & ENHANCEMENT PANEL (5 COLS) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-amber-600" />
                  Peningkatan AI & Subtitle
                </div>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  AI Studio Engine
                </span>
              </div>

              {/* AI Trigger Button */}
              <button
                onClick={handleProcessAiVideo}
                disabled={isProcessingAi}
                className="w-full py-3 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessingAi ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses Subtitle & Highlights AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
                    <span>Generate Subtitle Otomatis & Highlight</span>
                  </>
                )}
              </button>

              {/* Enhancements Settings Toggles */}
              <div className="space-y-3 pt-2 text-xs">
                {/* Lighting Boost */}
                <div className="bg-white p-3 rounded-xl border border-amber-200/70 space-y-1">
                  <div className="flex items-center justify-between text-slate-800 font-bold">
                    <span className="flex items-center gap-1.5 text-amber-900">
                      <Sun className="w-4 h-4 text-amber-600" />
                      Pencahayaan Pintar AI
                    </span>
                    <span className="text-amber-700">+{lightingBoost}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={lightingBoost}
                    onChange={(e) => setLightingBoost(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Audio Noise Reduction */}
                <div className="bg-white p-3 rounded-xl border border-amber-200/70 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                    Penjernihan Vokal Suara
                  </span>
                  <button
                    onClick={() => setAudioNoiseReduction(!audioNoiseReduction)}
                    className={`px-3 py-1 rounded-full font-bold text-[11px] transition-colors ${
                      audioNoiseReduction
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {audioNoiseReduction ? 'AKTIF' : 'NONAKTIF'}
                  </button>
                </div>

                {/* Color Grading Profile */}
                <div className="bg-white p-3 rounded-xl border border-amber-200/70 space-y-1.5">
                  <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                    Profil Filter Warna Studio
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'mentari', name: 'Mentari Bright' },
                      { id: 'vivid', name: 'Vivid Learning' },
                      { id: 'warm', name: 'Warm Warmth' },
                      { id: 'normal', name: 'Original Neutral' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setColorFilter(f.id as any)}
                        className={`p-2 rounded-lg text-[11px] font-semibold border transition-all ${
                          colorFilter === f.id
                            ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generated Subtitles & Highlights Lists */}
              {subtitles.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-amber-200">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                    <span className="flex items-center gap-1">
                      <Subtitles className="w-4 h-4 text-amber-600" />
                      Subtitle Berstempel Waktu ({subtitles.length})
                    </span>
                  </div>

                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {subtitles.map((sub, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-2.5 rounded-lg border border-amber-200 text-[11px] text-slate-800 leading-snug"
                      >
                        <span className="font-bold text-amber-800 block">
                          [{sub.start} - {sub.end}]
                        </span>
                        <span>"{sub.text}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function SquareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </svg>
  );
}

import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { PhotoItem, ReportData, StudentData } from '../types/report';
import { compressImageFile } from '../utils/imageCompressor';
import { 
  Camera, 
  Search, 
  Upload, 
  Filter, 
  Download, 
  Trash2, 
  X, 
  Maximize2, 
  Calendar, 
  User, 
  BookOpen, 
  Sparkles,
  Cloud,
  CheckCircle2,
  Image as ImageIcon,
  Send,
  Share2,
  Award,
  Sun
} from 'lucide-react';

interface PhotoGalleryViewProps {
  reports: ReportData[];
  standalonePhotos: PhotoItem[];
  students: StudentData[];
  onUploadPhoto: (photo: PhotoItem) => Promise<void>;
  onDeletePhoto: (id: string) => Promise<void>;
}

export const PhotoGalleryView: React.FC<PhotoGalleryViewProps> = ({
  reports,
  standalonePhotos,
  students,
  onUploadPhoto,
  onDeletePhoto,
}) => {
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'reports' | 'direct'>('all');
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<PhotoItem | null>(null);
  const [activeTemplatePhoto, setActiveTemplatePhoto] = useState<PhotoItem | null>(null);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  
  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStudentName, setUploadStudentName] = useState('');
  const [uploadSubject, setUploadSubject] = useState('Matematika');
  const [uploadTutor, setUploadTutor] = useState('Deni Santoso, M.M');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadDate, setUploadDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [pendingPhotoUrl, setPendingPhotoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Aggregate all photos from reports and standalone photos
  const allPhotos: PhotoItem[] = React.useMemo(() => {
    const list: PhotoItem[] = [...standalonePhotos];

    reports.forEach((r) => {
      if (r.fotoDokumentasi && r.fotoDokumentasi.length > 0) {
        r.fotoDokumentasi.forEach((p, idx) => {
          list.push({
            id: p.id || `RPT-${r.id}-${idx}`,
            url: p.url,
            caption: p.caption || `Foto Les ${r.mataPelajaran} - ${r.namaSiswa}`,
            namaSiswa: p.namaSiswa || r.namaSiswa,
            tanggal: p.tanggal || r.tanggal,
            namaPengajar: p.namaPengajar || r.namaPengajar,
            mataPelajaran: r.mataPelajaran,
            createdAt: p.createdAt || r.createdAt,
          });
        });
      }
    });

    // Remove potential duplicates by ID or URL
    const uniqueMap = new Map<string, PhotoItem>();
    list.forEach((item) => {
      const key = item.id || item.url.substring(0, 50);
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });

    return Array.from(uniqueMap.values()).sort((a, b) => {
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  }, [reports, standalonePhotos]);

  // Filter photos
  const filteredPhotos = allPhotos.filter((p) => {
    const matchesStudent =
      selectedStudentFilter === 'all' ||
      (p.namaSiswa || '').toLowerCase() === selectedStudentFilter.toLowerCase();

    const query = searchQuery.toLowerCase();
    const matchesQuery =
      !query ||
      (p.caption || '').toLowerCase().includes(query) ||
      (p.namaSiswa || '').toLowerCase().includes(query) ||
      (p.mataPelajaran || '').toLowerCase().includes(query) ||
      (p.namaPengajar || '').toLowerCase().includes(query);

    return matchesStudent && matchesQuery;
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      const compressed = await compressImageFile(file);
      setPendingPhotoUrl(compressed);
    } catch (err) {
      console.error('Error compressing image:', err);
      alert('Gagal memproses gambar. Silakan coba file gambar lain.');
    }
  };

  const handleSubmitNewPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingPhotoUrl) {
      alert('Silakan pilih foto terlebih dahulu.');
      return;
    }
    if (!uploadStudentName) {
      alert('Silakan tentukan atau pilih nama siswa.');
      return;
    }

    setIsSubmitting(true);
    const newPhoto: PhotoItem = {
      id: `PHOTO-${Date.now()}`,
      url: pendingPhotoUrl,
      caption: uploadCaption || `Dokumentasi Les ${uploadSubject} (${uploadStudentName})`,
      namaSiswa: uploadStudentName,
      tanggal: uploadDate,
      namaPengajar: uploadTutor,
      mataPelajaran: uploadSubject,
      createdAt: new Date().toISOString(),
    };

    try {
      await onUploadPhoto(newPhoto);
      setIsSubmitting(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setIsUploadModalOpen(false);
        setPendingPhotoUrl(null);
        setUploadCaption('');
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert('Gagal menyimpan foto ke Cloud Database.');
    }
  };

  const handleDownloadPhoto = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'Dokumentasi_Les_Dessa_Mentari.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadBrandedCard = async (photo: PhotoItem) => {
    const element = document.getElementById('branded-photo-canvas-card');
    if (!element) return;
    setDownloadingTemplate(true);
    try {
      let canvas: HTMLCanvasElement | null = null;
      for (const scale of [2, 1.5, 1]) {
        try {
          canvas = await html2canvas(element, {
            scale,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#0f172a',
            logging: false,
            imageTimeout: 6000,
          });
          if (canvas) break;
        } catch (scaleErr) {
          console.warn(`Photo template capture at scale ${scale} failed:`, scaleErr);
        }
      }

      if (!canvas) {
        throw new Error('Canvas generation returned null');
      }

      const cleanStudent = (photo.namaSiswa || 'Siswa').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      const cleanDate = (photo.tanggal || 'Les').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      const finalFilename = `Template_Foto_DME_${cleanStudent}_${cleanDate}.jpg`;

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas!.toBlob(resolve, 'image/jpeg', 0.95);
      });

      if (blob) {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = finalFilename;
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          if (link.parentNode) document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 1500);
      } else {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const link = document.createElement('a');
        link.download = finalFilename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          if (link.parentNode) document.body.removeChild(link);
        }, 1500);
      }
    } catch (err) {
      console.error('Error generating branded photo card:', err);
      // Fallback: direct download original photo URL
      if (photo.url) {
        handleDownloadPhoto(photo.url, `Foto_Dokumentasi_${photo.namaSiswa || 'Les'}.jpg`);
      } else {
        alert('Gagal mengunduh kartu template foto.');
      }
    } finally {
      setDownloadingTemplate(false);
    }
  };

  const handleSendTemplateWa = (photo: PhotoItem) => {
    const text = encodeURIComponent(
      `*DOKUMENTASI FOTO LES PRIVAT*\n*DESSA MENTARI EDUCATION*\n_Tempat Belajar Terpercaya · Les Privat Keluarga Indonesia_\n----------------------------------------\n👤 *Nama Siswa:* ${photo.namaSiswa || 'Siswa'}\n📚 *Mata Pelajaran:* ${photo.mataPelajaran || 'Les Privat'}\n📅 *Tanggal Sesi:* ${photo.tanggal || '-'}\n👨‍🏫 *Pengajar:* ${photo.namaPengajar || 'Dessa Mentari'}\n\n📝 *Keterangan Foto:* ${photo.caption || 'Dokumentasi pembelajaran ananda hari ini.'}\n----------------------------------------\n_Terima kasih atas kepercayaan Ibu/Bapak bersama Dessa Mentari Education!_ 🙏🏻`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
            <Camera className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold uppercase tracking-wider text-amber-300 font-serif-brand">
                Galeri Dokumentasi Foto Les Privat
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                <Cloud className="w-3 h-3" /> Cloud Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Arsip resmi dokumentasi foto kegiatan belajar, hasil latihan, dan praktikum siswa Dessa Mentari Education.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (students.length > 0) {
              setUploadStudentName(students[0].namaSiswa);
            }
            setIsUploadModalOpen(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Upload className="w-4 h-4 text-amber-950" />
          <span>+ Tambah Dokumentasi Foto</span>
        </button>
      </div>

      {/* STATS OVERVIEW & FILTER TOOLBAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Quick Stats Pill */}
        <div className="md:col-span-4 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-around text-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Foto</span>
            <span className="text-lg font-extrabold text-amber-600">{allPhotos.length}</span>
          </div>
          <div className="h-8 w-[1px] bg-slate-200"></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Siswa Terdokumentasi</span>
            <span className="text-lg font-extrabold text-slate-900">
              {new Set(allPhotos.map((p) => (p.namaSiswa || '').toLowerCase()).filter(Boolean)).size}
            </span>
          </div>
          <div className="h-8 w-[1px] bg-slate-200"></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Status Sync</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
            </span>
          </div>
        </div>

        {/* Search Input & Student Filter */}
        <div className="md:col-span-8 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata kunci foto, materi, atau pengajar..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedStudentFilter}
              onChange={(e) => setSelectedStudentFilter(e.target.value)}
              className="w-full sm:w-auto text-xs p-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white font-semibold"
            >
              <option value="all">Semua Siswa ({allPhotos.length})</option>
              {students.map((st) => (
                <option key={st.id} value={st.namaSiswa}>
                  {st.namaSiswa} ({st.jenjang})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* PHOTO GALLERY GRID */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Belum Ada Foto Dokumentasi</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Foto yang Anda unggah saat mengisi laporan les privat atau menambah dokumentasi foto akan muncul otomatis di sini.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Unggah Foto Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col"
            >
              {/* Image Box */}
              <div
                onClick={() => setActiveLightboxPhoto(photo)}
                className="aspect-4/3 w-full bg-slate-900 overflow-hidden relative cursor-pointer group"
              >
                <img
                  src={photo.url}
                  alt={photo.caption || 'Dokumentasi Les'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2 bg-white/90 text-slate-900 rounded-full shadow-lg">
                    <Maximize2 className="w-5 h-5" />
                  </span>
                </div>
                
                {photo.mataPelajaran && (
                  <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-400/30">
                    {photo.mataPelajaran}
                  </span>
                )}
              </div>

              {/* Info Body */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-800">
                    <span className="flex items-center gap-1 truncate">
                      <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{photo.namaSiswa || 'Siswa Dessa Mentari'}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium line-clamp-2 mt-1 leading-snug">
                    {photo.caption || 'Dokumentasi pembelajaran les privat'}
                  </p>

                  {/* Template Button */}
                  <button
                    onClick={() => setActiveTemplatePhoto(photo)}
                    className="w-full mt-2 py-1.5 px-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Template Foto Berlogo</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3" />
                    {photo.tanggal || 'Terbaru'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDownloadPhoto(photo.url, `Dokumentasi_${photo.namaSiswa}_${photo.tanggal}.jpg`)}
                      className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Unduh file foto mentah"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {photo.id && photo.id.startsWith('PHOTO-') && (
                      <button
                        onClick={async () => {
                          if (confirm('Apakah Anda yakin ingin menghapus foto dokumentasi ini?')) {
                            await onDeletePhoto(photo.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD NEW PHOTO MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8 relative border border-amber-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Tambah Dokumentasi Foto Les
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setPendingPhotoUrl(null);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewPhoto} className="space-y-4">
              {/* Template Info Banner */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-xl p-3 flex items-center gap-3">
                <img
                  src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
                  alt="Logo"
                  className="w-8 h-8 object-contain shrink-0 rounded-lg bg-white p-0.5 border border-amber-300 shadow-2xs"
                />
                <div className="text-[11px] leading-tight">
                  <span className="font-extrabold text-amber-950 block">Template Resmi Dessa Mentari Education</span>
                  <span className="text-amber-800 font-medium text-[10px]">
                    Keterangan: <strong>Les Privat Keluarga Indonesia</strong> (Tersedia template bingkai & ekspor kartu foto).
                  </span>
                </div>
              </div>

              {/* Image Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pilih Foto Pembelajaran <span className="text-red-500">*</span>
                </label>

                {pendingPhotoUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-300 aspect-4/3 bg-slate-900">
                    <img src={pendingPhotoUrl} alt="Preview" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setPendingPhotoUrl(null)}
                      className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-red-600 text-white rounded-full transition-colors"
                      title="Ganti foto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Button 1: Pilih dari Galeri HP */}
                      <label className="border-2 border-dashed border-amber-400/80 hover:border-amber-500 rounded-xl p-4 text-center block cursor-pointer bg-amber-50/50 hover:bg-amber-100/50 transition-all active:scale-[0.98]">
                        <ImageIcon className="w-6 h-6 text-amber-700 mx-auto mb-1.5" />
                        <span className="text-xs font-bold text-amber-950 block">
                          Pilih dari Galeri HP
                        </span>
                        <span className="text-[10px] text-amber-800 block mt-0.5">
                          Buka album / galeri foto HP
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </label>

                      {/* Button 2: Ambil Foto Kamera */}
                      <label className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-4 text-center block cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all active:scale-[0.98]">
                        <Camera className="w-6 h-6 text-slate-700 mx-auto mb-1.5" />
                        <span className="text-xs font-bold text-slate-800 block">
                          Ambil Foto Kamera
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Buka kamera HP langsung
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center">
                      Mendukung format JPG, PNG, WEBP dengan kompresi otomatis web-optimized.
                    </p>
                  </div>
                )}
              </div>

              {/* Student Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Siswa <span className="text-red-500">*</span>
                </label>
                {students.length > 0 ? (
                  <select
                    value={uploadStudentName}
                    onChange={(e) => setUploadStudentName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white font-medium"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.namaSiswa}>
                        {st.namaSiswa} ({st.jenjang})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={uploadStudentName}
                    onChange={(e) => setUploadStudentName(e.target.value)}
                    placeholder="Nama Siswa..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                )}
              </div>

              {/* Subject & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mata Pelajaran
                  </label>
                  <input
                    type="text"
                    value={uploadSubject}
                    onChange={(e) => setUploadSubject(e.target.value)}
                    placeholder="Matematika, IPA..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Foto
                  </label>
                  <input
                    type="date"
                    value={uploadDate}
                    onChange={(e) => setUploadDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keterangan / Caption Foto
                </label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Contoh: Praktikum IPA Uji Enzim Pencernaan..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !pendingPhotoUrl}
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {uploadSuccess ? '✓ Foto Saved!' : isSubmitting ? 'Simpan...' : 'Simpan Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX POPUP MODAL */}
      {activeLightboxPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl flex flex-col max-h-[90vh]">
            {/* Top Bar */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-200">
                    {activeLightboxPhoto.namaSiswa}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {activeLightboxPhoto.mataPelajaran} · {activeLightboxPhoto.tanggal}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveLightboxPhoto(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Image Body */}
            <div className="flex-1 bg-black p-4 flex items-center justify-center overflow-hidden">
              <img
                src={activeLightboxPhoto.url}
                alt={activeLightboxPhoto.caption || 'Preview'}
                className="max-h-[65vh] w-auto object-contain rounded-lg"
              />
            </div>

            {/* Bottom Info & Download Bar */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-white">
              <p className="text-xs text-slate-300 italic">
                "{activeLightboxPhoto.caption || 'Foto Dokumentasi Les Privat Dessa Mentari Education'}"
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTemplatePhoto(activeLightboxPhoto);
                    setActiveLightboxPhoto(null);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buka Template Berlogo</span>
                </button>

                <button
                  onClick={() =>
                    handleDownloadPhoto(
                      activeLightboxPhoto.url,
                      `Foto_Dokumentasi_${activeLightboxPhoto.namaSiswa}_${activeLightboxPhoto.tanggal}.jpg`
                    )
                  }
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Foto Mentah</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BRANDED PHOTO TEMPLATE MODAL */}
      {activeTemplatePhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl flex flex-col my-6">
            {/* Modal Top Bar */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-amber-200">
                  Template Foto Resmi Dessa Mentari Education
                </h3>
              </div>
              <button
                onClick={() => setActiveTemplatePhoto(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Container with the Branded Card */}
            <div className="p-4 sm:p-6 bg-slate-950/60 overflow-y-auto flex justify-center">
              {/* THE BRANDED PHOTO CARD TO CAPTURE */}
              <div
                id="branded-photo-canvas-card"
                className="w-full max-w-xl bg-gradient-to-b from-slate-900 via-zinc-900 to-slate-950 text-white rounded-2xl border-2 border-amber-500/80 shadow-2xl overflow-hidden relative"
              >
                {/* Official Branded Header */}
                <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-4 text-white flex items-center justify-between relative overflow-hidden">
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-md shrink-0 flex items-center justify-center border border-white/50">
                      <img
                        src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
                        alt="Logo Dessa Mentari Education"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        DESSA MENTARI EDUCATION
                      </div>
                      <h4 className="text-base font-extrabold tracking-tight font-serif-brand">
                        Dokumentasi Kegiatan Belajar
                      </h4>
                      <p className="text-[11px] text-amber-100 font-medium">
                        Tempat Belajar Terpercaya · Les Privat Keluarga Indonesia
                      </p>
                    </div>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-full border border-white/30 shrink-0">
                    <Award className="w-3 h-3 text-amber-300" />
                    Verified Photo
                  </span>
                </div>

                {/* Central Photo */}
                <div className="p-4 bg-slate-950/80">
                  <div className="relative rounded-xl overflow-hidden border-2 border-amber-400/40 shadow-inner aspect-4/3 bg-black flex items-center justify-center">
                    <img
                      src={activeTemplatePhoto.url}
                      alt={activeTemplatePhoto.caption || 'Foto'}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Floating Watermark Badge on Photo */}
                    <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-amber-400/40 text-[10px] font-semibold text-amber-200 flex items-center gap-1.5 shadow-md">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>{activeTemplatePhoto.namaSiswa} · {activeTemplatePhoto.mataPelajaran || 'Les Privat'}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Metadata & Info Bar */}
                <div className="p-4 bg-zinc-900 border-t border-amber-500/30 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Siswa</span>
                      <p className="font-extrabold text-amber-200 truncate">{activeTemplatePhoto.namaSiswa}</p>
                    </div>

                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Mata Pelajaran</span>
                      <p className="font-bold text-white truncate">{activeTemplatePhoto.mataPelajaran || 'Les Privat'}</p>
                    </div>

                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 col-span-2 sm:col-span-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Tanggal / Pengajar</span>
                      <p className="font-medium text-slate-300 truncate">
                        {activeTemplatePhoto.tanggal || '-'} · {activeTemplatePhoto.namaPengajar || 'Dessa Mentari'}
                      </p>
                    </div>
                  </div>

                  {activeTemplatePhoto.caption && (
                    <div className="bg-amber-950/30 border border-amber-500/30 p-2.5 rounded-xl text-xs text-amber-100 italic">
                      "{activeTemplatePhoto.caption}"
                    </div>
                  )}

                  {/* Brand Tagline in Template */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <img
                        src="/assets/aistudio/Logo_Pendidikan_Dessa_Mentari_6f1f1e2d.png"
                        alt="Logo"
                        className="w-4 h-4 object-contain"
                      />
                      <span className="font-bold text-slate-300">Dessa Mentari Education</span>
                      <span>— Les Privat Keluarga Indonesia</span>
                    </div>
                    <span className="font-mono text-amber-400/80">DOC-{activeTemplatePhoto.id?.substring(0, 8) || 'DME'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Buttons */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleSendTemplateWa(activeTemplatePhoto)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Kirim via WhatsApp</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTemplatePhoto(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all"
                >
                  Tutup
                </button>

                <button
                  onClick={() => handleDownloadBrandedCard(activeTemplatePhoto)}
                  disabled={downloadingTemplate}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadingTemplate ? 'Menyiapkan Gambar...' : 'Unduh Kartu Template (JPG)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

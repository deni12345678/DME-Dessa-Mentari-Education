import React, { useState } from 'react';
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
  CheckCircle2
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
                      title="Unduh foto"
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
              {/* Image Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Foto Pembelajaran <span className="text-red-500">*</span>
                </label>

                {pendingPhotoUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-300 aspect-4/3 bg-slate-900">
                    <img src={pendingPhotoUrl} alt="Preview" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setPendingPhotoUrl(null)}
                      className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-red-600 text-white rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-6 text-center block cursor-pointer bg-slate-50 hover:bg-amber-50/50 transition-colors">
                    <Upload className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <span className="text-xs font-bold text-slate-700 block">
                      Klik untuk Pilih / Ambil Foto
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Mendukung kamera HP, JPG, PNG, WEBP (Otomatis Kompresi)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
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
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-white">
              <p className="text-xs text-slate-300 italic">
                "{activeLightboxPhoto.caption || 'Foto Dokumentasi Les Privat Dessa Mentari Education'}"
              </p>

              <button
                onClick={() =>
                  handleDownloadPhoto(
                    activeLightboxPhoto.url,
                    `Foto_Dokumentasi_${activeLightboxPhoto.namaSiswa}_${activeLightboxPhoto.tanggal}.jpg`
                  )
                }
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-xs shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Foto</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

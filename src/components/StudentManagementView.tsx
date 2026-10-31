import React, { useState } from 'react';
import { StudentData, EducationLevel, StudentStatus, ReportData } from '../types/report';
import { 
  Users, 
  UserPlus, 
  Search, 
  Phone, 
  BookOpen, 
  Calendar, 
  Clock, 
  School, 
  FileEdit, 
  Trash2, 
  X, 
  Plus, 
  CheckCircle2, 
  UserCheck, 
  MessageSquare,
  Sparkles,
  BarChart2,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

interface StudentManagementViewProps {
  students: StudentData[];
  reports: ReportData[];
  onSaveStudent: (student: StudentData) => void;
  onDeleteStudent: (id: string) => void;
  onSelectStudentForReport: (student: StudentData) => void;
}

const EDUCATION_LEVELS: EducationLevel[] = ['TK', 'SD', 'SMP', 'SMA', 'Umum/PAUD'];
const PRESET_TEACHERS = ['Deni Santoso, M.M', 'Sarah Syahidah Syahrudin, S.Pd'];

export const StudentManagementView: React.FC<StudentManagementViewProps> = ({
  students,
  reports,
  onSaveStudent,
  onDeleteStudent,
  onSelectStudentForReport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | StudentStatus>('Semua');
  const [levelFilter, setLevelFilter] = useState<'Semua' | EducationLevel>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentData | null>(null);
  const [viewingDetailStudent, setViewingDetailStudent] = useState<StudentData | null>(null);

  // Initial Form State
  const initialForm: Omit<StudentData, 'id' | 'createdAt'> = {
    namaSiswa: '',
    panggilan: '',
    jenjang: 'SD',
    kelasGrade: 'Kelas 4 SD',
    sekolah: '',
    namaOrangTua: '',
    nomorOrangTua: '',
    alamat: '',
    mataPelajaran: 'Matematika',
    hariLes: 'Senin & Kamis',
    jamLes: '15.30 - 17.00 WIB',
    namaPengajar: 'Deni Santoso, M.M',
    status: 'Aktif',
    catatanKhusus: '',
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student: StudentData) => {
    setEditingStudent(student);
    setFormData({
      namaSiswa: student.namaSiswa,
      panggilan: student.panggilan || '',
      jenjang: student.jenjang,
      kelasGrade: student.kelasGrade || '',
      sekolah: student.sekolah || '',
      namaOrangTua: student.namaOrangTua || '',
      nomorOrangTua: student.nomorOrangTua || '',
      alamat: student.alamat || '',
      mataPelajaran: student.mataPelajaran || '',
      hariLes: student.hariLes || '',
      jamLes: student.jamLes || '',
      namaPengajar: student.namaPengajar || '',
      status: student.status,
      catatanKhusus: student.catatanKhusus || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaSiswa.trim()) {
      alert('Nama siswa wajib diisi!');
      return;
    }

    const studentToSave: StudentData = {
      ...formData,
      id: editingStudent ? editingStudent.id : `STU-${Date.now()}`,
      createdAt: editingStudent ? editingStudent.createdAt : new Date().toISOString(),
    };

    onSaveStudent(studentToSave);
    setIsModalOpen(false);
  };

  // Filtered Students List
  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      s.namaSiswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.panggilan && s.panggilan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.sekolah && s.sekolah.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.kelasGrade && s.kelasGrade.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.namaPengajar && s.namaPengajar.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'Semua' || s.status === statusFilter;
    const matchesLevel = levelFilter === 'Semua' || s.jenjang === levelFilter;

    return matchesSearch && matchesStatus && matchesLevel;
  });

  // Calculate stats summary
  const totalStudents = students.length;
  const totalAktif = students.filter((s) => s.status === 'Aktif').length;
  const totalCuti = students.filter((s) => s.status === 'Cuti').length;
  const totalAlumni = students.filter((s) => s.status === 'Alumni').length;

  const getLevelBadgeColor = (jenjang: string) => {
    switch (jenjang) {
      case 'TK':
      case 'Umum/PAUD':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'SD':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'SMP':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SMA':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusBadgeColor = (status: StudentStatus) => {
    switch (status) {
      case 'Aktif':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cuti':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Alumni':
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER TITLE & ACTION */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
            <GraduationCap className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold tracking-tight font-serif-brand">
                Daftar Siswa Terdaftar Les Privat
              </h2>
              <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30">
                {totalAktif} Siswa Aktif
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Kelola data seluruh siswa les privat Dessa Mentari Education. Pilih siswa untuk langsung membuat laporan les otomatis.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 text-xs font-extrabold text-amber-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Tambah Siswa Baru</span>
        </button>
      </div>

      {/* STATS SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Siswa Terdaftar</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{totalStudents}</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Database Cloud Real-Time</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs bg-emerald-50/20">
          <span className="text-xs font-semibold text-emerald-800 block">Siswa Aktif Les</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{totalAktif}</span>
          <span className="text-[11px] text-emerald-700 mt-0.5 block">Mengikuti Sesi Rutin</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs bg-amber-50/20">
          <span className="text-xs font-semibold text-amber-800 block">Siswa Cuti Sementar</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{totalCuti}</span>
          <span className="text-[11px] text-amber-700 mt-0.5 block">Penangguhan Jadwal</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs bg-slate-50">
          <span className="text-xs font-semibold text-slate-600 block">Alumni Lulus</span>
          <span className="text-2xl font-black text-slate-700 mt-1 block">{totalAlumni}</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Selesai Program Les</span>
        </div>
      </div>

      {/* CONTROLS: SEARCH & FILTER TABS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari siswa, sekolah, pengajar..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status:</span>
          {(['Semua', 'Aktif', 'Cuti', 'Alumni'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                statusFilter === st
                  ? 'bg-amber-600 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}

          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2">Jenjang:</span>
          {(['Semua', 'TK', 'SD', 'SMP', 'SMA', 'Umum/PAUD'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl as any)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                levelFilter === lvl
                  ? 'bg-slate-800 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* STUDENT CARDS GRID */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">Tidak Ada Data Siswa Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba ubah pencarian atau filter status. Anda juga dapat menambahkan siswa baru menggunakan tombol di atas.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-all inline-flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Tambah Siswa Baru</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            const studentReports = reports.filter(
              (r) => r.namaSiswa.toLowerCase() === student.namaSiswa.toLowerCase()
            );

            return (
              <div
                key={student.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-amber-300 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group relative"
              >
                {/* Top Section: Avatar & Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-extrabold text-base flex items-center justify-center shadow-xs uppercase shrink-0">
                        {student.panggilan ? student.panggilan.charAt(0) : student.namaSiswa.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                          {student.namaSiswa}
                        </h3>
                        {student.panggilan && (
                          <span className="text-[11px] font-medium text-slate-500 block">
                            Panggilan: &quot;{student.panggilan}&quot;
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${getStatusBadgeColor(
                        student.status
                      )}`}
                    >
                      {student.status}
                    </span>
                  </div>

                  {/* Level & School Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className={`px-2 py-0.5 rounded-md font-bold border ${getLevelBadgeColor(student.jenjang)}`}>
                      {student.jenjang}
                    </span>
                    {student.kelasGrade && (
                      <span className="px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {student.kelasGrade}
                      </span>
                    )}
                    {student.sekolah && (
                      <span className="px-2 py-0.5 rounded-md font-medium bg-slate-50 text-slate-600 border border-slate-200 flex items-center gap-1">
                        <School className="w-3 h-3 text-slate-400" />
                        {student.sekolah}
                      </span>
                    )}
                  </div>

                  {/* Details Breakdown */}
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                    {student.namaOrangTua && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Orang Tua / Wali:</span>
                        <span className="font-semibold text-slate-800">{student.namaOrangTua}</span>
                      </div>
                    )}

                    {student.namaPengajar && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Pengajar:</span>
                        <span className="font-bold text-amber-800">{student.namaPengajar}</span>
                      </div>
                    )}

                    {student.mataPelajaran && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Mata Pelajaran:</span>
                        <span className="font-medium text-slate-700">{student.mataPelajaran}</span>
                      </div>
                    )}

                    {(student.hariLes || student.jamLes) && (
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-600" />
                          Jadwal Les:
                        </span>
                        <span className="font-semibold text-slate-700">
                          {student.hariLes} {student.jamLes ? `(${student.jamLes})` : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {student.catatanKhusus && (
                    <p className="text-[11px] text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100 line-clamp-2">
                      💡 {student.catatanKhusus}
                    </p>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      Total Laporan: <strong className="text-amber-700">{studentReports.length} Sesi</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewingDetailStudent(student)}
                      className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-0.5"
                    >
                      <span>Lihat Rekap</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Action Buttons Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectStudentForReport(student)}
                      className="w-full py-2 px-3 text-xs font-bold text-amber-950 bg-amber-300 hover:bg-amber-200 active:scale-95 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Buat Laporan</span>
                    </button>

                    {student.nomorOrangTua ? (
                      <a
                        href={`https://wa.me/${student.nomorOrangTua.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-3 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 active:scale-95 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 text-center"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Chat WA</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(student)}
                        className="w-full py-2 px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center justify-center gap-1"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        <span>Edit Data</span>
                      </button>
                    )}
                  </div>

                  {/* Secondary Edit / Delete Bar */}
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(student)}
                      className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                    >
                      <FileEdit className="w-3 h-3" />
                      <span>Edit Profil</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Hapus data siswa "${student.namaSiswa}" dari database terdaftar?`)) {
                          onDeleteStudent(student.id);
                        }
                      }}
                      className="text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL FORM: TAMBAH / EDIT SISWA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 my-8 border border-slate-200 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  🎓
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-serif-brand">
                    {editingStudent ? 'Edit Data Siswa Terdaftar' : 'Tambah Siswa Terdaftar Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lengkapi profil siswa les privat Dessa Mentari Education.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Nama Lengkap */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap Siswa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.namaSiswa}
                    onChange={(e) => setFormData({ ...formData, namaSiswa: e.target.value })}
                    placeholder="Contoh: Ananda Kevin Pratama"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>

                {/* Nama Panggilan */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    value={formData.panggilan}
                    onChange={(e) => setFormData({ ...formData, panggilan: e.target.value })}
                    placeholder="Contoh: Kevin"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>

                {/* Status Keaktifan */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Siswa
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StudentStatus })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white"
                  >
                    <option value="Aktif">Aktif Les</option>
                    <option value="Cuti">Cuti Sementara</option>
                    <option value="Alumni">Alumni Lulus</option>
                  </select>
                </div>

                {/* Jenjang */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenjang Pendidikan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.jenjang}
                    onChange={(e) => setFormData({ ...formData, jenjang: e.target.value as EducationLevel })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white"
                  >
                    {EDUCATION_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Kelas / Grade */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kelas / Grade
                  </label>
                  <input
                    type="text"
                    value={formData.kelasGrade}
                    onChange={(e) => setFormData({ ...formData, kelasGrade: e.target.value })}
                    placeholder="Contoh: Kelas 4 SD, TK B"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>

                {/* Nama Sekolah */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Asal Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.sekolah}
                    onChange={(e) => setFormData({ ...formData, sekolah: e.target.value })}
                    placeholder="Contoh: SDN Mentari 01 Jakarta"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>

                {/* Orang Tua & WA */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Orang Tua / Wali
                  </label>
                  <input
                    type="text"
                    value={formData.namaOrangTua}
                    onChange={(e) => setFormData({ ...formData, namaOrangTua: e.target.value })}
                    placeholder="Contoh: Ibu Ratna"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp Ortu
                  </label>
                  <input
                    type="text"
                    value={formData.nomorOrangTua}
                    onChange={(e) => setFormData({ ...formData, nomorOrangTua: e.target.value })}
                    placeholder="Contoh: 081234567890"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>

                {/* Pengajar Penanggung Jawab */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pengajar / Tentor Penanggung Jawab
                  </label>
                  <select
                    value={formData.namaPengajar}
                    onChange={(e) => setFormData({ ...formData, namaPengajar: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white"
                  >
                    {PRESET_TEACHERS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                    <option value="Tim Dessa Mentari">Tim Dessa Mentari Education</option>
                  </select>
                </div>

                {/* Mata Pelajaran & Jadwal */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mata Pelajaran Les
                  </label>
                  <input
                    type="text"
                    value={formData.mataPelajaran}
                    onChange={(e) => setFormData({ ...formData, mataPelajaran: e.target.value })}
                    placeholder="Contoh: Matematika, Bahasa Inggris"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hari Les
                  </label>
                  <input
                    type="text"
                    value={formData.hariLes}
                    onChange={(e) => setFormData({ ...formData, hariLes: e.target.value })}
                    placeholder="Contoh: Senin & Kamis"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jam Sesi Les
                  </label>
                  <input
                    type="text"
                    value={formData.jamLes}
                    onChange={(e) => setFormData({ ...formData, jamLes: e.target.value })}
                    placeholder="Contoh: 15.30 - 17.00 WIB"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>

                {/* Catatan Khusus */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Catatan Khusus / Preferensi Belajar Siswa
                  </label>
                  <textarea
                    rows={2}
                    value={formData.catatanKhusus}
                    onChange={(e) => setFormData({ ...formData, catatanKhusus: e.target.value })}
                    placeholder="Tuliskan gaya belajar, topik yang disukai, atau kebutuhan khusus siswa..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md"
                >
                  {editingStudent ? 'Simpan Perubahan' : 'Daftarkan Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL FOR STUDENT REKAP */}
      {viewingDetailStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8 border border-slate-200 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black text-lg flex items-center justify-center">
                  {viewingDetailStudent.namaSiswa.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Profil Rekap: {viewingDetailStudent.namaSiswa}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {viewingDetailStudent.jenjang} — {viewingDetailStudent.kelasGrade || 'Tingkat Umum'} ({viewingDetailStudent.sekolah || 'Les Privat'})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingDetailStudent(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rekap Sesi Les */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-amber-600" />
                Riwayat Sesi Laporan Pembelajaran
              </h4>

              {reports.filter((r) => r.namaSiswa.toLowerCase() === viewingDetailStudent.namaSiswa.toLowerCase()).length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
                  Belum ada laporan pembelajaran yang diinput untuk {viewingDetailStudent.namaSiswa}.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {reports
                    .filter((r) => r.namaSiswa.toLowerCase() === viewingDetailStudent.namaSiswa.toLowerCase())
                    .map((rep) => (
                      <div key={rep.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>{rep.mataPelajaran} ({rep.tanggal})</span>
                          <span className="text-amber-700">{rep.namaPengajar}</span>
                        </div>
                        <p className="text-slate-600 font-medium">Materi: {rep.materiDipelajari}</p>
                        <p className="text-slate-500 italic">Evaluasi: {rep.evaluasiSiswa}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  onSelectStudentForReport(viewingDetailStudent);
                  setViewingDetailStudent(null);
                }}
                className="px-4 py-2 text-xs font-bold text-amber-950 bg-amber-300 hover:bg-amber-200 rounded-xl transition-all inline-flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Buat Laporan Pembelajaran Baru</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingDetailStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

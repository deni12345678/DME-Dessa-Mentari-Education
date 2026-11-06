import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocFromServer,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ReportData, StudentData, PhotoItem, BillingRecord, CertificateData } from '../types/report';

const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connectivity on initial load
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firestore connected successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is currently offline or unreachable.');
    }
  }
}

const REPORTS_COLLECTION = 'reports';
const STUDENTS_COLLECTION = 'students';
const PHOTOS_COLLECTION = 'photos';
const BILLINGS_COLLECTION = 'billings';
const CERTIFICATES_COLLECTION = 'certificates';

// Save or update report in cloud
export async function saveReportToCloud(report: ReportData): Promise<void> {
  try {
    const docRef = doc(db, REPORTS_COLLECTION, report.id);
    const cleanPayload = {
      namaSiswa: report.namaSiswa || '',
      tanggal: report.tanggal || '',
      jenjang: report.jenjang || 'SD',
      kelasGrade: report.kelasGrade || '',
      waktuDurasi: report.waktuDurasi || '',
      mataPelajaran: report.mataPelajaran || '',
      statusKehadiran: report.statusKehadiran || 'Hadir',
      materi: report.materiDipelajari || '',
      perkembangan: report.evaluasiSiswa || '',
      tugasRumah: report.tugasRumah || '',
      catatanOrtu: report.catatanOrangTua || '',
      namaPengajar: report.namaPengajar || 'Dessa Mentari Team',
      skorPemahaman: Number(report.skorPemahaman) || 80,
      skorKeaktifan: Number(report.skorKeaktifan) || 80,
      skorFokus: Number(report.skorFokus) || 80,
      fotoDokumentasi: report.fotoDokumentasi || [],
      tema: report.theme || 'solar',
      createdAt: report.createdAt || new Date().toISOString()
    };
    await setDoc(docRef, cleanPayload, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `reports/${report.id}`);
  }
}

// Delete report from cloud
export async function deleteReportFromCloud(id: string): Promise<void> {
  try {
    const docRef = doc(db, REPORTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `reports/${id}`);
  }
}

// Real-time listener for reports
export function subscribeReportsFromCloud(onData: (reports: ReportData[]) => void, onError?: (err: Error) => void) {
  const q = query(collection(db, REPORTS_COLLECTION), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const reports: ReportData[] = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        namaSiswa: data.namaSiswa || '',
        tanggal: data.tanggal || '',
        waktuDurasi: data.waktuDurasi || '90 Menit',
        jenjang: data.jenjang || 'SD',
        kelasGrade: data.kelasGrade || '',
        mataPelajaran: data.mataPelajaran || '',
        statusKehadiran: data.statusKehadiran || 'Hadir',
        materiDipelajari: data.materi || data.materiDipelajari || '',
        evaluasiSiswa: data.perkembangan || data.evaluasiSiswa || '',
        tugasRumah: data.tugasRumah || '',
        catatanOrangTua: data.catatanOrtu || data.catatanOrangTua || '',
        namaPengajar: data.namaPengajar || 'Dessa Mentari Team',
        skorPemahaman: data.skorPemahaman ?? 80,
        skorKeaktifan: data.skorKeaktifan ?? 80,
        skorFokus: data.skorFokus ?? 80,
        fotoDokumentasi: Array.isArray(data.fotoDokumentasi) ? data.fotoDokumentasi : [],
        theme: data.tema || data.theme || 'solar',
        createdAt: data.createdAt || new Date().toISOString()
      };
    });
    onData(reports);
  }, (err) => {
    console.error("Firestore snapshot error:", err);
    if (onError) onError(err);
  });
}

// Save or update student in cloud
export async function saveStudentToCloud(student: StudentData): Promise<void> {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, student.id);
    const cleanPayload = {
      namaSiswa: student.namaSiswa || '',
      panggilan: student.panggilan || '',
      jenjang: student.jenjang || 'SD',
      kelasGrade: student.kelasGrade || '',
      sekolah: student.sekolah || '',
      namaOrangTua: student.namaOrangTua || '',
      nomorOrangTua: student.nomorOrangTua || '',
      alamat: student.alamat || '',
      mataPelajaran: student.mataPelajaran || '',
      hariLes: student.hariLes || '',
      jamLes: student.jamLes || '',
      namaPengajar: student.namaPengajar || '',
      status: student.status || 'Aktif',
      catatanKhusus: student.catatanKhusus || '',
      createdAt: student.createdAt || new Date().toISOString()
    };
    await setDoc(docRef, cleanPayload, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `students/${student.id}`);
  }
}

// Delete student from cloud
export async function deleteStudentFromCloud(id: string): Promise<void> {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `students/${id}`);
  }
}

// Real-time listener for registered students
export function subscribeStudentsFromCloud(onData: (students: StudentData[]) => void, onError?: (err: Error) => void) {
  const q = query(collection(db, STUDENTS_COLLECTION), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const students: StudentData[] = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        namaSiswa: data.namaSiswa || '',
        panggilan: data.panggilan || '',
        jenjang: data.jenjang || 'SD',
        kelasGrade: data.kelasGrade || '',
        sekolah: data.sekolah || '',
        namaOrangTua: data.namaOrangTua || '',
        nomorOrangTua: data.nomorOrangTua || '',
        alamat: data.alamat || '',
        mataPelajaran: data.mataPelajaran || '',
        hariLes: data.hariLes || '',
        jamLes: data.jamLes || '',
        namaPengajar: data.namaPengajar || '',
        status: data.status || 'Aktif',
        catatanKhusus: data.catatanKhusus || '',
        createdAt: data.createdAt || new Date().toISOString()
      };
    });
    onData(students);
  }, (err) => {
    console.error("Firestore students snapshot error:", err);
    if (onError) onError(err);
  });
}

// Save standalone photo item to cloud
export async function savePhotoToCloud(photo: PhotoItem): Promise<void> {
  try {
    const docRef = doc(db, PHOTOS_COLLECTION, photo.id);
    const cleanPayload = {
      url: photo.url,
      caption: photo.caption || '',
      namaSiswa: photo.namaSiswa || '',
      tanggal: photo.tanggal || new Date().toISOString().split('T')[0],
      namaPengajar: photo.namaPengajar || '',
      mataPelajaran: photo.mataPelajaran || '',
      createdAt: photo.createdAt || new Date().toISOString()
    };
    await setDoc(docRef, cleanPayload, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `photos/${photo.id}`);
  }
}

// Delete photo item from cloud
export async function deletePhotoFromCloud(id: string): Promise<void> {
  try {
    const docRef = doc(db, PHOTOS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `photos/${id}`);
  }
}

// Real-time listener for standalone photo gallery items
export function subscribePhotosFromCloud(onData: (photos: PhotoItem[]) => void, onError?: (err: Error) => void) {
  const q = query(collection(db, PHOTOS_COLLECTION), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const photos: PhotoItem[] = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        url: data.url || '',
        caption: data.caption || '',
        namaSiswa: data.namaSiswa || '',
        tanggal: data.tanggal || '',
        namaPengajar: data.namaPengajar || '',
        mataPelajaran: data.mataPelajaran || '',
        createdAt: data.createdAt || new Date().toISOString()
      };
    });
    onData(photos);
  }, (err) => {
    console.error("Firestore photos snapshot error:", err);
    if (onError) onError(err);
  });
}

// Save or update billing statement in cloud
export async function saveBillingToCloud(billing: BillingRecord): Promise<void> {
  try {
    const docRef = doc(db, BILLINGS_COLLECTION, billing.id);
    const cleanPayload = {
      namaSiswa: billing.namaSiswa || '',
      bulanTahun: billing.bulanTahun || '',
      jenjang: billing.jenjang || 'SD',
      mataPelajaran: billing.mataPelajaran || '',
      namaPengajar: billing.namaPengajar || '',
      modeKalkulasi: billing.modeKalkulasi || 'per_sesi',
      tarifPerSesi: Number(billing.tarifPerSesi) || 75000,
      tarifPerJam: Number(billing.tarifPerJam) || 0,
      totalJam: Number(billing.totalJam) || 0,
      jumlahHadir: Number(billing.jumlahHadir) || 0,
      jumlahIzin: Number(billing.jumlahIzin) || 0,
      biayaTambahan: Number(billing.biayaTambahan) || 0,
      keteranganBiayaTambahan: billing.keteranganBiayaTambahan || '',
      biayaTransport: Number(billing.biayaTransport) || 0,
      diskon: Number(billing.diskon) || 0,
      keteranganDiskon: billing.keteranganDiskon || '',
      totalBiaya: Number(billing.totalBiaya) || 0,
      totalBiayaManual: Number(billing.totalBiayaManual) || 0,
      jumlahTerbayar: Number(billing.jumlahTerbayar) || 0,
      sisaTagihan: Number(billing.sisaTagihan) || 0,
      statusPembayaran: billing.statusPembayaran || 'Belum Bayar',
      tanggalBayar: billing.tanggalBayar || '',
      metodePembayaran: billing.metodePembayaran || '',
      nomorKuitansi: billing.nomorKuitansi || '',
      catatan: billing.catatan || '',
      isManualEntry: Boolean(billing.isManualEntry),
      daftarSesiManual: billing.daftarSesiManual || [],
      createdAt: billing.createdAt || new Date().toISOString()
    };
    await setDoc(docRef, cleanPayload, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `billings/${billing.id}`);
  }
}

// Delete billing statement from cloud
export async function deleteBillingFromCloud(id: string): Promise<void> {
  try {
    const docRef = doc(db, BILLINGS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `billings/${id}`);
  }
}

// Real-time listener for billing records
export function subscribeBillingsFromCloud(onData: (billings: BillingRecord[]) => void, onError?: (err: Error) => void) {
  const q = query(collection(db, BILLINGS_COLLECTION), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const billings: BillingRecord[] = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        namaSiswa: data.namaSiswa || '',
        bulanTahun: data.bulanTahun || '',
        jenjang: data.jenjang || 'SD',
        mataPelajaran: data.mataPelajaran || '',
        namaPengajar: data.namaPengajar || '',
        modeKalkulasi: data.modeKalkulasi || 'per_sesi',
        tarifPerSesi: data.tarifPerSesi ?? 75000,
        tarifPerJam: data.tarifPerJam ?? 0,
        totalJam: data.totalJam ?? 0,
        jumlahHadir: data.jumlahHadir ?? 0,
        jumlahIzin: data.jumlahIzin ?? 0,
        biayaTambahan: data.biayaTambahan ?? 0,
        keteranganBiayaTambahan: data.keteranganBiayaTambahan || '',
        biayaTransport: data.biayaTransport ?? 0,
        diskon: data.diskon ?? 0,
        keteranganDiskon: data.keteranganDiskon || '',
        totalBiaya: data.totalBiaya ?? 0,
        totalBiayaManual: data.totalBiayaManual ?? 0,
        jumlahTerbayar: data.jumlahTerbayar ?? 0,
        sisaTagihan: data.sisaTagihan ?? 0,
        statusPembayaran: data.statusPembayaran || 'Belum Bayar',
        tanggalBayar: data.tanggalBayar || '',
        metodePembayaran: data.metodePembayaran || '',
        nomorKuitansi: data.nomorKuitansi || '',
        catatan: data.catatan || '',
        isManualEntry: Boolean(data.isManualEntry),
        daftarSesiManual: data.daftarSesiManual || [],
        createdAt: data.createdAt || new Date().toISOString()
      };
    });
    onData(billings);
  }, (err) => {
    console.error("Firestore billings snapshot error:", err);
    if (onError) onError(err);
  });
}

// Save or update certificate in cloud
export async function saveCertificateToCloud(cert: CertificateData): Promise<void> {
  try {
    const docRef = doc(db, CERTIFICATES_COLLECTION, cert.id);
    const cleanPayload = {
      certificateNumber: cert.certificateNumber || '',
      studentId: cert.studentId || '',
      namaSiswa: cert.namaSiswa || '',
      jenjang: cert.jenjang || 'SD',
      kelasGrade: cert.kelasGrade || '',
      sekolah: cert.sekolah || '',
      mataPelajaran: cert.mataPelajaran || '',
      tipeSertifikat: cert.tipeSertifikat || 'Kelulusan Kursus',
      predikat: cert.predikat || 'Sangat Memuaskan (A)',
      nilaiAkhir: cert.nilaiAkhir ?? 90,
      deskripsiKompetensi: cert.deskripsiKompetensi || '',
      tanggalTerbit: cert.tanggalTerbit || new Date().toISOString().split('T')[0],
      kotaTerbit: cert.kotaTerbit || 'Indonesia',
      namaKepalaLembaga: cert.namaKepalaLembaga || 'Deni Santoso, M.M',
      jabatanKepala: cert.jabatanKepala || 'Direktur Lembaga',
      namaTutorPengampu: cert.namaTutorPengampu || 'Sarah Syahidah Syahrudin, S.Pd',
      jabatanTutor: cert.jabatanTutor || 'Instruktur Pengampu',
      theme: cert.theme || 'gold',
      nomorWAOrangTua: cert.nomorWAOrangTua || '',
      isVerified: cert.isVerified ?? true,
      createdAt: cert.createdAt || new Date().toISOString()
    };
    await setDoc(docRef, cleanPayload, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `certificates/${cert.id}`);
  }
}

// Delete certificate from cloud
export async function deleteCertificateFromCloud(id: string): Promise<void> {
  try {
    const docRef = doc(db, CERTIFICATES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `certificates/${id}`);
  }
}

// Real-time listener for certificates
export function subscribeCertificatesFromCloud(onData: (certs: CertificateData[]) => void, onError?: (err: Error) => void) {
  const q = query(collection(db, CERTIFICATES_COLLECTION), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const certs: CertificateData[] = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        certificateNumber: data.certificateNumber || '',
        studentId: data.studentId || '',
        namaSiswa: data.namaSiswa || '',
        jenjang: data.jenjang || 'SD',
        kelasGrade: data.kelasGrade || '',
        sekolah: data.sekolah || '',
        mataPelajaran: data.mataPelajaran || '',
        tipeSertifikat: data.tipeSertifikat || 'Kelulusan Kursus',
        predikat: data.predikat || 'Sangat Memuaskan (A)',
        nilaiAkhir: data.nilaiAkhir ?? 90,
        deskripsiKompetensi: data.deskripsiKompetensi || '',
        tanggalTerbit: data.tanggalTerbit || '',
        kotaTerbit: data.kotaTerbit || 'Indonesia',
        namaKepalaLembaga: data.namaKepalaLembaga || 'Deni Santoso, M.M',
        jabatanKepala: data.jabatanKepala || 'Direktur Lembaga',
        namaTutorPengampu: data.namaTutorPengampu || 'Sarah Syahidah Syahrudin, S.Pd',
        jabatanTutor: data.jabatanTutor || 'Instruktur Pengampu',
        theme: data.theme || 'gold',
        nomorWAOrangTua: data.nomorWAOrangTua || '',
        isVerified: data.isVerified ?? true,
        createdAt: data.createdAt || new Date().toISOString()
      };
    });
    onData(certs);
  }, (err) => {
    console.error("Firestore certificates snapshot error:", err);
    if (onError) onError(err);
  });
}





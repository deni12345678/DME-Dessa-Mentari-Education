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
import { ReportData } from '../types/report';

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

// Save or update report in cloud
export async function saveReportToCloud(report: ReportData): Promise<void> {
  try {
    const docRef = doc(db, REPORTS_COLLECTION, report.id);
    const cleanPayload = {
      namaSiswa: report.namaSiswa || '',
      tanggal: report.tanggal || '',
      jenjang: report.jenjang || 'SD',
      mataPelajaran: report.mataPelajaran || '',
      materi: report.materiDipelajari || '',
      perkembangan: report.evaluasiSiswa || '',
      tugasRumah: report.tugasRumah || '',
      catatanOrtu: report.catatanOrangTua || '',
      namaPengajar: report.namaPengajar || 'Dessa Mentari Team',
      skorPemahaman: Number(report.skorPemahaman) || 80,
      skorKeaktifan: Number(report.skorKeaktifan) || 80,
      skorFokus: Number(report.skorFokus) || 80,
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

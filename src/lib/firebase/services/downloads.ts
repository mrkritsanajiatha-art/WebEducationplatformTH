import {
  collection, query, orderBy, where, getDocs, getDoc,
  doc, addDoc, updateDoc, deleteDoc, serverTimestamp, limit,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import type { Download, AccessLevel } from '@/types'

export async function getDownloadsList(opts?: { category?: string; accessLevel?: AccessLevel; maxItems?: number }) {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(opts?.maxItems ?? 50)]
  if (opts?.category) constraints.unshift(where('category', '==', opts.category))
  const snap = await getDocs(query(collection(db, COLLECTIONS.downloads), ...constraints))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Download))
}

export async function getDownloadById(id: string) {
  const snap = await getDoc(doc(db, COLLECTIONS.downloads, id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Download) : null
}

export async function saveDownload(
  id: string | null,
  data: Omit<Download, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount'>,
) {
  if (id) {
    await updateDoc(doc(db, COLLECTIONS.downloads, id), { ...data, updatedAt: serverTimestamp() })
    return id
  }
  const ref = await addDoc(collection(db, COLLECTIONS.downloads), {
    ...data,
    downloadCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function deleteDownload(id: string) {
  return deleteDoc(doc(db, COLLECTIONS.downloads, id))
}

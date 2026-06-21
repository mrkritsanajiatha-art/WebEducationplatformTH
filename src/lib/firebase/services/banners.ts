'use client'
import { collection, query, orderBy, getDocs, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'
import type { Banner } from '@/types'

export async function getBannersList(): Promise<Banner[]> {
  const q = query(collection(db, COLLECTIONS.banners), orderBy('order', 'asc'))
  const snap = await withFirestoreTimeout(getDocs(q))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Banner))
}

export async function saveBanner(id: string | null, data: Omit<Banner, 'id'>): Promise<string> {
  if (id) {
    await updateDoc(doc(db, COLLECTIONS.banners, id), { ...data })
    return id
  }
  const ref = await addDoc(collection(db, COLLECTIONS.banners), { ...data })
  return ref.id
}

export async function deleteBanner(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.banners, id))
}

export async function toggleBanner(id: string, active: boolean): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.banners, id), { active })
}

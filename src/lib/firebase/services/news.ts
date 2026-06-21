import {
  collection, query, orderBy, where, getDocs, getDoc,
  doc, addDoc, updateDoc, deleteDoc, serverTimestamp, limit,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import type { News, NewsStatus } from '@/types'

export async function getNewsList(opts?: { status?: NewsStatus; maxItems?: number }) {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(opts?.maxItems ?? 50)]
  if (opts?.status) constraints.unshift(where('status', '==', opts.status))
  const snap = await getDocs(query(collection(db, COLLECTIONS.news), ...constraints))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as News))
}

export async function getNewsById(id: string) {
  const snap = await getDoc(doc(db, COLLECTIONS.news, id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as News) : null
}

export async function getNewsBySlug(slug: string) {
  const snap = await getDocs(query(
    collection(db, COLLECTIONS.news),
    where('slug', '==', slug),
    where('status', '==', 'published'),
    limit(1),
  ))
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as News
}

export async function saveNews(
  id: string | null,
  data: Omit<News, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>,
) {
  if (id) {
    await updateDoc(doc(db, COLLECTIONS.news, id), { ...data, updatedAt: serverTimestamp() })
    return id
  }
  const ref = await addDoc(collection(db, COLLECTIONS.news), {
    ...data,
    viewCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function deleteNews(id: string) {
  return deleteDoc(doc(db, COLLECTIONS.news, id))
}

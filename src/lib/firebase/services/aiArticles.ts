import {
  collection, query, orderBy, where, getDocs, getDoc,
  doc, addDoc, updateDoc, deleteDoc, serverTimestamp, limit,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import type { AiArticle } from '@/types'

export async function getAiArticlesList(opts?: { category?: string; maxItems?: number }) {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(opts?.maxItems ?? 50)]
  if (opts?.category) constraints.unshift(where('category', '==', opts.category))
  const snap = await getDocs(query(collection(db, COLLECTIONS.aiArticles), ...constraints))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as AiArticle))
}

export async function getAiArticleById(id: string) {
  const snap = await getDoc(doc(db, COLLECTIONS.aiArticles, id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as AiArticle) : null
}

export async function getAiArticleBySlug(slug: string) {
  const snap = await getDocs(query(
    collection(db, COLLECTIONS.aiArticles),
    where('slug', '==', slug),
    where('status', '==', 'published'),
    limit(1),
  ))
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as AiArticle
}

export async function saveAiArticle(
  id: string | null,
  data: Omit<AiArticle, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>,
) {
  if (id) {
    await updateDoc(doc(db, COLLECTIONS.aiArticles, id), { ...data, updatedAt: serverTimestamp() })
    return id
  }
  const ref = await addDoc(collection(db, COLLECTIONS.aiArticles), {
    ...data,
    viewCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function deleteAiArticle(id: string) {
  return deleteDoc(doc(db, COLLECTIONS.aiArticles, id))
}

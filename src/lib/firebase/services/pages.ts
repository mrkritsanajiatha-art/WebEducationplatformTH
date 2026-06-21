'use client'
import { collection, query, where, orderBy, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'
import type { Page, PageBlock } from '@/types'

export async function getPagesList(): Promise<Page[]> {
  const q = query(collection(db, COLLECTIONS.pages), orderBy('updatedAt', 'desc'))
  const snap = await withFirestoreTimeout(getDocs(q))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Page))
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const q = query(collection(db, COLLECTIONS.pages), where('slug', '==', slug), where('status', '==', 'published'))
  const snap = await withFirestoreTimeout(getDocs(q))
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Page
}

export async function getPageById(id: string): Promise<Page | null> {
  const snap = await withFirestoreTimeout(getDoc(doc(db, COLLECTIONS.pages, id)))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Page
}

export async function savePage(id: string | null, data: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  if (id) {
    await updateDoc(doc(db, COLLECTIONS.pages, id), { ...data, updatedAt: serverTimestamp() })
    return id
  }
  const ref = await addDoc(collection(db, COLLECTIONS.pages), {
    ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function deletePage(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.pages, id))
}

export async function updateBlocks(id: string, blocks: PageBlock[]): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.pages, id), { blocks, updatedAt: serverTimestamp() })
}

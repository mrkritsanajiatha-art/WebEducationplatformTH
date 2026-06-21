import {
  collection, query, orderBy, where, getDocs, getDoc,
  doc, addDoc, updateDoc, deleteDoc, serverTimestamp, limit,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import type { Prompt } from '@/types'

export async function getPromptsList(opts?: { category?: string; maxItems?: number }) {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(opts?.maxItems ?? 50)]
  if (opts?.category) constraints.unshift(where('category', '==', opts.category))
  const snap = await getDocs(query(collection(db, COLLECTIONS.prompts), ...constraints))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Prompt))
}

export async function getPromptById(id: string) {
  const snap = await getDoc(doc(db, COLLECTIONS.prompts, id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Prompt) : null
}

export async function savePrompt(
  id: string | null,
  data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'useCount'>,
) {
  if (id) {
    await updateDoc(doc(db, COLLECTIONS.prompts, id), { ...data, updatedAt: serverTimestamp() })
    return id
  }
  const ref = await addDoc(collection(db, COLLECTIONS.prompts), {
    ...data,
    useCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function deletePrompt(id: string) {
  return deleteDoc(doc(db, COLLECTIONS.prompts, id))
}

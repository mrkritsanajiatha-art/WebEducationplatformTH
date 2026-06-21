'use client'
import { collection, query, where, orderBy, getDocs, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'
import type { MenuItem, MenuLocation } from '@/types'

export async function getMenuItems(location?: MenuLocation): Promise<MenuItem[]> {
  const q = location
    ? query(collection(db, COLLECTIONS.menus), where('location', '==', location), orderBy('order', 'asc'))
    : query(collection(db, COLLECTIONS.menus), orderBy('order', 'asc'))
  const snap = await withFirestoreTimeout(getDocs(q))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem))
}

export async function saveMenuItem(id: string | null, data: Omit<MenuItem, 'id'>): Promise<string> {
  if (id) {
    await updateDoc(doc(db, COLLECTIONS.menus, id), { ...data })
    return id
  }
  const ref = await addDoc(collection(db, COLLECTIONS.menus), { ...data })
  return ref.id
}

export async function deleteMenuItem(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.menus, id))
}

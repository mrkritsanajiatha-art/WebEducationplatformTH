'use client'
import { collection, query, where, getDocs, getDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'
import type { Certificate } from '@/types'

export async function getCertificateById(id: string): Promise<Certificate | null> {
  const snap = await withFirestoreTimeout(getDoc(doc(db, COLLECTIONS.certificates, id)))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Certificate
}

export async function getCertificatesByUser(userId: string): Promise<Certificate[]> {
  const q = query(collection(db, COLLECTIONS.certificates), where('userId', '==', userId))
  const snap = await withFirestoreTimeout(getDocs(q))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Certificate))
}

export async function issueCertificate(data: Omit<Certificate, 'id' | 'issuedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.certificates), {
    ...data,
    issuedAt: serverTimestamp(),
  })
  return ref.id
}

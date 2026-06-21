'use client'
import { collection, query, where, orderBy, getDocs, getDoc, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'
import type { Payment, PaymentStatus } from '@/types'

export async function getPaymentsList(opts?: { status?: PaymentStatus; maxItems?: number }): Promise<Payment[]> {
  const q = opts?.status
    ? query(collection(db, COLLECTIONS.payments), where('status', '==', opts.status), orderBy('createdAt', 'desc'))
    : query(collection(db, COLLECTIONS.payments), orderBy('createdAt', 'desc'))
  const snap = await withFirestoreTimeout(getDocs(q))
  let docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Payment))
  if (opts?.maxItems) docs = docs.slice(0, opts.maxItems)
  return docs
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  const snap = await withFirestoreTimeout(getDoc(doc(db, COLLECTIONS.payments, id)))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Payment
}

export async function createPayment(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.payments), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updatePaymentStatus(id: string, status: PaymentStatus, extra?: Partial<Payment>): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.payments, id), {
    status,
    ...extra,
    updatedAt: serverTimestamp(),
  })
}

export async function updatePaymentSlip(id: string, slipUrl: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.payments, id), {
    slipUrl,
    status: 'verifying' as PaymentStatus,
    updatedAt: serverTimestamp(),
  })
}

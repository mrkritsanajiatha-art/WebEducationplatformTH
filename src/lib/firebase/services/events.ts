'use client'
import { collection, query, where, orderBy, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, increment } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'
import type { Event, EventRegistration, EventStatus } from '@/types'

export async function getEventsList(opts?: { status?: EventStatus; maxItems?: number }): Promise<Event[]> {
  const q = opts?.status
    ? query(collection(db, COLLECTIONS.events), where('status', '==', opts.status), orderBy('startAt', 'asc'))
    : query(collection(db, COLLECTIONS.events), orderBy('startAt', 'asc'))
  const snap = await withFirestoreTimeout(getDocs(q))
  let docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Event))
  if (opts?.maxItems) docs = docs.slice(0, opts.maxItems)
  return docs
}

export async function getEventById(id: string): Promise<Event | null> {
  const snap = await withFirestoreTimeout(getDoc(doc(db, COLLECTIONS.events, id)))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Event
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const q = query(collection(db, COLLECTIONS.events), where('slug', '==', slug), where('status', '==', 'published'))
  const snap = await withFirestoreTimeout(getDocs(q))
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Event
}

export async function saveEvent(id: string | null, data: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'registeredCount'>): Promise<string> {
  if (id) {
    await updateDoc(doc(db, COLLECTIONS.events, id), { ...data, updatedAt: serverTimestamp() })
    return id
  }
  const ref = await addDoc(collection(db, COLLECTIONS.events), {
    ...data, registeredCount: 0, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function deleteEvent(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.events, id))
}

export async function getRegistrationByUserAndEvent(userId: string, eventId: string): Promise<EventRegistration | null> {
  const q = query(
    collection(db, COLLECTIONS.eventRegistrations),
    where('userId', '==', userId),
    where('eventId', '==', eventId),
  )
  const snap = await withFirestoreTimeout(getDocs(q))
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as EventRegistration
}

export async function registerEvent(data: Omit<EventRegistration, 'id' | 'registeredAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.eventRegistrations), {
    ...data, registeredAt: serverTimestamp(), updatedAt: serverTimestamp(),
  })
  await updateDoc(doc(db, COLLECTIONS.events, data.eventId), { registeredCount: increment(1) })
  return ref.id
}

export async function cancelRegistration(id: string, eventId: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.eventRegistrations, id), { status: 'cancelled', updatedAt: serverTimestamp() })
  await updateDoc(doc(db, COLLECTIONS.events, eventId), { registeredCount: increment(-1) })
}

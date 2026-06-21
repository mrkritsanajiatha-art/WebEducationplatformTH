'use client'
import { collection, query, where, orderBy, limit, getDocs, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'
import type { Notification, NotificationType } from '@/types'

export async function getNotificationsByUser(userId: string, maxItems = 20): Promise<Notification[]> {
  const q = query(
    collection(db, COLLECTIONS.notifications),
    where('userId', 'in', [userId, null]),
    orderBy('createdAt', 'desc'),
    limit(maxItems),
  )
  const snap = await withFirestoreTimeout(getDocs(q))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Notification))
}

export async function markAsRead(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.notifications, id), { read: true })
}

export async function markAllAsRead(userId: string): Promise<void> {
  const notifs = await getNotificationsByUser(userId)
  const unread = notifs.filter(n => !n.read)
  await Promise.all(unread.map(n => markAsRead(n.id)))
}

export async function sendNotification(data: {
  userId: string | null; title: string; body: string
  type: NotificationType; link?: string
}): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.notifications), {
    userId: data.userId,
    title: data.title,
    body: data.body,
    type: data.type,
    link: data.link ?? '',
    read: false,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

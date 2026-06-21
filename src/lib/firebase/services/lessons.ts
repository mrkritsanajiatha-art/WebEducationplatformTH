'use client'
import { collection, query, where, orderBy, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'
import type { CourseLesson } from '@/types'

export async function getLessonsByCourse(courseId: string): Promise<CourseLesson[]> {
  const q = query(
    collection(db, COLLECTIONS.courseLessons),
    where('courseId', '==', courseId),
    orderBy('order', 'asc'),
  )
  const snap = await withFirestoreTimeout(getDocs(q))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as CourseLesson))
}

export async function getLessonById(id: string): Promise<CourseLesson | null> {
  const snap = await withFirestoreTimeout(getDoc(doc(db, COLLECTIONS.courseLessons, id)))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as CourseLesson
}

export async function saveLesson(
  id: string | null,
  data: Omit<CourseLesson, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<string> {
  if (id) {
    await updateDoc(doc(db, COLLECTIONS.courseLessons, id), { ...data, updatedAt: serverTimestamp() })
    return id
  }
  const ref = await addDoc(collection(db, COLLECTIONS.courseLessons), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function deleteLesson(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.courseLessons, id))
}

import {
  collection, query, orderBy, where, getDocs, getDoc,
  doc, addDoc, updateDoc, deleteDoc, serverTimestamp, limit,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import type { Course, CourseStatus, AccessLevel } from '@/types'

export async function getCoursesList(opts?: { status?: CourseStatus; accessLevel?: AccessLevel; maxItems?: number }) {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(opts?.maxItems ?? 50)]
  if (opts?.status) constraints.unshift(where('status', '==', opts.status))
  const snap = await getDocs(query(collection(db, COLLECTIONS.courses), ...constraints))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Course))
}

export async function getCourseById(id: string) {
  const snap = await getDoc(doc(db, COLLECTIONS.courses, id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Course) : null
}

export async function getCourseBySlug(slug: string) {
  const snap = await getDocs(query(
    collection(db, COLLECTIONS.courses),
    where('slug', '==', slug),
    where('status', '==', 'published'),
    limit(1),
  ))
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as Course
}

export async function saveCourse(
  id: string | null,
  data: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'enrollCount' | 'lessonCount'>,
) {
  if (id) {
    await updateDoc(doc(db, COLLECTIONS.courses, id), { ...data, updatedAt: serverTimestamp() })
    return id
  }
  const ref = await addDoc(collection(db, COLLECTIONS.courses), {
    ...data,
    enrollCount: 0,
    lessonCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function deleteCourse(id: string) {
  return deleteDoc(doc(db, COLLECTIONS.courses, id))
}

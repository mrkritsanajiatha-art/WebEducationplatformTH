'use client'
import { collection, query, where, getDocs, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'
import type { CourseEnrollment, EnrollmentStatus } from '@/types'

export async function getEnrollmentByUserAndCourse(userId: string, courseId: string): Promise<CourseEnrollment | null> {
  const q = query(
    collection(db, COLLECTIONS.courseEnrollments),
    where('userId', '==', userId),
    where('courseId', '==', courseId),
  )
  const snap = await withFirestoreTimeout(getDocs(q))
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as CourseEnrollment
}

export async function getEnrollmentsByUser(userId: string): Promise<CourseEnrollment[]> {
  const q = query(collection(db, COLLECTIONS.courseEnrollments), where('userId', '==', userId))
  const snap = await withFirestoreTimeout(getDocs(q))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as CourseEnrollment))
}

export async function createEnrollment(
  data: Omit<CourseEnrollment, 'id' | 'enrolledAt' | 'updatedAt'>,
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.courseEnrollments), {
    ...data,
    enrolledAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateEnrollmentStatus(
  id: string,
  status: EnrollmentStatus,
  extra?: Partial<CourseEnrollment>,
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.courseEnrollments, id), {
    status,
    ...extra,
    updatedAt: serverTimestamp(),
  })
}

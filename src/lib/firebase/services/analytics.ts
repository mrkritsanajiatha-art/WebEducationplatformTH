'use client'
import { collection, query, where, orderBy, limit, getDocs, getCountFromServer } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'

export interface DashboardStats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  activeEnrollments: number
  pendingPayments: number
  totalRevenue: number
  totalEvents: number
  totalPosts: number
}

export interface RecentActivity {
  id: string
  type: 'enrollment' | 'payment' | 'user' | 'post'
  label: string
  sub: string
  time: Date
}

async function safeCount(q: Parameters<typeof getCountFromServer>[0]): Promise<number> {
  try {
    const snap = await withFirestoreTimeout(getCountFromServer(q))
    return snap.data().count
  } catch {
    return 0
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    activeEnrollments,
    pendingPayments,
    totalEvents,
    totalPosts,
  ] = await Promise.all([
    safeCount(collection(db, COLLECTIONS.users)),
    safeCount(query(collection(db, COLLECTIONS.courses), where('status', '==', 'published'))),
    safeCount(collection(db, COLLECTIONS.courseEnrollments)),
    safeCount(query(collection(db, COLLECTIONS.courseEnrollments), where('status', '==', 'active'))),
    safeCount(query(collection(db, COLLECTIONS.payments), where('status', 'in', ['pending', 'verifying']))),
    safeCount(query(collection(db, COLLECTIONS.events), where('status', '==', 'published'))),
    safeCount(query(collection(db, COLLECTIONS.communityPosts), where('status', '==', 'published'))),
  ])

  // Revenue: sum approved payments
  let totalRevenue = 0
  try {
    const paySnap = await withFirestoreTimeout(getDocs(
      query(collection(db, COLLECTIONS.payments), where('status', '==', 'approved'), limit(200))
    ))
    totalRevenue = paySnap.docs.reduce((sum, d) => sum + (d.data().amount ?? 0), 0)
  } catch { /* ignore */ }

  return { totalUsers, totalCourses, totalEnrollments, activeEnrollments, pendingPayments, totalRevenue, totalEvents, totalPosts }
}

export async function getRecentActivity(maxItems = 10): Promise<RecentActivity[]> {
  const results: RecentActivity[] = []
  try {
    const [enrollSnap, paySnap, userSnap, postSnap] = await Promise.all([
      withFirestoreTimeout(getDocs(query(collection(db, COLLECTIONS.courseEnrollments), orderBy('enrolledAt', 'desc'), limit(3)))),
      withFirestoreTimeout(getDocs(query(collection(db, COLLECTIONS.payments), orderBy('createdAt', 'desc'), limit(3)))),
      withFirestoreTimeout(getDocs(query(collection(db, COLLECTIONS.users), orderBy('createdAt', 'desc'), limit(3)))),
      withFirestoreTimeout(getDocs(query(collection(db, COLLECTIONS.communityPosts), where('status', '==', 'published'), orderBy('createdAt', 'desc'), limit(3)))),
    ])
    enrollSnap.docs.forEach(d => {
      const data = d.data()
      results.push({ id: d.id, type: 'enrollment', label: `ลงทะเบียน: ${data.courseTitle ?? ''}`, sub: data.status, time: data.enrolledAt?.toDate() ?? new Date() })
    })
    paySnap.docs.forEach(d => {
      const data = d.data()
      results.push({ id: d.id, type: 'payment', label: `ชำระเงิน: ${data.courseTitle ?? ''}`, sub: `฿${(data.amount ?? 0).toLocaleString()} · ${data.status}`, time: data.createdAt?.toDate() ?? new Date() })
    })
    userSnap.docs.forEach(d => {
      const data = d.data()
      results.push({ id: d.id, type: 'user', label: `สมาชิกใหม่: ${data.displayName ?? data.email ?? ''}`, sub: data.role, time: data.createdAt?.toDate() ?? new Date() })
    })
    postSnap.docs.forEach(d => {
      const data = d.data()
      results.push({ id: d.id, type: 'post', label: `โพสต์ใหม่`, sub: data.category, time: data.createdAt?.toDate() ?? new Date() })
    })
  } catch { /* ignore */ }
  return results.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, maxItems)
}

'use client'
import {
  collection, doc, addDoc, getDoc, getDocs, setDoc, query, where,
  documentId, serverTimestamp, FirestoreError,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'
import type { VipApplication, VipVerification } from '@/types'

/** Firestore doc ids cannot contain "/". memberIds like "VIP-B1-0006" are safe. */
function safeId(memberId: string): string {
  return memberId.replace(/[/.#$[\]]/g, '_')
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: 'already' | 'error' }

/**
 * Locks a VIP name row as verified. Doc id == memberId, create-only in rules,
 * so a second attempt on the same name is rejected → enforces 1 ชื่อ = 1 VIP.
 * Stores NO personal contact info (public-readable).
 */
export async function verifyVipMember(member: {
  memberId: string
  prefix: string
  firstName: string
  lastName: string
  source: string
}): Promise<VerifyResult> {
  const ref = doc(db, COLLECTIONS.vipVerifications, safeId(member.memberId))

  // Pre-check for a friendlier message (rules are the real guard).
  try {
    const existing = await withFirestoreTimeout(getDoc(ref))
    if (existing.exists()) return { ok: false, reason: 'already' }
  } catch {
    /* read may be blocked if rules aren't deployed — fall through */
  }

  try {
    await withFirestoreTimeout(
      // create-only rule → an overwrite of an existing lock is rejected
      setDoc(ref, {
        memberId:  member.memberId,
        prefix:    member.prefix,
        firstName: member.firstName,
        lastName:  member.lastName,
        source:    member.source,
        status:    'verified',
        verifiedAt: serverTimestamp(),
      }),
    )
    return { ok: true }
  } catch (e) {
    // permission-denied can mean either (a) the lock already exists (someone
    // verified between our pre-check and write), or (b) rules misconfigured.
    // Re-read to tell them apart instead of assuming "already".
    if (e instanceof FirestoreError && e.code === 'permission-denied') {
      try {
        const recheck = await withFirestoreTimeout(getDoc(ref))
        if (recheck.exists()) return { ok: false, reason: 'already' }
      } catch {
        /* read also blocked → genuine config/permission error */
      }
    }
    return { ok: false, reason: 'error' }
  }
}

/** Returns the set of memberIds (from the given list) that are already verified. */
export async function getVerifiedIds(memberIds: string[]): Promise<Set<string>> {
  const ids = Array.from(new Set(memberIds.map(safeId))).slice(0, 300)
  if (ids.length === 0) return new Set()

  const verified = new Set<string>()
  // Firestore `in` supports max 30 values per query.
  for (let i = 0; i < ids.length; i += 30) {
    const chunk = ids.slice(i, i + 30)
    const q = query(
      collection(db, COLLECTIONS.vipVerifications),
      where(documentId(), 'in', chunk),
    )
    const snap = await withFirestoreTimeout(getDocs(q))
    snap.forEach(d => verified.add(d.id))
  }
  return verified
}

export async function getVerification(memberId: string): Promise<VipVerification | null> {
  const snap = await withFirestoreTimeout(
    getDoc(doc(db, COLLECTIONS.vipVerifications, safeId(memberId))),
  )
  return snap.exists() ? (snap.data() as VipVerification) : null
}

/** Stores a new VIP membership application (PII; staff-only read in rules). */
export async function submitVipApplication(
  data: Omit<VipApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
): Promise<string> {
  const ref = await withFirestoreTimeout(
    addDoc(collection(db, COLLECTIONS.vipApplications), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
  )
  return ref.id
}

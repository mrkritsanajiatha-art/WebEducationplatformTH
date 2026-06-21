'use client'
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, increment } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'
import type { CommunityComment } from '@/types'

export async function getCommentsByPost(postId: string): Promise<CommunityComment[]> {
  const q = query(
    collection(db, COLLECTIONS.communityComments),
    where('postId', '==', postId),
    orderBy('createdAt', 'asc'),
  )
  const snap = await withFirestoreTimeout(getDocs(q))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as CommunityComment))
}

export async function addComment(data: Omit<CommunityComment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.communityComments), {
    ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  })
  await updateDoc(doc(db, COLLECTIONS.communityPosts, data.postId), { commentCount: increment(1) })
  return ref.id
}

export async function deleteComment(id: string, postId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.communityComments, id))
  await updateDoc(doc(db, COLLECTIONS.communityPosts, postId), { commentCount: increment(-1) })
}

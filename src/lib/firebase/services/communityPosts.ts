'use client'
import { collection, query, where, orderBy, limit, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, increment, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'
import type { CommunityPost, CommunityCategory } from '@/types'

export async function getPostsList(opts?: { category?: CommunityCategory; maxItems?: number }): Promise<CommunityPost[]> {
  const q = opts?.category
    ? query(collection(db, COLLECTIONS.communityPosts), where('status', '==', 'published'), where('category', '==', opts.category), orderBy('createdAt', 'desc'), limit(opts?.maxItems ?? 30))
    : query(collection(db, COLLECTIONS.communityPosts), where('status', '==', 'published'), orderBy('createdAt', 'desc'), limit(opts?.maxItems ?? 30))
  const snap = await withFirestoreTimeout(getDocs(q))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as CommunityPost))
}

export async function getPostById(id: string): Promise<CommunityPost | null> {
  const snap = await withFirestoreTimeout(getDoc(doc(db, COLLECTIONS.communityPosts, id)))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as CommunityPost
}

export async function createPost(data: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'commentCount' | 'shareCount'>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.communityPosts), {
    ...data, likeCount: 0, commentCount: 0, shareCount: 0,
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updatePost(id: string, data: Partial<CommunityPost>): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.communityPosts, id), { ...data, updatedAt: serverTimestamp() })
}

export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.communityPosts, id))
}

export async function toggleLike(postId: string, uid: string, liked: boolean): Promise<void> {
  const likeRef = doc(db, COLLECTIONS.communityPosts, postId, 'likes', uid)
  const postRef = doc(db, COLLECTIONS.communityPosts, postId)
  if (liked) {
    await deleteDoc(likeRef)
    await updateDoc(postRef, { likeCount: increment(-1) })
  } else {
    await setDoc(likeRef, { uid, createdAt: serverTimestamp() })
    await updateDoc(postRef, { likeCount: increment(1) })
  }
}

export async function checkLiked(postId: string, uid: string): Promise<boolean> {
  const snap = await withFirestoreTimeout(getDoc(doc(db, COLLECTIONS.communityPosts, postId, 'likes', uid)))
  return snap.exists()
}

export async function getAllPostsAdmin(): Promise<CommunityPost[]> {
  const q = query(collection(db, COLLECTIONS.communityPosts), orderBy('createdAt', 'desc'), limit(100))
  const snap = await withFirestoreTimeout(getDocs(q))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as CommunityPost))
}

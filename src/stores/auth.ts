'use client'
import { create } from 'zustand'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/collections'
import type { UserRole } from '@/types'

interface AuthState {
  user: FirebaseUser | null
  role: UserRole
  loading: boolean
  setUser: (user: FirebaseUser | null, role?: UserRole) => void
  setLoading: (v: boolean) => void
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

async function persistSession(user: FirebaseUser) {
  const token = await user.getIdToken()
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: 'guest',
  loading: true,

  setUser: (user, role = 'guest') => set({ user, role }),
  setLoading: (loading) => set({ loading }),

  signIn: async (email, password) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    await persistSession(user)
  },

  signInWithGoogle: async () => {
    const provider = new GoogleAuthProvider()
    const { user } = await signInWithPopup(auth, provider)
    await persistSession(user)
    // Upsert user doc — ignore Firestore permission errors (rules may not allow yet)
    try {
      await setDoc(doc(db, COLLECTIONS.users, user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoUrl: user.photoURL,
        role: 'member',
        status: 'active',
        updatedAt: serverTimestamp(),
      }, { merge: true })
    } catch { /* ignore */ }
  },

  signUp: async (email, password, displayName) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, { displayName })
    await setDoc(doc(db, COLLECTIONS.users, user.uid), {
      uid: user.uid,
      email,
      displayName,
      photoUrl: null,
      phone: '',
      role: 'member',
      vipMemberId: null,
      province: '',
      school: '',
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    await persistSession(user)
  },

  signOut: async () => {
    await fbSignOut(auth)
    await fetch('/api/auth/session', { method: 'DELETE' })
    set({ user: null, role: 'guest' })
  },

  resetPassword: async (email) => {
    await sendPasswordResetEmail(auth, email)
  },
}))

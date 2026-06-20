'use client'
import { create } from 'zustand'
import type { User as FirebaseUser } from 'firebase/auth'
import type { UserRole } from '@/types'

interface AuthState {
  user: FirebaseUser | null
  role: UserRole
  loading: boolean
  setUser: (user: FirebaseUser | null, role?: UserRole) => void
  setLoading: (v: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: 'guest',
  loading: true,
  setUser: (user, role = 'guest') => set({ user, role }),
  setLoading: (loading) => set({ loading }),
}))

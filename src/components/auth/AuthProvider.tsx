'use client'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser)
  const setLoading = useAuthStore((s) => s.setLoading)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult()
        const role = (tokenResult.claims['role'] as UserRole) ?? 'member'
        setUser(firebaseUser, role)
      } else {
        setUser(null, 'guest')
      }
      setLoading(false)
    })
    return unsub
  }, [setUser, setLoading])

  return <>{children}</>
}

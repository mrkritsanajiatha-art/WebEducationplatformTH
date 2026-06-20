'use client'
import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  searchOpen: boolean
  setSidebarOpen: (v: boolean) => void
  setMobileMenuOpen: (v: boolean) => void
  setSearchOpen: (v: boolean) => void
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
  setSearchOpen: (v) => set({ searchOpen: v }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))

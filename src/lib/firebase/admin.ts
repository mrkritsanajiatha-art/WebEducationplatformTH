import 'server-only'
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { getStorage, type Storage } from 'firebase-admin/storage'

function createAdminApp(): App {
  if (getApps().length) return getApps()[0]

  const credential = cert({
    projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  })

  return initializeApp({ credential, storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET })
}

const adminApp = createAdminApp()

export const adminDb: Firestore = getFirestore(adminApp)
export const adminAuth: Auth = getAuth(adminApp)
export const adminStorage: Storage = getStorage(adminApp)

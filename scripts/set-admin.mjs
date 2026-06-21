// One-time script: set role: superadmin for a Firebase Auth user
// Usage: node scripts/set-admin.mjs <UID>
// Requires: gcloud auth application-default login --project=educationplatformth2026

import { initializeApp, applicationDefault } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const uid = process.argv[2]

if (!uid) {
  console.error('❌  ระบุ UID: node scripts/set-admin.mjs <UID>')
  process.exit(1)
}

const app = initializeApp({
  credential: applicationDefault(),
  projectId: 'educationplatformth2026',
})

const auth = getAuth(app)

await auth.setCustomUserClaims(uid, { role: 'superadmin' })
console.log(`✅  UID ${uid} เป็น superadmin แล้ว`)
console.log('👉  logout แล้ว login ใหม่ที่ /login เพื่อให้ token refresh')
process.exit(0)

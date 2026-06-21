import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = '__session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 14 // 14 days

export async function POST(req: NextRequest) {
  const { token } = await req.json() as { token: string }

  if (!token) {
    return NextResponse.json({ error: 'token required' }, { status: 400 })
  }

  const res = NextResponse.json({ ok: true })

  const hasAdminCreds = !!(
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY
  )

  if (hasAdminCreds) {
    // Production: create a proper Firebase session cookie via Admin SDK
    // We import admin lazily here so the module is only resolved on server
    const { adminAuth } = await import('@/lib/firebase/admin')
    const sessionCookie = await adminAuth.createSessionCookie(token, {
      expiresIn: SESSION_MAX_AGE * 1000,
    })
    res.cookies.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    })
  } else {
    // Dev mode (no service account yet): use raw ID token as session value
    // WARNING: not cryptographically verified — replace once service account is added
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    })
  }

  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(SESSION_COOKIE)
  return res
}

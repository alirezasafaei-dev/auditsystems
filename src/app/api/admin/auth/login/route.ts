import { NextRequest, NextResponse } from 'next/server'
import { validateAdminCredentials, createAdminSession, isSessionAuthConfigured } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  if (!isSessionAuthConfigured()) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 503 })
  }

  try {
    const { username, password } = await request.json()
    
    if (validateAdminCredentials(username, password)) {
      await createAdminSession()
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

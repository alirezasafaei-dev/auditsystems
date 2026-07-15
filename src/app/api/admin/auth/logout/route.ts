import { NextResponse } from 'next/server'
import { clearAdminSession } from '@/lib/admin-auth'

export async function POST() {
  try {
    await clearAdminSession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json({ error: 'Failed to revoke admin session' }, { status: 500 })
  }
}

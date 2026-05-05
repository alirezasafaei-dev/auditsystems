import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [totalAudits, totalOrders, pendingOrders, recentAudits] = await Promise.all([
      prisma.auditRun.count(),
      prisma.auditOrder.count(),
      prisma.auditOrder.count({ where: { status: 'PENDING' } }),
      prisma.auditRun.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          url: true,
          status: true,
          createdAt: true,
        },
      }),
    ])

    return NextResponse.json({
      totalAudits,
      totalOrders,
      pendingOrders,
      recentAudits,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

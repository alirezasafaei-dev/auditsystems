'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
interface Stats {
  totalAudits: number
  totalOrders: number
  pendingOrders: number
  recentAudits: Array<{
    id: string
    url: string
    status: string
    createdAt: string
  }>
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => {
        if (res.status === 401) {
          router.push('/admin/login')
          return null
        }
        return res.json()
      })
      .then(data => {
        if (data) {
          setStats(data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Total Audits</h3>
          </div>
          <div>
            <p className="text-4xl font-bold">{stats?.totalAudits || 0}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Total Orders</h3>
          </div>
          <div>
            <p className="text-4xl font-bold">{stats?.totalOrders || 0}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Pending Orders</h3>
          </div>
          <div>
            <p className="text-4xl font-bold">{stats?.pendingOrders || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Recent Audits</h3>
        </div>
        <div>
          <div className="space-y-4">
            {stats?.recentAudits?.map(audit => (
              <div key={audit.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{audit.url}</p>
                  <p className="text-sm text-gray-500">{new Date(audit.createdAt).toLocaleString('fa-IR')}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {audit.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

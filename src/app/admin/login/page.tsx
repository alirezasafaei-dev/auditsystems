import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Login - Audit Systems',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Admin Login</h2>
        <p className="text-center text-gray-600">
          Authentication system will be configured in production
        </p>
      </div>
    </div>
  )
}

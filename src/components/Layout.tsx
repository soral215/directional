import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../stores'
import { healthApi } from '../api'
import { Button } from './Button'
import { NavItem } from './NavItem'

const menuItems = [
  { to: '/posts', label: '게시판' },
  { to: '/charts', label: '차트' },
]

export const Layout = () => {
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const health = useQuery({
    queryKey: ['health'],
    queryFn: () => healthApi.check(),
    refetchInterval: 30000,
    retry: 1,
  })

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-4 lg:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Directional
            <span
              className={`w-2 h-2 rounded-full ${
                health.isLoading ? 'bg-yellow-500' : health.isSuccess ? 'bg-green-500' : 'bg-red-500'
              }`}
              title={health.isLoading ? '연결 확인중...' : health.isSuccess ? '서버 연결됨' : '서버 연결 안됨'}
            />
          </h1>
        </div>
        <div className="flex items-center gap-2 lg:gap-4">
          <span className="text-gray-300 text-sm lg:text-base hidden sm:block">{user?.email}</span>
          <Button variant="secondary" size="sm" onClick={logout}>
            로그아웃
          </Button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-30
            w-56 bg-gray-800 border-r border-gray-700 p-4
            transform transition-transform duration-200 ease-in-out
            lg:transform-none lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            top-[65px] lg:top-0
          `}
        >
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavItem key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}>
                {item.label}
              </NavItem>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

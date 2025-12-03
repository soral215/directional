import { Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores'
import { Button } from './Button'
import { NavItem } from './NavItem'

const menuItems = [
  { to: '/posts', label: '게시판' },
  { to: '/charts', label: '차트' },
]

export function Layout() {
  const { user, logout } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Directional</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">{user?.email}</span>
          <Button variant="secondary" size="sm" onClick={logout}>
            로그아웃
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-56 bg-gray-800 border-r border-gray-700 p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavItem key={item.to} to={item.to}>
                {item.label}
              </NavItem>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

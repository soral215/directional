import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

interface NavItemProps {
  to: string
  children: ReactNode
}

export function NavItem({ to, children }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-2 rounded transition ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-700'
        }`
      }
    >
      {children}
    </NavLink>
  )
}


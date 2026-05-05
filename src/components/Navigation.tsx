import { NavLink } from 'react-router-dom'
import { Home, User, Heart, RefreshCw, BookOpen } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Главная' },
  { to: '/about-me', icon: User, label: 'Обо мне' },
  { to: '/partner', icon: Heart, label: 'С партнёром' },
  { to: '/practice', icon: RefreshCw, label: 'Практика' },
  { to: '/methodology', icon: BookOpen, label: 'О методике' },
]

export default function Navigation() {
  return (
    <nav className="sticky top-14 z-40 bg-white border-b border-[#E8E4DC]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center gap-1.5 bg-[#9E8B45] text-white rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all'
                  : 'flex items-center gap-1.5 text-[#6B6560] rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap flex-shrink-0 hover:text-[#1A1918] transition-colors'
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

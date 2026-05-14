import { useEffect, useState } from 'react'
import { Home, User, Heart, RefreshCw, BookOpen } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Главная' },
  { id: 'about-me', icon: User, label: 'Обо мне' },
  { id: 'partner', icon: Heart, label: 'С партнёром' },
  { id: 'practice', icon: RefreshCw, label: 'Практика' },
  { id: 'methodology', icon: BookOpen, label: 'О методике' },
]

export default function Navigation() {
  const [activeId, setActiveId] = useState('home')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
        { threshold: 0.2, rootMargin: '-80px 0px -40% 0px' }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="sticky top-14 z-40 bg-white border-b border-[#E8E4DC]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={
                activeId === id
                  ? 'flex items-center gap-1.5 bg-[#9E8B45] text-white rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all'
                  : 'flex items-center gap-1.5 text-[#6B6560] rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap flex-shrink-0 hover:text-[#1A1918] transition-colors'
              }
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStage } from '../contexts/StageContext'
import { useAuth } from '../contexts/AuthContext'

const STAGES = [
  { id: 1 as const, label: 'Тип' },
  { id: 2 as const, label: 'Тип + Стиль' },
  { id: 3 as const, label: 'Всё' },
  { id: 4 as const, label: 'Партнёр' },
]

export default function Header() {
  const { stage, setStage, userEmail, userName } = useStage()
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E8E4DC]">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img src="/релада_logo_black.png" alt="релада" className="h-8 w-auto" />
        </div>

        {/* Stage switcher */}
        <div className="flex items-center gap-1 bg-[#F5F2EC] rounded-full px-1.5 py-1">
          {STAGES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStage(s.id)}
              className={
                stage === s.id
                  ? 'bg-[#9E8B45] text-white rounded-full px-3 py-1 text-xs font-medium transition-all'
                  : 'text-[#6B6560] rounded-full px-3 py-1 text-xs font-medium hover:text-[#1A1918] transition-colors'
              }
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* User menu */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <span className="text-xs text-[#6B6560] hidden sm:block">{userEmail}</span>
            <div className="w-8 h-8 rounded-full border-2 border-[#9E8B45] bg-[#F5F2EC] flex items-center justify-center hover:bg-[#EDE8DF] transition-colors">
              <span className="text-xs font-semibold text-[#9E8B45]">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E8E4DC] py-1 z-50">
              <div className="px-4 py-2 border-b border-[#E8E4DC]">
                <p className="text-xs font-semibold text-[#1A1918] truncate">{userName || userEmail}</p>
                <p className="text-xs text-[#6B6560] truncate">{userEmail}</p>
              </div>
              <button
                onClick={() => { navigate('/profile'); setMenuOpen(false) }}
                className="w-full text-left px-4 py-2 text-sm text-[#1A1918] hover:bg-[#F5F2EC] transition-colors"
              >
                Мой профиль
              </button>
              <button
                onClick={() => { navigate('/settings'); setMenuOpen(false) }}
                className="w-full text-left px-4 py-2 text-sm text-[#1A1918] hover:bg-[#F5F2EC] transition-colors"
              >
                Настройки
              </button>
              <div className="border-t border-[#E8E4DC] mt-1">
                <button
                  onClick={signOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#F5F2EC] transition-colors"
                >
                  Выйти
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

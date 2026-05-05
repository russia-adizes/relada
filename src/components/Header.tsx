import { useStage } from '../contexts/StageContext'

const STAGES = [
  { id: 1 as const, label: 'Тип' },
  { id: 2 as const, label: 'Тип + Стиль' },
  { id: 3 as const, label: 'Всё' },
  { id: 4 as const, label: 'Партнёр' },
]

export default function Header() {
  const { stage, setStage, userEmail, userName } = useStage()

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

        {/* User info */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-[#6B6560] hidden sm:block">{userEmail}</span>
          <div className="w-8 h-8 rounded-full border-2 border-[#9E8B45] bg-[#F5F2EC] flex items-center justify-center">
            <span className="text-xs font-semibold text-[#9E8B45]">
              {userName.charAt(0)}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

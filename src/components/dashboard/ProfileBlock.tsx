import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import { useStage } from '../../contexts/StageContext'

export default function ProfileBlock() {
  const { personalityType } = useStage()
  const navigate = useNavigate()

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold text-[#1A1918]">Мой профиль</h2>

      <div className="card-inner flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#9E8B45]/10 flex items-center justify-center flex-shrink-0">
          <User size={20} className="text-[#9E8B45]" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-[#6B6560] uppercase tracking-wide">Тип личности</p>
          {personalityType ? (
            <>
              <p className="text-2xl font-bold text-[#9E8B45] leading-tight">{personalityType}</p>
              <p className="text-xs text-[#6B6560] mt-0.5">Ваш внутренний ритм и базовые реакции.</p>
            </>
          ) : (
            <>
              <p className="text-sm text-[#1A1918] font-medium mt-0.5">Не определён</p>
              <button
                onClick={() => navigate('/test')}
                className="text-xs text-[#9E8B45] font-medium hover:underline mt-0.5"
              >
                Пройти тест →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

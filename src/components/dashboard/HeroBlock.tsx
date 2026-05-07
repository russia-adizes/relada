import { useNavigate } from 'react-router-dom'
import { useStage } from '../../contexts/StageContext'

export default function HeroBlock() {
  const { userName, personalityType } = useStage()
  const navigate = useNavigate()

  if (!personalityType) {
    return (
      <div className="card space-y-4 text-center py-8">
        <div className="w-16 h-16 rounded-full bg-[#9E8B45]/10 flex items-center justify-center mx-auto">
          <span className="text-2xl">🧭</span>
        </div>
        <div>
          <p className="text-sm text-[#6B6560]">Добро пожаловать, {userName || 'друг'}!</p>
          <h1 className="text-xl font-bold text-[#1A1918] mt-1">Ваш тип личности ещё не определён</h1>
        </div>
        <p className="text-sm text-[#6B6560] leading-relaxed max-w-xs mx-auto">
          Пройдите тест PAEI, чтобы узнать свой тип личности и получить персональные инсайты.
        </p>
        <button
          onClick={() => navigate('/test')}
          className="btn-primary mx-auto"
        >
          Пройти тест →
        </button>
      </div>
    )
  }

  return (
    <div className="card space-y-4">
      <div>
        <p className="text-sm text-[#6B6560]">Добро пожаловать, {userName}</p>
        <h1 className="text-2xl font-bold text-[#1A1918] mt-1">
          Ваш тип личности: <span className="text-[#9E8B45]">{personalityType}</span>
        </h1>
      </div>

      <p className="text-sm text-[#6B6560] leading-relaxed">
        Это ваши базовые настройки: как вы думаете, реагируете и к чему возвращаетесь в стрессе.
      </p>

      <div className="flex flex-wrap gap-3">
        <button className="btn-primary">
          Открыть мой тип личности →
        </button>
        <button className="btn-outline">
          Узнать стиль в отношениях
        </button>
      </div>

      <div className="pt-2 border-t border-[#E8E4DC]">
        <p className="text-xs text-[#6B6560] mb-2">
          Вы уже знаете, какая вы по природе. Теперь узнайте, как вы проявляетесь рядом с близкими.
        </p>
        <button className="text-sm text-[#9E8B45] font-medium hover:opacity-80 transition-opacity">
          Взять полный личный разбор
        </button>
      </div>
    </div>
  )
}

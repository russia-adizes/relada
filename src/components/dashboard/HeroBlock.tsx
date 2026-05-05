import { useStage } from '../../contexts/StageContext'

export default function HeroBlock() {
  const { userName, personalityType } = useStage()

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

import { useNavigate } from 'react-router-dom'
import { useStage } from '../../contexts/StageContext'

export default function NextStepBlock() {
  const { personalityType } = useStage()
  const navigate = useNavigate()

  if (!personalityType) {
    return (
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-[#1A1918]">Следующий шаг</h2>
        <p className="text-sm text-[#6B6560] leading-relaxed">
          Первый шаг — узнать свой тип личности. Тест займёт около 10 минут.
        </p>
        <button onClick={() => navigate('/test')} className="btn-primary">
          Пройти тест PAEI →
        </button>
      </div>
    )
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold text-[#1A1918]">Следующий шаг</h2>
      <p className="text-sm text-[#6B6560] leading-relaxed">
        Вы уже знаете свой внутренний тип. Следующий шаг покажет, как вы проявляетесь рядом с близкими.
      </p>
      <button className="btn-primary">
        Узнать стиль в отношениях →
      </button>
    </div>
  )
}

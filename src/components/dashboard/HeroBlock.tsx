import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download } from 'lucide-react'
import { useStage } from '../../contexts/StageContext'
import { useAuth } from '../../contexts/AuthContext'
import PricingSheet from '../PricingSheet'
import { generateReport } from '../../utils/generateReport'
import type { PaeiType } from '../../data/paeiQuestions'

function loadScores(part: 1 | 2): Record<PaeiType, number> {
  try {
    const raw = localStorage.getItem(`relada_scores${part}`)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { P: 1, A: 1, E: 1, I: 1 }
}

export default function HeroBlock() {
  const { userName, personalityType, relationshipStyle, accessLevel } = useStage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showPricing, setShowPricing] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  function downloadReport(part: 1 | 2) {
    const type = part === 1 ? personalityType : relationshipStyle
    if (!type) return
    generateReport({
      part,
      resultType: type,
      scores: loadScores(part),
      userName: user?.user_metadata?.name || user?.email,
    })
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Нет доступа — предлагаем тарифы
  if (accessLevel === 'none') {
    return (
      <>
        {showPricing && <PricingSheet onClose={() => setShowPricing(false)} />}
        <div className="card space-y-4 text-center py-8">
          <div className="w-16 h-16 rounded-full bg-[#9E8B45]/10 flex items-center justify-center mx-auto">
            <span className="text-2xl">🧭</span>
          </div>
          <div>
            <p className="text-sm text-[#6B6560]">Добро пожаловать, {userName || 'друг'}!</p>
            <h1 className="text-xl font-bold text-[#1A1918] mt-1">Узнайте свой тип личности</h1>
          </div>
          <p className="text-sm text-[#6B6560] leading-relaxed max-w-xs mx-auto">
            Пройдите тест PAEI — узнайте как вы думаете, принимаете решения и строите отношения.
          </p>
          <button onClick={() => setShowPricing(true)} className="btn-primary mx-auto">
            Пройти тест →
          </button>
        </div>
      </>
    )
  }

  // Есть доступ, тест не пройден
  if (!personalityType) {
    return (
      <div className="card space-y-4 text-center py-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <span className="text-2xl">✅</span>
        </div>
        <div>
          <p className="text-sm text-[#6B6560]">Добро пожаловать, {userName || 'друг'}!</p>
          <h1 className="text-xl font-bold text-[#1A1918] mt-1">Доступ открыт — пройдите тест</h1>
        </div>
        <p className="text-sm text-[#6B6560] leading-relaxed max-w-xs mx-auto">
          Вы можете начать прямо сейчас или вернуться позже — доступ сохранится.
        </p>
        <button onClick={() => navigate('/test')} className="btn-primary mx-auto">
          Начать тест →
        </button>
      </div>
    )
  }

  // Full доступ, часть 1 пройдена, часть 2 не пройдена
  if (accessLevel === 'full' && !relationshipStyle) {
    return (
      <div className="card space-y-4">
        <div>
          <p className="text-sm text-[#6B6560]">Добро пожаловать, {userName}</p>
          <h1 className="text-2xl font-bold text-[#1A1918] mt-1">
            Ваш тип: <span className="text-[#9E8B45]">{personalityType}</span>
          </h1>
        </div>
        <div className="bg-[#9E8B45]/10 rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-[#1A1918]">🔓 Вторая часть открыта</p>
          <p className="text-xs text-[#6B6560]">Узнайте свой стиль в отношениях — как вы проявляетесь рядом с близкими.</p>
          <button
            onClick={() => navigate('/test', { state: { startPart: 2 } })}
            className="btn-primary text-sm mt-1"
          >
            Пройти часть 2 →
          </button>
        </div>
        <button className="btn-outline text-sm" onClick={() => scrollTo('about-me')}>
          Смотреть результаты части 1 →
        </button>
        <button className="btn-outline text-sm flex items-center gap-1.5" onClick={() => downloadReport(1)}>
          <Download size={13} /> Скачать отчёт PDF
        </button>
      </div>
    )
  }

  // Basic доступ, часть 1 пройдена — апсейл на часть 2
  if (accessLevel === 'basic' && !relationshipStyle) {
    return (
      <>
        {showUpgrade && <PricingSheet onClose={() => setShowUpgrade(false)} upgradeOnly />}
        <div className="card space-y-4">
          <div>
            <p className="text-sm text-[#6B6560]">Добро пожаловать, {userName}</p>
            <h1 className="text-2xl font-bold text-[#1A1918] mt-1">
              Ваш тип: <span className="text-[#9E8B45]">{personalityType}</span>
            </h1>
          </div>
          <p className="text-sm text-[#6B6560] leading-relaxed">
            Это ваши базовые настройки. Хотите узнать как вы проявляетесь в близких отношениях?
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary" onClick={() => scrollTo('about-me')}>
              Мой тип личности →
            </button>
            <button className="btn-outline" onClick={() => setShowUpgrade(true)}>
              Узнать стиль в отношениях
            </button>
            <button className="btn-outline flex items-center gap-1.5" onClick={() => downloadReport(1)}>
              <Download size={13} /> Скачать отчёт PDF
            </button>
          </div>
        </div>
      </>
    )
  }

  // Всё пройдено — полный кабинет
  return (
    <div className="card space-y-4">
      <div>
        <p className="text-sm text-[#6B6560]">Добро пожаловать, {userName}</p>
        <h1 className="text-2xl font-bold text-[#1A1918] mt-1">
          Ваш тип: <span className="text-[#9E8B45]">{personalityType}</span>
          {relationshipStyle && (
            <span className="text-lg text-[#6B6560] font-normal ml-2">· {relationshipStyle}</span>
          )}
        </h1>
      </div>
      <p className="text-sm text-[#6B6560] leading-relaxed">
        Это ваши базовые настройки: как вы думаете, реагируете и к чему возвращаетесь в стрессе.
      </p>
      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" onClick={() => scrollTo('about-me')}>
          Открыть мой тип личности →
        </button>
        <button className="btn-outline" onClick={() => scrollTo('partner')}>
          С партнёром
        </button>
        <button className="btn-outline flex items-center gap-1.5" onClick={() => downloadReport(1)}>
          <Download size={13} /> Отчёт часть 1
        </button>
        <button className="btn-outline flex items-center gap-1.5" onClick={() => downloadReport(2)}>
          <Download size={13} /> Отчёт часть 2
        </button>
      </div>
    </div>
  )
}

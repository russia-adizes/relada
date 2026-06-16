import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Check } from 'lucide-react'
import { useStage, type AccessLevel } from '../contexts/StageContext'

interface PricingSheetProps {
  onClose: () => void
  upgradeOnly?: boolean  // true = показать только апгрейд до full (часть 2)
}

const TIERS = [
  {
    id: 'basic' as AccessLevel,
    name: 'Базовый',
    price: '990 ₽',
    description: 'Узнайте свой тип — как вы устроены',
    features: ['20 вопросов', 'Ваш тип: как вы устроены', 'Персональные инсайты', 'Практики на каждый день'],
    accent: false,
  },
  {
    id: 'full' as AccessLevel,
    name: 'Расширенный',
    price: '1 690 ₽',
    description: 'Тип + стиль в паре — полная картина',
    features: ['40 вопросов', 'Ваш тип: как вы устроены', 'Стиль в паре: как вы ведёте себя рядом с близкими', 'Почему вы ссоритесь и как это изменить', 'Практики под ваш тип — на каждый день и в кризис'],
    accent: true,
  },
  {
    id: 'full' as AccessLevel,
    name: 'С консультацией',
    price: '4 900 ₽',
    description: 'Полная картина + разбор с экспертом',
    features: ['Всё из Расширенного', 'Личная консультация 60 мин', 'Разбор вашего типа и типа партнёра', 'Конкретные рекомендации'],
    accent: false,
  },
]

const UPGRADE_TIER = {
  id: 'full' as AccessLevel,
  name: 'Стиль в паре',
  price: '700 ₽',
  description: 'Как вы ведёте себя в отношениях — и почему одни сценарии повторяются',
  features: ['20 вопросов', 'Стиль в паре: как вы проявляетесь рядом с близкими', 'Почему вы ссоритесь и как это изменить', 'Расширенные практики'],
}

export default function PricingSheet({ onClose, upgradeOnly = false }: PricingSheetProps) {
  const navigate = useNavigate()
  const { setAccessLevel, personalityType } = useStage()
  const [paid, setPaid] = useState<AccessLevel | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSelect(level: AccessLevel) {
    setLoading(true)
    await setAccessLevel(level)
    setLoading(false)
    setPaid(level)
  }

  if (paid) {
    const goToTest = () => {
      onClose()
      if (paid === 'full' && personalityType) {
        navigate('/test', { state: { startPart: 2 } })
      } else {
        navigate('/test')
      }
    }

    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
        <div className="bg-white rounded-2xl w-full max-w-sm text-center overflow-hidden">
          <div className="px-6 py-10 space-y-5">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Check className="text-green-600" size={28} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1A1918]">Доступ открыт!</h2>
              <p className="text-sm text-[#6B6560] mt-1">
                Уже через 15 минут поймёте, почему одни сценарии повторяются — и что с этим делать.
              </p>
            </div>
            <button onClick={goToTest} className="w-full py-3.5 rounded-xl bg-[#9E8B45] text-white font-semibold text-sm hover:bg-[#8A7A3A] transition-colors">
              Пройти тест →
            </button>
            <button onClick={onClose} className="w-full py-3 text-sm text-[#6B6560] hover:text-[#1A1918] transition-colors">
              Вернуться в кабинет
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (upgradeOnly) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
          <div className="flex justify-between items-center px-5 pt-5 pb-3">
            <h2 className="text-base font-bold text-[#1A1918]">Узнайте себя в паре</h2>
            <button onClick={onClose}><X size={18} className="text-[#6B6560]" /></button>
          </div>
          <div className="px-5 pb-6 space-y-4">
            <p className="text-sm text-[#6B6560]">Как вы ведёте себя в отношениях — и откуда берутся повторяющиеся ссоры.</p>
            <div className="border border-[#9E8B45]/30 rounded-xl p-4 bg-[#9E8B45]/5 space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-semibold text-[#1A1918] text-sm">{UPGRADE_TIER.name}</span>
                <span className="text-lg font-bold text-[#9E8B45]">{UPGRADE_TIER.price}</span>
              </div>
              <ul className="space-y-1">
                {UPGRADE_TIER.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-[#6B6560]">
                    <Check size={12} className="text-[#9E8B45] flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => handleSelect('full')}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#9E8B45] text-white font-semibold text-sm hover:bg-[#8A7A3A] transition-colors disabled:opacity-50"
            >
              {loading ? 'Открываем...' : 'Узнать стиль в паре — 700 ₽ →'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-5 pt-5 pb-3 sticky top-0 bg-white border-b border-[#F0EDE7]">
          <h2 className="text-base font-bold text-[#1A1918]">Выберите формат</h2>
          <button onClick={onClose}><X size={18} className="text-[#6B6560]" /></button>
        </div>

        <div className="p-4 space-y-3">
          {TIERS.map((tier, i) => (
            <div
              key={i}
              className={`border rounded-xl p-4 space-y-3 ${tier.accent ? 'border-[#9E8B45] bg-[#9E8B45]/5' : 'border-[#E8E4DC]'}`}
            >
              {tier.accent && (
                <div className="text-[10px] font-bold text-[#9E8B45] uppercase tracking-widest">Популярный</div>
              )}
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-[#1A1918] text-sm">{tier.name}</div>
                  <div className="text-xs text-[#6B6560] mt-0.5">{tier.description}</div>
                </div>
                <div className="text-lg font-bold text-[#1A1918] ml-2 flex-shrink-0">{tier.price}</div>
              </div>
              <ul className="space-y-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-[#6B6560]">
                    <Check size={12} className="text-[#9E8B45] flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelect(tier.id)}
                disabled={loading}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
                  tier.accent
                    ? 'bg-[#9E8B45] text-white hover:bg-[#8A7A3A]'
                    : 'border border-[#9E8B45] text-[#9E8B45] hover:bg-[#9E8B45]/5'
                }`}
              >
                {loading ? 'Открываем...' : 'Выбрать →'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

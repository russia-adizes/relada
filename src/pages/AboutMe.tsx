import { useState } from 'react'
import { Lock } from 'lucide-react'
import { useStage } from '../contexts/StageContext'
import PaywallModal from '../components/PaywallModal'

type TabId = 'type' | 'style' | 'role'

interface Tab {
  id: TabId
  label: string
}

const TABS: Tab[] = [
  { id: 'type', label: '👤 Тип личности' },
  { id: 'style', label: '🔒 Стиль в отношениях' },
  { id: 'role', label: '🔒 Роль в семье' },
]

const VALUES = [
  'Результат и прогресс',
  'Честность и прямота',
  'Свобода действий',
  'Признание усилий',
]

const STRENGTHS = [
  { title: 'Решительность', desc: 'Не откладываете важные разговоры.' },
  { title: 'Энергичность', desc: 'Привносите динамику и движение.' },
  { title: 'Прямота', desc: 'Говорите то, что думаете.' },
  { title: 'Инициативность', desc: 'Часто первой предлагаете планы.' },
]

const OVERLOADS = [
  'Когда нужно долго объяснять очевидное.',
  'Пассивность и откладывание решений.',
  'Когда результат зависит от чужой медлительности.',
]

export default function AboutMe() {
  const { personalityType, relationshipStyle } = useStage()
  const [activeTab, setActiveTab] = useState<TabId>('type')
  const [showPaywall, setShowPaywall] = useState(false)

  if (!personalityType) {
    return (
      <div className="card text-center py-12 space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#9E8B45]/10 flex items-center justify-center mx-auto">
          <span className="text-2xl">🔍</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#1A1918]">Здесь будет ваш психологический портрет</h2>
          <p className="text-sm text-[#6B6560] mt-2 max-w-xs mx-auto leading-relaxed">
            Пройдите тест PAEI, чтобы узнать свой тип личности, стиль в отношениях и роль в семье.
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/test'}
          className="btn-primary mx-auto"
        >
          Пройти тест →
        </button>
      </div>
    )
  }

  function handleTabClick(tab: Tab) {
    const locked = tab.id === 'style' ? !relationshipStyle : tab.id === 'role' ? true : false
    if (locked) {
      setShowPaywall(true)
    } else {
      setActiveTab(tab.id)
    }
  }

  return (
    <>
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}

      <div className="space-y-4">
        {/* Tab bar */}
        <div className="flex items-center gap-1 flex-wrap">
          {TABS.map((tab) => {
            const locked = tab.id === 'style' ? !relationshipStyle : tab.id === 'role' ? true : false
            const isActive = activeTab === tab.id && !locked
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={
                  locked
                    ? 'flex items-center gap-1 text-[#6B6560]/50 rounded-full px-4 py-1.5 text-xs font-medium border border-[#E8E4DC] hover:border-[#9E8B45]/40 transition-colors'
                    : isActive
                    ? 'bg-[#9E8B45] text-white rounded-full px-4 py-1.5 text-xs font-medium transition-all'
                    : 'text-[#6B6560] rounded-full px-4 py-1.5 text-xs font-medium hover:text-[#1A1918] transition-colors border border-[#E8E4DC]'
                }
              >
                {locked && <Lock size={10} />}
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content — Type tab */}
        {activeTab === 'type' && (
          <div className="space-y-4">
            <div className="card space-y-3">
              <h3 className="text-base font-semibold text-[#1A1918]">Кто я по сути</h3>
              <p className="text-sm text-[#6B6560] leading-relaxed">
                Вы — человек действия с предпринимательским складом ума. Вы быстро принимаете решения,
                ориентируетесь на результат и не боитесь брать на себя инициативу. Вам важно видеть
                прогресс и конкретные результаты своих усилий.
              </p>
            </div>

            <div className="card space-y-3">
              <h3 className="text-base font-semibold text-[#1A1918]">Как я принимаю решения</h3>
              <p className="text-sm text-[#6B6560] leading-relaxed">
                Вы доверяете интуиции и действуете быстро. Долгие обсуждения и согласования вас
                утомляют — вам проще попробовать и скорректировать, чем бесконечно планировать.
              </p>
            </div>

            <div className="card space-y-3">
              <h3 className="text-base font-semibold text-[#1A1918]">Что для меня важно</h3>
              <div className="grid grid-cols-2 gap-2">
                {VALUES.map((v) => (
                  <div key={v} className="card-inner">
                    <p className="text-sm text-[#1A1918] font-medium">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card space-y-3">
              <h3 className="text-base font-semibold text-[#1A1918]">Мои сильные стороны</h3>
              <div className="grid grid-cols-2 gap-2">
                {STRENGTHS.map((s) => (
                  <div key={s.title} className="card-inner space-y-1">
                    <p className="text-sm font-semibold text-[#1A1918]">{s.title}</p>
                    <p className="text-xs text-[#6B6560] leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card space-y-3">
              <h3 className="text-base font-semibold text-[#1A1918]">Что меня перегружает</h3>
              <div className="space-y-2">
                {OVERLOADS.map((o) => (
                  <div key={o} className="card-inner">
                    <p className="text-sm text-[#1A1918]">{o}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content — Style tab (unlocked) */}
        {activeTab === 'style' && relationshipStyle && (
          <div className="card text-center py-12 text-[#6B6560]">
            <p className="text-sm">Этот раздел находится в разработке.</p>
          </div>
        )}
      </div>
    </>
  )
}

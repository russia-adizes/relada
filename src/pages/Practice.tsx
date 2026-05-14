import { useState } from 'react'
import { useStage } from '../contexts/StageContext'
import { getPractice } from '../data/paeiPractices'

type TabId = 'daily' | 'crisis'

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: 'daily', label: 'На каждый день', emoji: '🌱' },
  { id: 'crisis', label: 'В кризис', emoji: '🌊' },
]

export default function Practice() {
  const { personalityType } = useStage()
  const [activeTab, setActiveTab] = useState<TabId>('daily')

  if (!personalityType) {
    return (
      <div className="card text-center py-8 space-y-3">
        <p className="text-2xl">🌱</p>
        <p className="text-sm text-[#6B6560]">
          Пройдите тест, чтобы получить практики под ваш тип личности.
        </p>
      </div>
    )
  }

  const practice = getPractice(personalityType)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1918]">Практика</h1>
        <p className="text-sm text-[#6B6560] mt-1">
          Маленькие шаги для типа <span className="text-[#9E8B45] font-semibold">{personalityType}</span>.
        </p>
      </div>

      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={
              activeTab === tab.id
                ? 'flex items-center gap-1.5 bg-[#9E8B45] text-white rounded-full px-4 py-2 text-sm font-medium transition-all'
                : 'flex items-center gap-1.5 text-[#6B6560] border border-[#E8E4DC] rounded-full px-4 py-2 text-sm font-medium hover:text-[#1A1918] transition-colors'
            }
          >
            <span>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card space-y-3">
        {practice[activeTab].map((text, i) => (
          <div key={i} className="card-inner flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#9E8B45]/10 text-[#9E8B45] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm text-[#1A1918] leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

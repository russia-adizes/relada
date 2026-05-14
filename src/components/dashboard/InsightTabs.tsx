import { useState } from 'react'
import { useStage } from '../../contexts/StageContext'
import { getInsight } from '../../data/paeiInsights'

type TabId = 'short' | 'strengths' | 'overload'

const TABS: { id: TabId; label: string }[] = [
  { id: 'short', label: '💡 Коротко' },
  { id: 'strengths', label: '🛡 Мои сильные стороны' },
  { id: 'overload', label: '⚡ Что меня перегружает' },
]

export default function InsightTabs() {
  const { personalityType } = useStage()
  const [activeTab, setActiveTab] = useState<TabId>('short')

  if (!personalityType) return null

  const insight = getInsight(personalityType)

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold text-[#1A1918]">Ваши инсайты</h2>

      <div className="flex items-center gap-1 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={
              activeTab === tab.id
                ? 'bg-[#9E8B45] text-white rounded-full px-4 py-1.5 text-xs font-medium transition-all'
                : 'text-[#6B6560] rounded-full px-4 py-1.5 text-xs font-medium hover:text-[#1A1918] transition-colors border border-[#E8E4DC]'
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {insight[activeTab].map((text, i) => (
          <div key={i} className="card-inner">
            <p className="text-sm text-[#1A1918] leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

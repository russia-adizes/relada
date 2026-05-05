import { useState } from 'react'

type TabId = 'short' | 'strengths' | 'overload'

const TABS: { id: TabId; label: string }[] = [
  { id: 'short', label: '💡 Коротко' },
  { id: 'strengths', label: '🛡 Мои сильные стороны' },
  { id: 'overload', label: '⚡ Что меня перегружает' },
]

const CONTENT: Record<TabId, string[]> = {
  short: [
    'Вы принимаете решения быстрее, чем 78% прошедших тест.',
    'Ваша сильная сторона — прямота и честность.',
    'Зона роста — давать пространство другому в разговоре.',
  ],
  strengths: [
    'Решительность: вы не откладываете важные решения.',
    'Инициативность: вы часто первой предлагаете планы.',
    'Энергичность: вы привносите динамику и движение.',
  ],
  overload: [
    'Когда нужно долго объяснять очевидное.',
    'Пассивность и откладывание решений.',
    'Когда результат зависит от чужой медлительности.',
  ],
}

export default function InsightTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('short')

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold text-[#1A1918]">Ваши инсайты</h2>

      {/* Tabs */}
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

      {/* Cards */}
      <div className="space-y-2">
        {CONTENT[activeTab].map((text, i) => (
          <div key={i} className="card-inner">
            <p className="text-sm text-[#1A1918] leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

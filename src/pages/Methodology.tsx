import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Section {
  title: string
  content: string
}

const SECTIONS: Section[] = [
  {
    title: 'Что такое RELADA',
    content:
      'RELADA — это диагностическая модель, которая помогает понять ваш естественный стиль мышления, поведения и взаимодействия в отношениях. Она опирается на концепцию четырёх управленческих ролей и адаптирует её для личной жизни.',
  },
  {
    title: '4 роли PAEI',
    content:
      'P (Producer) — Производитель результата. A (Administrator) — Администратор порядка. E (Entrepreneur) — Предприниматель идей. I (Integrator) — Интегратор отношений.',
  },
  {
    title: 'Почему невозможно одинаково хорошо выполнять все роли',
    content:
      'Каждая роль требует разного склада ума. Сильная P ориентирована на действие, сильная A — на контроль. Эти стратегии часто противоречат друг другу.',
  },
  {
    title: 'Как из этого рождаются стили',
    content:
      'Ваш тип — это ваша природная комбинация ролей. Стиль — это то, как вы действуете в отношениях под влиянием этого типа.',
  },
  {
    title: 'Чем отличается тип от стиля',
    content: 'Тип — стабильный, внутренний. Стиль — поведенческий, может адаптироваться.',
  },
  {
    title: 'Как использовать отчёт',
    content: 'Читайте через призму: «Как это проявляется в моей жизни прямо сейчас?»',
  },
  {
    title: 'Как читать его с партнёром',
    content: 'Сравните, где вы дополняете друг друга, а где создаёте трение.',
  },
]

function AccordionItem({
  section,
  isOpen,
  onToggle,
}: {
  section: Section
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border border-[#E8E4DC] rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F5F2EC] transition-colors"
      >
        <span className="text-sm font-medium text-[#1A1918]">{section.title}</span>
        <ChevronDown
          size={16}
          className={`text-[#6B6560] flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-4">
          <p className="text-sm text-[#6B6560] leading-relaxed">{section.content}</p>
        </div>
      )}
    </div>
  )
}

export default function Methodology() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1918]">О методике</h1>
        <p className="text-sm text-[#6B6560] mt-1">
          Как устроена модель и как использовать результаты.
        </p>
      </div>

      <div className="space-y-2">
        {SECTIONS.map((section, i) => (
          <AccordionItem
            key={i}
            section={section}
            isOpen={openIndex === i}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>
    </div>
  )
}

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
      'RELADA — инструмент самопознания, основанный на методологии Адизеса. Помогает понять, как вы устроены — и почему рядом с одними людьми всё легко, а с другими возникают одни и те же трения.',
  },
  {
    title: 'Четыре роли PAEI',
    content:
      'P — Деятель: ориентирован на результат. A — Организатор: ценит порядок и предсказуемость. E — Новатор: думает идеями и возможностями. I — Объединитель: держит связь и атмосферу.',
  },
  {
    title: 'Почему мы не можем быть всем сразу',
    content:
      'Каждая роль требует разного подхода к жизни. Тот, кто действует быстро (P), и тот, кто всё проверяет дважды (A) — неизбежно смотрят на мир по-разному. Это не плохо — это разные языки.',
  },
  {
    title: 'Откуда берутся ссоры',
    content:
      'Конфликт часто рождается не из-за злого умысла, а из-за разных «заводских настроек». Понимая свой тип и тип партнёра, вы видите причину — а не только следствие.',
  },
  {
    title: 'Тип и стиль: в чём разница',
    content: 'Тип — это вы в обычной жизни. Стиль — как вы проявляетесь именно в близких отношениях. Иногда они совпадают, иногда — нет.',
  },
  {
    title: 'Как читать отчёт',
    content: 'Читайте через призму: «Как это объясняет то, что происходит у нас прямо сейчас?»',
  },
  {
    title: 'Как смотреть отчёт с партнёром',
    content: 'Найдите, где вы дополняете друг друга — и где ваши типы создают трение. Это и есть зона роста.',
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
          Как устроена методология и что стоит за вашим типом.
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

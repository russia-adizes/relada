interface OfferCard {
  title: string
  description: string
  buttons: { label: string; variant?: 'primary' | 'outline' | 'ghost' }[]
}

const OFFERS: OfferCard[] = [
  {
    title: 'Подарить тест',
    description: 'Отправьте подруге или близкому человеку.',
    buttons: [
      { label: '💬 Telegram', variant: 'outline' },
      { label: '🎁 Ссылка', variant: 'outline' },
    ],
  },
  {
    title: 'Другой тест',
    description: 'Узнайте больше о себе с новым тестом.',
    buttons: [
      { label: '📋 Посмотреть тесты', variant: 'outline' },
    ],
  },
  {
    title: 'Поддержка',
    description: 'Есть вопросы? Мы всегда на связи.',
    buttons: [
      { label: 'Написать нам', variant: 'outline' },
    ],
  },
]

export default function SecondaryOffers() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {OFFERS.map((offer) => (
        <div key={offer.title} className="card flex flex-col gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#1A1918]">{offer.title}</h3>
            <p className="text-xs text-[#6B6560] mt-1 leading-relaxed">{offer.description}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-auto">
            {offer.buttons.map((btn) => (
              <button
                key={btn.label}
                className="border border-[#E8E4DC] text-[#1A1918] rounded-full px-3 py-1.5 text-xs font-medium hover:border-[#9E8B45] hover:text-[#9E8B45] transition-colors"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

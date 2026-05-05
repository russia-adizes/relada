const PRACTICES = [
  'Замечайте моменты, когда вы действуете на автопилоте.',
  'Где вы путаете свой тип с обязанностью быть «удобной»?',
  'Попробуйте в конце дня записать одно решение, которое вы приняли осознанно.',
]

export default function Practice() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1918]">Практика для вашего этапа</h1>
        <p className="text-sm text-[#6B6560] mt-1">Маленькие шаги, которые меняют динамику.</p>
      </div>

      <div className="card space-y-4">
        <h2 className="text-base font-semibold text-[#1A1918]">💡 Практика самонаблюдения</h2>

        <div className="space-y-2">
          {PRACTICES.map((text, i) => (
            <div key={i} className="card-inner flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#9E8B45]/10 text-[#9E8B45] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-[#1A1918] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

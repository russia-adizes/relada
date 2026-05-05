import { Heart } from 'lucide-react'

export default function Partner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="card max-w-md w-full text-center space-y-5 py-12">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-[#F5F2EC] flex items-center justify-center">
            <Heart size={32} className="text-[#6B6560]" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-[#1A1918]">Сравнение с партнёром</h2>
          <p className="text-sm text-[#6B6560] leading-relaxed max-w-sm mx-auto">
            Когда у вас будет личная картина, можно будет посмотреть, как вы усиливаете друг
            друга и где попадаете в повторяющиеся сценарии.
          </p>
        </div>

        <button className="bg-[#E8E4DC] text-[#6B6560] rounded-full px-6 py-3 text-sm font-medium hover:bg-[#DDD9D0] transition-colors">
          Пока изучаю себя
        </button>
      </div>
    </div>
  )
}

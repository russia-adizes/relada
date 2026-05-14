import { useState } from 'react'
import { X } from 'lucide-react'

interface PaywallModalProps {
  onClose: () => void
}

export default function PaywallModal({ onClose }: PaywallModalProps) {
  const [clicked, setClicked] = useState(false)

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-sm text-center overflow-hidden">
        <div className="flex justify-end px-4 pt-4">
          <button
            onClick={onClose}
            className="text-[#6B6560] hover:text-[#1A1918] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#9E8B45]/10 flex items-center justify-center mx-auto">
            <span className="text-3xl">🔓</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-[#1A1918]">
              Откройте стиль в отношениях
            </h2>
            <p className="text-sm text-[#6B6560] leading-relaxed">
              Узнайте, как вы проявляетесь рядом с близкими — и почему некоторые люди
              понимают вас с полуслова, а другие нет.
            </p>
          </div>

          {clicked ? (
            <div className="py-3 px-4 rounded-xl bg-[#F0EDE6] text-sm text-[#6B6560]">
              Скоро будет доступно 🙌
            </div>
          ) : (
            <button
              onClick={() => setClicked(true)}
              className="w-full py-3.5 rounded-xl bg-[#9E8B45] text-white font-semibold text-sm hover:bg-[#8A7A3A] transition-colors"
            >
              Получить доступ
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

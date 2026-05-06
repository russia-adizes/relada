import { useState } from 'react'
import { useStage } from '../contexts/StageContext'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { userName, userEmail, personalityType } = useStage()
  const { user } = useAuth()
  const [name, setName] = useState(userName)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    if (!user) return
    setLoading(true)
    await supabase.from('profiles').update({ name }).eq('id', user.id)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-md mx-auto space-y-6 py-4">
      <h1 className="text-xl font-semibold text-[#1A1918]">Мой профиль</h1>

      <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 space-y-4">
        <div>
          <label className="text-xs text-[#6B6560] block mb-1">Email</label>
          <p className="text-sm text-[#1A1918]">{userEmail}</p>
        </div>

        <div>
          <label className="text-xs text-[#6B6560] block mb-1">Имя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите имя"
            className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2 text-sm text-[#1A1918] focus:outline-none focus:border-[#9E8B45]"
          />
        </div>

        {personalityType && (
          <div>
            <label className="text-xs text-[#6B6560] block mb-1">Тип личности</label>
            <p className="text-sm font-semibold text-[#9E8B45]">{personalityType}</p>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-[#9E8B45] text-white rounded-xl py-2 text-sm font-medium hover:bg-[#8a7a3d] transition-colors disabled:opacity-50"
        >
          {saved ? 'Сохранено!' : loading ? 'Сохраняем...' : 'Сохранить'}
        </button>
      </div>
    </div>
  )
}

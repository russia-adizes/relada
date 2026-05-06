import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Settings() {
  const { user } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Пароли не совпадают', error: true })
      return
    }
    if (newPassword.length < 6) {
      setMessage({ text: 'Пароль должен быть не менее 6 символов', error: true })
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setLoading(false)
    if (error) {
      setMessage({ text: 'Ошибка: ' + error.message, error: true })
    } else {
      setMessage({ text: 'Пароль изменён!', error: false })
      setNewPassword('')
      setConfirmPassword('')
    }
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="max-w-md mx-auto space-y-6 py-4">
      <h1 className="text-xl font-semibold text-[#1A1918]">Настройки</h1>

      <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#1A1918]">Изменить пароль</h2>

        <div>
          <label className="text-xs text-[#6B6560] block mb-1">Новый пароль</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Минимум 6 символов"
            className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#9E8B45]"
          />
        </div>

        <div>
          <label className="text-xs text-[#6B6560] block mb-1">Повторите пароль</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Повторите новый пароль"
            className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#9E8B45]"
          />
        </div>

        {message && (
          <p className={`text-xs ${message.error ? 'text-red-500' : 'text-green-600'}`}>
            {message.text}
          </p>
        )}

        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="w-full bg-[#9E8B45] text-white rounded-xl py-2 text-sm font-medium hover:bg-[#8a7a3d] transition-colors disabled:opacity-50"
        >
          {loading ? 'Сохраняем...' : 'Изменить пароль'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6">
        <h2 className="text-sm font-semibold text-[#1A1918] mb-1">Аккаунт</h2>
        <p className="text-xs text-[#6B6560]">{user?.email}</p>
      </div>
    </div>
  )
}

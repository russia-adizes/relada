import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Пароли не совпадают'); return }
    if (password.length < 6) { setError('Минимум 6 символов'); return }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) setError(error.message)
    else navigate('/')
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <img src="/релада_logo_black.png" alt="релада" className="h-8 w-auto mx-auto mb-6" />
          <p className="text-sm text-[#6B6560]">Проверяем ссылку...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img src="/релада_logo_black.png" alt="релада" className="h-8 w-auto mx-auto mb-6" />
          <h1 className="text-xl font-semibold text-[#1A1918]">Новый пароль</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8E4DC] p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs text-[#6B6560] mb-1 block">Новый пароль</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              required
              className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#9E8B45]"
            />
          </div>
          <div>
            <label className="text-xs text-[#6B6560] mb-1 block">Повторите пароль</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#9E8B45]"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#9E8B45] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#8a7a3a] transition-colors disabled:opacity-50"
          >
            {loading ? 'Сохраняем...' : 'Сохранить пароль'}
          </button>
        </form>
      </div>
    </div>
  )
}

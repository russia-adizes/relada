import { useState } from 'react'
import { supabase } from '../lib/supabase'

type Mode = 'login' | 'register' | 'forgot'

export default function Auth() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  function reset() {
    setError('')
    setMessage('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    reset()

    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      })
      if (error) setError(error.message)
      else setMessage('Проверь почту — мы отправили письмо для подтверждения.')

    } else if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Неверный email или пароль')

    } else if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) setError(error.message)
      else setMessage('Письмо отправлено! Проверь почту и перейди по ссылке.')
    }

    setLoading(false)
  }

  const titles: Record<Mode, string> = {
    login: 'Войти в аккаунт',
    register: 'Создать аккаунт',
    forgot: 'Восстановить пароль',
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img src="/релада_logo_black.png" alt="релада" className="h-8 w-auto mx-auto mb-6" />
          <h1 className="text-xl font-semibold text-[#1A1918]">{titles[mode]}</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8E4DC] p-6 flex flex-col gap-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs text-[#6B6560] mb-1 block">Имя</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Анна"
                required
                className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm text-[#1A1918] outline-none focus:border-[#9E8B45]"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-[#6B6560] mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="anna@mail.ru"
              required
              className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm text-[#1A1918] outline-none focus:border-[#9E8B45]"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-[#6B6560]">Пароль</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); reset() }}
                    className="text-xs text-[#9E8B45] hover:underline"
                  >
                    Забыл пароль?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm text-[#1A1918] outline-none focus:border-[#9E8B45]"
              />
            </div>
          )}

          {error && <p className="text-red-500 text-xs">{error}</p>}
          {message && <p className="text-green-600 text-xs">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#9E8B45] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#8a7a3a] transition-colors disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : mode === 'register' ? 'Зарегистрироваться' : 'Отправить письмо'}
          </button>
        </form>

        <p className="text-center text-xs text-[#6B6560] mt-4">
          {mode === 'forgot' ? (
            <>
              Вспомнил пароль?{' '}
              <button onClick={() => { setMode('login'); reset() }} className="text-[#9E8B45] font-medium hover:underline">
                Войти
              </button>
            </>
          ) : mode === 'login' ? (
            <>
              Нет аккаунта?{' '}
              <button onClick={() => { setMode('register'); reset() }} className="text-[#9E8B45] font-medium hover:underline">
                Зарегистрироваться
              </button>
            </>
          ) : (
            <>
              Уже есть аккаунт?{' '}
              <button onClick={() => { setMode('login'); reset() }} className="text-[#9E8B45] font-medium hover:underline">
                Войти
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

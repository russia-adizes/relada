import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPA_URL = 'https://oqiiovmytkqsksenyrtr.supabase.co'
const SUPA_KEY = atob('c2Jfc2VjcmV0X0pWZ1dUM0xFWElRVlg1aERkbVNrb2dfd2FwdldZYUc=')

const supabaseAdmin = createClient(SUPA_URL, SUPA_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, storageKey: 'relada-admin' },
})

async function adminFetch(table: string, params = '') {
  const res = await fetch(`${SUPA_URL}/rest/v1/${table}?${params}`, {
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
  })
  return res.json()
}

const ADMIN_LOGIN = 'admin'
const ADMIN_PASSWORD = 'relada2026'
const ADMIN_SESSION_KEY = 'relada_admin'

type Section = 'overview' | 'users' | 'coupons' | 'pricing'

interface Profile {
  id: string
  name: string | null
  personality_type: string | null
  relationship_style: string | null
  created_at: string
}

interface Coupon {
  id: string
  code: string
  discount_percent: number
  max_uses: number | null
  used_count: number
  expires_at: string | null
  created_at: string
}

interface Stats { total: number; hasType: number; hasStyle: number }

const NAV = [
  { id: 'overview' as Section, icon: '📊', label: 'Обзор' },
  { id: 'users' as Section, icon: '👥', label: 'Пользователи' },
  { id: 'coupons' as Section, icon: '🎟', label: 'Купоны' },
  { id: 'pricing' as Section, icon: '💰', label: 'Тарифы' },
]

// ── Login screen ──────────────────────────────────────────────────────────────
function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (login.trim().toLowerCase() === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true')
      onSuccess()
    } else {
      setError('Неверный логин или пароль')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1A1918', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ background: '#252321', borderRadius: 16, padding: 40, width: 360, border: '1px solid #2a2927' }}>
        <div style={{ color: '#9E8B45', fontSize: 22, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 4 }}>RELADA</div>
        <div style={{ color: '#6B6560', fontSize: 13, marginBottom: 32 }}>Панель администратора</div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#9B9691', marginBottom: 6 }}>Логин</label>
            <input
              value={login} onChange={(e) => setLogin(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              style={{ width: '100%', background: '#1A1918', border: '1px solid #3a3937', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#9B9691', marginBottom: 6 }}>Пароль</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              style={{ width: '100%', background: '#1A1918', border: '1px solid #3a3937', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {error && <div style={{ fontSize: 13, color: '#EF4444' }}>{error}</div>}

          <button
            type="submit" disabled={!login || !password}
            style={{ background: '#9E8B45', color: '#fff', border: 'none', borderRadius: 8, padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 4 }}
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Main admin panel ──────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true')

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />
  }

  return <AdminPanel />
}

function AdminPanel() {
  const [section, setSection] = useState<Section>('overview')
  const [users, setUsers] = useState<Profile[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, hasType: 0, hasStyle: 0 })
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [newCode, setNewCode] = useState('')
  const [newDiscount, setNewDiscount] = useState('')
  const [newMaxUses, setNewMaxUses] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const profiles = await adminFetch('profiles', 'select=id,name,personality_type,relationship_style,created_at&order=created_at.desc')
      console.log('profiles result:', profiles)
      if (Array.isArray(profiles)) {
        setUsers(profiles)
        setStats({
          total: profiles.length,
          hasType: profiles.filter((p: Profile) => p.personality_type).length,
          hasStyle: profiles.filter((p: Profile) => p.relationship_style).length,
        })
      }
      const couponData = await adminFetch('coupons', 'select=*&order=created_at.desc')
      if (Array.isArray(couponData)) setCoupons(couponData)
      setLoading(false)
    }
    load()
  }, [])

  async function createCoupon() {
    if (!newCode || !newDiscount) return
    setSaving(true)
    const { data, error } = await supabaseAdmin.from('coupons').insert({
      code: newCode.toUpperCase().trim(),
      discount_percent: parseInt(newDiscount),
      max_uses: newMaxUses ? parseInt(newMaxUses) : null,
    }).select().single()
    setSaving(false)
    if (!error && data) {
      setCoupons((prev) => [data, ...prev])
      setNewCode(''); setNewDiscount(''); setNewMaxUses('')
    }
  }

  async function deleteCoupon(id: string) {
    await supabaseAdmin.from('coupons').delete().eq('id', id)
    setCoupons((prev) => prev.filter((c) => c.id !== id))
  }

  function formatDate(str: string) {
    return new Date(str).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  function handleSignOut() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
    window.location.href = '/'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Sidebar */}
      <aside style={{ width: 220, background: '#1A1918', minHeight: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #2a2927' }}>
          <div style={{ color: '#9E8B45', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em' }}>RELADA</div>
          <div style={{ color: '#6B6560', fontSize: 11, marginTop: 2 }}>Панель администратора</div>
        </div>
        <nav style={{ padding: '16px 0', flex: 1 }}>
          {NAV.map((item) => (
            <button key={item.id} onClick={() => setSection(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 20px', width: '100%', border: 'none',
              background: section === item.id ? '#252321' : 'transparent',
              borderLeft: `3px solid ${section === item.id ? '#9E8B45' : 'transparent'}`,
              color: section === item.id ? '#fff' : '#9B9691',
              fontSize: 14, cursor: 'pointer', textAlign: 'left',
            }}>
              <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #2a2927', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ color: '#6B6560', fontSize: 11 }}>admin</div>
          <button onClick={handleSignOut} style={{ background: 'none', border: 'none', color: '#6B6560', fontSize: 12, cursor: 'pointer', textAlign: 'left', padding: 0 }}>Выйти</button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, background: '#F5F2EC', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #E8E4DC', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1A1918' }}>{NAV.find((n) => n.id === section)?.label}</div>
          <a href="/" style={{ fontSize: 13, color: '#6B6560', textDecoration: 'none' }}>← На сайт</a>
        </div>

        <div style={{ padding: 24, flex: 1 }}>

          {section === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Всего пользователей', value: stats.total, sub: 'зарегистрированы' },
                  { label: 'Прошли тест', value: stats.hasType, sub: `${stats.total ? Math.round(stats.hasType / stats.total * 100) : 0}% конверсия` },
                  { label: 'Полный доступ', value: stats.hasStyle, sub: 'с типом + стилем' },
                ].map((s) => (
                  <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E8E4DC' }}>
                    <div style={{ fontSize: 12, color: '#6B6560', marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#1A1918' }}>{loading ? '...' : s.value}</div>
                    <div style={{ fontSize: 11, color: '#9E8B45', marginTop: 4 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E4DC', marginBottom: 20 }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8E4DC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Последние пользователи</span>
                  <button onClick={() => setSection('users')} style={{ fontSize: 12, color: '#9E8B45', background: 'none', border: 'none', cursor: 'pointer' }}>Все →</button>
                </div>
                <UserTable users={users.slice(0, 5)} formatDate={formatDate} />
              </div>

              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E4DC' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8E4DC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Активные купоны</span>
                  <button onClick={() => setSection('coupons')} style={{ fontSize: 12, color: '#9E8B45', background: 'none', border: 'none', cursor: 'pointer' }}>Управлять →</button>
                </div>
                <div style={{ padding: '12px 20px' }}>
                  {coupons.length === 0
                    ? <p style={{ fontSize: 13, color: '#6B6560' }}>Купонов пока нет</p>
                    : coupons.slice(0, 3).map((c) => <CouponRow key={c.id} coupon={c} onDelete={deleteCoupon} compact />)
                  }
                </div>
              </div>
            </div>
          )}

          {section === 'users' && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E4DC' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8E4DC' }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Все пользователи ({users.length})</span>
              </div>
              <UserTable users={users} formatDate={formatDate} />
            </div>
          )}

          {section === 'coupons' && (
            <div>
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E4DC', padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Создать купон</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <input value={newCode} onChange={(e) => setNewCode(e.target.value)} placeholder="Код (напр. RELADA50)" style={inputStyle} />
                  <input value={newDiscount} onChange={(e) => setNewDiscount(e.target.value)} placeholder="Скидка %" type="number" min="1" max="100" style={{ ...inputStyle, width: 120 }} />
                  <input value={newMaxUses} onChange={(e) => setNewMaxUses(e.target.value)} placeholder="Макс. использований (пусто = ∞)" type="number" min="1" style={{ ...inputStyle, width: 240 }} />
                  <button onClick={createCoupon} disabled={saving || !newCode || !newDiscount}
                    style={{ background: '#9E8B45', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                    {saving ? 'Создаём...' : 'Создать'}
                  </button>
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E4DC' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8E4DC' }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Все купоны ({coupons.length})</span>
                </div>
                <div style={{ padding: '0 20px' }}>
                  {coupons.length === 0
                    ? <p style={{ padding: '20px 0', fontSize: 13, color: '#6B6560' }}>Купонов пока нет</p>
                    : coupons.map((c) => <CouponRow key={c.id} coupon={c} onDelete={deleteCoupon} formatDate={formatDate} />)
                  }
                </div>
              </div>
            </div>
          )}

          {section === 'pricing' && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E4DC' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8E4DC' }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Тарифы</span>
              </div>
              <div style={{ padding: 20 }}>
                <p style={{ fontSize: 13, color: '#6B6560', marginBottom: 20 }}>Управление ценами будет доступно после подключения платёжного провайдера.</p>
                {[
                  { name: 'Базовый тест', desc: '20 вопросов · тип личности', price: '990 ₽' },
                  { name: 'Расширенный', desc: '40 вопросов · тип + стиль в отношениях', price: '1 690 ₽' },
                  { name: 'Тест с консультацией', desc: 'тест + персональный разбор с экспертом', price: '4 900 ₽' },
                ].map((tier) => (
                  <div key={tier.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #F0EDE7' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1918' }}>{tier.name}</div>
                      <div style={{ fontSize: 12, color: '#6B6560', marginTop: 2 }}>{tier.desc}</div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#1A1918' }}>{tier.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function UserTable({ users, formatDate }: { users: Profile[], formatDate: (s: string) => string }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#FAF8F4' }}>
          {['Имя / ID', 'Тип личности', 'Стиль', 'Дата'].map((h) => (
            <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B6560', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id} style={{ borderTop: '1px solid #F0EDE7' }}>
            <td style={{ padding: '12px 20px' }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#1A1918' }}>{u.name || '—'}</div>
              <div style={{ fontSize: 11, color: '#9B9691', fontFamily: 'monospace' }}>{u.id.slice(0, 8)}…</div>
            </td>
            <td style={{ padding: '12px 20px' }}>
              {u.personality_type
                ? <span style={{ background: 'rgba(158,139,69,0.12)', color: '#9E8B45', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>{u.personality_type}</span>
                : <span style={{ color: '#9B9691', fontSize: 12 }}>—</span>}
            </td>
            <td style={{ padding: '12px 20px' }}>
              {u.relationship_style
                ? <span style={{ background: 'rgba(158,139,69,0.12)', color: '#9E8B45', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>{u.relationship_style}</span>
                : <span style={{ color: '#9B9691', fontSize: 12 }}>—</span>}
            </td>
            <td style={{ padding: '12px 20px', fontSize: 12, color: '#6B6560' }}>{formatDate(u.created_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function CouponRow({ coupon, onDelete, compact, formatDate }: { coupon: Coupon; onDelete: (id: string) => void; compact?: boolean; formatDate?: (s: string) => string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F5F2EC' }}>
      <div>
        <div style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: '#1A1918', letterSpacing: '0.08em' }}>{coupon.code}</div>
        <div style={{ fontSize: 11, color: '#6B6560', marginTop: 2 }}>
          {coupon.used_count} / {coupon.max_uses ?? '∞'} использований
          {!compact && coupon.expires_at && formatDate && ` · до ${formatDate(coupon.expires_at)}`}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: '#9E8B45' }}>{coupon.discount_percent}%</span>
        {!compact && (
          <button onClick={() => onDelete(coupon.id)} style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: 13, cursor: 'pointer', padding: '4px 8px' }}>
            удалить
          </button>
        )}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  border: '1px solid #E8E4DC', borderRadius: 8, padding: '8px 12px',
  fontSize: 13, color: '#1A1918', outline: 'none', width: 200,
}

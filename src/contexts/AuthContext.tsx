import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export const LOCAL_USER_SESSION_KEY = 'relada_user'

const LOCAL_USER = {
  id: 'local-user',
  email: 'sofya@relada.ru',
  user_metadata: { name: 'Sofya' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: '',
} as unknown as User

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, signOut: async () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem(LOCAL_USER_SESSION_KEY) === 'true') {
      setUser(LOCAL_USER)
      setLoading(false)
      return
    }

    const timeout = setTimeout(() => setLoading(false), 5000)
    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeout)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    if (sessionStorage.getItem(LOCAL_USER_SESSION_KEY) === 'true') {
      sessionStorage.removeItem(LOCAL_USER_SESSION_KEY)
      setUser(null)
      return
    }
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

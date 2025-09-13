import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if Supabase is properly configured
    const hasValidConfig = import.meta.env.VITE_SUPABASE_URL && 
                          import.meta.env.VITE_SUPABASE_ANON_KEY &&
                          import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'

    if (!hasValidConfig) {
      // For demo purposes, create a mock user but check localStorage for real signup data
      const savedUser = localStorage.getItem('oceanai_user')
      const mockUser: any = savedUser ? JSON.parse(savedUser) : {
        id: 'demo-user',
        email: 'user@example.com',
        user_metadata: {
          full_name: 'Demo User',
          username: 'DemoUser'
        },
        created_at: new Date().toISOString()
      }
      setUser(mockUser)
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    const hasValidConfig = import.meta.env.VITE_SUPABASE_URL && 
                          import.meta.env.VITE_SUPABASE_ANON_KEY &&
                          import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'

    if (hasValidConfig) {
      await supabase.auth.signOut()
    } else {
      // For demo, clear the mock user and localStorage
      localStorage.removeItem('oceanai_user')
      setUser(null)
      setSession(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
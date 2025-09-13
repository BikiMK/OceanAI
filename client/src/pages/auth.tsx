import { useState } from 'react'
import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { useLocation } from 'wouter'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { user } = useAuth()
  const [, navigate] = useLocation()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    organization: '',
    role: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const hasValidConfig = import.meta.env.VITE_SUPABASE_URL && 
                            import.meta.env.VITE_SUPABASE_ANON_KEY &&
                            import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'

      if (hasValidConfig) {
        if (isLogin) {
          // Login with Supabase
          const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          })
          
          if (error) throw error
          
          setSuccess('Successfully logged in!')
        } else {
          // Sign up with Supabase
          const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                full_name: formData.fullName,
                organization: formData.organization,
                role: formData.role,
              }
            }
          })
          
          if (error) throw error
          
          setSuccess('Check your email for the confirmation link!')
        }
      } else {
        // Demo mode - save to localStorage and create user
        if (isLogin) {
          const savedUser = localStorage.getItem('oceanai_user')
          if (!savedUser) {
            throw new Error('No account found. Please sign up first.')
          }
          setSuccess('Successfully logged in!')
        } else {
          // Create new user in demo mode
          const newUser = {
            id: `demo-${Date.now()}`,
            email: formData.email,
            user_metadata: {
              full_name: formData.fullName || 'User',
              organization: formData.organization,
              role: formData.role
            },
            created_at: new Date().toISOString()
          }
          localStorage.setItem('oceanai_user', JSON.stringify(newUser))
          setSuccess('Account created successfully!')
        }
        
        // Auto redirect after success in demo mode
        setTimeout(() => {
          window.location.href = '/'
        }, 1500)
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Neural network pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-emerald-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
        </div>
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/10 via-transparent to-violet-900/20"></div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <Card className="w-full max-w-md bg-black/80 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 relative overflow-hidden">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10 opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyan-500/5"></div>
          
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          
          <CardHeader className="space-y-6 relative z-10 text-center">
            {/* AI Icon with glow */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-400/30">
                  {/* AI Brain Icon */}
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v-.07zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                {/* Glow rings */}
                <div className="absolute inset-0 rounded-xl border border-cyan-400/50 animate-ping"></div>
                <div className="absolute -inset-2 rounded-xl border border-cyan-400/20 animate-pulse"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                OceanAI
              </CardTitle>
              <div className="text-xs font-mono text-cyan-400/80 tracking-widest">
                NEURAL PLATFORM
              </div>
              <CardDescription className="text-gray-300/80 text-sm">
                {isLogin ? 'Initialize neural connection' : 'Register neural interface'}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="relative z-10">
            {error && (
              <Alert className="mb-6 bg-red-900/20 border border-red-500/50 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <AlertDescription className="text-red-300 text-sm">{error}</AlertDescription>
                </div>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-6 bg-green-900/20 border border-green-500/50 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <AlertDescription className="text-green-300 text-sm">{success}</AlertDescription>
                </div>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                      Neural ID
                    </Label>
                    <div className="relative">
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Arnab Das"
                        data-testid="input-fullname"
                        className="bg-black/50 border border-cyan-500/30 focus:border-cyan-400 text-white placeholder:text-gray-500 h-12 px-4 font-mono backdrop-blur-sm"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none rounded-md"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="organization" className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                      Research Node
                    </Label>
                    <div className="relative">
                      <Input
                        id="organization"
                        name="organization"
                        type="text"
                        value={formData.organization}
                        onChange={handleInputChange}
                        placeholder="Marine Research Institute"
                        data-testid="input-organization"
                        className="bg-black/50 border border-cyan-500/30 focus:border-cyan-400 text-white placeholder:text-gray-500 h-12 px-4 font-mono backdrop-blur-sm"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none rounded-md"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                      Access Level
                    </Label>
                    <div className="relative">
                      <Input
                        id="role"
                        name="role"
                        type="text"
                        value={formData.role}
                        onChange={handleInputChange}
                        placeholder="Marine Biologist"
                        data-testid="input-role"
                        className="bg-black/50 border border-cyan-500/30 focus:border-cyan-400 text-white placeholder:text-gray-500 h-12 px-4 font-mono backdrop-blur-sm"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none rounded-md"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  Network Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                    data-testid="input-email"
                    className="bg-black/50 border border-cyan-500/30 focus:border-cyan-400 text-white placeholder:text-gray-500 h-12 px-4 font-mono backdrop-blur-sm"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none rounded-md"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  Security Key
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    data-testid="input-password"
                    className="bg-black/50 border border-cyan-500/30 focus:border-cyan-400 text-white placeholder:text-gray-500 h-12 px-4 font-mono backdrop-blur-sm"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none rounded-md"></div>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono uppercase tracking-wider text-sm shadow-lg shadow-cyan-500/25 border border-cyan-400/50 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                disabled={loading}
                data-testid="button-submit"
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    isLogin ? 'Initialize Connection' : 'Register Interface'
                  )}
                </span>
              </Button>
            </form>
            
            <div className="mt-8 text-center space-y-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-mono"
                data-testid="toggle-auth-mode"
              >
                {isLogin ? 
                  '> Need neural interface registration?' : 
                  '> Already have neural connection?'
                }
              </button>
              
              <div className="pt-4 border-t border-gray-800">
                <Link href="/">
                  <button className="text-xs text-gray-500 hover:text-cyan-400 transition-colors font-mono flex items-center justify-center space-x-2" data-testid="back-to-home">
                    <span>←</span>
                    <span>Return to mainframe</span>
                  </button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Auth
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/useToast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { login } = useAuthStore()
  const { success, error } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  function validate() {
    const e = {}
    if (!form.email) e.email = 'Email requis'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide'
    if (!form.password) e.password = 'Mot de passe requis'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    // Simulate API call — swap with authService.login(form)
    await new Promise(r => setTimeout(r, 800))
    login(
      { id: 1, name: 'Kofi Mensah', email: form.email, avatar: 'K', role: 'admin' },
      'mock_jwt_token'
    )
    success('✅ Connecté avec succès !')
    navigate(from, { replace: true })
  }

  return (
    <div className="page-transition min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-soft border border-sand-200"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-serif text-3xl text-sand-900 mb-1">Bon retour 👋</h1>
        <p className="text-sand-400 text-sm mb-8">Connecte-toi pour continuer</p>

        {/* Google */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-sand-300 rounded-xl py-3 text-sm font-semibold text-sand-700 hover:bg-sand-50 transition-colors mb-5 focus:outline-none focus:ring-2 focus:ring-brand-400"
          onClick={() => error('Google OAuth — à brancher avec Laravel Socialite')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>

        <div className="flex items-center gap-3 mb-5 text-sand-400">
          <div className="flex-1 h-px bg-sand-200" /><span className="text-xs">ou</span><div className="flex-1 h-px bg-sand-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Email" type="email" placeholder="ton@email.com"
            icon={Mail} error={errors.email}
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            autoComplete="email"
          />
          <Input
            label="Mot de passe" type="password" placeholder="••••••••"
            icon={Lock} error={errors.password}
            value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            autoComplete="current-password"
          />
          <div className="text-right">
            <button type="button" className="text-xs text-brand-500 hover:underline">
              Mot de passe oublié ?
            </button>
          </div>
          <Button fullWidth size="lg" loading={loading} type="submit">
            Se connecter
          </Button>
        </form>

        <p className="text-center text-sm text-sand-400 mt-6">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-brand-500 font-semibold hover:underline">
            S'inscrire
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

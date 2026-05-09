import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Phone } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/useToast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const { success } = useToast()
  const navigate = useNavigate()

  function set(key) {
    return (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    login(
      { id: 2, name: form.name, email: form.email, avatar: form.name[0]?.toUpperCase() || 'U', role: 'user' },
      'mock_jwt_token'
    )
    success('🎉 Compte créé ! Bienvenue sur Souk')
    navigate('/')
  }

  return (
    <div className="page-transition min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-soft border border-sand-200"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-serif text-3xl text-sand-900 mb-1">Créer un compte</h1>
        <p className="text-sand-400 text-sm mb-8">Rejoins des milliers de vendeurs</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input label="Prénom & Nom" type="text" placeholder="Kofi Mensah"
            icon={User} value={form.name} onChange={set('name')} required />
          <Input label="Email" type="email" placeholder="ton@email.com"
            icon={Mail} value={form.email} onChange={set('email')} autoComplete="email" required />
          <Input label="Téléphone" type="tel" placeholder="+229 XX XX XX XX"
            icon={Phone} value={form.phone} onChange={set('phone')} />
          <Input label="Mot de passe" type="password" placeholder="Minimum 8 caractères"
            icon={Lock} value={form.password} onChange={set('password')} autoComplete="new-password" required />

          <p className="text-xs text-sand-400">
            En créant un compte, tu acceptes nos{' '}
            <a className="text-brand-500 hover:underline" href="#">CGU</a>{' '}
            et notre{' '}
            <a className="text-brand-500 hover:underline" href="#">Politique de confidentialité</a>.
          </p>

          <Button fullWidth size="lg" loading={loading} type="submit">
            Créer mon compte
          </Button>
        </form>

        <p className="text-center text-sm text-sand-400 mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-brand-500 font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

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
  const [errors, setErrors] = useState({})
  const { register } = useAuthStore()
  const { success, error } = useToast()
  const navigate = useNavigate()

  function set(key) {
    return (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  }

  function validate() {
    const e = {}
    if (!form.name) e.name = 'Nom requis'
    if (!form.email) e.email = 'Email requis'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide'
    if (!form.password) e.password = 'Mot de passe requis'
    else if (form.password.length < 8) e.password = 'Minimum 8 caractères'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      })
      success('🎉 Compte créé ! Vérifie ton email pour confirmer.')
      navigate('/')
    } catch (err) {
      error(err.message || 'Erreur lors de la création du compte')
    } finally {
      setLoading(false)
    }
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
            icon={User} value={form.name} onChange={set('name')}
            error={errors.name} required />
          <Input label="Email" type="email" placeholder="ton@email.com"
            icon={Mail} value={form.email} onChange={set('email')}
            error={errors.email} autoComplete="email" required />
          <Input label="Téléphone" type="tel" placeholder="+229 XX XX XX XX"
            icon={Phone} value={form.phone} onChange={set('phone')} />
          <Input label="Mot de passe" type="password" placeholder="Minimum 8 caractères"
            icon={Lock} value={form.password} onChange={set('password')}
            error={errors.password} autoComplete="new-password" required />

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
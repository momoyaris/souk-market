import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, Check } from 'lucide-react'
import { CATEGORIES } from '@/utils/mockData'
import { useToast } from '@/hooks/useToast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const STEPS = ['Infos', 'Photos', 'Prix', 'Publier']

const CONDITIONS = ['Neuf avec étiquette', 'Très bon état', 'Bon état', 'État correct', 'Pour pièces']

export default function PublishPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', category: '', city: '', description: '',
    price: '', condition: 'Bon état',
  })
  const { success } = useToast()
  const navigate = useNavigate()

  function set(key) {
    return (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  }

  async function handlePublish() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    success('✅ Annonce publiée ! Elle est visible maintenant.')
    navigate('/profile')
  }

  return (
    <div className="page-transition max-w-2xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl text-sand-900 mb-1">Publier une annonce</h1>
        <p className="text-sand-400 text-sm mb-8">Visible en quelques secondes, c'est gratuit</p>

        {/* Steps bar */}
        <div className="flex rounded-xl overflow-hidden border border-sand-200 mb-8" role="progressbar" aria-valuenow={step + 1} aria-valuemax={4}>
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`flex-1 py-2.5 text-center text-xs font-semibold transition-colors border-r last:border-r-0 border-sand-200 ${
                i < step ? 'bg-sand-900 text-white' :
                i === step ? 'bg-brand-500 text-white' :
                'bg-white text-sand-400'
              }`}
            >
              {i < step ? <Check size={12} className="inline" /> : `${i + 1}. ${s}`}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-sand-200 shadow-card space-y-5">
          {/* Step 0 — Infos */}
          {step === 0 && (
            <>
              <Input label="Titre de l'annonce *" placeholder="Ex: iPhone 14 Pro 256Go — comme neuf"
                value={form.title} onChange={set('title')} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-sand-500 uppercase tracking-wide mb-1.5">
                    Catégorie *
                  </label>
                  <select value={form.category} onChange={set('category')}
                    className="w-full border border-sand-300 rounded-xl px-3 py-3 text-sm bg-white focus:outline-none focus:border-brand-500">
                    <option value="">Choisir</option>
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                </div>
                <Input label="Ville *" placeholder="Ex: Cotonou"
                  value={form.city} onChange={set('city')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-sand-500 uppercase tracking-wide mb-1.5">
                  Description *
                </label>
                <textarea
                  value={form.description} onChange={set('description')}
                  placeholder="État, caractéristiques, raison de la vente…"
                  rows={4}
                  className="w-full border border-sand-300 rounded-xl px-4 py-3 text-sm font-sans resize-none focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </>
          )}

          {/* Step 1 — Photos */}
          {step === 1 && (
            <div>
              <label className="block text-xs font-semibold text-sand-500 uppercase tracking-wide mb-3">
                Photos (max 8)
              </label>
              <label
                className="flex flex-col items-center justify-center border-2 border-dashed border-sand-300 rounded-2xl py-14 cursor-pointer hover:border-brand-500 hover:bg-brand-50/30 transition-colors group"
                htmlFor="photoUpload"
              >
                <Upload size={32} className="text-sand-400 group-hover:text-brand-500 mb-3 transition-colors" />
                <p className="text-sm text-sand-600">
                  <strong className="text-brand-500">Clique pour ajouter</strong> ou glisse tes photos
                </p>
                <p className="text-xs text-sand-400 mt-1">JPG, PNG — max 10 Mo par photo</p>
                <input id="photoUpload" type="file" accept="image/*" multiple className="sr-only"
                  onChange={() => {}} />
              </label>
            </div>
          )}

          {/* Step 2 — Prix */}
          {step === 2 && (
            <>
              <Input label="Prix (FCFA) *" type="number" placeholder="Ex: 150000"
                value={form.price} onChange={set('price')} />
              <div>
                <label className="block text-xs font-semibold text-sand-500 uppercase tracking-wide mb-1.5">
                  État de l'objet
                </label>
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS.map(c => (
                    <button key={c} type="button"
                      onClick={() => setForm(f => ({ ...f, condition: c }))}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors focus:outline-none ${
                        form.condition === c
                          ? 'bg-sand-900 text-white border-sand-900'
                          : 'bg-white text-sand-500 border-sand-300 hover:border-sand-500'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 3 — Review */}
          {step === 3 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sand-900">Récapitulatif</h3>
              {[
                ['Titre', form.title || '—'],
                ['Ville', form.city || '—'],
                ['Prix', form.price ? `${Number(form.price).toLocaleString('fr-FR')} FCFA` : '—'],
                ['État', form.condition],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm py-2 border-b border-sand-100">
                  <span className="text-sand-400">{k}</span>
                  <span className="font-semibold text-sand-900">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <Button variant="ghost" fullWidth onClick={() => setStep(s => s - 1)}>
              ← Précédent
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button fullWidth onClick={() => setStep(s => s + 1)}>
              Suivant →
            </Button>
          ) : (
            <Button fullWidth loading={loading} onClick={handlePublish}>
              Publier l'annonce
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

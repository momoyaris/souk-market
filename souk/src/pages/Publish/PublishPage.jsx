import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, Check, X } from 'lucide-react'
import { CATEGORIES } from '@/utils/mockData'
import { useToast } from '@/hooks/useToast'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/services/supabase'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const STEPS = ['Infos', 'Photos', 'Prix', 'Publier']
const CONDITIONS = ['Neuf avec étiquette', 'Très bon état', 'Bon état', 'État correct', 'Pour pièces']

export default function PublishPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([]) // fichiers locaux
  const [previews, setPreviews] = useState([]) // URLs de prévisualisation
  const [form, setForm] = useState({
    title: '', category: '', city: '', description: '',
    price: '', condition: 'Bon état',
  })
  const { success, error } = useToast()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  function set(key) {
    return (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  }

  // Gérer la sélection des photos
  function handlePhotos(e) {
    const files = Array.from(e.target.files).slice(0, 8)
    setImages(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  function removePhoto(index) {
    setImages(imgs => imgs.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Upload une image vers Supabase Storage
  async function uploadImage(file, listingId) {
    const ext = file.name.split('.').pop()
    const path = `${listingId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('listings-images')
      .upload(path, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('listings-images')
      .getPublicUrl(path)

    return data.publicUrl
  }

  async function handlePublish() {
    // Validation
    if (!form.title || !form.category || !form.city || !form.description) {
      error('Remplis tous les champs obligatoires')
      setStep(0)
      return
    }
    if (!form.price) {
      error('Ajoute un prix')
      setStep(2)
      return
    }

    setLoading(true)
    try {
      // 1. Créer l'annonce dans Supabase
      const { data: listing, error: insertError } = await supabase
        .from('listings')
        .insert({
          user_id: user.id,
          title: form.title,
          description: form.description,
          price: parseInt(form.price),
          category: form.category,
          city: form.city,
          condition: form.condition,
          images: [],
          is_active: true,
          is_flagged: false,
        })
        .select()
        .single()

      if (insertError) throw insertError

      // 2. Upload les images si il y en a
      if (images.length > 0) {
        const urls = await Promise.all(
          images.map(img => uploadImage(img, listing.id))
        )
        // Mettre à jour l'annonce avec les URLs des images
        await supabase
          .from('listings')
          .update({ images: urls })
          .eq('id', listing.id)
      }

      success('✅ Annonce publiée ! Elle est visible maintenant.')
      navigate('/profile')

    } catch (err) {
      error(err.message || 'Erreur lors de la publication')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-transition max-w-2xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl text-sand-900 mb-1">Publier une annonce</h1>
        <p className="text-sand-400 text-sm mb-8">Visible en quelques secondes, c'est gratuit</p>

        {/* Steps bar */}
        <div className="flex rounded-xl overflow-hidden border border-sand-200 mb-8" role="progressbar" aria-valuenow={step + 1} aria-valuemax={4}>
          {STEPS.map((s, i) => (
            <div key={s} className={`flex-1 py-2.5 text-center text-xs font-semibold transition-colors border-r last:border-r-0 border-sand-200 ${
              i < step ? 'bg-sand-900 text-white' :
              i === step ? 'bg-brand-500 text-white' :
              'bg-white text-sand-400'
            }`}>
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

              {/* Prévisualisations */}
              {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {previews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-sand-200">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label
                className="flex flex-col items-center justify-center border-2 border-dashed border-sand-300 rounded-2xl py-10 cursor-pointer hover:border-brand-500 hover:bg-brand-50/30 transition-colors group"
                htmlFor="photoUpload"
              >
                <Upload size={28} className="text-sand-400 group-hover:text-brand-500 mb-2 transition-colors" />
                <p className="text-sm text-sand-600">
                  <strong className="text-brand-500">Clique pour ajouter</strong> ou glisse tes photos
                </p>
                <p className="text-xs text-sand-400 mt-1">JPG, PNG — max 10 Mo — {previews.length}/8</p>
                <input id="photoUpload" type="file" accept="image/*" multiple className="sr-only"
                  onChange={handlePhotos} />
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
                ['Catégorie', form.category || '—'],
                ['Ville', form.city || '—'],
                ['Prix', form.price ? `${Number(form.price).toLocaleString('fr-FR')} FCFA` : '—'],
                ['État', form.condition],
                ['Photos', `${images.length} photo(s)`],
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
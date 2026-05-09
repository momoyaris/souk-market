import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="page-transition min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-7xl mb-4">🔍</p>
        <h1 className="font-serif text-4xl text-sand-900 mb-2">Page introuvable</h1>
        <p className="text-sand-400 mb-8">Cette page n'existe pas ou a été déplacée.</p>
        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={() => navigate(-1)}>← Retour</Button>
          <Button onClick={() => navigate('/')}>Accueil</Button>
        </div>
      </motion.div>
    </div>
  )
}

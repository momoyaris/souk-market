import { Link } from 'react-router-dom'

const links = [
  { label: 'À propos',  to: '#' },
  { label: 'Aide',      to: '#' },
  { label: 'CGU',       to: '#' },
  { label: 'Contact',   to: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-sand-900 text-white/60 py-12 px-6 mt-16" role="contentinfo">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
        <span className="font-serif text-white text-xl">
          Souk<span className="text-brand-400">.</span>
        </span>
        <nav aria-label="Liens du pied de page" className="flex gap-6">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="text-sm hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-white/30">© 2025 Souk Marketplace</p>
      </div>
    </footer>
  )
}

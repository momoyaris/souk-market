import { Link, useNavigate } from 'react-router-dom'
import { MessageCircle, Heart, Plus, User, LogOut, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import SearchBar from '@/components/ui/SearchBar'
import Button from '@/components/ui/Button'

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-sand-100/90 backdrop-blur-md border-b border-sand-300">
      <nav
        className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center gap-4"
        aria-label="Navigation principale"
      >
        {/* Logo */}
        <Link
          to="/"
          className="font-serif text-2xl text-sand-900 shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-400 rounded"
          aria-label="Souk — Accueil"
        >
          Souk<span className="text-brand-500">.</span>
        </Link>

        {/* Search — hidden on mobile */}
        <div className="hidden sm:flex flex-1 max-w-md">
          <SearchBar className="w-full" />
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <NavIconBtn to="/messages" label="Messages" icon={<MessageCircle size={18} />} />
              <NavIconBtn to="/favorites" label="Favoris" icon={<Heart size={18} />} />
              <NavIconBtn to="/admin" label="Admin" icon={<ShieldCheck size={18} />} srOnly />
              <NavIconBtn to="/profile" label="Profil" icon={<User size={18} />} />
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-full bg-sand-200 hover:bg-sand-300 flex items-center justify-center text-sand-500 hover:text-sand-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400"
                aria-label="Se déconnecter"
              >
                <LogOut size={16} />
              </button>
              <Button
                size="sm"
                onClick={() => navigate('/publish')}
                className="hidden sm:inline-flex"
              >
                <Plus size={14} aria-hidden="true" /> Publier
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Connexion
              </Button>
              <Button size="sm" onClick={() => navigate('/publish')}>
                Publier
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile search */}
      <div className="sm:hidden px-4 pb-3">
        <SearchBar className="w-full" />
      </div>
    </header>
  )
}

function NavIconBtn({ to, label, icon, srOnly = false }) {
  return (
    <Link
      to={to}
      aria-label={label}
      className={`w-9 h-9 rounded-full bg-sand-200 hover:bg-sand-300 flex items-center justify-center text-sand-600 hover:text-sand-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400 ${srOnly ? 'hidden md:flex' : ''}`}
    >
      {icon}
    </Link>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Package, Flag, TrendingUp, Trash2, CheckCircle, Ban } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import Button from '@/components/ui/Button'

const STATS = [
  { label: 'Annonces actives', value: '247', icon: Package, color: 'text-brand-500' },
  { label: 'Utilisateurs',     value: '1 823', icon: Users,   color: 'text-green-600' },
  { label: 'Signalements',     value: '14',  icon: Flag,    color: 'text-amber-500' },
  { label: 'Taux approbation', value: '98%', icon: TrendingUp, color: 'text-blue-500' },
]

const REPORTS_INIT = [
  { id: 1, listing: 'iPhone cassé (vendu entier)', seller: 'user_3412', reason: 'Tromperie',      status: 'flagged' },
  { id: 2, listing: 'Voiture — photos volées',    seller: 'vendeur_99', reason: 'Fraude',         status: 'flagged' },
  { id: 3, listing: 'Réfrigérateur LG',           seller: 'amina_s',   reason: 'Prix suspect',   status: 'pending' },
]

const USERS_INIT = [
  { id: 1, name: 'Kofi Mensah',  email: 'kofi@example.com',       listings: 12, status: 'active' },
  { id: 2, name: 'Ama Touré',    email: 'ama@example.com',         listings: 3,  status: 'active' },
  { id: 3, name: 'user_3412',    email: 'suspicious@temp.com',     listings: 47, status: 'suspect' },
]

const statusStyle = {
  flagged: 'bg-red-100 text-red-700',
  pending: 'bg-amber-100 text-amber-700',
  active:  'bg-green-100 text-green-700',
  suspect: 'bg-red-100 text-red-700',
}

export default function AdminPage() {
  const [reports, setReports]   = useState(REPORTS_INIT)
  const [users, setUsers]       = useState(USERS_INIT)
  const { success }             = useToast()

  function removeReport(id, msg) {
    setReports(r => r.filter(x => x.id !== id))
    success('✅ ' + msg)
  }

  function banUser(id) {
    setUsers(u => u.map(x => x.id === id ? { ...x, status: 'banned' } : x))
    success('✅ Utilisateur banni')
  }

  return (
    <div className="page-transition max-w-5xl mx-auto px-4 md:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl text-sand-900">Admin Panel</h1>
          <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full">🛡️ Admin</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="bg-white border border-sand-200 rounded-2xl p-5 shadow-card"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <s.icon size={20} className={`${s.color} mb-3`} aria-hidden="true" />
              <p className="text-2xl font-bold text-sand-900">{s.value}</p>
              <p className="text-xs text-sand-400 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Reports */}
        <section className="mb-10" aria-labelledby="reports-heading">
          <h2 id="reports-heading" className="font-serif text-xl text-sand-900 mb-4">
            Signalements en attente
            {reports.length > 0 && (
              <span className="ml-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {reports.length}
              </span>
            )}
          </h2>
          {reports.length === 0 ? (
            <p className="text-sand-400 text-sm py-6 text-center">✅ Aucun signalement en attente</p>
          ) : (
            <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-sand-100 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-sand-500 uppercase tracking-wide">Annonce</th>
                    <th className="px-4 py-3 text-xs font-semibold text-sand-500 uppercase tracking-wide">Vendeur</th>
                    <th className="px-4 py-3 text-xs font-semibold text-sand-500 uppercase tracking-wide">Motif</th>
                    <th className="px-4 py-3 text-xs font-semibold text-sand-500 uppercase tracking-wide">Statut</th>
                    <th className="px-4 py-3 text-xs font-semibold text-sand-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r, i) => (
                    <tr key={r.id} className={`border-t border-sand-100 ${i % 2 === 0 ? '' : 'bg-sand-50/50'}`}>
                      <td className="px-4 py-3 font-medium text-sand-800">{r.listing}</td>
                      <td className="px-4 py-3 text-sand-500">{r.seller}</td>
                      <td className="px-4 py-3 text-sand-500">{r.reason}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle[r.status]}`}>
                          {r.status === 'flagged' ? 'Signalé' : 'En révision'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => removeReport(r.id, 'Annonce supprimée')}
                            className="flex items-center gap-1 text-xs text-red-600 hover:underline font-semibold focus:outline-none">
                            <Trash2 size={12} /> Supprimer
                          </button>
                          <button onClick={() => removeReport(r.id, 'Annonce validée')}
                            className="flex items-center gap-1 text-xs text-green-600 hover:underline font-semibold focus:outline-none">
                            <CheckCircle size={12} /> Valider
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Users */}
        <section aria-labelledby="users-heading">
          <h2 id="users-heading" className="font-serif text-xl text-sand-900 mb-4">Utilisateurs récents</h2>
          <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sand-100 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-sand-500 uppercase tracking-wide">Nom</th>
                  <th className="px-4 py-3 text-xs font-semibold text-sand-500 uppercase tracking-wide hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 text-xs font-semibold text-sand-500 uppercase tracking-wide">Annonces</th>
                  <th className="px-4 py-3 text-xs font-semibold text-sand-500 uppercase tracking-wide">Statut</th>
                  <th className="px-4 py-3 text-xs font-semibold text-sand-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} className={`border-t border-sand-100 ${i % 2 === 0 ? '' : 'bg-sand-50/50'}`}>
                    <td className="px-4 py-3 font-medium text-sand-800">{u.name}</td>
                    <td className="px-4 py-3 text-sand-500 hidden sm:table-cell">{u.email}</td>
                    <td className="px-4 py-3 text-sand-500">{u.listings}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle[u.status] || 'bg-sand-100 text-sand-500'}`}>
                        {u.status === 'active' ? 'Actif' : u.status === 'suspect' ? 'Suspect' : 'Banni'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.status !== 'banned' && (
                        <button onClick={() => banUser(u.id)}
                          className="flex items-center gap-1 text-xs text-red-600 hover:underline font-semibold focus:outline-none">
                          <Ban size={12} /> Bannir
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </motion.div>
    </div>
  )
}

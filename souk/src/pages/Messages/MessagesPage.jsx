import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ArrowLeft } from 'lucide-react'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/utils/helpers'

export default function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [showList, setShowList] = useState(true)
  const { user } = useAuthStore()
  const bottomRef = useRef(null)

  const active = conversations.find(c => c.id === activeId)

  // Charger les conversations
  useEffect(() => {
    async function fetchConversations() {
      if (!user) return
      setLoading(true)

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          listing:listings(id, title, price),
          buyer:profiles!conversations_buyer_id_fkey(id, name, avatar),
          seller:profiles!conversations_seller_id_fkey(id, name, avatar)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setConversations(data)
        if (data.length > 0) setActiveId(data[0].id)
      }
      setLoading(false)
    }

    fetchConversations()
  }, [user])

  // Charger les messages de la conversation active
  useEffect(() => {
    if (!activeId) return

    async function fetchMessages() {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles(id, name, avatar)
        `)
        .eq('conversation_id', activeId)
        .order('created_at', { ascending: true })

      if (!error) setMessages(data || [])
    }

    fetchMessages()

    // Temps réel — écouter les nouveaux messages
    const channel = supabase
      .channel(`messages:${activeId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${activeId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [activeId])

  // Scroll automatique vers le bas
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function selectConv(id) {
    setActiveId(id)
    setShowList(false)
  }

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim() || !activeId || !user) return

    const text = input.trim()
    setInput('')

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: activeId,
        user_id: user.id,
        text,
      })

    if (error) console.error('Erreur envoi message:', error.message)
  }

  // Obtenir le nom de l'interlocuteur
  function getParticipant(conv) {
    if (!conv || !user) return { name: '?', avatar: '?' }
    const other = conv.buyer_id === user.id ? conv.seller : conv.buyer
    return {
      name: other?.name || 'Utilisateur',
      avatar: other?.name?.[0]?.toUpperCase() || '?',
    }
  }

  // Formater l'heure
  function formatTime(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleTimeString('fr-FR', {
      hour: '2-digit', minute: '2-digit'
    })
  }

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)] text-sand-400">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Chargement des messages…</p>
      </div>
    </div>
  )

  return (
    <div className="page-transition h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        'w-full md:w-72 border-r border-sand-200 flex flex-col bg-white shrink-0',
        'md:flex', showList ? 'flex' : 'hidden md:flex'
      )} aria-label="Conversations">
        <div className="px-4 py-4 border-b border-sand-200">
          <h1 className="font-serif text-xl text-sand-900">Messages</h1>
        </div>

        {conversations.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sand-400 text-sm p-6 text-center">
            <div>
              <p className="text-3xl mb-2">💬</p>
              <p>Aucune conversation</p>
            </div>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto">
            {conversations.map(conv => {
              const participant = getParticipant(conv)
              return (
                <li key={conv.id}>
                  <button
                    onClick={() => selectConv(conv.id)}
                    aria-current={conv.id === activeId ? 'true' : undefined}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3.5 border-b border-sand-100 transition-colors text-left focus:outline-none',
                      conv.id === activeId ? 'bg-brand-50' : 'hover:bg-sand-50'
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {participant.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-sm text-sand-900 truncate">
                          {participant.name}
                        </span>
                        <span className="text-xs text-sand-400 shrink-0 ml-2">
                          {formatTime(conv.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-sand-400 truncate">
                        {conv.listing?.title || 'Annonce'}
                      </p>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </aside>

      {/* Chat area */}
      <main className={cn(
        'flex-1 flex flex-col bg-sand-50',
        'md:flex', !showList ? 'flex' : 'hidden md:flex'
      )}>
        {active ? (
          <>
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-sand-200 bg-white flex items-center gap-3">
              <button
                className="md:hidden p-1.5 rounded-lg hover:bg-sand-100 transition-colors"
                onClick={() => setShowList(true)}
                aria-label="Retour"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                {getParticipant(active).avatar}
              </div>
              <div>
                <p className="font-semibold text-sm text-sand-900">
                  {getParticipant(active).name}
                </p>
                <p className="text-xs text-sand-400">
                  {active.listing?.title} —{' '}
                  {active.listing?.price?.toLocaleString('fr-FR')} FCFA
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3" aria-live="polite">
              {messages.length === 0 && (
                <p className="text-center text-sand-400 text-sm mt-8">
                  Aucun message — commence la conversation !
                </p>
              )}
              <AnimatePresence initial={false}>
                {messages.map(msg => {
                  const isMe = msg.user_id === user?.id
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn('flex', isMe ? 'justify-end' : 'justify-start')}
                    >
                      <div className={cn(
                        'max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                        isMe
                          ? 'bg-brand-500 text-white rounded-br-sm'
                          : 'bg-white border border-sand-200 text-sand-800 rounded-bl-sm shadow-sm'
                      )}>
                        {msg.text}
                        <span className={cn(
                          'block text-xs mt-0.5',
                          isMe ? 'text-white/60' : 'text-sand-400'
                        )}>
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="px-4 py-3 border-t border-sand-200 bg-white flex gap-2 items-center">
              <input
                type="text" value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Écrire un message…"
                aria-label="Message"
                className="flex-1 bg-sand-100 border-none rounded-full px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Envoyer"
                className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white hover:bg-brand-400 disabled:opacity-40 transition-all focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sand-400">
            <div className="text-center">
              <p className="text-4xl mb-3">💬</p>
              <p className="font-semibold">Sélectionne une conversation</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
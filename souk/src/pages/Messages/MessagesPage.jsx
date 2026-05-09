import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ArrowLeft } from 'lucide-react'
import { CONVERSATIONS } from '@/utils/mockData'
import { cn } from '@/utils/helpers'

export default function MessagesPage() {
  const [conversations, setConversations] = useState(CONVERSATIONS)
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id)
  const [input, setInput] = useState('')
  const [showList, setShowList] = useState(true) // mobile toggle

  const active = conversations.find(c => c.id === activeId)

  function selectConv(id) {
    setActiveId(id)
    setShowList(false)
    // Mark as read
    setConversations(cs => cs.map(c => c.id === id ? { ...c, unread: false } : c))
  }

  function sendMessage(e) {
    e.preventDefault()
    if (!input.trim()) return
    setConversations(cs => cs.map(c => {
      if (c.id !== activeId) return c
      return {
        ...c,
        messages: [...c.messages, { id: Date.now(), from: 'me', text: input.trim(), time: 'maintenant' }],
      }
    }))
    setInput('')
    // Simulate reply
    setTimeout(() => {
      setConversations(cs => cs.map(c => {
        if (c.id !== activeId) return c
        return {
          ...c,
          messages: [...c.messages, {
            id: Date.now() + 1, from: 'them',
            text: 'Merci pour ton message, je te réponds dès que possible 👍', time: 'maintenant',
          }],
        }
      }))
    }, 1200)
  }

  return (
    <div className="page-transition h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Sidebar — conversation list */}
      <aside className={cn(
        'w-full md:w-72 border-r border-sand-200 flex flex-col bg-white shrink-0',
        'md:flex', showList ? 'flex' : 'hidden md:flex'
      )} aria-label="Conversations">
        <div className="px-4 py-4 border-b border-sand-200">
          <h1 className="font-serif text-xl text-sand-900">Messages</h1>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <li key={conv.id}>
              <button
                onClick={() => selectConv(conv.id)}
                aria-current={conv.id === activeId ? 'true' : undefined}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3.5 border-b border-sand-100 transition-colors text-left focus:outline-none focus:bg-brand-50',
                  conv.id === activeId ? 'bg-brand-50' : 'hover:bg-sand-50'
                )}
              >
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0', conv.participant.color)}>
                  {conv.participant.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-sm text-sand-900 truncate">{conv.participant.name}</span>
                    <span className="text-xs text-sand-400 shrink-0 ml-2">{conv.lastTime}</span>
                  </div>
                  <p className="text-xs text-sand-400 truncate">{conv.messages.at(-1)?.text}</p>
                </div>
                {conv.unread && (
                  <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" aria-label="Non lu" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat area */}
      <main className={cn(
        'flex-1 flex flex-col bg-sand-50',
        'md:flex', !showList ? 'flex' : 'hidden md:flex'
      )}>
        {active ? (
          <>
            {/* Chat header */}
            <div className="px-4 py-3.5 border-b border-sand-200 bg-white flex items-center gap-3">
              <button
                className="md:hidden p-1.5 rounded-lg hover:bg-sand-100 transition-colors"
                onClick={() => setShowList(true)}
                aria-label="Retour aux conversations"
              >
                <ArrowLeft size={18} />
              </button>
              <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm', active.participant.color)}>
                {active.participant.avatar}
              </div>
              <div>
                <p className="font-semibold text-sm text-sand-900">{active.participant.name}</p>
                <p className="text-xs text-sand-400">{active.listing}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3" aria-live="polite">
              <AnimatePresence initial={false}>
                {active.messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className={cn('flex', msg.from === 'me' ? 'justify-end' : 'justify-start')}
                  >
                    <div className={cn(
                      'max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                      msg.from === 'me'
                        ? 'bg-brand-500 text-white rounded-br-sm'
                        : 'bg-white border border-sand-200 text-sand-800 rounded-bl-sm shadow-sm'
                    )}>
                      {msg.text}
                      <span className={cn('block text-xs mt-0.5', msg.from === 'me' ? 'text-white/60' : 'text-sand-400')}>
                        {msg.time}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
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

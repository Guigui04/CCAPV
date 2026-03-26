import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Send, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { submitContactMessage } from '../lib/contactService'
import { LIMITS } from '../lib/validate'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      await submitContactMessage({ name, email, subject, message })
      setSent(true)
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Retour à l'accueil
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Mail size={24} />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900">
              Contact
            </h1>
            <p className="text-sm text-slate-400">Une question ? Écris-nous !</p>
          </div>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-5 py-8 text-center"
          >
            <CheckCircle size={40} className="mx-auto mb-3 text-green-500" />
            <p className="font-extrabold text-lg mb-1">Message envoyé !</p>
            <p className="text-sm">
              Nous te répondrons dans les meilleurs délais.
            </p>
          </motion.div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    required
                    maxLength={LIMITS.NAME}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Sujet *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input-field"
                  required
                  maxLength={LIMITS.TITLE}
                  placeholder="Ex: Question sur une aide"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-field resize-none"
                  rows={5}
                  required
                  maxLength={LIMITS.CONTENT}
                  placeholder="Décris ta question ou ta demande..."
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full"
              >
                {sending ? (
                  'Envoi...'
                ) : (
                  <>
                    <Send size={16} /> Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

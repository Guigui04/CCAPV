import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
            <Mail className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-2xl font-display font-extrabold text-slate-900">
            Mot de passe oublié
          </h1>
          <p className="text-slate-500 text-sm mt-1 text-center">
            Entre ton email pour recevoir un lien de réinitialisation.
          </p>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center"
          >
            <CheckCircle className="text-green-600 mx-auto mb-3" size={40} />
            <h2 className="font-bold text-green-800 text-lg mb-1">Email envoyé !</h2>
            <p className="text-green-600 text-sm">
              Si un compte existe avec l'adresse <strong>{email}</strong>, tu recevras un lien pour réinitialiser ton mot de passe.
            </p>
          </motion.div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm mb-4 text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 flex items-center gap-3 px-4 py-3.5 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <span className="text-slate-400 text-lg">✉️</span>
                <input
                  type="email"
                  placeholder="Ton adresse email"
                  className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-base font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </button>
            </form>
          </>
        )}

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 mt-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Retour à la connexion
        </Link>
      </motion.div>
    </div>
  )
}

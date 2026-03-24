import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    setLoading(true)
    try {
      await register(email, password, { first_name: firstName, last_name: lastName })
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription")
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
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200 hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl">IJ</span>
            </div>
          </Link>
          <h1 className="text-3xl font-display font-extrabold text-slate-900">
            Créer un compte
          </h1>
          <p className="text-slate-500 text-sm mt-1 text-center">
            Rejoins la communauté Info Jeunes
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-5 py-6 text-center"
          >
            <p className="font-extrabold text-lg mb-1">✅ Inscription réussie !</p>
            <p className="text-sm mb-4">
              Vérifie ta boîte mail pour confirmer ton compte.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline"
            >
              Se connecter <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm mb-4 text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First + Last name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-2xl border border-slate-200 flex items-center gap-2 px-4 py-3.5 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                  <input
                    type="text"
                    placeholder="Prénom"
                    className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-sm font-medium w-full"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 flex items-center gap-2 px-4 py-3.5 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                  <input
                    type="text"
                    placeholder="Nom"
                    className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-sm font-medium w-full"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-2xl border border-slate-200 flex items-center gap-3 px-4 py-3.5 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <span className="text-slate-400 text-lg">✉️</span>
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-base font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="bg-white rounded-2xl border border-slate-200 flex items-center gap-3 px-4 py-3.5 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <span className="text-slate-400 text-lg">🔒</span>
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Mot de passe (6 car. min)"
                  className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-base font-medium"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Inscription...
                  </span>
                ) : (
                  <>
                    Créer mon compte <UserPlus size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Déjà un compte ?{' '}
              <Link
                to="/login"
                className="text-indigo-600 font-bold hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </>
        )}

        {/* Back to home */}
        <Link
          to="/"
          className="block text-center text-sm text-slate-400 hover:text-slate-600 mt-4 transition-colors"
        >
          ← Retour à l'accueil
        </Link>
      </motion.div>
    </div>
  )
}

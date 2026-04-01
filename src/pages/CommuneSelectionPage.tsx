import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getAllCommunesSimple } from '../lib/communeService'

export default function CommuneSelectionPage() {
  const { updateProfile, needsCommuneSelection } = useAuth()
  const navigate = useNavigate()
  const [communeId, setCommuneId] = useState('')
  const [communes, setCommunes] = useState<{ id: string; name: string }[]>([])
  const [communesLoading, setCommunesLoading] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // If user already has a commune, redirect home
    if (!needsCommuneSelection) {
      navigate('/', { replace: true })
      return
    }

    getAllCommunesSimple()
      .then(setCommunes)
      .catch(() => setCommunes([]))
      .finally(() => setCommunesLoading(false))
  }, [needsCommuneSelection, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!communeId) {
      setError('Sélectionne ton intercommunalité pour continuer')
      return
    }

    setLoading(true)
    try {
      await updateProfile({ commune_id: communeId })
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
      setError(message)
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
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <Building2 size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-display font-extrabold text-slate-900 text-center">
            Choisis ton intercommunalité
          </h1>
          <p className="text-slate-500 text-sm mt-2 text-center leading-relaxed">
            Pour te montrer les informations de ta communauté, nous avons besoin de savoir à quelle intercommunalité tu appartiens.
          </p>
        </div>

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
          <div className="bg-white rounded-2xl border border-slate-200 flex items-center gap-3 px-4 py-3.5 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <Building2 size={18} className="text-slate-400 shrink-0" />
            <select
              value={communeId}
              onChange={(e) => setCommuneId(e.target.value)}
              required
              disabled={communesLoading}
              className="flex-1 bg-transparent outline-none text-slate-800 text-base font-medium appearance-none cursor-pointer disabled:opacity-50"
            >
              <option value="">
                {communesLoading ? 'Chargement...' : 'Sélectionne ta CC'}
              </option>
              {communes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !communeId}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Enregistrement...
              </span>
            ) : (
              'Confirmer'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

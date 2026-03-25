import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div className="text-8xl font-display font-black text-indigo-600 mb-2">404</div>
        <h1 className="text-xl font-display font-bold text-slate-900 mb-2">
          Page introuvable
        </h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          La page que tu cherches n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="btn-primary w-full sm:w-auto">
            <Home size={16} />
            Retour à l'accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary w-full sm:w-auto"
          >
            <ArrowLeft size={16} />
            Page précédente
          </button>
        </div>
      </motion.div>
    </div>
  )
}

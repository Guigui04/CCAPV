import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY)
    if (!consent) {
      setVisible(true)
    }
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4 pb-safe"
        >
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <p className="text-sm text-slate-600 flex-1">
              Cette application utilise uniquement des cookies techniques nécessaires à son fonctionnement.{' '}
              <Link to="/confidentialite" className="text-indigo-600 font-medium hover:underline">
                En savoir plus
              </Link>
            </p>
            <button
              onClick={accept}
              className="btn-primary btn-sm whitespace-nowrap"
            >
              J'ai compris
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

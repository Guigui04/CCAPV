import { useState, useEffect } from 'react'
import { Building2 } from 'lucide-react'
import { getAllCommunesSimple } from '../lib/communeService'

interface CommuneFilterProps {
  value: string
  onChange: (communeId: string) => void
}

/**
 * Dropdown filter for super_admin to filter data by commune.
 * Shows "Toutes les CC" by default.
 */
export default function CommuneFilter({ value, onChange }: CommuneFilterProps) {
  const [communes, setCommunes] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllCommunesSimple()
      .then(setCommunes)
      .catch(() => setCommunes([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="relative">
      <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className="input-field pl-8 w-full sm:w-56 text-sm disabled:opacity-50"
      >
        <option value="">
          {loading ? 'Chargement...' : 'Toutes les CC'}
        </option>
        {communes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  )
}

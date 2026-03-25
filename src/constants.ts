// ── Onglets principaux avec leurs sous-catégories ──────────────────────

export const TABS = [
  {
    id: 'orientation',
    label: 'Orientation / Formation',
    icon: '🎓',
    lucideIcon: 'GraduationCap',
    color: 'bg-violet-500',
    subcategories: [
      { id: 'parcours-scolaires', label: 'Parcours scolaires' },
      { id: 'reconversion', label: 'Reconversion' },
      { id: 'alternance', label: 'Alternance' },
    ],
  },
  {
    id: 'emploi',
    label: 'Emploi',
    icon: '💼',
    lucideIcon: 'Briefcase',
    color: 'bg-blue-500',
    subcategories: [
      { id: 'recherche-job', label: 'Recherche de job' },
      { id: 'cv', label: 'CV' },
      { id: 'stages', label: 'Stages' },
      { id: 'insertion', label: "Dispositifs d'insertion" },
    ],
  },
  {
    id: 'vie-quotidienne',
    label: 'Vie quotidienne',
    icon: '🏠',
    lucideIcon: 'Home',
    color: 'bg-teal-500',
    subcategories: [
      { id: 'logement', label: 'Logement' },
      { id: 'budget', label: 'Budget' },
      { id: 'transport', label: 'Transport' },
    ],
  },
  {
    id: 'sante',
    label: 'Santé',
    icon: '🏥',
    lucideIcon: 'HeartPulse',
    color: 'bg-rose-500',
    subcategories: [
      { id: 'acces-soins', label: 'Accès aux soins' },
      { id: 'prevention', label: 'Prévention' },
      { id: 'bien-etre', label: 'Bien-être' },
    ],
  },
  {
    id: 'mobilite',
    label: 'Mobilité internationale',
    icon: '✈️',
    lucideIcon: 'Plane',
    color: 'bg-sky-500',
    subcategories: [
      { id: 'erasmus', label: 'Erasmus+' },
      { id: 'volontariat', label: 'Volontariat' },
      { id: 'sejours-etranger', label: "Séjours à l'étranger" },
    ],
  },
  {
    id: 'engagement',
    label: 'Engagement',
    icon: '🤝',
    lucideIcon: 'HandHeart',
    color: 'bg-amber-500',
    subcategories: [
      { id: 'benevolat', label: 'Bénévolat' },
      { id: 'service-civique', label: 'Service civique' },
      { id: 'projets-citoyens', label: 'Projets citoyens' },
    ],
  },
  {
    id: 'droits',
    label: 'Accès aux droits',
    icon: '⚖️',
    lucideIcon: 'Scale',
    color: 'bg-purple-500',
    subcategories: [
      { id: 'aides-financieres', label: 'Aides financières' },
      { id: 'dispositifs-publics', label: 'Dispositifs publics' },
    ],
  },
] as const

export type TabId = typeof TABS[number]['id']
export type SubcategoryId = typeof TABS[number]['subcategories'][number]['id']

// Flat list of all subcategories (for dropdowns, filters, etc.)
export const ALL_SUBCATEGORIES = TABS.flatMap((tab) =>
  tab.subcategories.map((sub) => ({
    ...sub,
    tabId: tab.id,
    tabLabel: tab.label,
    tabIcon: tab.icon,
    tabColor: tab.color,
  }))
)

/** Find a subcategory by its id, returns subcategory + parent tab info */
export function getCategoryById(id: string) {
  return ALL_SUBCATEGORIES.find((s) => s.id === id) ?? null
}

/** Find the parent tab for a subcategory id */
export function getTabBySubcategoryId(id: string) {
  return TABS.find((tab) => tab.subcategories.some((s) => s.id === id)) ?? null
}

/** Find a tab by its own id */
export function getTabById(id: string) {
  return TABS.find((t) => t.id === id) ?? null
}

export const REACTION_LABELS: Record<string, string> = {
  useful: 'Utile',
  unclear: 'Pas clair',
  interested: "Ça m'intéresse",
  more_info: "Je veux plus d'infos",
}

export const FEEDBACK_STATUS_LABELS: Record<string, string> = {
  new: 'Nouveau',
  processed: 'Traité',
  archived: 'Archivé',
}

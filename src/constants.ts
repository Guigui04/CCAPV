export const CATEGORIES = [
  { id: 'sante',       label: 'Santé',       icon: '🏥', lucideIcon: 'HeartPulse', color: 'bg-rose-500' },
  { id: 'activites',   label: 'Activités',   icon: '🎯', lucideIcon: 'Gamepad2',   color: 'bg-orange-500' },
  { id: 'sport',       label: 'Sport',       icon: '⚽', lucideIcon: 'Trophy',     color: 'bg-emerald-500' },
  { id: 'culture',     label: 'Culture',     icon: '🎭', lucideIcon: 'Palette',    color: 'bg-indigo-500' },
  { id: 'emploi',      label: 'Emploi',      icon: '💼', lucideIcon: 'Briefcase',  color: 'bg-blue-500' },
  { id: 'orientation', label: 'Orientation', icon: '🧭', lucideIcon: 'Compass',    color: 'bg-violet-500' },
  { id: 'aides',       label: 'Aides',       icon: '🤝', lucideIcon: 'HandHelping',color: 'bg-amber-500' },
  { id: 'mobilite',    label: 'Mobilité',    icon: '🚌', lucideIcon: 'Bus',        color: 'bg-sky-500' },
  { id: 'logement',    label: 'Logement',    icon: '🏠', lucideIcon: 'Home',       color: 'bg-teal-500' },
  { id: 'prevention',  label: 'Prévention',  icon: '🛡️', lucideIcon: 'ShieldAlert',color: 'bg-red-500' },
  { id: 'citoyennete', label: 'Citoyenneté', icon: '🗳️', lucideIcon: 'Users',      color: 'bg-purple-500' },
  { id: 'evenements',  label: 'Événements',  icon: '📅', lucideIcon: 'Calendar',   color: 'bg-fuchsia-500' },
] as const

export type CategoryId = typeof CATEGORIES[number]['id']

export function getCategoryById(id: string) {
  return CATEGORIES.find(c => c.id === id) ?? null
}

export const REACTION_LABELS: Record<string, string> = {
  useful: 'Utile',
  unclear: 'Pas clair',
  interested: "Ça m'intéresse",
  more_info: "Je veux plus d'infos",
}

export const FEEDBACK_STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  approved: 'Approuvé',
  rejected: 'Rejeté',
}

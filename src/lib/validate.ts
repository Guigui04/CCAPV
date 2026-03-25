/**
 * Centralized input validation & sanitization.
 * Used across services and forms to enforce security constraints.
 */

// ── String sanitization ─────────────────────────────────────

/** Trim and enforce max length */
export function sanitizeText(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength)
}

/** Validate UUID format */
export function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

/** Validate URL with safe protocols only */
export function isValidSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

// ── Password validation ─────────────────────────────────────

export interface PasswordValidation {
  valid: boolean
  errors: string[]
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = []
  if (password.length < 8) errors.push('8 caractères minimum')
  if (!/[A-Z]/.test(password)) errors.push('1 majuscule requise')
  if (!/[a-z]/.test(password)) errors.push('1 minuscule requise')
  if (!/[0-9]/.test(password)) errors.push('1 chiffre requis')
  return { valid: errors.length === 0, errors }
}

/** Password strength for UI indicator (0-4) */
export function passwordStrength(password: string): number {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(score, 4)
}

// ── Form field limits ───────────────────────────────────────

export const LIMITS = {
  TITLE: 200,
  SUMMARY: 500,
  CONTENT: 50_000,
  COMMENT: 1000,
  ALERT_TITLE: 200,
  ALERT_BODY: 2000,
  SEARCH: 100,
  NAME: 50,
  URL: 2048,
} as const

// ── Reaction validation ─────────────────────────────────────

const VALID_REACTIONS = new Set([
  'super_utile',
  'interessant',
  'pas_compris',
  'pas_utile',
])

export function isValidReaction(reaction: string): boolean {
  return VALID_REACTIONS.has(reaction)
}

// ── Role validation ─────────────────────────────────────────

const VALID_ROLES = new Set(['user', 'commune_admin', 'super_admin'])

export function isValidRole(role: string): boolean {
  return VALID_ROLES.has(role)
}

// ── Alert type validation ───────────────────────────────────

const VALID_ALERT_TYPES = new Set(['info', 'event', 'important'])

export function isValidAlertType(type: string): boolean {
  return VALID_ALERT_TYPES.has(type)
}

// ── File upload validation ──────────────────────────────────

const ALLOWED_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif'])
const ALLOWED_IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB

export interface FileValidation {
  valid: boolean
  error?: string
  safeExtension: string
}

export function validateImageFile(file: File): FileValidation {
  // Check MIME type
  if (!ALLOWED_IMAGE_MIMES.has(file.type)) {
    return { valid: false, error: 'Type de fichier non autorisé. Formats acceptés : JPG, PNG, WebP, GIF', safeExtension: '' }
  }

  // Check file extension
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
    return { valid: false, error: 'Extension de fichier non autorisée', safeExtension: '' }
  }

  // Check size
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: 'Image trop lourde (max 5 Mo)', safeExtension: '' }
  }

  return { valid: true, safeExtension: ext }
}

// ── Date validation ─────────────────────────────────────────

export function isValidBirthDate(dateStr: string): boolean {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return false
  const now = new Date()
  const age = now.getFullYear() - date.getFullYear()
  // Must be between 10 and 120 years old
  return age >= 10 && age <= 120
}

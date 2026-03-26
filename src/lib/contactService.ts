import { supabase } from './supabase'
import { sanitizeText, LIMITS } from './validate'

export async function submitContactMessage(payload: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const name = sanitizeText(payload.name, LIMITS.NAME)
  const subject = sanitizeText(payload.subject, LIMITS.TITLE)
  const message = sanitizeText(payload.message, LIMITS.CONTENT)

  if (!name) throw new Error('Le nom est obligatoire')
  if (!payload.email) throw new Error("L'email est obligatoire")
  if (!subject) throw new Error('Le sujet est obligatoire')
  if (!message) throw new Error('Le message est obligatoire')

  const { error } = await supabase
    .from('contact_messages')
    .insert([{ name, email: payload.email.trim(), subject, message }])

  if (error) throw error
}

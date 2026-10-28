/** Enlace wa.me con el mensaje ya escrito. El número va en E.164 sin "+". */
export function whatsappLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

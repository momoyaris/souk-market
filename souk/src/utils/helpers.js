import { clsx } from 'clsx'

export function cn(...inputs) {
  return clsx(inputs)
}

export function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}

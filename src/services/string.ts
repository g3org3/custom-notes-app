export const capitalize = (str?: string): string => {
  if (!str) return ''

  return str.substring(0, 1).toUpperCase() + str.substring(1)
}

export const removeVocals = (str: string): string => {
  const vocals = ['a', 'e', 'i', 'o', 'u']

  return str
    .split('')
    .filter((letter) => vocals.indexOf(letter) === -1)
    .join('')
}

export const subList = (list?: Array<string> | null, limit?: number) => {
  if (!list) return ''

  const toDisplay = list.slice(0, limit || 1)
  const diff = list.length - toDisplay.length

  return `${toDisplay.join(', ')} ${diff > 0 ? '+' + diff : ''}`
}

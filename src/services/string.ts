export const capitalize = (str?: string): string => {
  if (!str) return ''

  return str.substr(0, 1).toUpperCase() + str.substr(1)
}

export const removeVocals = (str: string): string => {
  const vocals = ['a', 'e', 'i', 'o', 'u']

  return str
    .split('')
    .filter((letter) => vocals.indexOf(letter) === -1)
    .join('')
}

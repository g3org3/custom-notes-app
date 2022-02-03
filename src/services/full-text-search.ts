export const createFTS = (query: string) => (line: string) => {
  const lineNormalized = line.toLowerCase()
  const queryNormalized = query.toLowerCase()

  const tokens = queryNormalized.split(' ').filter(Boolean)
  const matchedTokens = tokens.filter((token) => lineNormalized.indexOf(token) !== -1)

  return matchedTokens.length === tokens.length
}

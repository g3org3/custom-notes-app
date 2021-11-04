export const createFTS = (search: string) => (line: string) => {
  const lline = line.toLowerCase()
  const ssearch = search.toLowerCase()

  const tokens = ssearch.split(' ').filter(Boolean)
  const matchedTokens = tokens.filter((token) => lline.indexOf(token) !== -1)

  return matchedTokens.length === tokens.length

  // return lline.indexOf(ssearch) !== -1
}

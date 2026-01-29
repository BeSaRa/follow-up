export function removeTrailingSlash(str: string) {
  return str.replace(/\/$/, '')
}
export function removeLeadingSlash(str: string) {
  return str.replace(/^\//, '')
}

export function addTrailingSlash(str: string) {
  return str.replace(/\/?$/, '/')
}
export function addLeadingSlash(str: string) {
  return str.replace(/^\/?/, '/')
}
export function removeTrailingAndLeadingSlash(str: string) {
  return removeLeadingSlash(removeTrailingSlash(str))
}

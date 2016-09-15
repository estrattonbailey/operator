const getOrigin = url => url.origin || url.protocol+'//'+url.host

/**
 * Standardize base URL
 */
export const origin = getOrigin(window.location) 

/**
 * Create regex to test links
 */
export const originRegEx = new RegExp(origin)

/**
 * Replace site origin, if present,
 * remove leading slash, if present.
 *
 * @param {string} url Raw URL to parse
 * @return {string} URL sans origin and sans leading comma
 */
export const sanitize = url => {
  let path = url.replace(originRegEx, '')
  let clean = path.match(/^\//) ? path.replace(/\/{1}/,'') : path // remove /
  return clean === '' ? '/' : clean
}

export const parseURL = url => {
  let a = document.createElement('a')
  a.href = url
  return a
}

export const link = {
  isSameOrigin: href => origin === getOrigin(parseURL(href)),
  isHash: href => href.match(/^\#/) ? true : false,
  isSameURL: href => window.location.pathname === parseURL(href).pathname
}

/**
 * Set scroll position on current history
 * state so that when returning to the
 * page we can scroll to the previous position
 */
export const saveScrollPosition = () => {
  let scrollTop = window.pageYOffset || window.scrollY || document.body.scrollTop

  window.history.replaceState({ scrollTop }, '')
}

/**
 * Restore previous scroll position,
 * if available
 */
export const restoreScrollPos = () => {
  let scrollTop = history.state.scrollTop
  if (history.state && scrollTop !== undefined ) {
    window.scrollTo(0, scrollTop)
    return scrollTop
  } else {
    window.scrollTo(0, 0)
  }
}

const activeLinks = []
export const setActiveLinks = path => {
  activeLinks.forEach(a => a.classList.remove('is-active'))
  activeLinks.splice(0, activeLinks.length)
  activeLinks.push(...Array.prototype.slice.call(document.querySelectorAll(`[href$="${path}"]`)))
  activeLinks.forEach(a => a.classList.add('is-active'))
}

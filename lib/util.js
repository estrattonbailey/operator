const getOrigin = url => url.origin || url.protocol+'//'+url.host

export const origin = getOrigin(window.location) 

export const originRegEx = new RegExp(origin)

/**
 * Replace site origin, if present,
 * remove leading slash, if present.
 *
 * @param {string} url Raw URL to parse
 * @return {string} URL sans origin and sans leading comma
 */
export const sanitize = url => {
  let route = url.replace(originRegEx, '')
  let clean = route.match(/^\//) ? route.replace(/\/{1}/,'') : route // remove /
  return clean === '' ? '/' : clean
}

export const parseURL = url => {
  let a = document.createElement('a')
  a.href = url
  return a
}

export const link = {
  isSameOrigin: href => origin === getOrigin(parseURL(href)),
  isHash: href => /#/.test(href),
  isSameURL: href => {
    return window.location.search === parseURL(href).search 
        && window.location.pathname === parseURL(href).pathname 
          ? ( true ) : false
  }
}

export const getScrollPosition = () => window.pageYOffset || window.scrollY

export const saveScrollPosition = () => window.history.replaceState({ scrollTop: getScrollPosition() }, '')

export const restoreScrollPos = () => {
  let scrollTop = history.state ? history.state.scrollTop : undefined 
  if (history.state && scrollTop !== undefined ) {
    window.scrollTo(0, scrollTop)
    return scrollTop
  } else {
    window.scrollTo(0, 0)
  }
}

const activeLinks = []
export const setActiveLinks = route => {
  activeLinks.forEach(a => a.classList.remove('is-active'))
  activeLinks.splice(0, activeLinks.length)
  activeLinks.push(...Array.prototype.slice.call(document.querySelectorAll(`[href$="${route}"]`)))
  activeLinks.forEach(a => a.classList.add('is-active'))
}

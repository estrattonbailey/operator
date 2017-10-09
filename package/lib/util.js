export const location = window.location

export function getOrigin (href) {
  const { protocol, host } = href || window.location
  return `${protocol}//${host}`
}

export function getURL (url) {
  let a = document.createElement('a')
  a.href = url
  return a
}

/**
 * @param {string} url Raw URL to parse
 * @return {string} URL sans origin
 */
export function sanitize (url) {
  const route = url.replace(new RegExp(getOrigin()), '')
  return route
}

export function isHash (href) {
  return /#/.test(href)
}

export function isSameURL (href) {
  return window.location.search === getURL(href).search &&
    window.location.pathname === getURL(href).pathname
}

export function isSameOrigin (href) {
  return getOrigin() === getOrigin(getURL(href))
}

export function getValidPath (e, target) {
  if (!target) return
  if (!target.href) return
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  if (target.target === '_blank') return
  if (!isSameOrigin(target.href)) return
  if (isHash(target.href)) return
  if (target.classList.contains('no-ajax')) return
  return target.href
}

let activeLinks = []

export function setActiveLinks (route) {
  const regex = /^\/$/.test(route) ? RegExp(/^\/$/) : new RegExp(route)

  for (let i = 0; i < activeLinks.length; i++) {
    activeLinks[i].classList.remove('is-active')
  }

  activeLinks = [].slice.call(document.querySelectorAll(`[href$="${route}"]`))

  for (let i = 0; i < activeLinks.length; i++) {
    if (regex.test(sanitize(activeLinks[i].href))) {
      activeLinks[i].classList.add('is-active')
    }
  }
}

export function evalScripts (newDom, existingDom) {
  const existing = Array.prototype.slice.call(existingDom.getElementsByTagName('script'))
  const scripts = newDom.getElementsByTagName('script')

  for (let i = 0; i < scripts.length; i++) {
    if (existing.filter(e => e.isEqualNode(scripts[i])).length > 0) {
      continue
    }

    const s = document.createElement('script')

    for (let a = 0; a < scripts[i].attributes.length; a++) {
      const attr = scripts[i].attributes[a]
      s.setAttribute(attr.name, attr.value)
    }

    if (!s.src) {
      s.innerHTML = scripts[i].innerHTML
    }

    document.body.appendChild(s)
  }
}

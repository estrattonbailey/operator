const getOrigin = (location) => {
  const { protocol, host } = location
  return `${protocol}//${host}`
}

const parseURL = (url) => {
  let a = document.createElement('a')
  a.href = url
  return a
}

export const origin = getOrigin(window.location)

const originRegEx = new RegExp(origin)

/**
 * @param {string} url Raw URL to parse
 * @return {string} URL sans origin and sans leading slash
 */
export const sanitize = (url) => {
  const route = url.replace(originRegEx, '')
  return route.match(/^\//) ? route.replace(/\/{1}/, '') : route // remove / and return
}

export const link = {
  isSameOrigin: (href) => origin === getOrigin(parseURL(href)),
  isHash: (href) => /#/.test(href),
  isSameURL: (href) => {
    return window.location.search === parseURL(href).search &&
      window.location.pathname === parseURL(href).pathname
  }
}

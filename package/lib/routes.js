/**
 * route utils lifted and adapted from
 * dush-router by @@tunnckoCore
 * @see https://github.com/tunnckoCore/dush-router
 */
export function collectParams (r, pathname) {
  let match = null

  pathname.replace(r.regex, function (...args) {
    for (let i = 1; i < args.length - 2; i++) {
      r.keys.forEach(function (key) {
        r.params[key] = args[i]
      })
      match = true
    }
  })

  return match ? r.params : match
}

export function createRoute (route, handler) {
  const keys = []

  const regex = new RegExp(route.replace(/\*/g, '(?:.*)').replace(/([:*])(\w+)/g, (key) => {
    keys.push(key.slice(1))
    return '([\\w-]+)'
  }) + '(?:[\/|?\w+]$|$)' + '$', 'ig')

  return {
    route,
    handler,
    regex,
    keys,
    params: {},
    match (pathname) {
      return regex.test(pathname) ? collectParams(this, pathname) : false
    }
  }
}

export function executeRoute (pathname, routes, done) {
  if (routes.length < 1) return done && done()

  let handlers = []

  /**
   * If we have configured routes,
   * check them and fire any handlers
   */
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]
    const params = route.match(pathname)
    /**
     * params will return be `null` if
     * there was a match, but not parametized
     * route params. If params is `false`,
     * it means a no-match, so skip the handler
     */
    if (params === false) {
      continue
    }

    handlers.push(
      route.handler(params || {}, pathname)
    )
  }

  Promise.all(handlers).then(responses => {
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i]
      if (typeof response === 'string') return done(response) // handle redirect
      if (response === false && window.location.pathname !== pathname) {
        return window.location = pathname
      }
    }

    done && done()
  })
}

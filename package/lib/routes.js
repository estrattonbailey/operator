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

export default function createRoute (route, handler) {
  const keys = []

  const regex = new RegExp(route.replace('*', '.+').replace(/:[^\s/]+/g, (key) => {
    keys.push(key.slice(1))
    return '([\\w-]+)'
  }), 'ig')

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

const cache = new Map()

function getParts (url) {
  const parts = url.split('/')
  return parts.slice(parts[0] !== '' ? 0 : 1)
}

function clean (href) {
  return href.replace(window.location.origin, '')
}

function getRoute (path, routes) {
  const urls = getParts(path)
  const params = {}
  outer: for (let route of routes) {
    if (urls.length === route.parts.length) {
      inner: for (let i = 0; i < route.parts.length; i++) {
        if (route.parts[i][0] === ':') {
          params[route.parts[i].slice(1)] = urls[i]
          continue inner
        } else if (route.parts[i] === urls[i]) {
          continue inner
        } else if (route.parts[i] === '*') {
          break
        }
        continue outer
      }
      route.params = params
      return route
    } else if (route.parts[0] == '*') {
      route.params = params
      return route
    }
  }
}

export default function app (defs, selector) {
  let root = document.querySelector(selector)

  let queue
  const routes = []
  const before = []
  const during = []
  const after = []

  while (defs.length) {
    const r = defs.shift()
    if (typeof r === 'function') {
      during.push(r)
      continue
    }
    routes.push({
      path: r.pop ? r[0] : r,
      parts: getParts(r.pop ? r[0] : r),
      handler: r.pop ? r[1] || null : null
    })
  }

  const initialRoute = getRoute(clean(window.location.href), routes)

  const state = {
    path: clean(window.location.href),
    title: document.title,
    params: initialRoute ? initialRoute.params : {}
  }

  function done (doc, body, route) {
    state.title = doc.title

    Promise.all(
      during.reduce((fns, fn) => {
        fns.push(fn(state))
        return fns
      }, [route.handler ? route.handler(state) : true])
    ).then(() => {
      requestAnimationFrame(() => {
        root.innerHTML = body
        for (let fn of after) fn(state)
      })
    })
  }

  function get (path, route, cb) {
    fetch(path, { credentials: 'include' })
      .then(res => res.text())
      .then(res => {
        const doc = new window.DOMParser().parseFromString(res, 'text/html')
        const c = [
          doc,
          doc.querySelector(selector).innerHTML
        ]
        cache.set(path, c)
        cb && cb(c[0], c[1], route)
      })
  }

  function go (path, route) {
    queue = () => {
      const cached = cache.get(path)

      cached ? (
        done(cached[0], cached[1], route)
      ) : (
        get(path, route, done)
      )
    }

    state.path = path
    state.params = route.params

    for (let fn of before) fn(path)

    queue()
  }

  document.body.addEventListener('click', e => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.defaultPrevented) return

    let a = e.target

    while (a && !(a.href && a.nodeName === 'A')) {
      a = a.parentNode
    }

    if (
      !a ||
      window.location.origin !== a.origin ||
      a.hasAttribute('download') ||
      a.target === '_blank' ||
      /mailto|tel/.test(a.href)
    ) return

    const path = clean(a.href)
    const route = getRoute(path, routes)
    if (!route) return
    e.preventDefault()
    window.location.pathname !== path && go(path, route)
    return false
  })

  window.addEventListener('popstate', e => {
    const path = clean(e.target.location.href)
    const route = getRoute(path, routes)
    if (!route) return
    e.preventDefault()
    go(path, route)
    return false
  })

  return {
    get state () {
      return state
    },
    push (href) {
      queue = null
      const path = clean(href)
      const route = getRoute(path, routes)
      if (!route) return
      go(path, route)
    },
    prefetch (href, cb) {
      const path = clean(href)
      const route = getRoute(path, routes)
      if (!route) return
      return get(path, route, cb)
    },
    before (fn) {
      before.push(fn)
      return () => before.slice(before.indexOf(fn), 1)
    },
    after (fn) {
      after.push(fn)
      return () => after.slice(after.indexOf(fn), 1)
    }
  }
}

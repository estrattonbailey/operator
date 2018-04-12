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
  outer: for (let r = 0; r < routes.length; r++) {
    let route = routes[r]
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
  const during = []
  const events = {}

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

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

  function emit(ev) {
    return events[ev] ? events[ev].map(fn => fn(state)) : []
  }

  function done (doc, body, route, pop) {
    state.title = doc.title

    Promise.all(
      during.reduce((fns, fn) => {
        fns.unshift(fn(state))
        return fns
      }, [route.handler ? route.handler(state) : true])
    ).then(([ cb ]) => {
      window.scrollTo(0, 0)
      requestAnimationFrame(() => {
        root.innerHTML = body
        cb && cb()
        if (!pop) emit('after')
      })
    })
  }

  function get (path, route, cb, pop) {
    if (!route) return window.location.href = path

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

  function go (path, route, pop) {
    queue = () => {
      const cached = cache.get(path)

      cached ? (
        done(cached[0], cached[1], route, pop)
      ) : (
        get(path, route, done, pop)
      )
    }

    state.path = path
    state.params = route ? route.params : {}

    Promise.all(emit('before')).then(queue)
  }

  function match (href) {
    const path = clean(href)
    const route = getRoute(path, routes)
    return [ path, route ]
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

    e.preventDefault()

    const m = match(a.href)
    window.location.pathname !== m[0] && go(...m, false)

    return false
  })

  window.addEventListener('popstate', e => {
    go(...match(e.target.location.href), true)
    return false
  })

  return {
    get state () {
      return state
    },
    go (href) {
      queue = null
      go(...match(href), false)
    },
    load (href, cb) {
      return get(...match(href), cb, false)
    },
    on (ev, fn) {
      events[ev] = events[ev] ? events[ev].concat(fn) : [ fn ]
      return () => events[ev].slice(events[ev].indexOf(fn), 1)
    }
  }
}

import * as m from 'matchit'

const cache = new Map()

function clean (href) {
  return href.replace(window.location.origin, '')
}

function parse (location, routes) {
  let hash = ''
  let search = ''
  let [ pathname, ...parts ] = location.split(/#|\?/)

  pathname = pathname.replace(/\/$/g, '')
  pathname = pathname || '/'

  for (let i = 0; i < parts.length; i++) {
    const [ rest ] = location.split(parts[i])
    if (rest[rest.length - 1] === '?') search = parts[i]
    if (rest[rest.length - 1] === '#') hash = parts[i]
  }

  const match = m.match(pathname, routes.map(r => r.matcher))
  const route = routes.filter(r => r.path === match[0].old)[0]

  return match[0] ? Object.assign({}, route, {
    params: m.exec(pathname, match),
    hash,
    search,
    pathname,
    location
  }) : null
}

export default function app (selector, routes = ['*']) {
  let root = document.querySelector(selector)

  let queue
  const middleware = []
  const events = {}

  routes = routes.reduce((next, r) => {
    if (typeof r === 'function') {
      middleware.push(r)
      return next
    }
    return next.concat(r)
  }, []).map(r => {
    return r.path ? Object.assign({}, r, {
      matcher: m.parse(r.path)
    }) : {
      path: r,
      matcher: m.parse(r)
    }
  })

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

  const initialRoute = parse(clean(window.location.href), routes)

  let state = Object.assign({
    title: document.title
  }, initialRoute)

  function emit(ev) {
    return events[ev] ? events[ev].map(fn => fn(state)) : []
  }

  function done (doc, body, route, pop) {
    state.title = doc.title

    Promise.all(
      middleware.concat(route.handler || []).map(fn => fn(state))
    ).then(() => {
      window.scrollTo(0, 0)
      requestAnimationFrame(() => {
        root.innerHTML = body
        emit('after')
      })
    })
  }

  function get (path, route, cb) {
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

      cached && route.cache !== false ? (
        done(cached[0], cached[1], route, pop)
      ) : (
        get(path, route, done)
      )
    }

    state = Object.assign(state, route)

    // allows for redirects
    Promise.all(emit('before')).then(queue)
  }

  function match (href) {
    const path = clean(href)
    const route = parse(path, routes)
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

    const [ path, route ] = match(a.pathname)

    if (route.ignore) return e

    e.preventDefault()

    state.location !== path && go(path, route, false)

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
      return get(...match(href), cb)
    },
    on (ev, fn) {
      events[ev] = events[ev] ? events[ev].concat(fn) : [ fn ]
      return () => events[ev].slice(events[ev].indexOf(fn), 1)
    }
  }
}

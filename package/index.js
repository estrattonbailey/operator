import mitt from 'mitt'
import fetch from 'unfetch'
import cache from './lib/cache.js'
import {
  location,
  isSameURL,
  setActiveLinks,
  getValidPath
} from './lib/util.js'
import createRoute from './lib/routes.js'

export default function operator ({
  root = 'root',
  transition = {
    speed: 400
  },
  routes = {}
}) {
  if (!window.history.pushState) {
    return console.error('operator: the history API is unavailable, aborting.')
  }

  const ev = mitt()

  routes = Object.keys(routes).map(k => createRoute(k, routes[k]))

  setActiveLinks(location.pathname)

  function render (markup, pathname) {
    const _root = document.getElementById(root)
    const dom = new window.DOMParser().parseFromString(markup, 'text/html')
    const title = dom.title

    ev.emit('beforeRender')

    document.documentElement.classList.add('operator-is-transitioning')
    _root.style.height = _root.clientHeight + 'px'

    setTimeout(() => {
      _root.innerHTML = dom.getElementById(root).innerHTML

      instance.push(pathname, title)

      setTimeout(() => {
        _root.style.height = ''
        document.documentElement.classList.remove('operator-is-transitioning')
        setActiveLinks(pathname)
        ev.emit('afterRender')
      }, 0)
    }, transition.speed)
  }

  function handleClick (e) {
    let target = e.target

    while (target && !target.href) {
      target = target.parentNode
    }

    const path = getValidPath(e, target)

    if (path) {
      e.preventDefault()

      if (isSameURL(target.href)) return

      instance.go(path)

      return false
    }
  }

  const instance = {
    ...ev,
    go (pathname) {
      const done = () => this.prefetch(pathname).then(markup => render(markup, pathname))

      if (routes.length < 1) return done()

      for (let i = 0; i < routes.length; i++) {
        const r = routes[i]
        const params = r.match(pathname)

        if (params === false) {
          done()
          continue
        }

        Promise.resolve(r.handler(params || {})).then(valid => {
          valid ? done() : window.location.pathname = pathname
        })
      }
    },
    push (route, title = document.title) {
      window.history.pushState({}, title, route)
      document.title = title
    },
    prefetch (route) {
      const cached = cache.get(route)
      return cached ? Promise.resolve(cached) : fetch(route, { credentials: 'include' }).then(res => res.text()).then(markup => {
        cache.set(route, markup)
        return markup
      })
    },
    destroy () {
      document.body.removeEventListener('click', handleClick)
    }
  }

  document.body.addEventListener('click', handleClick)

  return instance
}

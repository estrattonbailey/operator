import mitt from 'mitt'
import fetch from 'unfetch'
import cache from './lib/cache.js'
import {
  location,
  isSameURL,
  setActiveLinks,
  getValidPath,
  evalScripts
} from './lib/util.js'
import createRoute from './lib/routes.js'

export default function operator ({
  root = 'root',
  transition = {
    speed: 400
  },
  routes = {},
  evaluateScripts = false
}) {
  if (!window.history.pushState) {
    return console.error('operator: the history API is unavailable, aborting.')
  }

  let ajaxDisabled = false

  const ev = mitt()

  routes = Object.keys(routes).map(k => createRoute(k, routes[k]))

  setActiveLinks(location.pathname)

  function render (markup, pathname) {
    const mountNode = document.getElementById(root)
    const oldDom = document
    const newDom = new window.DOMParser().parseFromString(markup, 'text/html')
    const title = newDom.title

    ev.emit('beforeRender', pathname)

    document.documentElement.classList.add('operator-is-transitioning')
    mountNode.style.height = mountNode.clientHeight + 'px'

    setTimeout(() => {
      mountNode.innerHTML = newDom.getElementById(root).innerHTML

      instance.push(pathname, title)

      setTimeout(() => {
        mountNode.style.height = ''
        document.documentElement.classList.remove('operator-is-transitioning')
        setActiveLinks(pathname)
        ev.emit('afterRender', pathname)
        evaluateScripts && evalScripts(newDom, oldDom)
      }, 0)
    }, transition.speed)
  }

  function handleClick (e) {
    if (ajaxDisabled) return

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

      /**
       * If we have configured routes,
       * check them and fire any handlers
       */
      for (let i = 0; i < routes.length; i++) {
        const r = routes[i]
        const params = r.match(pathname)

        /**
         * params will return be `null` if
         * there was a match, but not parametized
         * route params
         */
        if (params === false) {
          done()
          continue
        }

        Promise.resolve(r.handler(params || {}, pathname)).then(valid => {
          valid !== false ? done() : window.location.pathname = pathname
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
    addRoute (route, handler) {
      routes.push(createRoute(route, handler))
    },
    disable () {
      ajaxDisabled = true
    },
    enable () {
      ajaxDisabled = false
    },
    isEnabled () {
      return ajaxDisabled
    },
    destroy () {
      document.body.removeEventListener('click', handleClick)
    }
  }

  document.body.addEventListener('click', handleClick)

  return instance
}

import mitt from 'mitt'
import fetch from 'unfetch'
import scroller from 'scroll-restoration'
import cache from './lib/cache.js'
import {
  location,
  isSameURL,
  setActiveLinks,
  getValidPath,
  evalScripts
} from './lib/util.js'
import {
  createRoute,
  executeRoute
} from './lib/routes.js'

export default function operator ({
  root = 'root',
  transitionSpeed = 0,
  routes = {},
  evaluateScripts = false
}) {
  if (!window.history.pushState) {
    return console.error('operator: the history API is unavailable, aborting.')
  }

  /**
   * Take control of scroll position
   */
  scroller.init()

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
        scroller.restore()
      }, 0)
    }, transitionSpeed)
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

      /** Only save on clicks, not on popstate */
      scroller.save()

      instance.go(path)

      return false
    }
  }

  /**
   * Notes on popstate:
   *  - catches hashchange
   *  - must validate url before AJAX
   */
  function onPopstate (e) {
    if (ajaxDisabled) return

    e.preventDefault()

    /**
     * If it's a back button, the
     * target should be a window object
     */
    const path = e.target.window ? (
      e.target.window.location.href
    ) : (
      getValidPath(e, e.target)
    )

    if (path) {
      instance.go(e.target.location.href)

      return false
    }
  }

  const instance = {
    ...ev,
    go (pathname) {
      const done = () => this.prefetch(pathname).then(markup => render(markup, pathname))
      executeRoute(pathname, routes, done)
    },
    push (route, title = document.title) {
      window.history.pushState(window.history.state || {}, title, route)
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
      window.removeEventListener('popstate', onPopstate)
    }
  }

  document.body.addEventListener('click', handleClick)
  window.addEventListener('popstate', onPopstate)

  /**
   * Runs any applicable routes on page load,
   * restore scroll (if saved at history.state.scrollPosition)
   * *after* routes are fired
   */
  executeRoute(window.location.pathname, routes, () => {
    scroller.restore()
  })

  return instance
}

import mitt from 'mitt'
import fetch from 'unfetch'
import scroller from 'scroll-restoration'
import cache from './lib/cache.js'
import {
  location,
  isSameURL,
  setActiveLinks,
  getValidPath,
  getAnchor,
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

  /**
   * Changed via enable()/disable() methods
   */
  let ajaxDisabled = false

  /**
   * Emitter instance
   */
  const ev = mitt()

  /**
   * Map over routes to create pattern
   * matching handlers
   */
  routes = Object.keys(routes).map(k => createRoute(k, routes[k]))

  /**
   * Update active links to match initial
   * page load
   */
  setActiveLinks(location.href)

  /**
   * @param {string} markup The new markup from a successful request
   * @param {string} href The new URL
   * @param {boolean} isPopstate True if render is called via popstate, false otherwise
   */
  function render (markup, href, isPopstate) {
    const mountNode = document.getElementById(root)
    const oldDom = document
    const newDom = new window.DOMParser().parseFromString(markup, 'text/html')
    const title = newDom.title

    ev.emit('beforeRender', href)

    document.documentElement.classList.add('operator-is-transitioning')
    mountNode.style.height = mountNode.clientHeight + 'px'

    /**
     * After transition out, render new page
     * and (optionally) push a new history location
     */
    setTimeout(() => {
      mountNode.innerHTML = newDom.getElementById(root).innerHTML

      /**
       * If a popstate event occurred, we don't
       * need to manually create a new history
       * location: it's already there from
       * a previous navigation
       */
      !isPopstate && instance.push(href, title)

      /**
       * Finish up
       */
      setTimeout(() => {
        mountNode.style.height = ''
        document.documentElement.classList.remove('operator-is-transitioning')
        setActiveLinks(href)
        ev.emit('afterRender', href)
        evaluateScripts && evalScripts(newDom, oldDom)
        scroller.restore()
      }, 0)
    }, transitionSpeed)
  }

  function handleClick (e) {
    if (ajaxDisabled) return

    let target = e.target

    /**
     * Find link that was clicked
     */
    while (target && !(target.href && target.nodeName === 'A')) {
      target = target.parentNode
    }

    /**
     * Validate URL
     */
    const href = getValidPath(e, target)

    if (href) {
      e.preventDefault()

      if (isSameURL(target.href)) return

      /**
       * Only save on clicks, not on popstate
       */
      scroller.save()

      instance.go(href)

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
     * target should be a window object.
     * Otherwise this could be a hash
     * link or otherwise.
     */
    const path = e.target.window ? (
      e.target.window.location.href
    ) : (
      getValidPath(e, e.target)
    )

    if (path) {
      instance.go(e.target.location.href, true) // set isPopstate to true

      return false
    }
  }

  const instance = {
    ...ev,
    go (href, isPopstate) {
      href = getAnchor(href).href // ensure it's a full address
      const done = () => this.prefetch(href).then(markup => render(markup, href, isPopstate))
      executeRoute(href, routes, done)
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

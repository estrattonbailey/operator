import nanoajax from 'nanoajax'
import Navigo from 'navigo'
import scroll from 'scroll-restoration'
import loop from 'loop.js'
import { origin, sanitize } from './url'
import setActiveLinks from './links'
import render from './render'
import state from './state'
import cache from './cache'

const router = new Navigo(origin)

export default class Operator {
  constructor (config) {
    const events = loop()

    this.config = config

    // create curried render function
    this.render = render(document.querySelector(config.root), config, events.emit)

    Object.assign(this, events)
  }

  stop () {
    state.paused = true
  }

  start () {
    state.paused = false
  }

  getState () {
    return state._state
  }

  setState ({ route, title }) {
    state.route = route === '' ? '/' : route
    title ? state.title = title : null

    setActiveLinks(state.route)

    document.title = title
  }

  /**
   * @param {string} href
   * @param {function} cb
   * @param {boolean} resolve Use Navigo.resolve(), bypass Navigo.navigate()
   *
   * Popstate changes the URL for us, so if we were to
   * router.navigate() to the previous location, it would push
   * a duplicate route to history and we would create a loop.
   *
   * router.resolve() let's Navigo know we've moved, without
   * altering history.
   */
  go (href, cb = null, resolve) {
    if (state.paused) {
      return
    }

    const callback = (title) => {
      const res = {
        title,
        route
      }

      resolve ? (
        router.resolve(route)
      ) : (
        router.navigate(route)
      )

      this.setState(res)

      this.emit('route:after', res)

      if (cb) {
        cb(res)
      }
    }

    const route = sanitize(href)

    if (resolve) {
      scroll.save()
    }

    const cached = cache.get(route)

    if (cached) {
      return this.render(route, cached, callback)
    }

    this.emit('route:before', { route })

    this.get(route, callback)
  }

  get (route, cb) {
    return nanoajax.ajax({
      method: 'GET',
      url: `${origin}/${route}`
    }, (status, res, req) => {
      if (req.status < 200 || req.status > 300 && req.status !== 304) {
        window.location = `${origin}/${state.prev.route}`
        return
      }

      cache.set(route, req.response)

      this.render(route, req.response, cb)
    })
  }

  push (route = null, title = state.title) {
    if (!route) { return }

    this.router.navigate(route)
    this.setState({ route, title })
  }

  validate (event = null, href = state.route) {
    const route = sanitize(href)

    return this.config.handlers.filter((t) => {
      if (Array.isArray(t)) {
        const res = t[1](route)
        if (res) {
          this.emit(t[0], {
            route,
            event
          })
        }
        return res
      } else {
        return t(route)
      }
    }).length > 0
  }
}

import nanoajax from 'nanoajax'
import Navigo from 'navigo'
import scroll from 'scroll-restoration'
import loop from 'loop.js'
import { origin, sanitize } from './url'
import setActiveLinks from './links'
import render from './render'
import state from './state'

const router = new Navigo(origin)

/**
 * TODO
 * Document.title
 */
export default class Operator {
  constructor(config) {
    const events = loop()

    this.config = config

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
    state.route = route
    title ? state.title = title : null

    setActiveLinks(route)
  }

  /**
   * @param {string} route
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
  go (path, cb = null, resolve) {
    if (state.paused) {
      return
    }

    const route = sanitize(path)

    if (resolve) {
      scroll.save()
    }

    this.emit('before:route', { route })

    this.get(`${origin}/${route}`, (title) => {
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

      this.emit('after:route', res)

      if (cb) {
        cb(res)
      }
    })
  }

  get (route, cb) {
    return nanoajax.ajax({
      method: 'GET',
      url: route
    }, (status, res, req) => {
      if (req.status < 200 || req.status > 300 && req.status !== 304) {
        window.location = `${origin}/${state.prev.route}`
        return
      }

      this.render(req.response, cb)
    })
  }

  push (route = null, title = null) {
    if (!route) { return }

    this.router.navigate(route)
    this.setState({ route, title })
  }

  matches (event, route) {
    return this.config.ignore.filter((t) => {
      if (Array.isArray(t)) {
        let res = t[1](route)
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

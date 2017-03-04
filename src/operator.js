import nanoajax from 'nanoajax'
import Navigo from 'navigo'
import scroll from 'scroll-restoration'

import render from './render'
import setActiveLinks from './links'
import events from './emitter'
import { origin, sanitize } from './url'

const state = {
  _state: {
    route: '',
    title: '',
    prev: {
      route: '/',
      title: ''
    }
  },
  get route () {
    return this._state.route
  },
  set route (loc) {
    this._state.prev.route = this.route
    this._state.route = loc
  },
  get title () {
    return this._state.title
  },
  set title (val) {
    this._state.prev.title = this.title
    this._state.title = val
  }
}

/**
 * TODO
 * Document.title
 */
export default class Operator {
  constructor({ root, duration, ignore }) {
    this.state = state
    this.router = new Navigo(origin)
    this.mount = render(root, duration)
    this.ignore = ignore
  }

  stop () {
    this.state.paused = true
  }

  start () {
    this.state.paused = false
  }

  getState () {
    return this.state._state
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
    const route = sanitize(path)

    if (resolve) {
      scroll.save()
    }

    events.emit('before:route', { route })

    if (this.state.paused) { return }

    this.get(`${origin}/${route}`, (title) => {
      resolve ? this.router.resolve(route) : this.router.navigate(route)

      // Update state
      this.pushRoute(route, title)

      events.emit('after:route', {
        route,
        title
      })

      cb ? cb(route, title) : null
    })
  }

  push (loc = null, title = null) {
    if (!loc) { return }

    this.router.navigate(loc)

    this.pushRoute(loc, title)
  }

  get (route, cb) {
    return nanoajax.ajax({
      method: 'GET',
      url: route
    }, (status, res, req) => {
      if (req.status < 200 || req.status > 300 && req.status !== 304) {
        window.location = `${origin}/${this.state._state.prev.route}`
        return
      }
      this.mount(req.response, cb)
    })
  }

  pushRoute (loc, title = null) {
    this.state.route = loc
    title ? this.state.title = title : null

    setActiveLinks(this.state.route)
  }

  matches (event, route) {
    return this.ignore.filter((t) => {
      if (Array.isArray(t)) {
        let res = t[1](route)
        if (res) {
          events.emit(t[0], {
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

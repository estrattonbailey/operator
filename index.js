import loop from 'loop.js'
import delegate from 'delegate'
import nanoajax from 'nanoajax'
import navigo from 'navigo'
import dom from './lib/dom.js'
import { 
  origin, 
  sanitize,
  saveScrollPosition,
  scrollToLocation,
  link,
  setActiveLinks
} from './lib/util.js'

const router = new navigo(origin)

const state = {
  _state: {
    route: '',
    title: '',
    prev: {
      route: '/',
      title: '',
    }
  },
  get route(){
    return this._state.route
  },
  set route(loc){
    this._state.prev.route = this.route
    this._state.route = loc
    setActiveLinks(loc)
  },
  get title(){
    return this._state.title
  },
  set title(val){
    this._state.prev.title = this.title
    this._state.title = val
    document.title = val
  }
}

export default (options = {}) => {
  const root = options.root || document.body
  const duration = options.duration || 0
  const ignore = options.ignore || []

  const events = loop()
  const render = dom(root, duration, events)

  const instance = Object.create({
    ...events,
    stop(){ state.paused = true },
    start(){ state.paused = false },
    go,
    push
  }, {
    getState: {
      value: () => state._state
    }
  })

  state.route = window.location.pathname
  state.title = document.title 

  delegate(document, 'a', 'click', (e) => {
    let a = e.delegateTarget
    let href = a.getAttribute('href') || '/'
    let route = sanitize(href)

    if (
      !link.isSameOrigin(href)
      || a.getAttribute('rel') === 'external'
      || a.classList.contains('no-ajax')
      || matches(e, route)
      || link.isHash(href)
    ){ return }

    e.preventDefault()

    if (
      link.isSameURL(href)
    ){ return }

    go(`${origin}/${route}`)
  })

  window.onpopstate = e => {
    let to = e.target.location.href

    if (matches(e, to)){ 
      if (link.isHash(to)){ return }
      window.location.reload()
      return 
    }

    /**
     * Popstate bypasses router, so we 
     * need to tell it where we went to
     * without pushing state
     */
    go(to, null, true)
  }

  if ('scrollRestoration' in history){
    history.scrollRestoration = 'manual'

    if (history.state && history.state.scrollTop !== undefined){
      window.scrollTo(0, history.state.scrollTop)
    }

    window.onbeforeunload = saveScrollPosition 
  }

  /**
   * @param {string} route
   * @param {function} cb 
   * @param {boolean} resolve Use navigo.resolve(), bypass navigo.navigate()
   *
   * Popstate changes the URL for us, so if we were to 
   * router.navigate() to the previous location, it would push
   * a duplicate route to history and we would create a loop.
   *
   * router.resolve() let's Navigo know we've moved, without
   * altering history.
   */
  function go(route, cb = null, resolve){
    let to = sanitize(route)

    resolve ? null : saveScrollPosition()

    events.emit('before:route', {route: to})

    if (state.paused){ return }

    let req = get(`${origin}/${to}`, title => {
      resolve ? router.resolve(to) : router.navigate(to)
      
      // Update state
      pushRoute(to, title)

      events.emit('after:route', {route: to, title})

      cb ? cb(to, title) : null
    })
  }

  function push(loc = state.route, title = null){
    router.navigate(loc)
    state.route = loc
    title ? state.title = title : null
  }

  function get(route, cb){
    return nanoajax.ajax({ 
      method: 'GET', 
      url: route 
    }, (status, res, req) => {
      if (req.status < 200 || req.status > 300 && req.status !== 304){
        return window.location = `${origin}/${state._state.prev.route}`
      }
      render(req.response, cb) 
    })
  }

  function pushRoute(loc, title = null){
    state.route = loc
    title ? state.title = title : null
  }

  function matches(event, route){
    return ignore.filter(t => {
      if (Array.isArray(t)){
        let res = t[1](route)
        if (res){ events.emit(t[0], {route, event}) }
        return res
      } else {
        return t(route) 
      }
    }).length > 0 ? true : false
  }

  return instance
}

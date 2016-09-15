import knot from 'knot.js'
import delegate from 'delegate'
import nanoajax from 'nanoajax'
import navigo from 'navigo'
import dom from './lib/dom.js'
import { 
  origin, 
  sanitize,
  saveScrollPosition, 
  link,
  setActiveLinks
} from './lib/util.js'

const router = new navigo(origin)

const state = {
  _state: {
    path: window.location.pathname,
    title: document.title,
    prev: {
      path: '/',
      title: '',
    }
  },
  get path(){
    return this._state.path
  },
  set path(loc){
    this._state.prev.path = this.path
    this._state.path = loc
    setActiveLinks(loc)
  },
  get title(){
    this._state.prev.title = this.title
    return this._state.title
  },
  set title(val){
    document.title = val
  }
}

const matches = (path, tests) => (
  tests.filter(t => t(path)).length > 0 ? true : false 
)

export default (options = {}) => {
  const root = options.root || document.body
  const duration = options.duration || 0
  const ignore = options.ignore || []

  const events = knot()
  const render = dom(root, duration, events)

  const instance = Object.create({
    ...events,
    go
  }, {
    getState: {
      value: () => state._state
    }
  })

  delegate(document, 'a', 'click', (e) => {
    let a = e.delegateTarget
    let href = a.getAttribute('href') || '/'
    let path = sanitize(href)

    if (
      !link.isSameOrigin(href)
      || a.getAttribute('rel') === 'external'
      || matches(path, ignore)
    ){ return }

    e.preventDefault()

    if (link.isHash(href)){ 
      events.emit('hash', href)
      state.path = `${state.path}/${href}` 
      return
    }

    if (
      link.isSameURL(href)
    ){ return }

    saveScrollPosition()

    go(`${origin}/${path}`, (to, title) => {
      router.navigate(to)

      // Update state
      pushRoute(to, title)
    })
  })

  window.onpopstate = e => {
    let to = e.target.location.href

    if (matches(to, ignore)){ 
      window.location.reload()
      return 
    }

    go(to, (loc, title) => {
      /**
       * Popstate bypasses router, so we 
       * need to tell it where we went to
       * without pushing state
       */
      router.resolve(loc)

      // Update state
      pushRoute(loc, title)
    })
  }

  if ('scrollRestoration' in history){
    history.scrollRestoration = 'manual'

    if (history.state && history.state.scrollTop !== undefined){
      window.scrollTo(0, history.state.scrollTop)
    }

    window.onbeforeunload = saveScrollPosition 
  }

  function get(path, cb){
    return nanoajax.ajax({ 
      method: 'GET', 
      url: path 
    }, (status, res, req) => {
      if (req.status < 200 || req.status > 300 && req.status !== 304){
        return window.location = `${origin}/${state._state.prev.path}`
      }
      render(req.response, cb) 
    })
  }

  function go(path, cb = () => {}){
    let to = sanitize(path)

    events.emit('before:route', {path: to})

    let req = get(`${origin}/${to}`, (title, root) => {
      events.emit('after:route', {path: to, title, root})

      cb(to, title, root)
    })
  }

  function pushRoute(loc, title){
    events.emit('after:route', {path: loc, title})
    state.path = loc
    state.title = title
  }

  return instance
}

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
    path: '/',
    title: '',
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
    router.navigate(loc)
    router.resolve(loc)
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

    go(`${origin}/${path}`)
  })

  window.onpopstate = e => {
    go(e.target.location.href)
  }

  state.path = window.location.pathname
  state.title = document.title

  return instance

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

    saveScrollPosition()

    events.emit('before:route', {path: to})

    state.path = to

    let req = get(`${origin}/${to}`, (title, root) => {
      events.emit('after:route', {path: to, title, root})

      state.title = title

      cb(to, title, root)
    })
  }
}

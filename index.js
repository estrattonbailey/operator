import knot from 'knot.js'
import delegate from 'delegate'
import nanoajax from 'nanoajax'
import navigo from 'navigo'
import dom from './lib/dom'
import { 
  origin, 
  sanitize,
  saveScrollPosition, 
  link
} from './lib/util'

const state = {
  path: window.location.pathname,
  title: document.title 
}

const router = new navigo(origin)

const valid = e => tests.filter(t => true).length > 0 ? false : true

export default (options = {}) => {
  const root = options.root || document.body
  const duration = options.duration || 0

  const events = knot()
  const render = dom(root, duration, events)

  const instance = Object.create({
    ...events,
    go
  }, {
    getState: {
      value: () => state
    }
  })

  delegate(document, 'a', 'click', (e) => {
    let a = e.delegateTarget
    let href = a.getAttribute('href') || '/'

    if (
      !link.isSameOrigin(href)
      || link.isHash(href)
      || link.isSameURL(href)
      || a.getAttribute('rel') === 'external'
    ){ return }

    e.preventDefault()

    go(`${origin}/${sanitize(href)}`)
  })

  window.onpopstate = e => {
    go(e.target.location.href)
  }

  return instance

  function get(path, cb){
    return nanoajax.ajax({ 
      method: 'GET', 
      url: path 
    }, (status, res, req) => {
      if (req.status < 200 || req.status > 300 && req.status !== 304){
        return window.location.reload()
      }
      render(req.response, cb) 
    })
  }

  function go(path, cb = () => {}){
    let to = sanitize(path)

    saveScrollPosition()

    let req = get(`${origin}/${to}`, (title, root) => {
      router.navigate(to)
      router.resolve(to)
      document.title = title
      state.title = title
      state.path = to
      cb(to, root)
    })
  }
}

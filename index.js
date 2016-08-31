import knot from 'knot.js'
import delegate from 'delegate'
import router from './lib/router'
import { 
  origin, 
  validate,
  merge, 
  saveScrollPosition
} from './lib/util'

export default (options = {}) => {
  const config = merge({
    root: 'root',
    duration: 0
  }, options)

  const state = {
    path: '',
    title: ''
  }

  const instance = Object.create({
    router: router(config),
    events: knot()
  }, {
    getState: {
      value: () => state
    }
  })

  delegate(document.body, 'a', 'click', (e) => {
    let path = validate(e)

    if (!path) return

    instance.router.go(`${origin}/${path}`)
  })

  /**
   * Get previous page, don't push
   * history.state
   */
  window.onpopstate = (e) => {
    let path = e.target.location.href

    instance.router.go(path)
  }

  return instance
}

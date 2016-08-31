import nanoajax from 'nanoajax'
import Navigo from 'navigo'
import series from 'run-series'

import { 
  origin, 
  scrubPath,
  saveScrollPosition, 
  restoreScrollPos, 
  parseResponse, 
  returnSize, 
  evalScripts 
} from './util'

/**
 * Helper to smoothly swap old 
 * markup with new markup
 * 
 * @param {object} markup New node to append to DOM
 */
export const render = (root, duration) => (markup, cb) => {
  const dom = parseResponse(markup)
  const title = dom.head.getElementsByTagName('title')[0].innerHTML
  const main = document.getElementById(root)

  // Transition class
  document.documentElement.classList.add('is-transitioning') 

  // Fix height
  main.style.height = returnSize(main, 'Height')+'px'

  series([
    setTimeout(() => {
      console.log('One')
    }, 2000),
    setTimeout(() => {
      console.log('Two')
    }, 2000)
  ])

  setTimeout(() => {
    main.innerHTML = dom.getElementById(root).innerHTML

    setTimeout(() => {
      /**
       * Run callback: updating routes, etc
       */
      cb(title, main)

      /**
       * Fire any script tags that are
       * now in the new DOM
       */
      evalScripts(main)

      restoreScrollPos()
    }, 0)

    setTimeout(() => { 
      document.documentElement.classList.remove('is-transitioning') 

      main.style.height = ''

      setTimeout(() => {
        // events.publish('pageTransitionEnd')
      }, duration)

    }, duration)

  }, duration)
}

/**
 * Main AJAX request handler
 *
 * @param {string} path URL to fetch
 * @param {object} data Data to pass to ajax
 * @param {funciton} cb Callback function
 */
function get(path, cb){
  return nanoajax.ajax({
    method: 'GET',
    url: path
  }, (status, response, request) => {
    let success = status >= 200 && status <= 300 ? true : false
    success ? this.render(response, cb) : console.log('AJAX error:', response)
  })
}

function go(path, cb = () => {}){
  let to = scrubPath(path)

  saveScrollPosition()

  this.get(`${origin}/${to}`, (title, res) => {
    try {
      this._router.navigate(to)
      this._router.resolve(to)
      document.title = title

      cb(res, to)
    } catch(e){
      console.log('Router failure:',e)
    }
  })
}

export default (config) => {
  return {
    _router: new Navigo(origin),
    render: render(config.root, config.duration),
    get,
    go
  }
}

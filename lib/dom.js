import { restoreScrollPos } from './util'

/**
 * Init new native parser
 */
const parser = new DOMParser()

/**
 * Get the target of the ajax req
 * @param {string} html Stringified HTML
 * @return {object} DOM node, #page
 */
const parseResponse = html => parser.parseFromString(html, "text/html")

/**
 * TODO
 * 1. Fire script links too, not just bodies
 *
 * Finds all <script> tags in the new
 * markup and evaluates their contents
 *
 * @param {object} context DOM node containing new markup via AJAX
 */
const evalScripts = (context) => {
  let tags = context.getElementsByTagName('script')

  for (let i = 0; i < tags.length; i++){
    try {
      eval(tags[i].innerHTML)
    } catch(e){
      console.log('Script eval() error:',e)
    }
  }
}

/**
 * Get width/height of element or window
 *
 * @param {object} el Element or window
 * @param {string} type 'Height' or 'Width
 */
const returnSize = (el, type) => {
  const isWindow = el !== null && el.window ? true : false

  if (isWindow){
    return Math.max(el[`outer${type}`], document.documentElement[`client${type}`])
  }

  return Math.max(el[`offset${type}`], el[`client${type}`])
}

/**
 * Helper to smoothly swap old 
 * markup with new markup
 * 
 * @param {object} markup New node to append to DOM
 */
export default (root, duration, events) => (markup, cb) => {
  const dom = parseResponse(markup)
  const title = dom.head.getElementsByTagName('title')[0].innerHTML
  const main = document.getElementById(root)

  document.documentElement.classList.add('is-transitioning') 

  events.emit('pageTransitionStart')

  // Fix height
  main.style.height = returnSize(main, 'Height')+'px'

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
        events.emit('pageTransitionEnd', title)
      }, duration)
    }, duration)
  }, duration)
}

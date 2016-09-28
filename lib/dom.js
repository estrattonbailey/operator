import { tarry, queue } from 'tarry.js'
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
 * Finds all <script> tags in the new
 * markup and evaluates their contents
 *
 * @param {object} root DOM node containing new markup via AJAX
 * @param {...object} sources Other DOM nodes to scrape script tags from 
 */
const evalScripts = (source, root = null) => {
  let errors = []
  const scripts = Array.prototype.slice.call(source.getElementsByTagName('script'))
  const existing = root ? Array.prototype.slice.call(root.getElementsByTagName('script')) : []

  const dupe = s => existing.filter(e => s.innerHTML === e.innerHTML && s.src === e.src).length > 0 ? true : false 

  scripts.length > 0 && scripts.forEach(t => {
    let s = t.cloneNode(true)

    if (dupe(s)) return

    s.setAttribute('data-ajaxed', 'true')

    try {
      eval(s.innerHTML)
    } catch(e){
      errors.push(e)
    }

    try {
      root ? root.insertBefore(s, root.children[0]) : source.replaceChild(s, t)
    } catch(e){
      errors.push(e)
      document.head.insertBefore(s, document.head.children[0])
    }
  }) 

  if (errors.length > 0){
    console.groupCollapsed('operator.js')
    errors.forEach(e => console.log(e))
    console.groupEnd()
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
  const main = document.querySelector(root)

  const start = tarry(
    () => {
      events.emit('before:transition')
      document.documentElement.classList.add('is-transitioning') 
      main.style.height = returnSize(main, 'Height')+'px'
    }
  , duration)

  const render = tarry(
    () => {
      main.innerHTML = dom.querySelector(root).innerHTML
      cb(title, main)
      evalScripts(main)
      evalScripts(dom.head, document.head)
      restoreScrollPos()
    }
  , duration)

  const removeTransitionStyles = tarry(
    () => {
      document.documentElement.classList.remove('is-transitioning') 
      main.style.height = ''
    }
  , duration)

  const signalEnd = tarry(
    () => events.emit('after:transition')
  , duration)

  queue(start, render, removeTransitionStyles, signalEnd)()
}

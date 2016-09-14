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
const evalScripts = (root, ...sources) => {
  const tags = sources.reduce((prev, curr) => {
    prev.push(...Array.prototype.slice.call(curr.getElementsByTagName('script')))
    return prev
  }, [])

  tags.push(...Array.prototype.slice.call(root.getElementsByTagName('script')))

  tags.forEach(t => {
    let s = document.createElement('script')

    ;[].forEach.call(t.attributes, a => {
      s.setAttribute(a.name, a.value)
    })

    s.innerHTML = t.innerHTML

    try{
      root.replaceChild(s, t)
    } catch(e){
      root.insertBefore(s, root.children[0])
    }
  })
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

  const start = tarry(
    () => {
      events.emit('before:transition')
      document.documentElement.classList.add('is-transitioning') 
      main.style.height = returnSize(main, 'Height')+'px'
    }
  , duration)

  const render = tarry(
    () => {
      main.innerHTML = dom.getElementById(root).innerHTML
      cb(title, main)
      evalScripts(main, dom.head)
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

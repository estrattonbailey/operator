import { tarry, queue } from 'tarry.js'
import scroll from 'scroll-restoration'
import events from './emitter'
import evalScripts from './eval.js'

/**
 * Init new native parser
 */
const parser = new window.DOMParser()

/**
 * Get the target of the ajax req
 * @param {string} html Stringified HTML
 * @return {object} DOM node, #page
 */
const parseResponse = (html) => parser.parseFromString(html, 'text/html')

/**
 * Helper to smoothly swap old
 * markup with new markup
 *
 * @param {object} markup New node to append to DOM
 */
export default (root, duration) => (markup, cb) => {
  const res = parseResponse(markup)
  const title = res.title

  const page = document.querySelector(root)

  // TODO does this need a duration
  const start = tarry(
    () => {
      events.emit('before:transition')
      document.documentElement.classList.add('is-transitioning')
      page.style.height = page.clientHeight + 'px'
    }
  , duration)

  const render = tarry(
    () => {
      page.innerHTML = res.querySelector(root).innerHTML
      cb(title, page)
      evalScripts(page)
      evalScripts(res.head, document.head)
      scroll.restore()
    }
  , duration)

  // TODO does this need duration either
  const removeTransitionStyles = tarry(
    () => {
      document.documentElement.classList.remove('is-transitioning')
      page.style.height = ''
    }
  , duration)

  const signalEnd = tarry(
    () => events.emit('after:transition')
  , duration)

  queue(start, render, removeTransitionStyles, signalEnd)()
}

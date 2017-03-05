import { tarry, queue } from 'tarry.js'
import scroll from 'scroll-restoration'
import evalScripts from './eval.js'

const parser = new window.DOMParser()

/**
 * @param {string} html Stringified HTML
 * @return {object} DOM node, #page
 */
const parseResponse = (html) => parser.parseFromString(html, 'text/html')

/**
 * @param {object} page Root application DOM node
 * @param {object} config Duration and root node selector
 * @param {function} emit Emitter function from Operator instance
 * @return {function}
 *
 * @param {string} markup New markup from AJAX response
 * @param {function} cb Optional callback
 */
export default (page, { duration, root }, emit) => (markup, cb) => {
  const res = parseResponse(markup)
  const title = res.title

  const start = tarry(() => {
    emit('transition:before')
    document.documentElement.classList.add('is-transitioning')
    page.style.height = page.clientHeight + 'px'
  })

  const render = tarry(() => {
    page.innerHTML = res.querySelector(root).innerHTML
    evalScripts(page, document.head)
    evalScripts(res.head, document.head)
    scroll.restore()
  })

  const removeTransitionStyles = tarry(() => {
    cb(title)
    document.documentElement.classList.remove('is-transitioning')
    page.style.height = ''
  })

  const end = tarry(() => emit('transition:after'))

  queue(start(0), render(duration), removeTransitionStyles(0), end(duration))()
}

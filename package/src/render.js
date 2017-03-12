import { tarry, queue } from 'tarry.js'
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
export default (page, { duration, root }, emit) => (route, markup, cb) => {
  const res = parseResponse(markup)
  const title = res.title

  const start = tarry(() => {
    emit('transition:before', { route })
    document.documentElement.classList.add('is-transitioning')
    page.style.height = page.clientHeight + 'px'
  })

  const render = tarry(() => {
    page.innerHTML = res.querySelector(root).innerHTML
    evalScripts(res, document)
  })

  const end = tarry(() => {
    cb(title)
    page.style.height = ''
    document.documentElement.classList.remove('is-transitioning')
    emit('transition:after', { route })
  })

  queue(start(0), render(duration), end(0))()
}

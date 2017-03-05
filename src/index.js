import delegate from 'delegate'
import Operator from './operator'
import { sanitize, link } from './url'

export default ({
  root = document.body,
  duration = 0,
  ignore = []
}) => {
  const operator = new Operator({ root, duration, ignore })

  /**
   * Start up
   */
  operator.setState({
    route: window.location.pathname + window.location.search,
    title: document.title
  })

  delegate(document, 'a', 'click', (e) => {
    const anchor = e.delegateTarget
    const href = anchor.getAttribute('href') || '/'
    const path = sanitize(href)

    const internal = link.isSameOrigin(href)
    const external = anchor.getAttribute('rel') === 'external'
    const disabled = anchor.classList.contains('no-ajax')
    const ignored = operator.matches(e, path)
    const hash = link.isHash(href)

    if ( !internal || external || disabled || ignored || hash) { return }

    e.preventDefault()

    if (link.isSameURL(href)) { return }

    operator.go(path)

    return false
  })

  window.onpopstate = (e) => {
    const href = e.target.location.href
    const path = sanitize(href)

    if (operator.matches(e, path)) {
      if (link.isHash(href)) { return }

      window.location.reload()

      return
    }

    /**
     * Popstate bypasses router, so we
     * need to tell it where we went to
     * without pushing state
     */
    operator.go(path, null, true)
  }

  return operator
}

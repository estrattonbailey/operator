import delegate from 'delegate'
import Operator from './operator'
import { link } from './url'

export default ({
  root = document.body,
  duration = 0,
  handlers = []
}) => {
  /**
   * Instantiate
   */
  const operator = new Operator({
    root,
    duration,
    handlers
  })

  /**
   * Bootstrap
   */
  operator.setState({
    route: window.location.pathname + window.location.search,
    title: document.title
  })

  /**
   * Bind and validate all links
   */
  delegate(document, 'a', 'click', (e) => {
    const anchor = e.delegateTarget
    const href = anchor.getAttribute('href') || '/'

    const internal = link.isSameOrigin(href)
    const external = anchor.getAttribute('rel') === 'external'
    const disabled = anchor.classList.contains('no-ajax')
    const ignored = operator.handlers(e, href)
    const hash = link.isHash(href)

    if (!internal || external || disabled || ignored || hash) { return }

    e.preventDefault()

    if (link.isSameURL(href)) { return }

    operator.go(href)

    return false
  })

  /**
   * Handle popstate
   */
  window.onpopstate = (e) => {
    const href = e.target.location.href

    if (operator.handlers(e, href)) {
      if (link.isHash(href)) { return }

      return window.location.reload()
    }

    /**
     * Popstate bypasses router, so we
     * need to tell it where we went to
     * without pushing state
     */
    operator.go(href, null, true)
  }

  return operator
}

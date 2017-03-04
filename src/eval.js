/**
 * Finds all <script> tags in the new
 * markup and evaluates their contents
 *
 * @param {object} root DOM node containing new markup via AJAX
 * @param {...object} sources Other DOM nodes to scrape script tags from
 */
export default (source, root = null) => {
  let errors = []
  const scripts = Array.prototype.slice.call(source.getElementsByTagName('script'))
  const existing = root ? Array.prototype.slice.call(root.getElementsByTagName('script')) : []

  const dupe = (s) => existing.filter((e) => s.innerHTML === e.innerHTML && s.src === e.src).length > 0

  scripts.length > 0 && scripts.forEach((t) => {
    let s = t.cloneNode(true)

    if (dupe(s)) return

    s.setAttribute('data-ajaxed', 'true')

    try {
      eval(s.innerHTML) // eslint-disable-line 
    } catch (e) {
      errors.push(e)
    }

    try {
      root ? root.insertBefore(s, root.children[0]) : source.replaceChild(s, t)
    } catch (e) {
      errors.push(e)
      document.head.insertBefore(s, document.head.children[0])
    }
  })

  if (errors.length > 0) {
    console.groupCollapsed('operator.js')
    errors.forEach((e) => console.log(e))
    console.groupEnd()
  }
}

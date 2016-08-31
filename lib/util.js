import closest from 'closest'

/**
 * Standardize base URL
 */
export const origin = window.location.origin || window.location.protocol+'//'+window.location.host

/**
 * Create regex to test links
 */
export const originRegEx = new RegExp(origin)

/**
 * Init new native parser
 */
const parser = new DOMParser()

/**
 * Get the target of the ajax req
 * @param {string} html Stringified HTML
 * @return {object} DOM node, #page
 */
export const parseResponse = html => parser.parseFromString(html, "text/html")

/**
 * Merge two objects into a 
 * new object
 *
 * @param {object} target Root object
 * @param {object} source Object to merge 
 *
 * @return {object} A *new* object with all props of the passed objects
 */
export const merge = (target, ...args) => {
  for (let i = 0; i < args.length; i++){
    let source = args[i]
    for (let key in source){
      if (source[key]) target[key] = source[key]
    }
  }

  return target 
}

/**
 * Replace site origin, if present,
 * remove leading slash, if present.
 *
 * @param {string} url Raw URL to parse
 * @return {string} URL sans origin and sans leading comma
 */
export const scrubPath = (url) => {
  let path = url.replace(originRegEx, '')
  let clean = path.match(/^\//) ? path.replace(/\/{1}/,'') : path // remove /
  return clean === '' ? '/' : clean
}

/**
 * HREF scrubber functions
 *
 * @param {string} href The href attr value for the link clicked
 * @return {boolean}
 */
const link = {
  hasFullProtocol: (href) => href.match(/^(http\:\/\/)|^w{3}|^\#/) ? true : false,
  isAnchor: (href) => href.match(/^\#/) ? true : false,
  isLocalPath: (href) => href.match(/^(\/\w+|\w+|\/)/) ? true : false,
  isSameDomain: (href) => href.match(originRegEx) ? true : false,
  isSamePage: (href) => {
    let cleanHREF = scrubPath(href)
    let cleanPath = scrubPath(window.location.pathname)
    let pathMatch = href.match(new RegExp(window.location.pathname)) ? true : false

    let samePath = pathMatch && cleanHREF === cleanPath ? true : false

    return samePath 
  },
  isHomepage: (href) => href.match(/^\/$/) ? true : false,
  isLogout: (href) => href.match(/account\/logout/) ? true : false
}

/**
 * Check the event for an external
 * link. Return true if external, which
 * will return from the handler and NOT
 * preventDefault(), allowing the click to fire
 *
 * @param {object} anchor The link clicked on
 * @return {boolean} 
 */
export const isExternal = (anchor) => {
  let href = anchor.getAttribute('href') || ''
  let rel = anchor.getAttribute('rel') || false
  let target = anchor.getAttribute('target') || false

  /**
   * If rel="external", 
   * if target="_blank"
   * if already bound
   */
  if (rel === 'external' || target){
    return true 
  }

  /** 
   * Coming from the same domain 
   */
  if (!link.isAnchor(href) && !link.isLocalPath(href) && !link.isSameDomain(href)){
    return true
  }

  return false
}

/**
 * Check if click is triggered for a valid
 * internal route, or other handler, like anchors
 *
 * @param {object} anchor The link clicked on
 * @return {boolean} Whether or not it's a valid route
 */
export const isValid = href => {
  let isCurrentlyHomepage = window.location.pathname.match(/^\/$/) ? true : false

  /**
   * If it's we're on the homepage,
   * clicking on a '/' link
   */
  if (link.isHomepage(href) && isCurrentlyHomepage){
    return false 
  }

  /**
   * If it's a link to the current page,
   * unless we're on the homepage (which
   * normally matches everything because
   * the pathname === '/'. Homepage case
   * is above ^^.
   */
  if (link.isSamePage(href) && !isCurrentlyHomepage){
    return false 
  }

  /** 
   * Coming from the same domain 
   */
  if (link.isSameDomain(href)){
    return true
  }

  /**
   * Ignore all full URLs and page anchors
   */
  if (link.hasFullProtocol(href)){
    return false
  }

  /**
   * Any other matches, i.e:
   *
   * /pages/page
   * pages/page
   */
  if (link.isLocalPath(href)){
    return true
  }

  return false
}

export const validate = e => {
  let anchor = closest(e.target, 'a', true)
  let href = anchor.getAttribute('href') || '/'

  /**
   * If this like was external,
   * exit and let it fire normally
   */
  if (isExternal(anchor)) return null 

  /**
   * If all these checks pass, prevent default
   */
  e.preventDefault()

  /**
   * Check for any other handlers
   * we've bound. If it's valid, pass
   * the event on to the router
   */
  if (!isValid(href)) return null 

  /**
   * We have a valid route!
   */
  return scrubPath(anchor.getAttribute('href') || '')
}

/**
 * TODO
 * 1. Fire script links too, not just bodies
 *
 * Finds all <script> tags in the new
 * markup and evaluates their contents
 *
 * @param {object} context DOM node containing new markup via AJAX
 */
export const evalScripts = (context) => {
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
export const returnSize = (el, type) => {
  const isWindow = el !== null && el.window ? true : false

  if (isWindow){
    return Math.max(el[`outer${type}`], document.documentElement[`client${type}`])
  }

  return Math.max(el[`offset${type}`], el[`client${type}`])
}

/**
 * Set scroll position on current history
 * state so that when returning to the
 * page we can scroll to the previous position
 */
export const saveScrollPosition = () => {
  let scrollTop = window.pageYOffset || window.scrollY || document.body.scrollTop

  window.history.replaceState({ scrollTop }, '')
}

/**
 * Restore previous scroll position,
 * if available
 */
export const restoreScrollPos = () => {
  if (history.state && history.state.scrollTop !== undefined ) {
    window.scrollTo(0, history.state.scrollTop)
    return history.state.scrollTop
  } else {
    window.scrollTo(0, 0)
  }
}

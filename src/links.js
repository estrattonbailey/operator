const activeLinks = []

const toggle = bool => {
  for (let i = 0; i < activeLinks.length; i++) {
    activeLinks[i].classList[bool ? 'add' : 'remove']('is-active')
  }
}

// TODO do I need to empty the array
// or can I just reset to []
export default (route) => {
  toggle(false)

  activeLinks.splice(0, activeLinks.length)
  activeLinks.push(...Array.prototype.slice.call(document.querySelectorAll(`[href$="${route}"]`)))

  toggle(true)
}

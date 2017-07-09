let activeLinks = []

export default (route) => {
  const regex = /^\/$/.test(route) ? RegExp(/^\/$/) : new RegExp(route)

  for (let i = 0; i < activeLinks.length; i++) {
    activeLinks[i].classList.remove('is-active')
  }

  activeLinks = Array.prototype.slice.call(document.querySelectorAll(`[href$="${route}"]`))

  for (let i = 0; i < activeLinks.length; i++) {
    if (regex.test(activeLinks[i].href)) {
      activeLinks[i].classList.add('is-active')
    }
  }
}

const isDupe = (script, existing) => {
  let dupes = []

  for (let i = 0; i < existing.length; i++) {
    script.isEqualNode(existing[i]) && dupes.push(i)
  }

  return dupes.length > 0
}

export default (newDom, existingDom) => {
  const existing = existingDom.getElementsByTagName('script')
  const scripts = newDom.getElementsByTagName('script')

  for (let i = 0; i < scripts.length; i++) {
    if (isDupe(scripts[i], existing)) {
      break
    }

    const src = scripts[i].attributes.getNamedItem('src')

    if (src) {
      const s = document.createElement('script')
      s.src = src.value
      document.body.appendChild(s)
    } else {
      try {
        eval(scripts[i].innerHTML) // eslint-disable-line 
      } catch (e) {
        console.warn(e)
      }
    }
  }
}

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
      continue
    }

    const s = document.createElement('script')
    const src = scripts[i].attributes.getNamedItem('src')

    if (src) {
      s.src = src.value
    } else {
      s.innerHTML = scripts[i].innerHTML
    }

    document.body.appendChild(s)
  }
}

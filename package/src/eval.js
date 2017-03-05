const isDupe = (script, existing) => existing.filter((e) => {
  script.innerHTML === e.innerHTML && script.src === e.src
}).length > 0

export default (scope, head) => {
  let errors = []

  const scripts = Array.prototype.slice.call(scope.getElementsByTagName('script'))
  const existing = Array.prototype.slice.call(head.getElementsByTagName('script'))

  for (let i = 0; i < scripts.length; i++) {
    let script = scripts[i].cloneNode(true)

    if (isDupe(script, existing)) {
      break
    }

    script.setAttribute('data-ajaxed', 'true')

    if (script.src) {
      const s = document.createElement('script')
      s.src = script.src
      head.appendChild(s)
    } else {
      try {
        eval(s.innerHTML) // eslint-disable-line 
      } catch (e) {
        errors.push(e)
      }
    }
  }

  if (errors.length > 0) {
    console.groupCollapsed('operator.js')
    errors.forEach((e) => console.log(e))
    console.groupEnd()
  }
}

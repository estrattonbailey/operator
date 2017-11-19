import fetch from 'unfetch'
import md from 'marked'

let readme = null

export default content => {
  if (!readme) {
    fetch('https://api.github.com/repos/estrattonbailey/operator.js/readme')
      .then(res => {
        return res.json()
      }).then(res => {
        readme = md(window.atob(res.content))
        content.innerHTML = readme
      })
  } else {
    content.innerHTML = readme
  }
}

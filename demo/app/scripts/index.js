import operator from 'operator.js'
import * as scripts from 'micromanager'

scripts.init({
  component: 'components/'
})

scripts.mount()

const app = operator({
  transitionSpeed: 0
})

app.on('afterRender', () => {
  scripts.unmount()
  scripts.mount()
})

import operator from '../../../package/dist/index.js'

const app = operator({
  root: '#root',
  duration: 200
})

app.on('transition:before', ({ route }) => {
  if (/page/.test(route)) {
    document.documentElement.classList.add('is-page')
  }
})
app.on('transition:after', ({ route }) => {
  if (/page/.test(route)) {
    document.documentElement.classList.remove('is-page')
  }
})

import operator from '../../../package/dist/index.js'

const app = operator({
  root: '#root',
  duration: 200,
})

window.app = app

app.on('route:before', (props) => console.log('route:before', props))
app.on('route:after', (props) => console.log('route:after', props))
app.on('transition:before', (props) => console.log('transition:before', props))
app.on('transition:after', (props) => console.log('transition:after', props))

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

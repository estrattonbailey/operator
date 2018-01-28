# operator.js v4
1kb drop-in "PJAX" solution for fluid, smooth transitions between pages. Zero stress.

## Features
1. Parametized routes
2. Client-side redirects
3. Async-by-default, easy data loading between routes
4. Create custom transitions
5. ~~Pages are cached after initial visit~~ TODO
6. ~~Pre-fetch select pages, as needed~~ TODO
7. ~~Manages scroll position between route changes~~ TODO

## Install
```bash
npm i operator.js@next --save
```

## Usage
```javascript
import operator from 'operator.js'

const app = operator([
  '/',
  '/about',
  '/posts',
  ['/posts/:slug', ({ params }) => {
    return getPost(params.slug) // promise
  }],
  '/redirect'
], '#root')

app.before(path => {
  if (/redirect/.test(path)) {
    app.push('/') // redirect
  }
})

app.after(({ params, title, path }) => {
  document.title = title
  window.history.pushState({}, '', path)
})

app.push('/about')

app.state // => { title, path, params }
```
Define transition in the initial route config:
```javascript
const app = operator([
  state => {
    return new Promise((resolve, reject) => {
      document.documentElement.classList.add('is-transitioning')
      setTimeout(() => {
        requestAnimationFrame(() => {
          document.documentElement.classList.remove('is-transitioning')
        })
        resolve()
      }, 400)
    })
  },
  ...routes
], '#root')
```

## TODO
1. Hash handling

MIT License

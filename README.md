# operator - *beta*
1kb drop-in "PJAX" solution for fluid, smooth transitions between pages. Zero stress.

> Coming from `operator.js`? We got a new name! This library also underwent a
> major refactor, so there may be some lingering issues. Check out the v3 branch
> and install from the legacy `operator.js` package for the latest stable
> release.

## Features
1. Parametized routes
2. Client-side redirects
3. Async-by-default, easy data loading between routes
4. Create custom transitions
5. Pages are cached after initial visit
6. Pre-fetch select pages, as needed

## Install
```bash
npm i operator --save
```

# Usage
```javascript
import operator from 'operator'

const app = operator([
  '/',
  '/about',
  '/posts',
  ['/posts/:slug', ({ params }) => {
    return getPost(params.slug) // promise
  }],
  '/redirect'
], '#root')

app.on('before', ({ params, title, path }) => {
  if (/redirect/.test(path)) {
    app.push('/') // redirect
  }
})

app.on('after', ({ params, title, path }) => {
  document.title = title
  window.history.pushState({}, '', path)
})

/* render new route */
app.go('/about')

/* prefetch data or flush cached route */
app.load('/about')

/* get state */
app.state // => { title, path, params }
```
Define middleware to handle transitions in the initial route config:
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

## License
MIT License © [Eric Bailey](https://estrattonbailey.com)

# operator.js
Drop-in PJAX solution.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

## Features
1. Simple config
2. Transitions handled via CSS
3. Visited pages are **cached by default** for repeat views
4. Precaching API
5. Handles scroll position between pages (coming soon)
6. Specify custom transitions per route (coming soon)
7. Lightweight: **2.7kb gzipped**

## Install
```bash
npm i operator.js --save
```

## Usage
```javascript
import operator from 'operator.js'

const app = operator({
  root: 'root',
  transition: {
    speed: 400
  },
  routes: {
    'products/:id': ({ id }) => {
      console.log(id)
      return true // return false to perform a normal page load
    }
  }
})

app.on('beforeRender', () => {})
app.on('afterRender', () => {})

app.prefetch('/about').then(markup => {
  // the /about route is now in cache
})

app.push('/pseudo-route', 'Optional Title') // pushes state without navigating

app.go('/about') // transition to next route

app.destroy() // stop everything
```

## Advanced Usage TODO
- async route transitions and data fetching
- client-side redirects
- code-splitting with webpack

## TODO
- scroll restoration

## Dependencies
- [mitt:](https://github.com/developit/mitt) Tiny 200 byte functional event emitter / pubsub. by [@developit](https://github.com/developit)
- [unfetch:](https://github.com/developit/unfetch) Bare minimum fetch polyfill in 500 bytes. by [@developit](https://github.com/developit)

## Related Projects
- [micromanager](https://github.com/estrattonbailey/micromanager) Route-managed client-side binding controller in ES6. Useful for preventing double-bindings between pages. by [@estrattonbailey](https://github.com/estrattonbailey)
- [putz](https://github.com/estrattonbailey/putz) A tiny progress bar library for AJAX and SPAs in ES6. by [@estrattonbailey](https://github.com/estrattonbailey)
- [jump.js](https://github.com/callmecavs/jump.js) A small, modern, dependency-free smooth scrolling library. by [@callmecavs](https://github.com/callmecavs)

## Sites Using Operator
- [Barrel NY](https://www.barrelny.com/)
- [A Goddamn Lady](http://www.agoddamnlady.com/)
- [Gitman Vintage](https://gitmanvintage.com/)
- [Genexa Health](https://www.genexahealth.com/)

MIT License

# operator.js
A drop-in "PJAX" solution for fluid, smooth transitions between pages. **2.87kb gzipped.** Zero stress.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

## Features
1. Simple config
2. Easily handle transitions with CSS
3. Pages are cached after initial visit
4. Pre-cache select pages, as needed
4. Parametized routes
4. Async-by-default, easy data loading between routes
5. Manages scroll position between route changes
6. Client-side redirects

## Install
```bash
npm i operator.js --save
```

## Usage
Import the library and call it with an empty object to use the default options.
```javascript
import operator from 'operator.js'

const app = operator({})
```
Operator requires a single wrapper around each of your pages.
```html
<div id='root'>
  <!--> Page content here <!-->
</div>
```
You'll also want some minimal CSS. Below is a basic fade-in/fade-out effect.
```css
#root {
  transition: opacity var(--fast) var(--ease);
}
.operator-is-transitioning #root {
  opacity: 0;
}
```

**And that's it.** Internal links will now smoothly transition automatically.

* * *

## Options
The operator factory accepts a single options object.

```javascript
const app = operator({
  // options
})
```

### Available options
#### root - `string`
The id of your outer wrapper. Default: `root`.
```javascript
const app = operator({
  root: 'root'
})
```
#### transitionSpeed - `number`
The speed of your CSS transition, can be any number (milliseconds). Default: `0`.
```javascript
const app = operator({
  transitionSpeed: 400
})
```
#### routes - `object`
An object where the keys are the routes and values are the route handlers. Each handler should return `true` to allow operator to follow the route. If you return `false`, the route will be followed via a normal page load. This is useful for a variety of reasons.

Handlers can also return an instance of `Promise`. Within this `Promise`, you can request data for the next route, perform custom animations, or whatever you want. Operator will wait until the promise resolves before transitioning to the next route. Magic.

Additionally, handlers can return a string that represents a path to redirect to. This path can be returned synchronously, or as the resolved value of a promise. See Client-side Redirects for an example.

Routes configured on the initial instance are executed immediately when the page loads.

```javascript
const app = operator({
  routes: {
    '/products/:id': ({ id }) => {
      return new Promise((resolve, reject) => {
        api.getProductById(id).then(product => {
          resolve(product)
        })
      })
    },
    '*': () => {
      /**
       * Could perform custom transitions
       * on each route
       */
      return true
    }
  }
})
```
#### evaluateScripts (experimental) - `boolean`
If `true`, operator will parse each new route and attempt to re-mount scripts to the page. It does this by recreating each script tag and appending it to the DOM.

## API

### on(event, callback)
Listen for emitted events from the instance. These can be useful to transitions, destroying other library instances, or initiating new instances.
```javascript
app.on('beforeRender', (newRoute) => {})
app.on('afterRender', () => {})
```

### go(route)
Navigate to a route.
```javascript
app.go('/products')
```

### push(route[, title])
Push a new path and title to `history` without loading any data. Useful for filtering, modals, etc.
```javascript
app.push('/products?sort=price', 'Filtered by Price')
```

### prefetch(route)
Cache a request for an arbitrary route. The method also returns a `Promise` that resolves with the requested page.
```javascript
app.prefetch('/about').then(markup => {
  // do something with page markup
})
```

### addRoute(route, handler)
Adds a route and handler. *Routes added with this method are not executed on initial startup.*
```javascript
app.addRoute('/products/:id', ({ id }) => {
  // do something with product id
  return true
})
```

### disable()
Disable operator without destorying the instance.

### enable()
Re-enable operator after disabling it.

### isEnabled()
Check if operator is enabled. Returns `true` or `false`.

### destory()
Stop everything. Pretty straighforward.

* * *

## Advanced Usage

### Code splitting
Operator doesn't do anything specifically to aid your in code splitting, but the async route handlers mean you can load the scripts for a new route *before* it's rendered, which keeps things buttery smooth.

With webpack, it looks like this:
```javascript
app.addRoute('/products/*', () => {
  return import('flickity').then(flickity => {
    window.Flickity = flickity
  })
})
```

### Client-side redirects
To create simple client side redirects, just return the path you wish to redirect to from your route handler.
```javascript
const app = operator({
  routes: {
    '/products/:id': ({ id }) => {
      if (id === 'some-product') {
        return '/products/all'
      } else {
        return true
      }
    },
    '/about': () => {
      return fetchAboutDataFromAPI().then(data => {
        if (data.hasRedirect) {
          return '/'
        } else {
          return true
        }
      })
    }
  }
})
```

* * *

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

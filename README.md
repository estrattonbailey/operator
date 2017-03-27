# Operator v2
An AJAX + routing library that transforms a normal site into a single page application (SPA). It's light, fast, and flexible.

**This is v2 beta. Please be aware there may still be a few bugs ;)**

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

### Features
1. Drop-in solution, simple config
2. Easily style transitions using CSS
3. Visited pages are cached by default for repeat views
4. Lightweight: **~4kb gzipped**

## Install
```javascript
# install v2 beta
npm i operator.js@next --save
```

## Usage
```javascript
import operator from 'operator.js'

const app = operator({
  root: '#root',
  duration: 200,
  handlers: [
    route => /logout/.test(route)
  ]
})
```

## Options
Operator accepts a single options object with the following keys:

#### root
A selector for the root element of your site
```javascript
const app = operator({
  root: '.js-root-element'
})
```

#### duration (optional)
Page transition duration, if desired. Operator adds an `is-transitioning` class to the `documentElement` while navigating for the duration provided here. `default: 0`
```javascript
const app = operator({
  root: '.js-root-element',
  duration: 1000
})
```

#### handlers (optional)
An `array` of functions to test against the route. **Functions must return true/false.**
- if a test returns `true`, the route is followed via normal page load instead of AJAX
- return `false` to continue with the AJAX experience

In the below example, routes matching `products` will be ignored and the page will perform a full load of the next route:
```javascript
const app = operator({
  root: '.js-root-element',
  handlers: [
    route => /products/.test(route)
  ]
})
```
Optionally, you can pass a sub-array containing a `name` value *and* a test function. If the test returns `true`, an event (`name`) is emitted with an object as payload. The payload object contains the native DOM event object returned from [delegate](https://github.com/zenorocha/delegate) and the matched route:
```javascript
const app = operator({
  root: '#root',
  handlers: [
    ['products', route => /products/.test(route)]
  ]
})

app.on('products', ({event, route}) => {
  // do stuff
  // you can also event.preventDefault()
})
```

## API
```javascript 
import operator from 'operator.js'
```

### .on(event, callback)
Operator emits the following events:

#### route:before
Before the route is resolved and the page loaded. The callback recieves the route to be resolved.
```javascript
operator.on('route:before', ({ route }) => {
  // do stuff  
})
```

#### route:after
After the route is resolved and the page loaded. The callback recieves the new route and page title.
```javascript
operator.on('route:after', ({ route, title }) => {
  // do stuff  
})
```

#### transition:before
Before the page starts its transition. The callback recieves an object with the new route.
```javascript
operator.on('transition:before', ({ route }) => {
  // do stuff  
})
```
This is handy for route specific transitions:
```javascript
operator.on('transition:before', ({ route }) => {
  if (/products/.test(route)) {
    document.documentElement.classList.add('is-products-transition')
  }
})
```

#### transition:after
After the page completes its transition (called after the `duration` you specified on the Operator instance). The callback recieves an object with the new route.
```javascript
operator.on('transition:after', ({ route }) => {
  // do stuff  
})
```
Use this to remove route specific transitions:
```javascript
operator.on('transition:before', ({ route }) => {
  if (/products/.test(route)) {
    document.documentElement.classList.remove('is-products-transition')
  }
})
```

### .go(route, callback)
Navigate to a given route.
```javascript
operator.go('/products', ({ route, title }) => {
  // do stuff
})
```

### .push(route)
Update History and set a new active URL, but don't fetch any data. Useful for manual route manipulation relating to UI changes.
```javascript
operator.push('/products/lightbox-open', 'Optional Title')

// or for hash
operator.push('#anchor')
```

### .getState()
Returns an object with the current route and title values.
```javascript
operator.getState() // { route: '/products', title: 'Products' }
```

## Common Use Cases

#### Anchors
By default, operator will ignore anchors and let native browser behavior take over. You can, however, intercept these hash events using the `handlers` option. The below example uses to [jump.js](https://github.com/callmecavs/jump.js) to smooth-scroll to the anchor target:
```javascript
import jump from 'jump.js'

const app = operator({
  root: '#root',
  handlers: [
    ['hash', path => /#/.test(path)]
  ]
})

app.on('hash', ({ event }) => {
  event.preventDefault()
  let hash = event.delegateTarget.getAttribute('href')
  jump(hash, { duration: 500 })
})
```

#### Client-side Redirects
Using the `handlers` option, you can block a route and navigate to another, effectively creating a redirect. This will work on page load as well, but please note that because we still to wait for the javascript to load, users might see a flash of the redirected page before Operator kicks in and sends them along.
```javascript
const app = operator({
  root: '#root',
  handlers: [
    ['products', path => /products/.test(path)]
  ]
})

app.on('products', ({ event }) => {
  event.preventDefault()
  app.go('/')
})
```

#### Code-splitting w/Webpack
With Webpack v2, code-splitting is ridiculously easy. Full example [here](https://github.com/estrattonbailey/estrattonbailey/blob/master/src/js/index.js).
```javascript
const load = route => {
  // load about page
  if (/about/.test(route)) {
    import('./pages/about.js')
      .then(p => p.default())
      .catch(err => console.error(err))
  }
}

// on route change
app.on('route:after', ({ route }) => load(route))

// on start-up
load(app.getState().route)
```

## Dependencies
- [delegate:](https://github.com/zenorocha/delegate) Lightweight event delegation. by [@zenorocha](https://github.com/zenorocha)
- [nanoajax:](https://github.com/yanatan16/nanoajax) An ajax library you need a microscope to see. by [@yanatan16](https://github.com/yanatan16)
- [navigo:](https://github.com/krasimir/navigo) An ajax library you need a microscope to see. by [@krasimir](https://github.com/krasimir)
- [loop.js:](https://github.com/callmecavs/loop.js) Part of a knot. Loop is a bare-bones pub/sub style event emitter. by [@estrattonbailey](https://github.com/estrattonbailey)
- [tarry.js:](https://github.com/estrattonbailey/tarry.js) A really tiny sequencing library with support for delays. by [@estrattonbailey](https://github.com/estrattonbailey)
- [scroll-restoration:](https://github.com/estrattonbailey/scroll-restoration) A tiny scroll management library using native DOM APIs. by [@estrattonbailey](https://github.com/estrattonbailey)

## Related Projects
- [micromanager](https://github.com/estrattonbailey/micromanager) Route-managed client-side binding controller in ES6. Useful for preventing double-bindings between pages. by [@estrattonbailey](https://github.com/estrattonbailey)
- [putz](https://github.com/estrattonbailey/putz) A tiny progress bar library for AJAX and SPAs in ES6. by [@estrattonbailey](https://github.com/estrattonbailey)
- [jump.js](https://github.com/callmecavs/jump.js) A small, modern, dependency-free smooth scrolling library. by [@callmecavs](https://github.com/callmecavs)

## Sites Using Operator
- [Genexa Health](https://www.genexahealth.com/)
- [Gitman Vintage](https://gitmanvintage.com/)

MIT License

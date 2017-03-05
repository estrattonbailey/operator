# Operator [![npm](https://img.shields.io/npm/v/operator.js.svg?maxAge=2592000)](https://www.npmjs.com/package/operator.js)
An AJAX + routing library that transforms a normal site into a Single Page Application (SPA). 

**4.2kb gzipped.**

## Install
```javascript
npm i operator.js --save
```

## Usage
```javascript
import operator from 'operator.js'

const app = operator({
  root: '#root',
  duration: 200, // transition duration
  ignore: [
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

#### ignore (optional)
An `array` of functions to test against the route. **Functions must return booleans.** If a test returns true, the route is followed via normal page load instead of AJAX. In the below example, routes matching `products` will be ignored:
```javascript
const app = operator({
  root: '.js-root-element',
  ignore: [
    route => /products/.test(route)
  ]
})
```
Optionally, you can pass a sub-array containing a `name` value *and* a test function. If the test returns true, an event (`name`) is emitted with an object as payload. The payload object contains the native DOM event object returned from [delegate](https://github.com/zenorocha/delegate) and the matched route:
```javascript
const app = operator({
  root: '#root',
  ignore: [
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

#### before:route
Before the route is resolved and the page loaded. The callback recieves the route to be resolved.
```javascript
operator.on('before:route', ({ route }) => {
  // do stuff  
})
```

#### after:route
After the route is resolved and the page loaded. The callback recieves the new route and page title.
```javascript
operator.on('after:route', ({ route, title }) => {
  // do stuff  
})
```

#### before:transition
Before the page starts its transition. The callback recieves no params.
```javascript
operator.on('before:transition', () => {
  // do stuff  
})
```

#### after:transition
After the page completes its transition. The callback recieves no params.
```javascript
operator.on('after:transition', () => {
  // do stuff  
})
```

### .go(route, callback)
Navigate to a given route.
```javascript
operator.go('/products', (route, title) => {
  // do stuff
})
```

### .push(route)
Update History and set a new active URL, but don't fetch any data. Useful for manual route manipulation relating to UI changes.
```javascript
operator.push('/products/lightbox-open')

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
By default, operator will ignore anchors and let native browser behavior take over. You can, however, intercept these hash events using the `ignore` option. The below example uses to [jump.js](https://github.com/callmecavs/jump.js) to smooth-scroll to the anchor target:
```javascript
import jump from 'jump.js'

const app = operator({
  root: '#root',
  ignore: [
    ['hash', path => /#/.test(path)]
  ]
})

app.on('hash', ({event}) => {
  event.preventDefault()
  let hash = event.delegateTarget.getAttribute('href')
  jump(hash, { duration: 500 })
})
```

#### Client-side Redirects
Using the `ignore` option, you can block a route and navigate to another, effectively creating a redirect. However, operator will **not redirect on initial load.** Currently.
```javascript
const app = operator({
  root: '#root',
  ignore: [
    ['products', path => /products/.test(path)]
  ]
})

app.on('products', ({event}) => {
  event.preventDefault()
  app.go('/')
})
```

## Dependencies
- [delegate:](https://github.com/zenorocha/delegate) Lightweight event delegation. by [@zenorocha](https://github.com/zenorocha)
- [nanoajax:](https://github.com/yanatan16/nanoajax) An ajax library you need a microscope to see. by [@yanatan16](https://github.com/yanatan16)
- [navigo:](https://github.com/krasimir/navigo) An ajax library you need a microscope to see. by [@krasimir](https://github.com/krasimir)
- [loop.js:](https://github.com/callmecavs/loop.js) Part of a knot. Loop is a bare-bones pub/sub style event emitter. by [@estrattonbailey](https://github.com/estrattonbailey)
- [tarry.js:](https://github.com/estrattonbailey/tarry.js) A really tiny sequencing library with support for delays. by [@estrattonbailey](https://github.com/estrattonbailey)

## Related Projects
- [micromanager](https://github.com/estrattonbailey/micromanager) Route-managed client-side binding controller in ES6. Useful for preventing double-bindings between pages. by [@estrattonbailey](https://github.com/estrattonbailey)
- [jump.js](https://github.com/callmecavs/jump.js) A small, modern, dependency-free smooth scrolling library. by [@callmecavs](https://github.com/callmecavs)

## TODO
1. On-page-load redirects?

MIT License - Would love to hear your thoughts! :)

# Operator 
Operator is an AJAX and routing library that transforms a normal site into a Single Page Application (SPA). 

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
- `root` - a selector on the root element of your site
- `duration` - page transition duration, if desired `default: 0`
- `ignore` - an `array` of functions to test against the route. If a test returns true, the route is followed via normal page load instead of AJAX.

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

#### hash
When a click event fires on an anchor i.e. `<a href="#anchor">Scroll Down</a>`
```javascript
import jump from 'jump.js'

operator.on('hash', hash => jump(hash, { duration: 500 }))
```

### .go(route, callback)
Navigate to a given route.
```javascript
operator.go('/products', (route, title) => {
  // do stuff
})
```

### .getState()
Returns an object with the current route and title values.
```javascript
operator.getState() // { route: '/products', title: 'Products' }
```

## Dependencies
- [knot.js:](https://github.com/callmecavs/knot.js) A browser-based event emitter, for tying things together. by [@callmecavs](https://github.com/callmecavs)
- [delegate:](https://github.com/zenorocha/delegate) Lightweight event delegation. by [@zenorocha](https://github.com/zenorocha)
- [nanoajax:](https://github.com/yanatan16/nanoajax) An ajax library you need a microscope to see. by [@yanatan16](https://github.com/yanatan16)
- [navigo:](https://github.com/krasimir/navigo) An ajax library you need a microscope to see. by [@krasimir](https://github.com/krasimir)
- [tarry.js:](https://github.com/estrattonbailey/tarry.js) A really tiny sequencing library with support for delays. by [@estrattonbailey](https://github.com/estrattonbailey)

## Related Projects
- Handle `hash` events with [jump.js](https://github.com/callmecavs/jump.js), another neat little library from [@callmecavs](https://github.com/callmecavs)

## TODO
1. Scroll to point if URL contains a hash on page load
2. Redirects would be cool

* * *
MIT

# WIP AJAX + Routing Lib

## Usage
Pass the root element of your app, and a transition speed. During transition, the library adds a `.is-transitioning` class to the `documentElement` for the specified duration. The `ignore` option takes an array of functions, which are checked against the next activated route. If a test returns true, the route is followed via normal page load i.e. is not AJAXed and animated in.
```javascript
import operator from 'operator.js'

const app = operator({
  root: 'root', // root ID
  duration: 200, // transition duration
  ignore: [
    route => /logout/.test(route)
  ]
})

app.on('pageTransitionStart', title => {})
app.on('pageTransitionEnd', title => {})
```

* * *
MIT

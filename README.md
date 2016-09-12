# WIP AJAX + Routing Lib

## Usage
Pass the root element of your app, and a transition speed. During transition, the library adds a `.is-transitioning` class to the `documentElement` for the specified duration.
```javascript
import operator from 'operator.js'

const app = operator({
  root: 'root', // root ID
  duration: 200 // transition duration
})

app.on('pageTransitionStart', title => {})
app.on('pageTransitionEnd', title => {})
```

* * *
MIT

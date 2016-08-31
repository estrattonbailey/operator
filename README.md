# overunder  [![npm](https://img.shields.io/npm/v/overunder.svg?maxAge=2592000)](https://www.npmjs.com/package/overunder)
A small waypoint library that emits events when you scroll to a specific element(s), or resize to a specified width.

Use overunder for sticky elements, lazy loading, [element queries](https://www.sitepoint.com/beyond-media-queries-time-get-elemental/), etc.

## Install 
```bash
npm i overunder --save
```

## Usage
#### Create An Instance
Create an instance with two waypoints.
```javascript
import overunder from 'overunder'

const endWaypoint = document.getElementById('anchor')

const scroller = overunder.scroll(200, endWaypoint, {watchResize: true})

scroller.on('under' () => {
  // under 200px
})

scroller.on('between' () => {
  // between 200px and endWaypoint offset top
})

scroller.on('over' () => {
  // over endWaypoint offset top
})

// Start watching scroll and check position
scroller.init().update()
```
#### Destroy An Instance
Destroy an instance and all handlers.
```javascript
scroller.destroy()
```
#### Update Instance After DOM Change
After a DOM change, like appending elements via AJAX, check scroll position again.
```javascript
scroller.update()
```
If a waypoint changes, or you need to update either of the waypoints, pass them as arguments to the `update()` method. This will also check the position immediately after updating the waypoint value.
```javascript
scroller.update(500)

// Or pass a new element
scroller.update(500, newEndWaypoint)
```

## API 
```javascript
import overunder from 'overunder'
```

### .scroll
```javascript
overunder.scroll(delta, range, options)
```
- delta `number|element` - first waypoint
- range `number|element` - (optional) second waypoint, enables the `between` event
- options `object` - (optional) available properties: `watchResize` `offset` `enterBottom`
 
### .resize
```javascript
overunder.resize(delta, range, options)
```
- delta `number|element` - first waypoint
- range `number|element` - (optional) second waypoint, enables the `between` event
- options `object` - (optional) available properties: `offset` `context`

### .on
Attach event listeners for a event.
```javascript
overunder.on(event, callback)
```

### .off
Remove event listener.
```javascript
const handler = () => {}
overunder.off('over', handler)
```

### .init
Initiate the instance and start watching for resize or scroll events. Returns the instance, allowing you to chain `update()`.
```javascript
overunder.init()
```

### .update
Allows you to check the position of the instance at any time, as well as update values and options. Position is checked once each time you call update, regardless of if you've passed any params or not.
```javascript
overunder.update()
```
Optionally update the waypoints, and then check position.
```javascript
overunder.update(newDelta, newRange)
```
To update just the `range` value, pass a falsy value as the first param.
```javascript
overunder.update(null, newRange)
```
To update options properties, pass the object *after* your `delta` or `range` values.
```javascript
overunder.update(newDelta, {offset: 50, enterBottom: true})
overunder.update(newDelta, newRange, {negativeOffset: newNegOffset})
overunder.update({watchResize: true})
```

### .destroy
Destroy the instance and remove all listeners.
```javascript
overunder.destroy()
```

## Options
Options are passed as an object as the second or third parameter of either the `scroll()` or `resize()` methods.

### offset `number|element` - default: 0
Buffer distance, **subtracted** from scroll/resize position (gets triggered sooner). Pass a negative number to achieve a positive offset (gets triggered later). To acheive a positive offset using an element, use `negativeOffset` below.

### negativeOffset `number|element` - default: 0
A value that is always **added** to the position value. I realize the naming of these two offset options is confusing, need to figure that out.

### watchResize `boolean` - default: false
Continously checks scroll position on resize. *For `scroll()` instances only.*

### enterBottom `boolean` - default: false
By defaul, overunder fires events when waypoints reach the top of the viewport. Enable this option to fire events when the waypoint enters the bottom of the viewport. *For `scroll()` instances only.*

### context `element` - default: window
Watch a specific element for changes in width. *For `resize()` instances only.*

## Dependencies
- [knot.js:](https://github.com/callmecavs/knot.js) A browser-based event emitter, for tying things together. by [@callmecavs](https://github.com/callmecavs)

## TODO
1. Test `context` option for scroll instances scroll
2. Enforce options for `scroll` vs `resize` i.e. resize doesn't need `watchResize` option
3. Allow for updating the `range` value independently of the `delta`
4. Pass context to `resize` callback

### MIT License - Please contribute! :)

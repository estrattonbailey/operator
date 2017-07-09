export default {
  paused: false,
  _state: {
    route: '',
    title: '',
    prev: {
      route: '/',
      title: ''
    }
  },
  get route () {
    return this._state.route
  },
  set route (loc) {
    this._state.prev.route = this.route
    this._state.route = loc
  },
  get title () {
    return this._state.title
  },
  set title (val) {
    this._state.prev.title = this.title
    this._state.title = val
  },
  get prev () {
    return this._state.prev
  }
}

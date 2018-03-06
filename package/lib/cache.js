let cache = {}

export default {
  set (route, markup) {
    cache = Object.assign(cache, {
      [route]: markup
    })
  },
  get (route) {
    return cache[route]
  }
}

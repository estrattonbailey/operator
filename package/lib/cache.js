let cache = {}

export default {
  set (route, markup) {
    cache = {
      ...cache,
      [route]: markup
    }
  },
  get (route) {
    return cache[route]
  }
}

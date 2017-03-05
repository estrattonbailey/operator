let cache = {}

export default {
  set: (route, res) => {
    cache = {
      ...cache,
      [route]: res
    }
  },
  get: (route) => cache[route],
  getCache: () => cache
}

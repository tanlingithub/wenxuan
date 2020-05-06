export default function({route, store}) {
  let path = (
    (route.matched[0] && route.matched[0].path) ||
    route.path
  ).replace(/\?/g, '')

  store.commit('update', {
    routePath: path
  })

  store.dispatch('updateBreadcrumd')
}

import Style from './Style'

const depthStr = (depth) => `depth_${depth}`
const debugStr = (debug) => (debug) ? 'debug' : ''

const Polygon = ((polygon, css, debug) => {
  let el = document.createElement('div')
  el.setAttribute('class', `gon ${polygon.name} ${depthStr(polygon.depth)} ${debugStr(debug)}`)
  Style.stylePolygon(polygon, css, debug)
  return el
})

const Vertex = ((polygon, vertex, n, N, css) => {
  const el = document.createElement('div')
  el.setAttribute('class', `vert ${polygon.name} depth_${polygon.depth} num${n}_${N}`)
  Style.styleVertex(polygon, vertex, n, N, css)
  return el
})

export {
  Polygon,
  Vertex
}

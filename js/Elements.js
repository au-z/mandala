import Style from './Style'

const depthStr = (depth) => `depth_${depth}`
const debugStr = (debug) => (debug) ? 'debug' : ''

const Polygon = ((polygon, debug) => {
  let el = document.createElement('div')
  el.setAttribute('class', `gon ${polygon.name} ${depthStr(polygon.depth)} ${debugStr(debug)}`)
  Style.stylePolygon(polygon)
  return el
})

const Vertex = ((polygon, vertex, n, N) => {
  const el = document.createElement('div')
  el.setAttribute('class', `vert ${polygon.name} depth_${polygon.depth}`)
  // Style.styleVertex(polygon, vertex, n, N)
  const pR = polygon.gon.radius
  const vR = vertex.radius
  const theta = (2 * Math.PI / N)
  const left = pR * Math.sin(n * theta) + pR - vR
  const bottom = pR * Math.cos(n * theta) + pR - vR
  console.log(left, bottom)
  el.style.cssText = `left: {0}px; bottom:{1}px; margin: 0;`.format(left, bottom)
  return el
})

export {
  Polygon,
  Vertex
}
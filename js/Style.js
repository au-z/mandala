const depthStr = (depth) => `depth_${depth}`

const Style = (() => {
  let styleTitle = 'mandala-css'
  let debug = false

  const setStyleTitle = (title) => styleTitle = title

  const styleDict = {}

  const findStyleSheet = (title) => {
    let el = document.querySelector('style#' + title)
    if(!el) el = createStyleElement(title)
    return el

    function createStyleElement(title) {
      let el = document.createElement('style')
      el.setAttribute('id', title)
      document.body.appendChild(el)
      return el
    }
  }

  const injectCss = (css) => {
    const sheet = findStyleSheet(styleTitle)
    sheet.innerHTML += css
  }

  const stylePolygon = (polygon, debug) => {
    const r = polygon.gon.radius
    const margin = -1 * (r - polygon.parentVertRadius)
    const gonSelector = `.${polygon.name}.${depthStr(polygon.depth)}`
  
    !styleDict[gonSelector] && injectCss(`${gonSelector}{
      width: {0}px;
      height: {0}px;
      border-radius: {0}px;
      margin-left: {1}px;
      margin-top: {1}px;
    }\n`.format(2*r, margin))
    styleDict[gonSelector] = true
  
    const vertexDiameter = 2 * polygon.vert[0].radius
    const vertSelector = `.${polygon.name}.vert.${depthStr(polygon.depth)}`
  
    !styleDict[vertSelector] && injectCss(`${vertSelector}{
      width: {0}px;
      height: {0}px;
      border-radius: {0}px;
    }\n`.format(vertexDiameter))
    styleDict[vertSelector] = true
  }

  const styleVertex = (polygon, vertex, n, N) => {
    const pR = polygon.gon.radius
    const vR = vertex.radius
    const theta = (2 * Math.PI / N)
    const left = pR * Math.sin(n * theta) + pR - vR
    const bottom = pR * Math.cos(n * theta) + pR - vR
    const vertSelector = `.${polygon.name}.vert.${depthStr(polygon.depth)}.num${n}_${N}`
    !styleDict[vertSelector] && injectCss(`${vertSelector}{
      left: {0}px;
      bottom: {1}px;
      margin: 0;
      transform: rotate(${360/N * n}deg);
    }\n`.format(left, bottom))
  }

  return {
    injectCss,
    setStyleTitle,
    stylePolygon,
    styleVertex,
  }
})()

export default Style

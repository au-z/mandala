const depthStr = (depth) => `depth_${depth}`

const Style = (() => {
  let STYLE_ID = 'mandala-css'
  let debug = false

  const setStyleId = (id) => {
    STYLE_ID = id
  }

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

  const injectCss = (css, styleId = STYLE_ID) => {
    const sheet = findStyleSheet(styleId)
    sheet.innerHTML += css
    return styleId
  }

  const stylePolygon = (polygon, debug) => {
    console.log('polygon', polygon)
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
    console.log('vertex', vertex)
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
    styleDict[vertSelector] = true
  }

  const erase = (selector) => {
    for(let s in styleDict) {
      if(s.includes(selector)) styleDict[s] = false
    }
  }

  return {
    erase,
    findStyleSheet,
    injectCss,
    setStyleId,
    stylePolygon,
    styleVertex,
  }
})()

export default Style

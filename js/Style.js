import { SSL_OP_NETSCAPE_CHALLENGE_BUG } from "constants"

const depthStr = (depth) => `depth_${depth}`

const Style = (() => {
  let STYLE_ID = 'mandala-css'
  let debug = false

  const setStyleId = (id) => {
    STYLE_ID = id
  }

  const styleDict = {}
  const animationOptionsDict = {}

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

  const extractBetween = (str, a, b) => {
    let aIndex = str.indexOf(a)
    if(aIndex === -1) return null
    let bIndex = str.indexOf(b, aIndex)
    if(bIndex === -1) return null
    return str.substr(aIndex, bIndex + b.length - aIndex).trim()
  }

  const extractNextBlock = (css, index, print) => {
    const stack = ['{']
    const startIndex = index

    while(stack.length > 0) {
      if(css[index] === '{') stack.push(css[index])
      if(css[index] === '}') stack.pop()
      index++
    }

    // print && console.log(css.substr(startIndex - 1, index - startIndex + 1))
    return css.substr(startIndex - 1, index - startIndex + 1)
  }

  const findRule = (css, subselector, rule) => {
    let blockIndex = css.indexOf(`${subselector}{`)
    if(blockIndex === -1) blockIndex = css.indexOf(`${subselector} {`)
    
    if(blockIndex !== -1) {
      while (css[blockIndex] !== '{') {
        blockIndex++
      }
      let block = extractNextBlock(css, blockIndex + 1)
      return extractBetween(block, `${rule}:`, ';')
    }
  }

  const findKeyframes = (css) => {
    const keyframesDict = {}
    const re = /@(-webkit)?-?keyframes\s(.*){/g
    let m
    do {
      m = re.exec(css)
      if(m) {
        const animationName = m[2]
        keyframesDict[animationName] = extractNextBlock(css, m.index + m[0].length)
      }
    } while(m)
    return keyframesDict
  }

  const parseAnimationOptions = (css, selector) => {
    let animationOptions = {}
    /**
     * Padding animations require differe transform origins.
     * These settings trigger various CSS treatments based on the animation CSS.
     */
    const assignOptions = (options, css) => {
      if(css.includes('-bottom') || css.includes('-top')) {
        options.lockVertAxis = true
      }
      if(css.includes('-left') || css.includes('-right')) {
        options.lockHorizAxis = true
      }
      return options
    }

    const keyframesDict = findKeyframes(css)

    if (animationOptionsDict[selector]) return animationOptionsDict[selector]
    selector.substr(1, selector.length).split('.').reduce((subselector, nextSelection) => {
      subselector += `.${nextSelection}`
      const rule = findRule(css, subselector, 'animation')
      if(rule) {
        Object.keys(keyframesDict).forEach((k) => {
          if(rule.includes(k)) {
            assignOptions(animationOptions, keyframesDict[k])
          }
        })
      }
      return subselector
    }, '')

    animationOptionsDict[selector] = animationOptions
    return animationOptions
  }

  const stylePolygon = (polygon, css, debug) => {
    const r = polygon.gon.radius
    const margin = -1 * (r - polygon.parentVertRadius)
    const gonSelector = `.${polygon.name}.${depthStr(polygon.depth)}`
    // const animationOptions = parseAnimationOptions(css, gonSelector)

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

  const styleVertex = (polygon, vertex, n, N, css) => {
    const vertSelector = `.${polygon.name}.vert.${depthStr(polygon.depth)}.num${n}_${N}`
    const animationOptions = parseAnimationOptions(css, vertSelector)

    const pR = polygon.gon.radius
    const vR = vertex.radius
    const theta = (2 * Math.PI / N)
    const left = pR * Math.sin(n * theta) + pR - vR
    let bottom = pR * Math.cos(n * theta) + pR
    if(!animationOptions.lockVertAxis) {
      bottom -= vR
    }
    const lockHorizAxis = animationOptions.lockHorizAxis ? '0%' : '50%'
    const lockVertAxis = animationOptions.lockVertAxis ? '100%' : '50%'

    !styleDict[vertSelector] && injectCss(`${vertSelector}{
      left: {0}px;
      bottom: {1}px;
      margin: 0;
      transform-origin: {2} {3} 0;
      transform: rotate(${360/N * n}deg);
    }\n`.format(left, bottom, lockHorizAxis, lockVertAxis))
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
    parseAnimationOptions,
    setStyleId,
    stylePolygon,
    styleVertex,
  }
})()

export default Style

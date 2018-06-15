import Check from './helpers/Check'
import {Polygon, Vertex} from './Elements'
import {copy, randomName, per} from './helpers/Helpers'
import Style from './Style'

function Token(substr = 8) {
  return Math.random().toString(36).substr(substr)
}

/**
 * Library used to create animated mandala effects
 * @param {String} json raw json to create a mandala from
 * @param {String} css css
 * @param {Object} options options for the mandala
 * @return {Object} the json of the resolved mandala
 */
export default function(json, css, options = {}) {
  const NONCE = Math.random().toString(36).substr(9)

  options.parentId = options.parentId || 'mandala'
  let DEBUG = options.debug || false

  if(!json || !css) throw new Error('Incomplete mandala provided. Please pass a JSON template and CSS string.')
  let name = null

  const buildMandala = (json = {}) => {
    json.name = json.name || new Token()
    let elId = `mandala_${json.name}`
    let styleId = `mandala-style_${json.name}`
    Style.setStyleId(styleId)

    // erase previously saved names
    Style.erase(json.name)

    if(json.debug && !DEBUG) DEBUG = json.debug
    Check.empty(json.nodes, 'Template file contains 0 nodes.')
    // parse json into polygons
    let polygons = createPolygons(json)
    linkPolygons(polygons, polygons[0])

    // turn mandala tree to html
    // TODO: add CSS
    let html = new Polygon(polygons[0], css, DEBUG)
    domify(html, polygons[0], DEBUG)

    // mount to DOM
    mount(options.parentId, html, `${elId}`)

    return {
      json,
      elId,
      styleId,
    }
  }

  const mount = (parentId, node, elId) => {
    const mount = document.getElementById(parentId)
    const container = document.createElement('div')
    container.setAttribute('class', `mandala-container`)
    container.setAttribute('id', elId)
    container.appendChild(node)
    mount.appendChild(container)
  }
  
  const createPolygons = (json, itr) => json.nodes.map((n, i) => {
    Check.falsies(n.gon, n.vert)
    return {
      depth: i,
      gon: copy(json.gon[n.gon]),
      name: json.name || randomName(5),
      parentVertRadius: 0,
      vert: per(json.gon[n.gon].vertCount, (i) => copy(json.vert[n.vert])),
    }
  })

  const linkPolygons = (polygons, polygon) => polygon.vert.forEach((v) => {
    if(polygon.depth < polygons.length - 1) {
      v.child = polygons[polygon.depth + 1]
      if(v.child) v.child.parentVertRadius = v.radius
      return linkPolygons(polygons, polygons[polygon.depth + 1])
    }
  })

  const domify = (htmlNode, polygon, debug) => polygon.vert.forEach((v, i) => {
    const vertNode = new Vertex(polygon, v, i, polygon.vert.length, css)
    htmlNode.appendChild(vertNode)
    if(v.child) {
      const gonNode = new Polygon(v.child, css, debug)
      vertNode.appendChild(gonNode)
      return domify(gonNode, v.child, debug)
    }
  })

  const effect = buildMandala(json)
  const styleId = Style.injectCss(css, effect.styleId)

  return {
    ...effect,
    css,
  }
}

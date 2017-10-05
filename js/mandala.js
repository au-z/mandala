import Check from './helpers/Check'
import {Polygon, Vertex} from './Elements'
import {copy, randomName, per} from './helpers/Helpers'
import {get, FileExt} from './helpers/Http'
import Style from './Style'

if(!String.prototype.format) {
  String.prototype.format = function(...a){
    return this.replace(/{(\d+)}/g, (match, number) => {
      return typeof args[number] != 'undefined' ? args[number] : match
    })
  }
}

const Mandala = ((uri, json, options) => {
  options.styleTitle && Style.setStyleTitle(options.styleTitle)
  const debug = options.debug || false

  if(!uri && !json) throw new Error('No template file or json provided.')
  let name = null

  const buildMandala = (json = {}) => {
    Check.empty(json.nodes, 'Template file contains 0 nodes.')
    Check.falsies([true, true, true])
    let polygons = createPolygons(json)
    linkPolygons(polygons, polygons[0])

    let html = new Polygon(polygons[0], debug)
    domify(html, polygons[0])
    mount(html, polygons[0].name)
  }

  const mount = (html, name) => {
    const mount = document.getElementById('mandala')
    const container = document.createElement('div')
    container.setAttribute('class', 'mandala-container')
    container.setAttribute('id', 'mandala_' + name)
    container.appendChild(html)
    mount.appendChild(container)
  }
  
  const createPolygons = (json, itr) => json.nodes.map((n, i) => {
    Check.falsies([n.gon, n.vert])
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

  const domify = (htmlNode, polygon) => polygon.vert.forEach((v, i) => {
    const vertNode = new Vertex(polygon, v, i, polygon.vert.length)
    htmlNode.appendChild(vertNode)
    if(v.child) {
      const gonNode = new Polygon(v.child, debug)
      vertNode.appendChild(gonNode)
      return domify(gonNode, v.child)
    }
  })

  const createMandala$ = (uri) ? get(uri, FileExt.json).then(buildMandala) : buildMandala(json)
  const styleMandala$ = (uri) ? get(uri, FileExt.css).then(Style.injectCss) : () => {}

  return new Promise((resolve, reject) => {
    Promise.all([createMandala$, styleMandala$]).then((values) => {
      resolve(values[0]) // return the created Mandala
    })
  })
})

export default Mandala

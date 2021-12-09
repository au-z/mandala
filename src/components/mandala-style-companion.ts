import {Hybrids, html, property, dispatch} from 'hybrids'
import {cssNodes} from './css/index'
import 'code-tex'
import {debounce} from 'lodash'
import styles from './mandala-style-companion.styl'

const dict: Record<string, string> = {}
const upsertStyles = (key, value) => {
  if(dict[key] != null && dict[key].localeCompare(value) === 0) return
  dict[key] = value

  return Object.values(dict).reduce((sheet, rule) => sheet += rule, '')
}

const ref = (defaultVal) => ({
  get: (host, value = defaultVal) => value,
  set: (host, value) => value,
})

interface MandalaStyleCompanion extends HTMLElement {
  [key: string]: any
}

const setFromDetail = (prop, host, e) => host[prop] = e.detail

export default {
  layer: property(0),
  active: property(false),

  polyBackground: ref('transparent'),
  polyStyle: {
    get: ({layer, polyBackground}) => `mandala-polygon[data-depth='${layer}']::part(polygon) {
  background: ${polyBackground}00;
}`,
    observe: debounce((host, value) => {
      const styleStr = upsertStyles(`${host.layer}-poly`, value)
      dispatch(host, 'style', {detail: styleStr, bubbles: true})
    }, 200),
  },

  vertBackground: ref('#ffffff'),
  vertStyle: {
    get: ({layer, vertBackground}) => `mandala-polygon[data-depth='${layer}']::part(vert) {
  background: ${vertBackground};
}`,
    observe: debounce((host, value) => {
      const styleStr = upsertStyles(`${host.layer}-vert`, value)
      dispatch(host, 'style', {detail: styleStr, bubbles: true})
    }, 200),
  },

  render: ({polyStyle, vertStyle, active}) => html`
    <div class="mandala-style-companion ${active ? 'active' : ''}">
      <node-hsl h="${220}" s="${80}" l="${90}" onchange="${setFromDetail.bind(null, 'polyBackground')}"></node-hsl>
      <node-hsl h="${29}" s="${72}" l="${76}" onchange="${setFromDetail.bind(null, 'vertBackground')}"></node-hsl>

      <div style="display: none;" innerHTML="${polyStyle}"></div>
      <div style="display: none;" innerHTML="${vertStyle}"></div>
    </div>
  `.define({...cssNodes}).style(styles.toString()),
} as Hybrids<MandalaStyleCompanion>

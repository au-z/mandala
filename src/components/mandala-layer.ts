import {html, Hybrids, property} from 'hybrids'
import MandalaPolygon from './mandala-polygon'
const stylePresets = require('./mandala-layer.styl')
import {seqGen} from '../array'

interface MandalaLayer extends HTMLElement {
	[key: string]: any
}

type PolygonTemplate = [number, number, number, number[]?]

const fetchText = (url) => fetch(url).then((r) => {
	if(!r.ok) throw new Error(`Fetch error. ${r.statusText}`)
	return r.text()
})

const defaultStyles = `
mandala-polygon::part(polygon) {border: 1px solid #aaa;}
mandala-polygon::part(vert) {background: #aaa;}
`

const gen = ([n, r, vr, c]: PolygonTemplate, keyframes, childIndex = null, d = 0, debug = false) => html.resolve(
	keyframes.then((k) => html`
		<mandala-polygon slot=${`s${childIndex}`} data-depth="${d}" debug="${debug}"
			n="${n}"
			r="${r}"
			vr="${vr}"
			d="${d}"
			styleKeyframes="${k}"
		>
			${c && seqGen(n).map((i) => gen(c as PolygonTemplate, keyframes, i, d+1))}
		</mandala-polygon>`)
	)

export default {
	name: property('layer.001'),
	preset: property('center'),
	debug: property(false),
	template: property([]),
	styles: defaultStyles,
	styleHref: property(''),
	keyframesHref: property(''),
	style: ({styleHref}) => styleHref.length > 0 && fetchText(styleHref),
	keyframes: ({keyframesHref}) => keyframesHref.length > 0 ? fetchText(keyframesHref) : Promise.resolve(''),

	slot: () => html`<slot></slot>`,

	render: ({name, preset, debug, template, keyframes, slot, styles, styleHref}) => html`
		<link rel="stylesheet" href="${styleHref}"/>
		<div class="mandala-layer preset-${preset}${debug ? 'debug' : ''}" data-name="${name}">
			${template.length <= 0 ? slot : gen(template, keyframes)}
		</div>

		<slot name="style"></slot>

		<style>
${styles}
		</style>
	`.define({MandalaPolygon}).style(stylePresets.toString()),
} as Hybrids<MandalaLayer>
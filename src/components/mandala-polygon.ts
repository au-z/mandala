import {Hybrids, html, property, children, render} from 'hybrids'
import {seqGen} from '../array'

type PolygonTemplate = [number, number, number, number[]?] // [n, r, vr, children]

interface MandalaPolygon extends HTMLElement {
	type: string
	[key: string]: any
}

export default {
	type: 'mandala-polygon',
	d: property(0),
	n: property(3),
	r: property(100),
	vr: property(4),
	debug: property(false),
	styleKeyframes: property(''),

	childPoly: children((hy) => hy.type === 'mandala-polygon'),
	renderChild: ({childPoly}) => childPoly?.[0]?.render || (() => {}),

	vertTemplate: ({n, d, vertStyles, childPoly, renderChild}) => (i) => html`
		<div class="vert v${i} p${n} d${d}" style="${vertStyles(i)}" part="vert">
			<slot name="${`s${i}`}"></slot>
		</div>
	`,
	vertStyles: ({r, n, vr}) => (i) => {
		const theta = 2 * Math.PI / n
		const left = r * Math.sin(i * theta) + r - vr
		const bottom  = r * Math.cos(i * theta) + r - vr
		return {
			width: `${2 * vr}px`,
			height: `${2 * vr}px`,
			borderRadius: `${2 * vr}px`,
			left: `${left}px`,
			bottom: `${bottom}px`,
			transform: `rotate(${360/n * i}deg)`,
		}
	},

	polygonStyles: ({n, r, debug}) => {
		return {
			width: `${2 * r}px`,
			height: `${2 * r}px`,
			borderRadius: `${2 * r}px`,
			transform: `translate(-50%, -50%) rotate(0deg)`,
		}
	},

	render: ({d, n, r, debug, vertTemplate, polygonStyles, styleKeyframes, c}) => html`
		<div class="polygon ${debug ? 'debug' : ''} p${n} d${d}" part="polygon" style="${polygonStyles}">
			${seqGen(n).map(vertTemplate)}
		</div>

		<style>
			.polygon {
				position: absolute;
				left: 50%;
				top: 50%;
			}

			.polygon.d0 {
				left: auto;
				top: auto;
			}

			.polygon.debug {
				border: 1px solid #aaa;
				outline: 1px solid #ddd;
			}

			.vert {
				position: absolute;
			}

			${styleKeyframes}
		</style>
	`,
} as Hybrids<MandalaPolygon>

export {
	PolygonTemplate,
}
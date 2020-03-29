import {Hybrids, html, property, children} from 'hybrids'

interface MandalaPolygon extends HTMLElement {
	type: string
	[key: string]: any
}

const LeafNode = (n, N) => {
	const el = document.createElement('div')
	el.classList.add('leaf')
}

export default {
	type: 'mandala-polygon',
	n: property(3),
	r: property(100),
	debug: property(false),
	childPolygons: children((hy) => hy.type === 'mandala-polygon'),
	leafNodes: ({n}) => {
		let nodes = []
		for(let i = 0; i < n; ++i) {
			nodes.push(LeafNode(i, n, ))
		}
	},
	polygonStyles: ({n, r, debug}) => ({
		width: `${r}px`,
		height: `${r}px`,
		borderRadius: `${r}px`,
	}),
	render: ({debug, polygonStyles, c}) => html`
		<div class="mandala-polygon ${debug ? 'debug' : ''}"
			style="${polygonStyles}">
			${!childPolygons && }
			<slot name="layers"></slot>
		</div>
	`,
} as Hybrids<MandalaPolygon>
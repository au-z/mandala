import {Hybrids, html, property, children, render, dispatch} from 'hybrids'
import styles from './mandala-companion.styl'
import MandalaStyleCompanion from './mandala-style-companion'
import MandalaPolygon from './mandala-polygon'
import mandalaLayer from './mandala-layer'

interface MandalaCompanion extends HTMLElement {
	type: string
	[key: string]: any
}

const addLayer = ({state, setState}, e) => setState((s) => ({
	...s,
	layers: [...s.layers, [3, 60, 4]],
	active: s.layers.length,
}))

const deleteLayer = ({state, setState}, idx) => setState((s) => {
	if(idx === 0) return s
	const newLayers = [...s.layers]
	newLayers.splice(idx, 1)
	return {
		...s,
		layers: newLayers,
		active: newLayers.length - 1,
	}
})

const setLayerValue = ({setState}, e, idx) => setState((s) => ({
	...s,
	layers: s.layers.map((l, i) => {
		if(i === s.active) l[idx] = parseInt(e.target.value)
		return l
	}),
}))

const arrChain = (arr, acc?) => arr.length ? arrChain(arr, acc ? [...arr.pop(), acc] : arr.pop()) : acc

const setActiveLayer = (host, e) => {
	const layer = parseInt(e.target.dataset.layer)
	host.setState((s) => ({...s, active: layer}))
}

const setMandalaStyles = (host, e) => {
	console.log(e.detail)
	host.mandalaStyles = e.detail
	host.mandala.forEach((m) => m.styles = host.mandalaStyles)
}

export default {
	state: {
		get: (host, value) => value || {layers: [[3, 60, 5]], active: 0},
		set: (host, value) => value,
		observe: (host, value) => {
			host.mandala.forEach((m) => m.template = [...host.template])
			dispatch(host, 'change', {detail: {
				template: [...host.template]
			}, bubbles: true})
		},
	},
	setState: (host) => (fn) => host.state = fn(host.state),
	activeLayer: ({state}) => state.layers[state.active],
	template: ({state: {layers}}) => arrChain([...layers]),

	/* children */
	mandala: children(mandalaLayer),
	mandalaStyles: '',

	render: ({state, activeLayer, styleToggle, mandalaStyles}) => html`
		<div>
			<section class="editor">
				<div class="preview">
					<nav>
						<small class="c-active">Layer: ${state.active}</small>
					</nav>
					<mandala-polygon n="${activeLayer[0]}" r="${activeLayer[1]}" vr="${activeLayer[2]}" d="${state.active}" />
				</div>
				<div class="config">
					${state.layers.map((l, i) => html`
						<div class="layer ${state.active === i ? 'active' : ''}" tabindex="${i}" data-layer="${i}" onclick="${setActiveLayer}">
							${l.map((v, idx) => html`
								<input type="number" size="5" min="1" step="1" value="${v}" data-layer="${i}"
									onfocus="${setActiveLayer}"
									onchange="${(host, e) => setLayerValue(host, e, idx)}"/>
							`)}
							<button class="delete" title="Delete"
								onclick="${(host) => deleteLayer(host, i)}">&#x1F5D9;</button>
						</div>
					`)}
					<button class="add" onclick="${addLayer}">Add Layer</button>
				</div>
				<hr/>
				<mandala-style-companion layer="${state.active}" active="${styleToggle}"
					onstyle="${setMandalaStyles}"/>
			</section>
			<slot></slot>
		</div>
		<style>
${mandalaStyles}
		</style>
	`.define({MandalaPolygon, MandalaStyleCompanion}).style(styles.toString())
} as Hybrids<MandalaCompanion>

// chain=(n,p)=>n.length?chain(n,p?[...n.pop(),p]:n.pop()):p
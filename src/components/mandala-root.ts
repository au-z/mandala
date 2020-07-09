import {html, children, Hybrids, property} from 'hybrids'
const styles = require('./style/mandala-root.styl')
import MandalaLayer from 'src/components/mandala-layer'

interface MandalaRoot extends HTMLElement {
	[key: string]: any
}

export default {
	debug: property(false),
	rootStyles: ({debug}) => ({
		outline: debug ? '1px solid #aaa' : 'none',
	}),
	layers: children(MandalaLayer),
	render: ({layers, rootStyles}) => html`
		<div class="mandala-root" style="${rootStyles}">
			<slot></slot>
		</div>
	`.style(styles.toString()),
} as Hybrids<MandalaRoot>
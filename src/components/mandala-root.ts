import {html, children, Hybrids} from 'hybrids'
const styles = require('./style/mandala-root.styl')
import MandalaLayer from 'src/components/mandala-layer'

interface MandalaRoot extends HTMLElement {
	[key: string]: any
}

export default {
	layers: children(MandalaLayer),
	render: ({layers}) => html`
		<div class="mandala-root">
			<slot name="layers"></slot>
		</div>
	`.style(styles.toString()),
} as Hybrids<MandalaRoot>
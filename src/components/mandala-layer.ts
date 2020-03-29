import {html, children, Hybrids} from 'hybrids'

interface MandalaLayer extends HTMLElement {
	[key: string]: any
}

export default {
	render: () => html`
		<div>
			<slot></slot>
		</div>
	`,
} as Hybrids<MandalaLayer>
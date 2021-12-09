import { property, html, dispatch } from 'hybrids'

const onChange = (host, e) => {
	let val = host.type === 'number' ? parseInt(e.target.value) : e.target.value
	if(host.type === 'number' && host.wrap)
	val = (val === host.max) ? host.min + 1 : (val === host.min) ? host.max - 1 : val
	dispatch(host, 'change', {detail: val, bubbles: true})
}

export default {
	value: property(''),
	min: property(0),
	max: property(0),
	wrap: property(false),
	type: property('number'),
	parsed: ({value, type}) => {
		switch(type.toUpperCase()) {
			case 'NUMBER': return parseFloat(value)
			case 'TEXT': return value
		}
	},
	render: ({type, parsed, min, max}) => html`<input type="${type}" value="${parsed}"
		min="${min}" max="${max}"
		onchange="${onChange}"/>

		<style>
			textarea, select, input, button { outline: none; }
			input, textarea {
				width: 100%;
				border: none;
				background: none;
				border-bottom: 2px solid #777;
				color: white;
				-moz-appearance: textfield;
				font-family: 'Consolas', monospace;
				text-transform: uppercase;
				font-size: 0.75rem;
				line-height: 1.1rem;
				letter-spacing: 0.1em;
				font-weight: bold;
			}
			input:focus, textarea:focus {
				border-bottom-color: #fa4;
			}
			input::-webkit-outer-spin-button,
			input::-webkit-inner-spin-button {
				-webkit-appearance: none;
				margin: 0;
			}
		</style>
	`
}
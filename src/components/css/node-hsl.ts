import { property, html, dispatch } from 'hybrids'
import MdInput from './md-input'
import ColorSwatch from './color-swatch'
import useColorProperties from './useColorProperties'
const {hsl_rgb, rgb_hex} = useColorProperties()

import style from './node-hsl.styl'

const ref = (defaultVal) => ({
	...property(defaultVal),
	set: (host, value) => value,
})

export default {
	h: {
		...ref(190),
		observe: (host, value) => dispatch(host, 'change', {detail: host.hex, bubbles: true}),
	},
	s: {
		...ref(100),
		observe: (host, value) => dispatch(host, 'change', {detail: host.hex, bubbles: true}),
	},
	l: {
		...ref(50),
		observe: (host, value) => dispatch(host, 'change', {detail: host.hex, bubbles: true}),
	},

	hex: ({h, s, l}) => rgb_hex(hsl_rgb([h / 360, s / 100, l / 100])),

	render: ({h, s, l, hex}) => html`<div class="node-hsl">
		<form>
			<md-input type="number" value="${h}" min="-1" max="361" wrap title="Hue"
				onchange="${(host, e) => host.h = parseInt(e.detail)}"></md-input>
			<md-input type="number" value="${s}" min="-1" max="101" wrap title="Saturation"
				onchange="${(host, e) => host.s = parseInt(e.detail)}"></md-input>
			<md-input type="number" value="${l}" min="-1" max="101" wrap title="Luminance"
				onchange="${(host, e) => host.l = parseInt(e.detail)}"></md-input>
		</form>
		<div class="swatch">
			<color-swatch h=${h} s=${s} l=${l} />
		</div>
	</div>

	<style>
	*,*:after,*:before {box-sizing: border-box}

	div.node-hsl {
		background: #333;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		max-width: 110px;
		box-shadow: 0 2px 6px 0 rgba(40, 40, 40, 0.3)
	}
	form {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-gap: 6px;
		padding: 4px 8px;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
	}
	div.swatch {
		height: 60px;
	}
	</style>
	`.define({MdInput, ColorSwatch}).style(style.toString())
}
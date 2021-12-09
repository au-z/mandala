import { property, html } from "hybrids";
import useColorProperties from './useColorProperties'
const {hsl_rgb, rgb_hex} = useColorProperties()

export default {
	h: property(0),
	s: property(0),
	l: property(0),
	r: property(0),
	g: property(0),
	b: property(0),
	hex: property('#000000'),

	color: ({h, s, l, r, g, b, hex}) => {
		if(l != 0) {
			hex = rgb_hex(hsl_rgb([h, s, l]))
			return `hsl(${h}, ${s}%, ${l}%)`
		} else if (r != 0 && g != 0 && b != 0) {
			hex = rgb_hex([r, g, b])
			return `rgb(${r}, ${g}, ${b})`
		} else {
			return hex
		}
	},

	calcHex: ({h, s, l}) => rgb_hex(hsl_rgb([h / 360, s / 100, l / 100])),

	textColor: ({h, s, l, r, g, b, hex}) => {
		if(l != 0) {
			return `hsl(${h}, ${s / 2}%, ${(l + 60) % 100}%)`
		} else {
			return '#353638'
		}
	},

	render: ({calcHex, color, textColor}) => html`
		<div style="width: 100%; height: 100%; background-color: ${color}; color: ${textColor};">
			<span>${calcHex}</span>
		</div>
		<style>
		div {
			display: flex;
			justify-content: center;
			align-items: center;
		}
		span {
			font-size: 1.1rem;
			opacity: 0.4;
			letter-spacing: 0.15rem;
		}
		</style>
	`,
}
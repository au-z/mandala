import { define, html, Hybrids } from "hybrids";
import {range} from './array'
import { reflect } from "./hybrids-helpers";

const layerStyles = (R, h) => {
	return {
		position: h === 0 ? 'relative' : 'absolute',
		width: `${2 * R}px`,
		height: `${2 * R}px`,
		borderRadius: `${R}px`
	};
};

const nodeStyles = (R, N, r, n) => {
	const theta = (2 * Math.PI) / N;
	const left = R * Math.sin(n * theta) + R - r;
	const bottom = R * Math.cos(n * theta) + R - r;

	return {
		left: `${left}px`,
		bottom: `${bottom}px`,
		width: `${2 * r}px`,
		height: `${2 * r}px`,
		borderRadius: `${r}px`,
	};
};

export interface MandalaLayer extends HTMLElement {
	exportparts: string,
	height: number,
	nested: number,
	name: string,
	nodes: [number, number, number, Array<number>?][],
	tag: string;
	template: [number, number, number, Array<number>?],
}

const MandalaLayer: Hybrids<MandalaLayer> = {
	tag: "mandala-layer",
	template: [], // [R, N, r, [child]?],
	name: 'm',
	nested: ({template}) => {
		let templateCopy: any = {...template}
		let h = 0;
		while((templateCopy = templateCopy[3]) && h < 10) h++
		return h
	},
	height: 0,
	nodes: ({ template }) => range(template[1] || 0).map((n) => template[3] ?? []),
	render: ({ template, name, nodes, height }) => html`
		<div class="layer" part="${`${name}-layer-${height}`}"
			style="${layerStyles(template[0], height)}">
			${nodes.map((node, n) => html`
				<div class="node" part="${`${name}-node-${height}`}"
					style="${nodeStyles(template[0], template[1], template[2], n)}">
					<mandala-layer name="${name}" template="${node}" height="${height + 1}"></mandala-layer>
				</div>`
			)}
		</div>

		<style>
			@keyframes spinCW {
				100% {transform: translate(-50%, -50%) rotate(360deg)}
			}

			@keyframes spinCCW {
				100% {transform: translate(-50%, -50%) rotate(-360deg)}
			}

			:host {
				width: 0;
				height: 0;
			}

			.layer {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}

			.node {
				position: absolute;
				display: flex;
				justify-content: center;
				align-items: center;
				background: black;
			}
		</style>`,
	exportparts: reflect({
		get: ({ name, height, nested }) => range(height, height + nested + 1)
			.map((i) => [`${name}-layer-${i}`, `${name}-node-${i}`])
			.flat().join(","),
	}),
};

define('mandala-layer', MandalaLayer);
export default MandalaLayer;

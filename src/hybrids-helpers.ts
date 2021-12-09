import { Descriptor } from "hybrids";

export function reflect<E extends HTMLElement>(d: Descriptor<E>): Descriptor<E> {
	let attrName;
	return {
		get: d.get,
		set: d.set,
		connect: (host, propName, invalidate) => {
			attrName = propName.replace(/([A-Z])/g, '-$1').toLowerCase()
			return d.connect?.(host, propName, invalidate)
		},
		observe: (host, val, last) => {
			host.setAttribute(attrName, typeof val === 'object' ? JSON.stringify(val) : val)
			return d.observe?.(host, val, last)
		}
	}
}
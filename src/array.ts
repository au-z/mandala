const seqGen = (N) => Array.apply(null, {length: N}).map(Number.call, Number)

export {
	seqGen,
}
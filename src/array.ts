export const range = (a: number, b?: number) => {
	if(a != null && b == null) {
		b = a
		a = 0
	}
	return [...Array(b - a).keys()].map((v) => v + a)
}

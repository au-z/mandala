# mandala-js
> Create complex geometric animations with simple Web Components. 

Mandala uses a simple template syntax for building nested geometric pattens in the browser.

## Getting Started
```bash
npm i mandala
```

## Usage
Import the `MandalaLayer` web component.
```ts
import {MandalaLayer} from 'mandala-js'
```

Use the Web component in your app.

```html
<mandala-layer name="m1" template="[30, 5, 5, [30, 3, 2]]"></mandala-layer>
```

### Template
A template recursively specifies 4 things about a mandala layer.
The `Child Layer` is an optional fourth element containing the structure of the nested layer.

```
[Layer Radius, Node Count, Node Radius, [Child Layer]]
```

### Styling
`mandala-js` uses ::part styling to expose styles from deeply nested shadow roots to the light DOM.

Part identifiers follow the following specification: 
```
{name}-(node|layer)-{depth}
```
For example:
```css
mandala-layer::part(m-layer-0) {
  /* styles the root layer of a mandala with the default name */
}

mandala-layer::part(myMandala-node-3) {
  /* styles the 4th level nodes of a mandala named "myMandala" */
}
```

Combinations of these selectors can lead to some interesting shapes.

### Animations
CSS animations are not current transcluded through the shadow DOM.
This spec may change so this is an evolving area of the API.

Two simple animations are provided:

- spinCW: clockwise spin
- spinCCW: counter-clockwise spin


## Contributing

Contributions welcome!

## License

MIT License

Copyright (c) [2021] [Austin Martin]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
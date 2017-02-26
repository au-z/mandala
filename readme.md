# Mandala

Create complex geometric animations in pure CSS with a few lines of JSON. 
Mandala does away with laborious recursive markup and standardizes a flexible syntax oriented towards building nested geometric pattens in the browser. 

## Installation

Mandala comes ready to tinker. When you're ready, port the dist folder to your own web projects.

For those looking to play:

1.  Clone it!
2.  `npm install`
3.  `npm start`

## Usage

Once starting lite-server with `npm start`, browse to localhost:3000 to begin.

*Disclaimer: Mandala is more 'art project' than 'robust code-base.' It's designed for the enlightened, modern browser. Vendor prefixed CSS and polyfills are not planned. If you're looking the next best framework to do some crazy IE8 native CSS animations, your princess is in another castle.*

*Note: Mandala uses VueJS for a small management component. However, the dist directory is dependency-less!*

Mandala template files are located in the /effects folder. Each mandala is described by a .json file. Matching .css files provide extra effect-specific styles and animations.
The examples in the project should get you off the ground but here's a primer on a basic Mandala design file.

JSON files look like this:
```json
{
  "name": "E1",
  "debug": false,
  "gon": {
    "root": { "vertCount": 3, "radius" : 20 }
  },
  "vert": {
    "p1": { "radius" : 4 },
    "p2": { "radius" : 2 }
  },
  "nodes": [
    { "gon": "root", "vert": "p1", "link": 1},
    { "gon": "root", "vert": "p2"}
  ]
}
```

__Name:__ Give the effect a name.

__Debug:__ Specifies whether to render a thin outline and border around your polygons and verts for easy debugging. 

__Gon:__ The Gon collection describes the various polygons available. vertCount signifies the number of vertices associated with each polygon.

__Vert:__ The vert collection describes the types of vertices to describe the gon. For now, all verts are circular. However, this can be overridden with some custom CSS.

__Nodes:__ Nodes contains a collection of objects that describe each level of the resulting DOM tree.
For now, each level must consist of homogeneous particles, hence the single "vert" property. 
The "link" property acts as a pointer to direct the Mandala parser to any child nodes. Be careful not to add any loops :).
The example design (above) renders to this:

```html
<div class="E1 gon depth_0">
  <div class="E1 vert depth_0 n_0">
    <div class="E1 gon depth_1">
      <div class="E1 vert depth_1 n_0"></div>
      <div class="E1 vert depth_1 n_1"></div>
      <div class="E1 vert depth_1 n_2"></div>
    </div>
  </div>
  <div class="E1 vert depth_0 n_1">
    <div class="E1 gon depth_1">
      <div class="E1 vert depth_1 n_0"></div>
      <div class="E1 vert depth_1 n_1"></div>
      <div class="E1 vert depth_1 n_2"></div>
    </div>
  </div>
  <div class="E1 vert depth_0 n_2">
    <div class="E1 gon depth_1">
      <div class="E1 vert depth_1 n_0"></div>
      <div class="E1 vert depth_1 n_1"></div>
      <div class="E1 vert depth_1 n_2"></div>
    </div>
  </div>
</div>
```

The design section makes specifying complex nestings of thousands of divs trivial. Neat, huh?

More? 
Yes. Coming.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT License

Copyright (c) [2016] [Austin Martin]

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
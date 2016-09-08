# Pythagoras

Create complex geometric animations in pure CSS with a few lines of JSON. 
Pythagoras does away with laborious recursive markup and standardizes a flexible syntax oriented towards building nested geometric pattens in the browser. 

## Installation

Pythagoras comes ready to tinker. When you're ready, port the dist folder to your own web projects.

For those looking to play:

1.  Clone it!
2.  `npm install`
3.  `npm start`

## Usage

Once starting lite-server with `npm start`, browse to localhost:3000 to begin.

*Disclaimer: Pythagoras is more art project than code-base. It's designed for the enlightened, modern browser. Vendor prefixed CSS and polyfills are not planned. If you're looking the next best framework to do some crazy IE8 native CSS animations, look no further.*

*Note: Pythagoras uses Vue.JS for data binding for ease of use and includes a Jquery CDN link for easy DOM querying but the dist directory is dependency-less!*

Pythagoras design files are located in the effects folder. Each effect is described by a .json file. Matching .css files provide extra effect-specific styles.
The examples there should get you off the ground but here's a primer on a basic Pythagoras design file.

JSON files look like this:
```json
{
  "name": "Sir Gallahad",
  "shapes": {
    "tri-20": { "attrs": ["tri", "a-20"], "particleCount": 3 }
  },
  "particleIterators": ["A", "B", "C"],
  "particles": {
    "circle-10": { "attrs": ["circle", "r-10"] }
  },
  "design": {
    "L0": { "shape": "tri-20", "particles": "circle-10", "link": "L1"},
    "L1": { "shape": "tri-20", "particles": "circle-10"}
  }
}
```

__Name:__ Give the effect a name.

__Shapes:__ Shapes describe the different shapes available. Attrs should be a list of CSS classes to assign to the resulting div. Inspect the sass folder for a list of shape classes. Better yet, dive in and experiment! 
Particle count signifies the number of vertices associated with each shape.

__Particles:__ Describes the types of divs to position centered on each shape's vertex. Attrs signify a list of CSS classes to assign to the resulting div.

__Particle Iterators:__ A list of class names to assign to each particle for each shape. In this case, no shape exceeds three vertices so 'A', 'B', and 'C' work fine. 
...*Note: this may become deprecated soon. Particle Iterators must be within [A-Z] and will be moving away from design configuration to the node tree building step.*

__Design:__ This object is the key to Pythagoras. It contains a map of objects that describe each level of the resulting DOM tree. 
For now, each level must consist of homogeneous particles, hence the single "particles" property. 
The "link" property specifies which shape each child in a particular level will contain.
The example design (above) renders to this:

```html
<div id="el-0" class="L0 shape root tri a-20">
  <div id="el-1" class="L0 A circle r-10">
    <div id="el-2" class="L1 shape  tri a-20">
      <div id="el-3" class="L1 A circle r-10"></div>
      <div id="el-4" class="L1 B circle r-10"></div>
      <div id="el-5" class="L1 C circle r-10"></div>
    </div>
  </div>
  <div id="el-6" class="L0 B circle r-10">
    <div id="el-7" class="L1 shape  tri a-20">
      <div id="el-8" class="L1 A circle r-10"></div>
      <div id="el-9" class="L1 B circle r-10"></div>
      <div id="el-10" class="L1 C circle r-10"></div>
    </div>
  </div>
  <div id="el-11" class="L0 C circle r-10">
    <div id="el-12" class="L1 shape  tri a-20">
      <div id="el-13" class="L1 A circle r-10"></div>
      <div id="el-14" class="L1 B circle r-10"></div>
      <div id="el-15" class="L1 C circle r-10"></div>
    </div>
  </div>
</div>
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
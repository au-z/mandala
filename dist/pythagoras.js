(function(obj, styleTitle) {
  const OBJ = _mandalaEffects
  const STYLE_TITLE = 'mandala'

  if(typeof Promise == 'undefined' && Promise.toString().indexOf('[native code]') == -1) {
    throw new Error('Sorry, promises are not supported by your browser. :( Try another browser.');
  }

  if(!String.prototype.format) {
    String.prototype.format = function(...a) {
      let args = a;
      return this.replace(/{(\d+)}/g, (match, number) => {
        return typeof args[number] != 'undefined' ? args[number] : match;
      });
    };
  }

  load(obj || OBJ);

  /**
   * Create a new Mandala
   * @param {string} uri relative path of the json template
   */
  function Mandala(uri) {
    _m = this;
    _m.debug = null;
    _m.html = null;
    _m.gon = {};
    _m.styleDict = {};

    /**
     * @param {object} gon A gon object
     * @return {HTMLDivElement} A gon div
     */
    let GonElement = function(gon) {
      let gonEl = document.createElement('div');
      gonEl.setAttribute('class', 
        'gon depth_' + gon.depth + ((_m.debug) ? ' debug' : '')
      );
      return gonEl;
    };

    /**
     * @param {object} gon A gon object
     * @param {object} vert A vert object
     * @param {number} n the index of the vert for the gon
     * @param {number} N the number of total verts for the gon
     * @return {HTMLDivElement} A vert div
     */
    let VertElement = function(gon, vert, n, N) {
      let vertEl = document.createElement('div');
      vertEl.setAttribute('class',
        'vert depth_' + gon.depth + ((_m.debug) ? ' debug' : ''));
      let gonR = gon.gon.radius;
      let vertR = vert.radius;
      let theta = (2 * Math.PI / N);
      var left = gonR * Math.sin(n * theta) + gonR - vertR;
      var bottom = gonR * Math.cos(n * theta) + gonR - vertR;
      vertEl.style.cssText = `left: {0}px; bottom: {1}px;`.format(left, bottom);
      return vertEl;
    };

    // Get the resources and render them
    uri && get(uri, '.json')
      .then((json) => assembleAndRenderMandala(json));
    uri && get(uri, '.css')
      .then((css) => injectCss(css));

    /**
     * @param {string} json the Mandala template
     */
    function assembleAndRenderMandala(json) {
      _m.json = json;
      assembleGons(0);
      console.log(_m.gon);
      linkGons(_m.gon[0]);

      _m.html = new GonElement(_m.gon[0]);
      injectGonStyles(_m.gon[0]);

      _m.html = toHtml(_m.html, _m.gon[0]);

      let mount = document.getElementById('mandala');
      mount.appendChild(_m.html);
    }

    /**
     * @param {HTMLDivElement} node the element of the DOM to modify
     * @param {object} gon the gon to parse and render
     * @return {HTMLDivElement} the final mandala element
     */
    function toHtml(node, gon) {
      if(unstyled(gon)) injectGonStyles(gon);
      gon.vert.forEach((v, index) => {
        // if(index == 0) styleVert(gon, v, index, gon.vert.length);
        let vertEl = new VertElement(gon, v, index, gon.vert.length);
        node.appendChild(vertEl);

        if(v.child) {
          let gonEl = new GonElement(v.child);
          vertEl.appendChild(gonEl);

          return toHtml(gonEl, v.child);
        }
      });
      return node;
    }

    /**
     * @param {object} gon the gon object to be styled including the verts
     */
    function injectGonStyles(gon) {
      let radius = gon.gon.radius;
      let diameter = 2 * radius;
      let margin = -1 * (radius - gon.parentVertRadius);

      let gonSelector = '.gon.depth_' + gon.depth;
      injectCss(gonSelector + `
        {
          width: {0}px;
          height: {0}px;
          border-radius: {0}px;
          margin-left: {1}px;
          margin-top: {1}px;
        }\n`.format(diameter, margin));
      _m.styleDict[gonSelector] = true;

      if(gon.gon.vertCount > 0 && gon.vert[0]) {
        let vertD = 2 * gon.vert[0].radius;
        let vertSelector = '.vert.depth_' + gon.depth;
        injectCss(vertSelector + `
          {
            width: {0}px;
            height: {0}px;
            border-radius: {0}px;
          }\n`.format(vertD));
        _m.styleDict[vertSelector] = true;
      }
    }

    /**
     * @param {object} gon checks if the gon has its common styles injected
     * @return {bool} True if the gon is unstyled
     */
    function unstyled(gon) {
      return !_m.styleDict['.gon.depth_' + gon.depth] === true;
    }

    /**
     * Assembles each node shape from the gon and vert objects of the template
     * @param {number} itr the index of the first node to begin assembly
     * @return {number} the number of iterations processed
     */
    function assembleGons(itr) {
      node = _m.json.nodes[itr];
      _m.debug = _m.json.debug || false;
      validateNode(node);

      _m.gon[itr] = {
        depth: itr,
        gon: _m.json.gon[node.gon],
        parentVertRadius: 0,
        vert: [],
      };

      for(let i = 0; i < _m.json.gon[node.gon].vertCount; i++) {
        _m.gon[itr].vert.push(_m.json.vert[node.vert]);
      }

      if(!node.link) return itr;
      return assembleGons(node.link);
    }

    /**
     * @param {object} node The root shape to which child shapes are linked
     */
    function linkGons(node) {
      node.vert.forEach((v) => {
        if(node.depth < Object.keys(_m.gon).length - 1) {
          v.child = _m.gon[node.depth + 1];
          if(v.child) v.child.parentVertRadius = v.radius;
          return linkGons(_m.gon[node.depth + 1]);
        }
      });
    }

    /**
     * @param {string} css The styles to be added to the stylesheet
     */
    function injectCss(css) {
      let sheet = findStyleSheet(styleTitle || STYLE_TITLE);
      sheet.innerHTML += css;
    }

    /**
     * @param {string} title The title of the <style> tag to find
     * @return {CSSStyleSheet} The found or created style sheet
     */
    function findStyleSheet(title) {
      styleEl = document.querySelector('style#' + (styleTitle || STYLE_TITLE));
      if(!styleEl) styleEl = createStyleElement(title);
      return styleEl;

      function createStyleElement(title) {
        var styleEl = document.createElement('style');
        styleEl.setAttribute('id', styleTitle || STYLE_TITLE);
        document.body.appendChild(styleEl);
        return styleEl;
      }
    }

    /**
     * Throws an error if the node is not properly supported in the template.
     * @param {object} node the node of the template to validate
     */
    function validateNode(node) {
      let error = !node.gon || !node.vert;
      error &= !_m.json.gon[node.gon];
      error &= !_m.json.vert[node.vert];
      if(error) throw new Error(`Error: gon or particle not defined on node.`);
    }

    /**
     * XMLHttpRequests the specified resource in JSON or text.
     * @param {string} uri a relative path
     * @param {string} ext a file extension
     * @return {Promise} the promised resource
     */
    function get(uri, ext) {
      return new Promise((resolve, reject) => {
        let http = new XMLHttpRequest();
        http.responseType = (ext == '.json') ? 'json' : 'text';
        http.open('GET', uri + ext);
        http.onload = () => {
          (http.status === 200 && http.response !== null) ?
            resolve(http.response) : reject(Error(http.statusText));
        };
        http.onerror = () => reject(Error('Network error.'));
        http.send();
      });
    }
  };

  /**
   * loads a number of Mandala effects
   * @param {object} effects an object describing the effects.
   */
  function load(effects) {
    effects.map((e) => {
      e = new Mandala(e.uri);
    });
  }
})();

var Pythagoras = (function() {
  var SHAPE_TAG = '<div id="el-{0}" class="{1}" style="{2}">{3}';
  var SHAPE_CSS = 'width: {0}px; height: {1}px; border-radius: {2}px; margin-left: {3}px; margin-top: {4}px';
  var VERT_TAG = '<div id="el-{0}" class="{1}" style="{2}">{3}';
  var VERT_CSS = 'left: {0}px; bottom: {1}px; width: {2}px; height: {3}px; border-radius: {4}px;';

  if(typeof Promise == 'undefined' && Promise.toString().indexOf('[native code]') == -1){
      throw new Error('Sorry, promises are not supported by your browser. :( Try another browser.');
  }

  if (!String.prototype.format) {
    String.prototype.format = function() {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
      });
    };
  }

  function load(effects) {
    effects.map(function(e) {
      e.css = null;
      e.plan = null;
      e.tree = {};
      e.html= '{0}';
      e.uri && get(e.uri, 'json')
        .then(function(json){ toTree(e, json) })
        .then(function(plan){ toHtml(e) });
      e.styleUri && get(e.styleUri, 'text')
        .then(function(css){ e.css = css; });
    });
    return effects;
  }

  function get(url, responseType){
    return new Promise(function(resolve, reject){
      var http = new XMLHttpRequest();
      http.responseType = responseType;
      http.open('GET', url);
      http.onload = function(){
        (http.status === 200 && http.response !== null) ?
          resolve(http.response) : reject(Error(http.statusText));
      };
      http.onerror = function(){ reject(Error('Network error.')); };
      http.send();
    });
  }

  function toTree(e, json){
    e.plan = json;
    e.tree['L0'] = recurseDesign(e, e.tree['L0'], json.design['L0'], 'L0', true);
  }

  function toHtml(e){
    recurseTree(e, { node: e.tree['L0'], id: 0});
    e.html = e.html.replace('{0}', '');
  }

  function recurseDesign(e, treeNode, designNode, link, isRoot){
    isRoot = isRoot || false;
    var shapeKey = designNode.shape;
    var shapeValue = e.plan.shapes[shapeKey];
    var particleKey = designNode.particles;
    var particleValue = e.plan.particles[particleKey];
    if(!shapeKey){ throw new Error('Could not find shape key in provided effect design.')};
    if(!shapeValue){ throw new Error('Could not find shape value in provided effect design.')};
    if(!particleKey){ throw new Error('Could not find particle key in provided effect design.')};
    if(!particleValue){ throw new Error('Could not find particle value in provided effect design.')};

    treeNode = { shape: shapeKey, classes: [link, 'shape', isRoot ? 'root' : null].concat(shapeValue.classes), args: shapeValue.args, particles: [] };
    for(var i = 0; i < shapeValue.particleCount; i++){
      treeNode.particles.push({ type: particleKey, classes: ['vert', link], args: particleValue.args, child: null });
      treeNode.particles[i].classes = treeNode.particles[i].classes.concat(particleValue.classes);
      if(designNode.link && designNode.link !== designNode){
        treeNode.particles[i].child = recurseDesign(e, treeNode.particles[i].child, e.plan.design[designNode.link], designNode.link);
      }
    }
    return treeNode;
  }

  function recurseTree(e, tree, parentRadius){
    var shapeStyle = styleShape(tree.node, parentRadius || 0);
    var shapeTag = SHAPE_TAG.format(tree.id++, tree.node.classes.join(' '), shapeStyle, (tree.node.particles ? '{0}</div>' : '</div>{0}'));
    e.html = e.html.format(shapeTag);
    if(tree.node.particles){
      for(var i = 0; i < tree.node.particles.length; i++){
        var nodePosition = styleVert(tree.node, tree.node.particles[i], i, tree.node.particles.length);
        var particleTag = VERT_TAG.format(tree.id++, tree.node.particles[i].classes.join(' '), nodePosition, (tree.node.particles[i].child ? '{0}</div>' : '</div>{0}'));
        e.html = e.html.format(particleTag);
        if(tree.node.particles[i].child){
          tree.id = recurseTree(e, { node: tree.node.particles[i].child, id: tree.id }, tree.node.particles[i].args.radius);
        }
      }
      e.html = e.html.replace('{0}</div>', '</div></div>{0}');
    }
    return tree.id;
  }

  // var SHAPE_TAG = '<div id="el-{0}" class="{1}" style="{2}">{3}';
  // var SHAPE_CSS = 'width: {0}px; height: {1}px; border-radius: {2}px; margin-left: {3}px; margin-top: {4}px';
  // var VERT_TAG = '<div id="el-{0}" class="{1}" style="{2}">{3}';
  // var VERT_CSS = 'left: {0}px; bottom: {1}px; width: {2}px; height: {3}px; border-radius: {4}px;';

  function styleShape(shape, parentRadius){
    var sr = shape.args.radius;
    var sd = 2 * sr;
    var marginAdjust = -1 * (sr - parentRadius);
    return SHAPE_CSS.format(sd, sd, sd, marginAdjust, marginAdjust);
  }

  function styleVert(shape, vert, n, N){
    var sr = shape.args.radius;
    var vr = vert.args.radius;
    var vd = 2 * vr;
    var theta = (2 * Math.PI / N);
    var css_left = sr * Math.sin(n *theta) + sr - vr;
    var css_bottom = sr * Math.cos(n * theta) + sr - vr;
    return VERT_CSS.format(css_left, css_bottom, vd, vd, vd);
  }

  return{
    load: load,
  }
});
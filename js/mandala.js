(function(obj, styleTitle) {
  const OBJ = _mandalaEffects;
  const STYLE_TITLE = 'mandala';

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

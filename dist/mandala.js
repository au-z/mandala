const MandalaUI = (function() {
  _mandalas = null;
  if(typeof Promise == 'undefined' && Promise.toString().indexOf('[native code]') == -1) {
    throw new Error('Sorry, promises are not supported by your browser. :( Try another browser.');
  }

  function detectMandalas() {
    if(Mandalas) console.debug('Detected ' + Mandalas.created.length + ' mandalas.');
    return Promise.all(Mandalas.created);
  }

  return {
    detect: detectMandalas,
  };
})();

new Vue({
  el: '#mandala-ui',
  data: {
    mandalas: null,
  },
  watch: {
    mandalas: {
      deep: true,
      handler: function() {
        this.refreshMandalas();
      },
    },
  },
  created: function() {
    if(MandalaUI) this.templateMandala();
  },
  methods: {
    templateMandala: function() {
      MandalaUI.detect().then((mandalas) => this.mandalas = mandalas );
    },
    refreshMandalas: _.debounce(function() {
      this.mandalas.forEach((m) => {
        Mandalas.erase(m.name);
        Mandalas.create(m);
      });
    }, 300),
  },
});

const Mandalas = (function(obj, styleTitle) {
  const OBJ = _mandalaEffects;
  const STYLE_TITLE = 'mandala-css';
  const effects = obj || OBJ;
  let created = [];

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

  /**
   * Create a new Mandala from either a uri template file or json data
   * @param {string} uri relative path of the json template
   * @param {string} json json data to create effect with
   */
  function Mandala(uri, json) {
    let _name; // If not found in template json, a random string is used.
    let _debug; // Enables special debug styling to view layouts.
    let _json; // Tne template effect file.
    let _gon; // Each (poly)gon. gon[0] becomes the final mandala tree.
    let _html; // The final appended html.
    let _styleDict; // A dictionary of style rule keys that were injected.

    /**
     * @param {string} json the Mandala template
     */
    function renderMandala(json) {
      _json = null;
      _gon = {};
      _html = null;
      _styleDict = {};
      _json = json;
      _debug = _json.debug || false;
      if(!_json.name) _json.name = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
      _name = _json.name;

      assembleGons(0);
      linkGons(_gon[0]);

      _html = new GonElement(_gon[0]);
      styleGon(_gon[0]);
      _html = toHtml(_html, _gon[0]);

      let mount = document.getElementById('mandala');
      let container = document.createElement('div');
      container.setAttribute('class', 'mandala-container');
      container.setAttribute('id', 'mandala_' + _name);
      container.appendChild(_html);
      mount.appendChild(container);
      return json;
    }

    /**
     * @param {object} gon A gon object
     * @return {HTMLDivElement} A gon div
     */
    let GonElement = function(gon) {
      let gonEl = document.createElement('div');
      gonEl.setAttribute('class', 
        _name + ' gon depth_' + gon.depth + ((_debug) ? ' debug' : '')
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
        _name + ' vert depth_' + gon.depth + ((_debug) ? ' debug' : '' + ' n_' + n));
      let gonR = gon.gon.radius;
      let vertR = vert.radius;
      let theta = (2 * Math.PI / N);
      var left = gonR * Math.sin(n * theta) + gonR - vertR;
      var bottom = gonR * Math.cos(n * theta) + gonR - vertR;
      vertEl.style.cssText = `left: {0}px; bottom: {1}px;`.format(left, bottom);
      return vertEl;
    };

    /**
     * @param {HTMLDivElement} node the element of the DOM to modify
     * @param {object} gon the gon to parse and render
     * @return {HTMLDivElement} the final mandala element
     */
    function toHtml(node, gon) {
      if(unstyled(gon)) styleGon(gon);
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

      function unstyled(gon) {
        return !_styleDict['.gon.depth_' + gon.depth] === true;
      }

      return node;
    }

    /**
     * @param {object} gon the gon object to be styled including the verts
     */
    function styleGon(gon) {
      let radius = gon.gon.radius;
      let diameter = 2 * radius;
      let margin = -1 * (radius - gon.parentVertRadius);

      let gonSelector = '.' + _name + '.gon.depth_' + gon.depth;
      (!_styleDict[gonSelector]) && injectCss(gonSelector + `
        {
          width: {0}px;
          height: {0}px;
          border-radius: {0}px;
          margin-left: {1}px;
          margin-top: {1}px;
        }\n`.format(diameter, margin));
      _styleDict[gonSelector] = true;

      let vertD = 2 * gon.vert[0].radius;
      let vertSelector = '.' + _name + '.vert.depth_' + gon.depth;
      (!_styleDict[vertSelector]) && injectCss(vertSelector + `
        {
          width: {0}px;
          height: {0}px;
          border-radius: {0}px;
        }\n`.format(vertD));
      _styleDict[vertSelector] = true;
    }

    /**
     * Assembles each node shape from the gon and vert objects of the template
     * @param {number} itr the index of the first node to begin assembly
     * @return {number} the number of iterations processed
     */
    function assembleGons(itr) {
      node = _json.nodes[itr];
      let error = !node.gon || !node.vert;
      error &= !_json.gon[node.gon];
      error &= !_json.vert[node.vert];
      if(error) throw new Error(`Gon or particle not found in template.`);

      _gon[itr] = {
        depth: itr,
        gon: _json.gon[node.gon],
        parentVertRadius: 0,
        vert: [],
      };

      for(let i = 0; i < _json.gon[node.gon].vertCount; i++) {
        _gon[itr].vert.push(copy(_json.vert[node.vert]));
      }

      if(!node.link) return itr;
      if(node.link == itr) throw new Error('Cannot link to self!');
      return assembleGons(node.link);
    }

    /**
     * @param {object} node The root shape to which child shapes are linked
     */
    function linkGons(node) {
      node.vert.forEach((v) => {
        if(node.depth < Object.keys(_gon).length - 1) {
          v.child = _gon[node.depth + 1];
          if(v.child) v.child.parentVertRadius = v.radius;
          return linkGons(_gon[node.depth + 1]);
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

    // Utility Functions

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

    /**
     * Returns a new copy of the object to pass by value.
     * @param {object} object
     * @return {object} an identical object.
     */
    function copy(object) {
      return JSON.parse(JSON.stringify(object));
    }
    
    // End utility functions

    if(!uri && !json) throw new Error('No template file uri or json specified.');
    let createMandala = (uri) ?
      get(uri, '.json').then((json) => renderMandala(json)) :
      renderMandala(json);
    let styleMandala = (uri) ? 
      get(uri, '.css').then((css) => injectCss(css)) :
      {};

    return new Promise((resolve, reject) => {
      Promise.all([createMandala, styleMandala]).then((values) => {
        resolve(values[0]);
      });
    });
  };

  function create(json) {
    created.push(new Mandala(null, json));
  }

  function erase(name) {
    let parent = document.getElementById('mandala');
    let el = document.getElementById('mandala_' + name);
    if(!el) throw new Error('Cannot find mandala with name ' + name);
    parent.removeChild(el);
  }

  created = effects.map((e) => e = new Mandala(e.uri, null));

  return {
    created: created,
    erase: erase,
    create: create,
  };
})();

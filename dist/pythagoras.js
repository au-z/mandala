'use strict';

var Pythagoras = function Pythagoras() {
  var SHAPE_TAG = '<div id="el-{0}" class="{1}">{2}';
  var PARTICLE_TAG = '<div id="el-{0}" class="{1}">{2}';

  if (typeof Promise == "undefined" && Promise.toString().indexOf("[native code]") == -1) {
    throw new Error('Sorry, promises are not supported by your browser. :( Try another browser.');
  }

  if (!String.prototype.format) {
    String.prototype.format = function () {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
      });
    };
  }

  function load(effects) {
    effects.map(function (e) {
      e.css = null;
      e.plan = null;
      e.tree = {};
      e.html = '{0}';
      e.uri && get(e.uri, 'json').then(function (json) {
        toTree(e, json);
      }).then(function (plan) {
        toHtml(e);
      });
      e.styleUri && get(e.styleUri, 'text').then(function (css) {
        e.css = css;
      });
    });
    return effects;
  }

  function get(url, responseType) {
    return new Promise(function (resolve, reject) {
      var http = new XMLHttpRequest();
      http.responseType = responseType;
      http.open('GET', url);
      http.onload = function () {
        http.status === 200 && http.response !== null ? resolve(http.response) : reject(Error(http.statusText));
      };
      http.onerror = function () {
        reject(Error('Network error.'));
      };
      http.send();
    });
  }

  function toTree(e, json) {
    e.plan = json;
    e.tree['L0'] = recurseDesign(e, e.tree['L0'], json.design['L0'], 'L0', true);
  }

  function toHtml(e) {
    recurseTree(e, { node: e.tree['L0'], id: 0 });
    e.html = e.html.replace('{0}', '');
  }

  function recurseDesign(e, treeNode, designNode, link) {
    var isRoot = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

    var shapeKey = designNode.shape;
    var shapeValue = e.plan.shapes[shapeKey];
    var particleKey = designNode.particles;
    var particleValue = e.plan.particles[particleKey];
    if (!shapeKey) {
      throw new Error('Could not find shape key in provided effect design.');
    };
    if (!shapeValue) {
      throw new Error('Could not find shape value in provided effect design.');
    };
    if (!particleKey) {
      throw new Error('Could not find particle key in provided effect design.');
    };
    if (!particleValue) {
      throw new Error('Could not find particle value in provided effect design.');
    };

    treeNode = { shape: shapeKey, attrs: [link, 'shape', isRoot ? 'root' : null].concat(shapeValue.attrs), particles: [] };
    for (var i = 0; i < shapeValue.particleCount; i++) {
      treeNode.particles.push({ type: particleKey, attrs: [link], child: null });
      treeNode.particles[i].attrs.push(e.plan.particleIterators[i]);
      treeNode.particles[i].attrs = treeNode.particles[i].attrs.concat(particleValue.attrs);

      if (designNode.link && designNode.link !== designNode) {
        treeNode.particles[i].child = recurseDesign(e, treeNode.particles[i].child, e.plan.design[designNode.link], designNode.link);
      }
    }
    return treeNode;
  }

  function recurseTree(e, tree) {
    var shapeTag = SHAPE_TAG.format(tree.id++, tree.node.attrs.join(' '), tree.node.particles ? '{0}</div>' : '</div>{0}');
    e.html = e.html.format(shapeTag);
    if (tree.node.particles) {
      for (var i = 0; i < tree.node.particles.length; i++) {
        var particleTag = PARTICLE_TAG.format(tree.id++, tree.node.particles[i].attrs.join(' '), tree.node.particles[i].child ? '{0}</div>' : '</div>{0}');
        e.html = e.html.format(particleTag);
        if (tree.node.particles[i].child) {
          tree.id = recurseTree(e, { node: tree.node.particles[i].child, id: tree.id });
        }
      }
      e.html = e.html.replace('{0}</div>', '</div></div>{0}');
    }
    return tree.id;
  }

  return {
    load: load
  };
};
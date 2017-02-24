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
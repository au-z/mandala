(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.MandalaUI = factory());
}(this, (function () {
  if(typeof Promise == 'undefined' && Promise.toString().indexOf('[native code]') == -1) {
    throw new Error('Sorry, promises are not supported by your browser. :( Try another browser.');
  }

  function detectMandalas() {
    if(Mandalas) console.debug('Detected ' + Mandalas.length + ' mandalas.');
    return Promise.all(Mandalas);
  }

  return {
    detect: detectMandalas,
  };
})))();

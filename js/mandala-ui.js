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

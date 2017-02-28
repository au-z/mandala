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
    mandalas: [],
    copiedMandala: '',
  },
  watch: {
    mandalas: {
      deep: true,
      handler: function() {
        this.refreshMandalas();
      },
    },
    copiedMandala: function(val) {
      const json = JSON.parse(val);
      console.log(json);
    },
  },
  created: function() {
    if(MandalaUI) this.templateMandala();
  },
  methods: {
    templateMandala: function() {
      MandalaUI.detect().then((mandalas) => this.mandalas = mandalas );
    },
    newLevel: function(i) {
      const name = this.randomName();
      this.$set(this.mandalas[i].gon, name, {vertCount: 5, radius: 50});
      this.$set(this.mandalas[i].vert, name, {radius: 5});
      const nodesLength = this.mandalas[i].nodes.length;
      this.$set(this.mandalas[i].nodes[nodesLength - 1], 'link', nodesLength);
      this.mandalas[i].nodes.push({gon: name, vert: name});
      this.refreshMandalas();
    },
    refreshMandalas: _.debounce(function() {
      this.mandalas.forEach((m) => {
        Mandalas.erase(m.name);
        Mandalas.create(m);
      });
    }, 300),
    randomName: function() {
      return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    },
  },
});

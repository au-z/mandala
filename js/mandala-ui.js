const MandalaUI = (function(options) {
  mandalaLib = options.lib || window.Mandala
  if(!mandalaLib) console.error('Mandala UI cannot render without Mandala.')

  _mandalas = null
  if(typeof Promise == 'undefined' && Promise.toString().indexOf('[native code]') == -1) {
    throw new Error('Sorry, promises are not supported by your browser. :( Try another browser.')
  }

  function detectMandalas() {
    if(Mandalas) console.debug('Detected ' + Mandalas.created.length + ' mandalas.')
    return Promise.all(Mandalas.created)
  }

  const el = new Vue({
    el: '#mandala-ui',
    data: {
      mandalas: [],
      copiedMandala: '',
    },
    watch: {
      mandalas: {
        deep: true,
        handler: function() {
          this.refreshMandalas()
        },
      },
      copiedMandala: function(val) {
        const json = JSON.parse(val)
        console.log(json)
      },
    },
    created: function() {
      if(MandalaUI) this.templateMandala()
    },
    methods: {
      templateMandala: function() {
        MandalaUI.detect().then((mandalas) => this.mandalas = mandalas )
      },
      newLevel: function(i) {
        const name = this.randomName()
        this.$set(this.mandalas[i].gon, name, {vertCount: 5, radius: 50})
        this.$set(this.mandalas[i].vert, name, {radius: 5})
        const nodesLength = this.mandalas[i].nodes.length
        this.$set(this.mandalas[i].nodes[nodesLength - 1], 'link', nodesLength)
        this.mandalas[i].nodes.push({gon: name, vert: name})
        this.refreshMandalas()
      },
      refreshMandalas: _.debounce(function() {
        this.mandalas.forEach((m) => {
          Mandalas.erase(m.name)
          Mandalas.create(m)
        })
      }, 300),
      randomName: function() {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
      },
    },
    template: `
    <div class="mandala-ui">
      <div class="legend">
        <div class="shape-radius">Shape radius</div>
        <div class="vert-count">Vert count</div>
        <div class="vert-radius">Vert radius</div>
      </div>
      <div class="mdla-item" v-for="(m, i) in mandalas">
        <div class="header">Mandala {{i}}: {{m.name}} 
          <span class="debug-toggle"><input type="checkbox" title="Debug mode" v-model="m.debug"></input></span>
        </div>
        <div :class="'mdla-nodes level level_' + i" v-for="(n, i) in m.nodes">
          <div class="input shape-radius"><input type="number" min="1" :title="n.gon + ' radius'" v-model.number="m.gon[n.gon].radius"></input></div>
          <div class="input vert-count"><input type="number" min="1" :title="n.gon + ' vertices'" v-model.number="m.gon[n.gon].vertCount"></input></div>
          <div class="input vert-radius"><input type="number" min="1" :title="n.vert + ' radius'" v-model.number="m.vert[n.vert].radius"></input></div>
        </div>
        <div :class="'mdla-nodes new-node level_' + m.nodes.length" @click="newLevel(i)">
          <span class="center">+</span>
        </div>
        <div class="copy-mandala">
          <label>Copy</label>
          <input type="text" :value="JSON.stringify(m)" v-model="copiedMandala"></input></div>
      </div>
    </div>
    `,
  })

  return {
    el,
    detect: detectMandalas,
  }
})

import Vue from 'vue';

const MandalaUi = ((container, effects = [], createFn, eraseFn) => {
  const ui = '';
  window.__ui = new Vue({
    el: createInContainer(container),
    data: () => ({
      effects: [],
      templates: null,
      headIdx: 0,
    }),
    created() {
      Promise.all(effects).then((json) =>
        this.templates = json.map((j) => this.templateEffect(j)))
    },
    methods: {
      templateEffect(json) {
        this.effects.push(son.nodes.map((n) => ({
          polyR: json.gon[n.gon].radius,
          polyN: json.gon[n.gon].vertCount,
          vertR: json.vert[n.vert].radius,
        })));
      },
    },
    template: `
    <div id="mandala-ui">
    <div class="legend">
      <div class="shape-radius">Shape radius</div>
      <div class="vert-count">Vert count</div>
      <div class="vert-radius">Vert radius</div>
    </div>
    <div class="mdla-item" v-for="(m, i) in effects">
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
    </div></div>
    `,
  })

  return ui
})

function createInContainer(container) {
  const id = 'mandala-ui';
  let el = document.createElement('div');
  el.setAttribute('id', id);
  document.body.appendChild(el);
  return '#' + id;
}

export default MandalaUi;
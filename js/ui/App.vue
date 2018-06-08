<template>
  <div id="mandala-ui">
    <div class="legend">
      <div class="shape-radius">Shape radius</div>
      <div class="vert-count">Vert count</div>
      <div class="vert-radius">Vert radius</div>
    </div>
    <div class="mdla-item" v-for="(m, i) in $effects" :key="i">
      <div class="header">
        Mandala {{i}}: {{m.json.name}}
        <span class="debug-toggle">
          <input type="checkbox" title="Debug mode" v-model="m.json.debug"/>
        </span>
      </div>
      <div :class="'mdla-nodes level level_' + i" v-for="(n, i) in m.json.nodes" :key="i">
        <div class="input shape-radius"><input type="number" min="1" v-model.number="m.json.gon[n.gon].radius"></input></div>
        <div class="input vert-count"><input type="number" min="1" v-model.number="m.json.gon[n.gon].vertCount"></input></div>
        <div class="input vert-radius"><input type="number" min="1" v-model.number="m.json.vert[n.vert].radius"></input></div>
      </div>
      <!-- <div :class="'mdla-nodes new-node level_' + m.nodes.length" @click="newLevel(i)">
        <span class="center">+</span>
      </div> -->
      <button class="re-render" @click="rerender">Render</button>
    </div>
  </div>
</template>

<script>
import {throttle} from 'lodash'

export default {
  name: 'mandala-ui',
  methods: {
    rerender() {
      this.$effects.forEach((e) => {
        this.$erase(e)
        // e.json.name = Math.random().toString(36).substr(7)
        this.$create(e)
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
$c1 = #f4d06f
$c2 = #FF8811
$c3 = #9DD9D2

p
  color: white

.legend
  .shape-radius
    background: $c1
  .vert-count
    background: $c2
  .vert-radius
    background: $c3

.mdla-nodes
  .shape-radius input
    border-color: $c1
  .vert-count input
    border-color: $c2
  .vert-radius input
    border-color: $c3

.re-render
  width: 100%
  height: 32px
  background: linear-gradient(#fff, #ddd)
  border: none
  border-radius: 4px
  margin: 6px 0
</style>

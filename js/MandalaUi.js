import Vue from 'vue'
import VueInject from './ui/plugins/vue-inject'

import App from './ui/App.vue'

const MandalaUi = ((container, effects, createFn, eraseFn) => {
  Vue.use(VueInject, {
    injectables: [
      {key: '$effects', val: effects},
      {key: '$create', val: createFn},
      {key: '$erase', val: eraseFn},
    ],
  })

  window.__ui = new Vue({
    el: createInContainer(container),
    render: (h) => h(App),
  })
})

function createInContainer(container) {
  const id = 'mandala-ui'
  let el = document.createElement('div')
  el.setAttribute('id', id)
  document.body.appendChild(el)
  return '#' + id
}

export default MandalaUi
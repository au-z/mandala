export default {
  name: 'vue-inject',
  version: '1.0.0',
  install: (vue, options) => {
    options = options || {injectables: []}
    if(!vue) throw new Error('Vue not defined!')
    vue.mixin({
      beforeCreate() {
        options.injectables.forEach((i) => this[i.key] = i.val)
      },
    })
  },
}

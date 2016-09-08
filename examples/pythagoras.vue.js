var vm = new Vue({
  el: '#pythagoras',
  data: {
    module: null,
    currentEffect: 0,
    effects: [
      { name: 'One', uri: 'effects/example1.json', styleUri: 'effects/example1.css', css: null, plan: null, tree:{}, html: '{0}'},
    ]
  },
  created: function(){
    this.module = new Pythagoras();
    this.effects = this.module.load(this.effects);
    console.log(this.effects);
  }
})
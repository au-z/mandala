var vm = new Vue({
  el: '#pythagoras',
  data: {
    module: null,
    currentEffect: 1,
    effects: [
      { name: 'One', uri: 'effects/example1.json', styleUri: 'effects/example1.css', css: null, plan: null, tree:{}, html: '{0}'},
      { name: 'Two', uri: 'effects/example2.json', styleUri: 'effects/example2.css', css: null, plan: null, tree:{}, html: '{0}'}
    ]
  },
  created: function(){
    this.module = new Pythagoras();
    this.effects = this.module.load(this.effects);
    console.log(this.effects);
  },
  methods: {
    increment: function(){
      if(this.currentEffect === this.effects.length -1){
        this.currentEffect = 0;
      }else{
        this.currentEffect++;
      }
    },
    decrement: function(){
      if(this.currentEffect === 0){
        this.currentEffect = this.effects.length - 1;
      }else{
        this.currentEffect--;
      }
    }
  }
});
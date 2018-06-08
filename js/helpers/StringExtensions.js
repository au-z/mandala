export default (() => {
  if(String.prototype.format) return
  String.prototype.format = function(...args){
    return this.replace(/{(\d+)}/g, (match, number) => {
      return typeof args[number] != 'undefined' ? args[number] : match
    })
  }
})()

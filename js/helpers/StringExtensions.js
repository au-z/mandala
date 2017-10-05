const StringExtensions = (() => {
  if(String.prototype.format) return
  String.prototype.format = function(...a){
    let args = a
    return this.replace(/{(\d+)}/g, (match, number) => {
      return typeof args[number] != 'undefined' ? args[number] : match
    })
  }
})()

export default StringExtensions

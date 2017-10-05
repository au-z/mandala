const Check = (() => {
  const unsupportedMsg  = (feature) => `Sorry ${feature} is not supported by your browser. :(`
  const wrongTypeMsg = (obj, type) => `\'${obj}\' is not an instance of type \'${type}\'`

  const checkPromise = () => {
    if(typeof Promise == 'undefined' && Promise.toString().indexOf('[native code]') == -1) {
      throw new Error(unsupportedMsg('Promise'))
    }
  }

  const checkArray = (a) => Array.isArray(a) || !!console.error(wrongTypeMsg(a, 'Array'))
  const checkObject = (a) => Object.isObject(a) || !!console.error(wrongTypeMsg(a, 'Object'))

  const feature = (name) => {
    switch(name.toUpperCase()) {
      case 'PROMISE': return checkPromise()
      default: throw new Error(`Unimplemented feature check: ${name}`)
    }
  }

  const typeOf = (a, type) => {
    switch(type.toUpperCase()) {
      case 'ARRAY': return checkArray(a)
      case 'OBJECT': return a === Object(a) && Object.prototype.toString.call(a) !== '[object Array]'
      default: throw new Error(`Unimplemented type check: ${type}`)
    }
  }

  const falsy = (a, msg = "") => a || !!console.error(msg)

  return {
    falsy,
    falsies: (arr) => arr.every((a, i) => falsy(a, `Falsy value detected at index ${i}`)),
    empty: (a, msg) => a.length < 1 && console.error(msg),
    feature,
    typeOf,
  }
})()

export default Check

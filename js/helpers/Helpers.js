const copy = (obj) => JSON.parse(JSON.stringify(obj))

const randomName = (len) => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, len)

/**
 * Executes a given function a number of times
 * @param {number} iterations number of times to repeat the function
 * @param {Function} fn function to execute per iteration
 * @return {Array} aggregate results from function calls
 */
const per = (iterations, fn) => {
  let results = []
  for(let i = 0; i < iterations; i++) {
    results.push(fn())
  }
  return results
}

export {
  copy,
  per,
  randomName,
}

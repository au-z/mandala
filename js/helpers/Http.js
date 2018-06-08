const FileExt = (() => {
  return {
    JSON: '.json',
    CSS: '.css',
  }
})()

const get = (uri, ext) => new Promise((resolve, reject) => {
  let http = new XMLHttpRequest()
  http.responseType = (ext === '.json') ? 'json' : 'text'
  http.open('GET', uri + ext)
  http.onload = () => {
    (http.status === 200 && http.response !== null) ?
      resolve(http.response) : reject(Error(http.statusText))
  }
  http.onerror = () => reject(Error('Network error'))
  http.send()
})

export {get, FileExt}

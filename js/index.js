import Mandala from './Mandala'
import MandalaUi from './MandalaUi'
import Package from '../package.json'
const version = Package.version

import './helpers/StringExtensions.js'

import {get, FileExt} from './helpers/Http'
import Check from './helpers/Check'

Check.feature('Promise')

module.exports = ((config, options = {}) => {
  Check.falsy(config, 'No configuration provided.')
  Check.typeOf(config, 'Array')
  Check.typeOf(options, 'Object')
  options.parentId = options.parentId || 'mandala'
  const uiEnabled = options.uiEnabled || false
  
  let container = document.getElementById(options.parentId)
  if(!container) throw new Error(`Cannot find container with id '${options.parentId}'`)

  const mandalaEffects = []
  config.forEach((c) => {
    const createMandala = get(c.uri, FileExt.JSON)
    const styleMandala = get(c.uri, FileExt.CSS)
    Promise.all([createMandala, styleMandala])
      .then((values) => registerEffect(values[0], values[1]))
  })

  function registerEffect(json, css) {
    mandalaEffects.push(new Mandala(json, css, options))
    if(uiEnabled) new MandalaUi(container, mandalaEffects, create, erase)
  }

  const create = (effect) => {
    mandalaEffects.push(new Mandala(effect.json, effect.css, options))
  }

  const erase = (effect) => {
    // remove effect
    let existingIdx = mandalaEffects.findIndex((e) => e.name === effect.name)
    if(existingIdx > -1) {
      mandalaEffects.splice(existingIdx, 1)
    }
    removeByQuerySelector(`div#${effect.elId}`)
    removeByQuerySelector(`style#${effect.styleId}`)
  }

  const removeByQuerySelector = (selector) => {
    const el = document.querySelector(selector)
    el.parentElement.removeChild(el)
  }

  return {
    create,
    erase,
    mandalaEffects,
    version,
  }
})

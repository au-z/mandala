import StringExtensions from './helpers/StringExtensions'
import Check from './helpers/Check'
import Mandala from './Mandala'
import MandalaUi from './MandalaUi'

Check.feature('Promise')

module.exports = ((conf, opt = {}) => {
  Check.falsy(conf, 'No configuration provided.')
  Check.typeOf(conf, 'Array')
  Check.typeOf(opt, 'Object')
  const uiEnabled = opt.uiEnabled || false;
  
  let container = document.getElementById('mandala')
  if(!container) throw new Error('Cannot find container with id \'mandala\'')

  let mandalaEffects = conf.map((c) => new Mandala(c.uri, null, opt))

  /**
   * Create a new mandala effect from JSON template
   * @param {Object} json template json for mandala effect
   */
  const create = (json) => {
    mandalaEffects.push(new Mandala(null, json, opt))
  }

  /**
   * Removes a mandala effect from the DOM
   * @param {String} name name of the effect
   */
  const erase = (name) => {
    let parent = document.getElementById('mandala')
    let el = document.getElementById('mandala_' + name)
    Check.falsy(el, `Cannot find mandala with name: ${name}`)
    parent.removeChild(el)
  }

  if(uiEnabled) new MandalaUi(container, mandalaEffects, create, erase);

  return {
    create,
    erase,
    mandalaEffects,
  }
})

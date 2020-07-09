import { property, html } from 'hybrids'
import hljs from 'highlight.js'
import nord from 'highlight.js/styles/nord.css'
import a11yDark from 'highlight.js/styles/a11y-dark.css'
import tomorrowNightEighties from 'highlight.js/styles/tomorrow-night-eighties.css'
import hybrid from 'highlight.js/styles/hybrid.css'

import js from 'highlight.js/lib/languages/javascript.js'
import ts from 'highlight.js/lib/languages/typescript.js'
import css from 'highlight.js/lib/languages/css.js'
import xml from 'highlight.js/lib/languages/xml.js'
hljs.registerLanguage('js', js)
hljs.registerLanguage('ts', ts)
hljs.registerLanguage('css', css)
hljs.registerLanguage('xml', xml)

const escapeMap = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;"
}
const escapeForHTML = (input) => input.replace(/([&<>'"])/g, (char) => escapeMap[char])

const formatCode = (code, lang) => {
	const supportedLang = !!(lang && hljs.getLanguage(lang))
	return supportedLang ? hljs.highlight(lang, code).value : escapeForHTML(code)
}

export default {
	lang: property('javascript'),
	theme: property('nord'),
	code: property(''),

	formatted: ({code, lang}) => formatCode(code, lang),

	styles: ({theme}) => {
		switch(theme) {
			case 'ay11-dark': return a11yDark.toString()
			case 'tomorrow-night-eighties': return tomorrowNightEighties.toString()
			case 'hybrid': return hybrid.toString()
			case 'nord': default: return nord.toString()
		}
	},

	render: ({lang, formatted, styles}) => html`
		<pre class="code"><code class="hljs ${lang}" innerHTML="${formatted}"></code></pre>
		<style>
			${styles}
			code.hljs {
				font-size: 1.1em;
				background: transparent;
			}
		</style>
	`,
}
if (process.env.NODE_ENV !== "production") module.hot.accept()
// import 'font-awesome/css/font-awesome.css'
import {html, define} from 'hybrids'
import {Components} from './components'
import style from 'style/app.styl'
// import * as glElements from 'src/gl'

define('app-root', {
	render: () => html`
		<mandala-root>
			<mandala-layer>
				<mandala-polygon n="3" r="40" debug>
					<mandala-polygon n="3" r="40" debug/>
				</mandala-polygon>
			</mandala-layer>
		</mandala-root>
	`.define({...Components}),
})

const styleEl = document.createElement('style')
styleEl.innerHTML = style.toString()
document.head.appendChild(styleEl)

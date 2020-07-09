// if (process.env.NODE_ENV !== "production") module.hot.accept()
// import 'font-awesome/css/font-awesome.css'
import {html, define} from 'hybrids'
import {components} from './components'
import styles from 'style/app.styl'
// import * as glElements from 'src/gl'

define('app-root', {
	render: () => html`
		<mandala-companion onchange="${(host, e) => console.log(e.detail)}">
			<mandala-layer />
		</mandala-companion>

		<!-- <mandala-layer name="m2" template=${[
			7, 60, 3, [
				80, 120, 2,
			]
		]} style-href="/static/style/m2.css" keyframes-href="/static/style/keyframes.css">
		</mandala-layer>

		<mandala-layer name="m1" template=${[
			5, 50, 5, [
				5, 50, 3, [
					5, 50, 2, [
						5, 50, 1
					]
				]
			]
		]} style-href="/static/style/mandala_1.css" keyframes-href="/static/style/keyframes.css">
		</mandala-layer> -->

		<style>
			:host {
				width: 100%;
				height: 100%;
				background: #707078;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		</style>
	`.define({...components}),
})

const styleEl = document.createElement('style')
styleEl.innerHTML = styles.toString()
document.head.appendChild(styleEl)

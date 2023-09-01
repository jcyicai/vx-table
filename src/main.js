import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
Vue.use(VXETable)

import { baseNumFormat } from '@/utils'

Vue.config.productionTip = false

Vue.prototype.$baseNumFormat = baseNumFormat

new Vue({
	render: h => h(App)
}).$mount('#app')

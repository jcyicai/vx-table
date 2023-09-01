import VxTable from './VxTable/index.vue'

const coms = [VxTable]

const install = function (Vue) {
	coms.forEach(com => {
		Vue.component(com.name, com)
	})
}

export default install

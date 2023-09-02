import VxTable from './VxTable'

const components = [VxTable]

const install = function (Vue) {
	components.forEach(component => {
		Vue.component(component.name, component)
	})
}

// 判断是否直接引入文件，如果是，就不用调用 Vue.use()
if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue)
}

export default install

# vx-table
## 前言

一个基于 vxe-table 二次封装的表格组件，适用于 vue2.0

## 功能点

- [x] 只读模式
- [x] 编辑模式
- [x] 分页
- [x] 列合计 / 总合计
- [x] 复选框
- [x] 复选框逻辑禁用
- [x] 复选框自定义
- [x] 展开
- [x] 多表头
- [x] 键盘 Tab 切换 / 单击触发 编辑
- [x] 验证

## 安装

```shell
npm install vxe-table@3.6.13 vxe-table-plugin-element@3.0.7 element-ui@2.5.14 vx-table
```

## npm

```javascript
// 引入 element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 引入 vxe-table
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
Vue.use(VXETable)

// 引入 vxe-table 插件 兼容 编辑模式下支持 element-ui 组件
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
VXETable.use(VXETablePluginElement)

// 引入 vx-table 组件
import VxTable from 'vx-table'
import 'vx-table/dist/vxTable.css'
Vue.use(VxTable)

```

## 示例

[所有示例](https://github.com/jcyicai/vx-table/blob/main/src/App.vue)

```vue
<template>
    <div>
    	<vx-table :data="data" :columns="columns"></vx-table>
    </div>
</template>

<script>
export default {
	name: 'App',
	components: { VxTable },
	data() {
		return {
			data: [{ id: 1, name: 'JC', age: 18, amount: 8568.87656 }],
            columns: [
				{
					label: '姓名',
					prop: 'name'
				},
				{
					label: '年龄',
					prop: 'age'
				},
				{
					label: '余额',
					prop: 'amount',
					format: { type: 'number', digits: 2, prefix: '￥' }
				}
			],
		}
	}
}
</script>
```

## 运行项目

```shell
// 安装依赖
npm install

// 运行本地调试
npm run serve

// 编译打包，生成 dist 编译目录
npm run lib
```

## 源码

[vx-table](https://github.com/jcyicai/vx-table)

## License

[MIT](LICENSE) © 2023-present, Jason Chen
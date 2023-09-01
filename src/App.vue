<template>
	<div id="app">
		<div>
			<h4>只读</h4>
			<vx-table :data="data" :columns="columns"></vx-table>
		</div>
		<div class="mt-14">
			<h4>编辑模式</h4>
			<vx-table :data="data" :columns="columns1" type="edit">
				<template #name="{ scope }">
					<el-input v-model="scope.row.name"></el-input>
				</template>
			</vx-table>
		</div>
		<div>
			<h4>带分页</h4>
			<vx-table :data="data" :columns="columns" show-page></vx-table>
		</div>
	</div>
</template>

<script>
import VxTable from '@/components/VxTable'
export default {
	name: 'App',
	components: { VxTable },
	data() {
		return {
			data: [{ name: 'JC', age: 18, amount: 8568.87656 }],
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
					format: { type: 'number', digits: 2 }
				}
			],
			columns1: [
				{
					label: '姓名',
					prop: 'name',
					slot: true
				},
				{
					label: '年龄',
					prop: 'age'
				},
				{
					label: '余额',
					prop: 'amount',
					format: { type: 'number', digits: 2 }
				}
			]
		}
	}
}
</script>

<style lang="scss">
body,
html {
	margin: 0;
}
#app {
	padding: 14px;
	.mt-14 {
		margin-top: 14px;
	}
}
</style>

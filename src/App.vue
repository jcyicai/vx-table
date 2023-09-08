<template>
	<div id="app">
		<div>
			<h4>只读</h4>
			<vx-table :data="data" :columns="columns"></vx-table>
		</div>
		<div>
			<h4>合计 / 总合计</h4>
			<vx-table
				:data="data"
				:columns="columns"
				:total-columns="totalColumns"
				:total-data="totalData"
				show-footer
				show-footer-all-total
			></vx-table>
		</div>
		<div>
			<h4>编辑</h4>
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
		<div>
			<h4>复选框</h4>
			<vx-table :data="data" :columns="columns" show-select></vx-table>
		</div>
		<div>
			<h4>复选框禁用</h4>
			<vx-table :data="data" :columns="columns2" :checkbox-config="{ checkMethod: handleSetTableCheck }" show-select>
			</vx-table>
		</div>
		<div>
			<h4>复选框自定义</h4>
			<vx-table :data="data1" :columns="columns2">
				<template #custom-checkbox>
					<vxe-column type="checkbox" align="center" width="50" fixed="left">
						<template #header>
							<el-checkbox v-model="allChecked" @change="handleAllChecked"></el-checkbox>
						</template>
						<template #checkbox="scope">
							<el-checkbox v-model="scope.row.checked" @change="handleRowChecked(scope.row)"></el-checkbox>
						</template>
					</vxe-column>
				</template>
			</vx-table>
		</div>
		<div>
			<h4>展开</h4>
			<vx-table :data="data" :columns="columns" show-expand>
				<template #expand-content="{ row }">
					<div style="padding: 14px 14px">
						<vx-table :data="row.children" :columns="columns" max-height="240"></vx-table>
					</div>
				</template>
			</vx-table>
		</div>
		<div>
			<h4>多表头</h4>
			<vx-table :data="data3" :columns="columns3"></vx-table>
		</div>
		<div>
			<h4>键盘tab切换 / 单击触发 可编辑</h4>
			<vx-table :data="data" :columns="columns4" type="edit" show-cell-select>
				<template #name="{ scope }">
					<el-input v-model="scope.row.name"></el-input>
				</template>
				<template #age="{ scope }">
					<el-input v-model="scope.row.age"></el-input>
				</template>
			</vx-table>
		</div>
		<div>
			<h4>添加验证</h4>
			<el-button type="primary" size="small" @click="handleValid">触发验证</el-button>
			<vx-table ref="vxTable" :data="data4" :columns="columns4" type="edit" show-cell-select :edit-rules="validRules">
				<template #name="{ scope }">
					<el-input v-model="scope.row.name"></el-input>
				</template>
				<template #age="{ scope }">
					<el-input v-model="scope.row.age"></el-input>
				</template>
			</vx-table>
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
			validRules: {
				name: [{ required: true, message: '请输入姓名' }]
			},
			totalColumns: ['amount'],
			totalData: { amount: 8568.87656 },
			data: [
				{
					name: 'JC',
					age: 18,
					amount: 8568.87656,
					status: 1,
					statusName: '已作废',
					children: [{ name: 'JC', age: 18, amount: 8568.87656, status: 1, statusName: '已作废' }]
				}
			],
			data1: [
				{ id: 1, name: 'JC', age: 18, amount: 8568.87656, status: 1, statusName: '已作废' },
				{ id: 2, name: 'JC', age: 18, amount: 8568.87656, status: 1, statusName: '已作废' }
			],
			data3: [
				{
					name: 'JC',
					age: 18,
					amount: 8568.87656,
					status: 1,
					statusName: '已作废',
					provinceName: '上海',
					cityName: '上海'
				}
			],
			data4: [
				{ id: 1, name: 'JC', age: 18, amount: 8568.87656, status: 1, statusName: '已作废' },
				{ id: 2, name: '', age: 18, amount: 8568.87656, status: 1, statusName: '已作废' }
			],
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
			],
			columns2: [
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
				},
				{
					label: '状态',
					prop: 'statusName'
				}
			],
			columns3: [
				{
					label: '姓名',
					prop: 'name'
				},

				{
					label: '地址',
					prop: 'address',
					children: [
						{
							label: '省',
							prop: 'provinceName'
						},
						{
							label: '市',
							prop: 'cityName'
						}
					]
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
			columns4: [
				{
					label: '姓名',
					prop: 'name',
					editRender: {} // 单击 变为 编辑模式
				},
				{
					label: '年龄',
					prop: 'age',
					editRender: {}
				},
				{
					label: '余额',
					prop: 'amount',
					format: { type: 'number', digits: 2 }
				}
			],
			allChecked: false
		}
	},
	methods: {
		// 判断 行 checkbox 是否禁用
		handleSetTableCheck({ row }) {
			return row.status !== 1
		},
		// 全选
		handleAllChecked() {
			this.data1.forEach((item, index) => {
				this.$set(item, 'checked', this.allChecked)
			})
		},
		// 行选中 可处理一些相同行属性都勾选的情况
		handleRowChecked(row) {
			// 处理行选中的数据
			this.data1.forEach(item => {
				if (item.id === row.id) {
					this.$set(item, 'checked', row.checked)
				}
			})
			// 获取数据总数
			const allLength = this.data1.length
			// 获取 checked 数据总数
			const checkedLength = this.data1.filter(item => item.checked).length
			// 设置是否全选
			this.allChecked = allLength === checkedLength
		},
		// 表格验证
		async handleValid() {
			const res = await this.$refs['vxTable'].validate()
			console.log(res)
		}
	}
}
</script>

<style lang="scss">
* {
	margin: 0;
	padding: 0;
}

#app {
	padding: 0 20px 20px;
	.mt-14 {
		margin-top: 14px;
	}
	h4 {
		margin: 20px 0;
	}
}
</style>

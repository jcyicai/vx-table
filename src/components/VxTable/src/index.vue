<template>
	<div class="vxe-table-container" :class="[type === 'edit' ? 'resize-cell' : '']">
		<vxe-table
			ref="xTable"
			border
			empty-text="暂无数据"
			:loading="loading"
			show-overflow
			auto-resize
			sync-resize
			:data="data"
			size="small"
			v-bind="$attrs"
			:column-config="{ resizable: true }"
			:keyboard-config="{ isTab: true, isArrow: true }"
			:mouse-config="{ selected: showCellSelect }"
			:edit-config="{ trigger: 'click', mode: 'cell' }"
			:show-footer="showFooter"
			:footer-method="handleFooterCalc"
			:expand-config="expandConfig"
			v-on="$listeners"
			@checkbox-change="handleSelectionChange"
			@checkbox-all="handleSelectionChange"
			@cell-selected="handleCellSelected"
			@edit-actived="handleCellEditActived"
		>
			<!--
      @cell-click="handleCellClick"
      :scroll-x="{ enabled: false }"
      :scroll-y="{ enabled: true }" -->
			<slot name="custom-checkbox">
				<vxe-column v-if="showSelect" type="checkbox" align="center" width="50"></vxe-column>
			</slot>
			<slot name="seq">
				<vxe-column v-if="showSerial" type="seq" align="center" title="序号" width="50"></vxe-column>
			</slot>
			<vxe-column v-if="showExpand" type="expand" width="50" align="center">
				<template #content="{ row, rowIndex }">
					<slot name="expand-content" :row="row" :rowIndex="rowIndex"></slot>
				</template>
			</vxe-column>

			<template v-for="(item, index) in columns">
				<template v-if="item.children && item.children.length > 0">
					<ChildrenColumn
						:key="`${item.prop}${index}`"
						:current-column="item"
						:columns="item.children"
					></ChildrenColumn>
				</template>
				<template v-else>
					<!-- key不能设置 prop 否则 排序更新 column 无法生效 -->
					<vxe-column
						v-if="typeof item.hidden === 'boolean' ? item.hidden : true"
						:key="`${item.prop}${index}`"
						:field="item.prop"
						:title="item.label"
						:width="item.width"
						min-width="100"
						:fixed="item.fixed"
						:type="item.type"
						:align="item.align || 'center'"
						:edit-render="isObject(item.editRender) ? item.editRender : null"
					>
						<template #header="scope">
							<template v-if="item.headerSlot">
								<slot
									:name="`${item.prop}-header`"
									:column="scope.column"
									:column-index="scope.columnIndex"
									:row-index="scope.$rowIndex"
									:item="item"
									:scope="scope"
								/>
							</template>
							<template v-else-if="item.isRequired">
								<span>
									<i style="color: red; font-style: normal">*</i>
									{{ item.label }}
								</span>
							</template>
							<template v-else>
								<span>{{ item.label }}</span>
							</template>
						</template>
						<template #edit="scope">
							<slot
								:name="item.prop"
								:row="scope.row"
								:column="scope.column"
								:column-index="scope.columnIndex"
								:row-index="scope.rowIndex"
								:item="item"
								:scope="scope"
							/>
						</template>
						<template #default="scope">
							<template v-if="item.slot">
								<slot
									:name="item.prop"
									:row="scope.row"
									:column="scope.column"
									:column-index="scope.columnIndex"
									:row-index="scope.rowIndex"
									:item="item"
									:scope="scope"
								/>
							</template>
							<template v-else>
								<!-- 格式化内容 -->
								<span v-if="item.format && Object.keys(item.format).length">
									{{ formatValue(scope.row[item.prop], item.format) }}
								</span>
								<!-- 常规 -->
								<span v-else>
									{{ scope.row[item.propName ? item.propName : item.prop] }}
								</span>
							</template>
						</template>
					</vxe-column>
				</template>
			</template>
		</vxe-table>
		<!-- 分页 -->
		<el-pagination
			v-if="showPage"
			:current-page="currentPage"
			layout="total, sizes, prev, pager, next, jumper"
			:page-size="pageSize"
			:total="total"
			background
			:page-sizes="[10, 20, 30, 40, 50, 100, 500]"
			class="page-box"
			@current-change="handleCurrentChange"
			@size-change="handleSizeChange"
		/>
	</div>
</template>

<script>
import { baseNumFormat } from '@/utils'
import ChildrenColumn from './components/ChildrenColumn.vue'

export default {
	name: 'VxTable',
	components: {
		ChildrenColumn
	},
	props: {
		// 数据
		data: {
			type: Array,
			default: () => [],
			required: true
		},
		// 表格 列数据
		columns: {
			type: Array,
			default: () => [],
			required: true
		},
		// 表格 loading
		loading: {
			type: Boolean,
			default: false
		},
		// 是否显示序号
		showSerial: {
			type: Boolean,
			default: true
		},
		// 是否表格选择
		showSelect: {
			type: Boolean,
			default: false
		},
		// 是否分页
		showPage: {
			type: Boolean,
			default: false
		},
		// 分页总数
		total: {
			type: Number,
			default: 0
		},
		// 当前页
		currentPage: {
			type: Number,
			default: 1
		},
		// 每页条数
		pageSize: {
			type: Number,
			default: 10
		},
		// 底部栏是否显示  显示 totalColumns为必填项！
		showFooter: {
			type: Boolean,
			default: false
		},
		// 所有数据 总和 用于底部合计 showFooter使用
		totalData: {
			type: Object,
			default: () => {}
		},
		// 底部合计 是否显示 查询合计 即 所有数据 总合计  显示 totalData 为必填项！
		showFooterAllTotal: {
			type: Boolean,
			default: false
		},
		// 需要合计的列
		totalColumns: {
			type: Array,
			default: () => []
		},
		// 展开
		showExpand: {
			type: Boolean,
			default: false
		},
		// 展开配置 lazy loadMethod height
		expandConfig: {
			type: Object,
			default: () => {}
		},
		// 显示单元格选中
		showCellSelect: {
			type: Boolean,
			default: false
		},
		// 表格模式
		type: {
			type: String,
			default: 'readonly' // 'readonly' 只读 'edit' 编辑
		}
	},
	data() {
		return {}
	},
	created() {},
	mounted() {},
	methods: {
		// 是否为对象
		isObject(val) {
			return Object.prototype.toString.call(val) === '[object Object]'
		},
		// 每页条数 change
		handleSizeChange(size) {
			this.$emit('size-change', size)
		},
		// 当前页数 change
		handleCurrentChange(page) {
			this.$emit('current-change', page)
		},
		// 表格 checkbox 多选
		handleSelectionChange() {
			const allCheckedData = this.$refs.xTable.getCheckboxRecords()
			this.$emit('selection-change', allCheckedData)
		},
		// 累加值
		getSumNum(data, column) {
			let count = 0
			let flag = false
			data.forEach(item => {
				const value = Number(item[column.property])
				if (!isNaN(value)) {
					count += item[column.property]
					flag = true
				}
			})
			return flag ? count : ''
		},
		// 所有数据累加值
		getSumAllNum(column) {
			return this.totalData[column.property]
		},
		// 底部栏计算
		handleFooterCalc(params) {
			const { columns, data } = params
			const totalRowData = []
			const allTotalRowData = []

			columns.forEach((column, columnIndex) => {
				if (columnIndex === 0) {
					totalRowData.push('合计')
					allTotalRowData.push('总和')
				} else {
					let currentMergeCell = null
					let allMergeCell = null
					if (this.totalColumns.includes(column.property)) {
						// 查找当前 column format
						const curColumnItem = this.columns.find(item => item.prop === column.property)
						// 累加当前行
						const sumNum = this.getSumNum(data, column)
						currentMergeCell =
							sumNum || sumNum === 0
								? `${curColumnItem?.format?.prefix || ''}${baseNumFormat(
										sumNum,
										curColumnItem?.format?.digits || 2,
										's',
										curColumnItem?.format?.zeroFill
								  )}`
								: ''
						// 所有数据总和
						if (this.showFooterAllTotal) {
							const sumAllNum = this.getSumAllNum(column)
							allMergeCell =
								sumAllNum || sumAllNum === 0
									? `${curColumnItem?.format?.prefix || ''}${baseNumFormat(
											sumAllNum,
											curColumnItem?.format?.digits || 2,
											's',
											curColumnItem?.format?.zeroFill
									  )}`
									: ''
						}
					}
					totalRowData.push(currentMergeCell)
					if (this.showFooterAllTotal) {
						allTotalRowData.push(allMergeCell)
					}
				}
			})
			return this.showFooterAllTotal ? [totalRowData, allTotalRowData] : [totalRowData]
		},
		// 格式化列内容
		formatValue(val, format) {
			// 1 日期  2 数字
			let value = null
			/* if (format.type === 'date') {
				// 日期
				value = baseDateFormat(val)
			} else  */
			if (format.type === 'number') {
				// 数字
				value = `${
					val || val === 0
						? `${format.prefix || ''}${baseNumFormat(val, format.digits || 2, 's', format.zeroFill)}`
						: ''
				}`
			}
			return value
		},
		// 设置行展开
		handleSetRowExpand(row, checked) {
			this.$nextTick(() => {
				this.$refs['xTable'].setRowExpand(row, checked)
			})
		},
		// 单元格选中 针对 mouse-config.selected
		handleCellSelected(scope) {
			this.$refs['xTable'].setEditCell(scope.row, scope.column)
		},
		// 单元格点击时
		handleCellClick(scope) {
			this.$refs['xTable'].setEditRow(scope.row)
		},
		// 单元格 编辑模式激活
		async handleCellEditActived(scope) {
			// 针对 mode 为 cell 模式 触发单元格验证
			this.$refs['xTable'].triggerValidate().catch(err => {})
			// 针对 mode 为 row 模式 触发行验证 validate方法参数 为 boolean 全表格验证 row 单行验证  rows 多行验证 什么都不传 只对改动数据验证
			//const $table = this.$refs.xTable
			//const errMap = await $table.validate(scope.row).catch((errMap) => errMap)
		},
		// 表格全量验证
		async validate() {
			const $table = this.$refs.xTable
			const errMap = await $table.fullValidate(true).catch(errMap => errMap)
			if (errMap) {
				const msgList = []
				Object.values(errMap).forEach(errList => {
					errList.forEach(params => {
						const { rowIndex, column, rules } = params
						rules.forEach(rule => {
							msgList.push({
								rowIndex: rowIndex + 1,
								prop: column.property,
								label: column.title,
								message: rule.message
							})
						})
					})
				})
				const rowIndexList = [...new Set(msgList.map(item => item.rowIndex))]
				return {
					data: false,
					message: '验证失败',
					//msgList,
					rowIndexList
				}
			} else {
				return {
					data: true,
					message: '验证成功'
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
::v-deep .vxe-footer--column {
	background-color: #f5f7fa !important;
	background-repeat: no-repeat;
	background-size: 1px 100%, 100% 1px;
	background-position: 100% 0, 100% 100%;
}
::v-deep .vxe-header--column {
	background-color: #f5f7fa !important;
	background-repeat: no-repeat;
	background-size: 1px 100%, 100% 1px;
	background-position: 100% 0, 100% 100%;
}

// vxe table 高度调整 以及 form 提示显示时高度
.resize-cell {
	::v-deep .vxe-body--column {
		height: 72px !important;
	}

	::v-deep .vxe-cell {
		max-height: 68px !important;
	}
}

// 表头 必填 星号 大小 原先13px 会压缩星号显示
::v-deep .vxe-header--column .vxe-cell--required-icon {
	font-size: 14px;
}

.page-box {
	text-align: center;
	margin-top: 14px;
}

// 添加 checkbox 禁用时 背景色 原 无背景色
::v-deep .vxe-cell--checkbox.is--disabled > .vxe-checkbox--icon {
	background: #eee;
	border-radius: 3px;
}
</style>

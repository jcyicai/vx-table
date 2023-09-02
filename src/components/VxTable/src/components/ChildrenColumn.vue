<template>
	<div class="children-column-container">
		<vxe-colgroup
			:field="currentColumn.prop"
			:title="currentColumn.label"
			:width="currentColumn.width"
			min-width="100"
			:fixed="currentColumn.fixed"
			:align="currentColumn.align || 'center'"
		>
			<template v-for="(item, index) in columns">
				<template v-if="item.children && item.children.length > 0">
					<ChildrenColumn
						:key="`${item.prop}${index}`"
						:current-column="item"
						:columns="item.children"
					></ChildrenColumn>
				</template>
				<template v-else>
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
		</vxe-colgroup>
	</div>
</template>

<script>
import { baseNumFormat } from '@/utils'
export default {
	name: 'ChildrenColumn',
	props: {
		columns: {
			type: Array,
			default: () => [],
			required: true
		},
		currentColumn: {
			type: Object,
			default: () => {},
			required: true
		}
	},
	data() {
		return {
			initColumns: this.columns
		}
	},
	computed: {
		finallyColumns() {
			return this.initColumns.reverse()
		}
	},
	created() {},
	mounted() {},
	methods: {
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
				value = val || val === 0 ? baseNumFormat(val, format.digits || 2, 's', format.zeroFill) : ''
			}
			return value
		}
	}
}
</script>

<style lang="scss" scoped></style>

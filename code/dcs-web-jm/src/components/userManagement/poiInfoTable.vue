<template>
  <el-table :data="poiTableData"
            border
            height="100%"
            style="width:100%; height:100%"
            @selection-change="selectionChange">
    <el-table-column v-for="(item, key) in poiParams"
                     v-if="key !== 'expand'"
                     :key="key"
                     :prop="key"
                     :label="item.label"
                     :width="item.width"
                     align="center">
    </el-table-column>
    <el-table-column v-if="poiParams.expand" :label="poiParams.expand.label"
                     type="expand">
      <template scope="scope">
        <div style="margin-bottom: 10px">{{poiParams.expand.label}}：</div>
        <el-table :data="scope.row.threshold">
          <el-table-column v-for="(el, key) in poiParams.expand.threshold"
                           :key="key"
                           :label="el.label"
                           :prop="key">
          </el-table-column>
        </el-table>
      </template>
    </el-table-column>
    <el-table-column label="操作"
                     align="center"
                     width="120">
      <template scope="scope">
        <span size="small" class="edit" @click.stop="updateFunc(scope.row, scope.$index)">编辑</span>
        <span size="small" class="delete" @click.stop="deleteFunc(scope.row, scope.$index)">删除</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    poiTableData: Array,
    poiParams: Object,
    deleteFunc: Function,
    updateFunc: Function,
    selectionChange: Function
  }
}
</script>

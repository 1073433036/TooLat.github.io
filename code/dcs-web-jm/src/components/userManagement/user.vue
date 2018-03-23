<template>
  <el-table :data="allUserData"
            max-height="100%"
            border
            style="width:100%; max-height:100%;"
            @selection-change="selectionChange">
    <el-table-column prop="account"
                     label="用户名"
                     align="center"width="200"></el-table-column>
    <el-table-column label="部门"
                     prop="sign"
                     align="center"
                     width="200"></el-table-column>
    <el-table-column label="操作权限"
                     align="center">
      <template scope="scope">
        <span v-if="scope.row.res.torrent">山洪</span>
        <span v-if="scope.row.res.waterlog">内涝</span>
        <span v-if="scope.row.res.geol">地质</span>
        <span v-if="scope.row.res.tide">潮讯</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="120">
      <template scope="scope">
        <span size="small"
              class="edit"
              @click="updateFunc(scope.row, scope.$index)">编辑</span>
        <span size="small"
              class="delete"
              @click="deleteFunc(scope.row, scope.$index)">删除</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  props: {
    allUserData: Array,
    deleteFunc: Function,
    updateFunc: Function,
    selectionChange: Function
  }
}
</script>



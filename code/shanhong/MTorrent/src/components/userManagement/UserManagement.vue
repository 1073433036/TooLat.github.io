<template>
  <main id="UserManagement">
    <div class="cover" v-show="popupType">
      <div class="popup">
        <header class="cf">
          <span>
            <template v-if="popupType === 'add'">新增用户</template>
            <template v-else>编辑</template>
          </span>
          <i class="el-icon-close" @click="popupType = null"></i>
        </header>
        <div class="cont">
          <div class="info">
            <span>账号</span>
            <input type="text" v-model="popupInfo.user.name">
          </div>
          <div class="info">
            <span>密码</span>
            <input type="text" v-model="popupInfo.user.password">
          </div>
          <div class="info">
            <span>手机</span>
            <input type="text" v-model="popupInfo.user.cellphone">
          </div>
          <div class="info">
            <span>分区</span>
            <select v-model="popupInfo.user.cityid">
              <option :value="Number(key)" v-for="(el, key) in cities" :key="key">{{ el }}</option>
            </select>
          </div>
          <div class="info" v-show="popupInfo.user.cityid">
            <span>区县</span>
            <select v-model="popupInfo.user.countyId">
              <option :value="Number(key)" v-for="(el, key) in counties" :key="key">{{ el }}</option>
            </select>
          </div>
          <div class="info">
            <span>模块</span>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div class="module-list">
              <el-checkbox-group v-model="popupInfo.module" v-if="modulesConf.length" @change="handleCheckedModulesChange">
                <el-checkbox v-for="el of modulesConf" :key="el.id" :label="el.id">{{ el.name }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="btn-wrapper cf">
            <div style="float: right;">
              <el-button :plain="true" size="small" type="warning" @click="popupType = null">取消</el-button>
              <el-button :plain="true" size="small" type="warning" @click="submitUser">
                {{ popupType === 'add' ? '新增' : '修改' }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="wrapper">
      <header class="cf">
        <!-- <div class="btn-wrapper"> -->
          <el-button type="warning" size="small" icon="plus" @click="openAddPopup">新增</el-button>
          <el-button type="warning" size="small" icon="minus" @click="deleteMultiple">删除</el-button>
        <!-- </div> -->
      </header>
      <div class="table-wrapper">
         <el-table :data="currentUserInfo" style="width: 100%" border @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column> 
          <el-table-column prop="user.name" label="用户名"></el-table-column>
          <el-table-column prop="user.password" label="密码"></el-table-column>
          <el-table-column prop="user.cellphone" label="手机"></el-table-column>
          <el-table-column label="模块" min-width="200">
            <template slot-scope="scope" v-if="scope.row.module">
              <div class="module-wrapper">
                <span class="modules" v-for="el of scope.row.module" :key="el.id">{{ el.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="175">
            <template slot-scope="scope">
              <el-button size="small" icon="edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" icon="delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-wrapper cf">
        <el-pagination 
          layout="prev, pager, next" 
          :total="userInfo.length" 
          :pageSize ="pageSize"
          :current-page="currentPage"
          @current-change="pageChanged">
        </el-pagination>
      </div>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { userClient, userModulesClient, geoClient, userThresholdsClient } from '../../util/clientHelper'

  @Component
  export default class UserManagement extends Vue {
    @Getter('decisionStore/userInfo_global') userInfo_global
    modulesConf: any[] = []
    cities: any = {}
    counties: any = {}
    userInfo: any[] = []
    currentPage: number = 1
    pageSize: number = 10
    currentUserInfo: any[] = []     // 当前页数用户数据
    multipleSelection: any[] = []   // 选中的数据
    popupType: 'add' | 'edit' | null = null
    popupInfo: any = {
      user: {
        id: null,
        name: null,
        password: null,
        cellphone: null,
        cityid: null,
        cityName: null,
        countyId: null,
        countyName: null
      },
      module: []
    }
    checkAll: boolean = false       // 模块多选
    isIndeterminate: boolean = false
    resetingPopupInfo: boolean = false 

    created() {
      this.initUserModulesList()
      this.initData()
      this.getAllCities()
    }

    // 初始化所有用户模块信息
    async initUserModulesList() {
      let res = await userModulesClient.getUserModules()
      this.modulesConf = []
      if (!res) return
      for (let el of res) {
        if (el.description !== 'pup')       // 排除pup !!!
          this.modulesConf.push(el)
      }
    }

    // 获取所有城市id
    async getAllCities () {
      if(Object.keys(this.cities).length) return
      let res = await geoClient.getAllCities()
      if (!res) return
      let obj = {}
      for (let el of res) {
        if (el.city.length !== 3) continue      // 排除飞地
        obj[el.cityid] = el.city.slice(0, 2)
      }
      obj[0] = '广东'
      this.cities = { ...obj }
    }

    // 获取所选城市所有区县id
    @Watch('popupInfo.user.cityid')
    async onCityInfoChanged (val: any, oldVal: any) {
      if (!this.resetingPopupInfo)
        this.popupInfo.user.countyId = 0
      if (!val) {
        this.counties = {}
        return
      }
      let res = await geoClient.getAllCounties(val)
      if (res) {
        let obj = {}
        for (let el of res) {
          obj[el.countyid] = el.county
        }
        obj[0] = '全市'
        this.counties = { ...obj }
      } else {
        this.counties = { 0: '全市' }
      }
    }

    // 初始化所有用户信息
    async initData() {
      let res = await userClient.getAllUsers()
      if (res) {
        this.userInfo = res
        this.currentUserInfo = this.userInfo.slice(0, this.pageSize)
      } else {
        Vue['prototype']['$message']({
          type: 'warning',
          message: '用户信息获取失败'
        })
        this.userInfo = []
        this.currentUserInfo = []
      }
    }

    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    }

    // 打开新增窗口
    openAddPopup() {
      this.resetingPopupInfo = true
      for (let i in this.popupInfo.user) {
        this.popupInfo.user[i] = null
      }
      this.popupInfo.user.id = 0
      this.popupInfo.module = []
      this.popupType = 'add'
      setTimeout(() => this.resetingPopupInfo = false, 0)
    }

    // 打开编辑窗口
    handleEdit(row) {
      this.resetingPopupInfo = true
      this.popupInfo.user = {
        id: row.user.id,
        name: row.user.name,
        password: row.user.password,
        cellphone: row.user.cellphone,
        cityid: row.user.cityid,
        cityName: row.user.cityName,
        countyId: row.user.countyId,
        countyName: row.user.countyName
      }
      setTimeout(() => this.resetingPopupInfo = false, 0)
      if (row.module) {
        let modules: any[] = []
        for (let el of row.module) {
          modules.push(el.id)
        }
        this.popupInfo.module = modules
      } else {
        this.popupInfo.module = []
      }
      this.popupType = 'edit'
    }

    // 新增、修改用户数据
    async submitUser() {
      let id = this.popupInfo.user.id,
          name = this.popupInfo.user.name,
          password = this.popupInfo.user.password,
          cellphone = this.popupInfo.user.cellphone,
          cityid =  this.popupInfo.user.cityid,
          cityName = this.cities[cityid],
          countyId = this.popupInfo.user.countyId,
          countyName = this.counties[countyId],
          moduleIds = this.popupInfo.module
      let user = { id, name, password, cellphone, cityid, cityName, countyId, countyName }
      let res, tip = ''
      if (this.popupType === 'add') {
        res = await userClient.addUser(user)
        tip = '添加'
      } else if (this.popupType === 'edit') {
        res = await userClient.updateUser(user)
        tip = '修改'
      }
      if (res !== false) {
        let userId = this.popupType === 'add' ? res.id : id
        let param = { userId, moduleIds }
        let msg = await userModulesClient.saveUserModules(param)
        if (msg !== false)
          Vue['prototype']['$message']({
            type: 'success',
            message: tip + '成功'
          })
        else
          Vue['prototype']['$message']({
            type: 'error',
            message: '用户模块' + tip + '失败'
          })
        this.initData()

        // 新增用户  初始化设置阈值接口
        if (this.popupType === 'add') {
          let userId = res.id
          let rainParam = {
            userid: userId,
            id: -1,
            rain1h1: 20,
            rain1h2: 50,
            rain1h3: 100,
            rain3h1: 50,
            rain3h2: 100,
            rain3h3: 150,
            rain6h1: 100,
            rain6h2: 150,
            rain6h3: 200,
            stationNumber: 1
          }
          userThresholdsClient.saveThreshold(rainParam)
          let qpfParam = {
            userId,
            id: -1,
            rain11h: 20,
            rain12h: 50,
            rain13h: 100,
            rain21h: 35,
            rain22h: 75,
            rain23h: 125,
            rain31h: 50,
            rain32h: 100,
            rain33h: 150
          }
          userThresholdsClient.saveQPFThreshold(qpfParam)
          let cappiParam = {
            userid: userId,
            id: "-1",
            level: 1,
            intension: 30,
            area: 40
          }
          userThresholdsClient.saveCappiThresholds(cappiParam)
          let windParam = {
            userId,
            id: "-1",
            level: 1,
            stationNumber: 1,
            averageWind: 28.5,
            strongWind: 0
          }
          userThresholdsClient.saveWindThresholds(windParam)
        }

        this.popupType = null
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: tip + '失败'
        })
      }
    }

    // 删除
    handleDelete(row) {
      Vue['prototype']['$confirm']('确定删除该行数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await userClient.deleteUser(row.user.id)
        if (res !== false) {
          Vue['prototype']['$message']({
            type: 'success',
            message: '删除成功'
          })
          this.initData()
        } else {
          Vue['prototype']['$message']({
            type: 'error',
            message: '删除失败'
          })
        }
      }).catch(() => {})
    }

    // 删除 多选
    deleteMultiple() {
      if (!this.multipleSelection.length) {
        Vue['prototype']['$message']({
          type: 'warning',
          message: '请先选择需要删除的数据'
        })
        return
      }
      Vue['prototype']['$confirm']('确定删除选中的数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let pros: any[] = []
        for (let el of this.multipleSelection) {
          let pro = new Promise(async (resolve, reject) => {
            let res = await userClient.deleteUser(el.user.id)
            if (res !== false) resolve()
            else reject()
          })
          pros.push(pro)
        }
        Promise.all(pros)
        .then(() => {
          Vue['prototype']['$message']({
            type: 'success',
            message: '删除成功'
          })
          this.initData()
        })
        .catch(() => {
          Vue['prototype']['$message']({
            type: 'error',
            message: '删除失败'
          })
          this.initData()
        })
      }).catch(() => {})
    }

    // 新增修改弹窗 模块多选
    handleCheckAllChange(val) {
      let modules: any[] = []
      for (let el of this.modulesConf) {
        modules.push(el.id)
      }
      this.popupInfo.module = val ? modules : []
      this.isIndeterminate = false
    }
    handleCheckedModulesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.modulesConf.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.modulesConf.length
    }

    @Watch('popupType')
    onpopupTypeChanged (val: string, oldVal: string) {
      if (val === 'add') {
        this.checkAll = false
        this.isIndeterminate = false
      } else if (val === 'edit') {
        if (this.popupInfo.module.length === this.modulesConf.length) {
          this.checkAll = true
          this.isIndeterminate = false
        } else if(this.popupInfo.module.length === 0) {
          this.checkAll = false
          this.isIndeterminate = false
        } else {
          this.checkAll = false
          this.isIndeterminate = true
        }
      }
    }

    // 分页
    pageChanged(e) {
      this.currentPage = e
      this.currentUserInfo = this.userInfo.slice((e - 1) * 10, (e - 1) * 10 + this.pageSize)
    }
  }
</script>

<style lang='scss' scoped>
#UserManagement {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  min-width: 1000px;
  overflow: auto;
  height: calc(100% - 50px);
  .cover {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    background: rgba(0, 0, 0, .5);
    .popup {
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      width: 302px;
      header {
        line-height: 30px;
        background: #404040;
        span {
          margin-left: 10px;
          color: #fff;
          font-size: 14px;
        }
        .el-icon-close {
          float: right;
          margin: 9px 10px;
          color: #fff;
          cursor: pointer;
          &:hover { color: #f3ac12; }
        }
      }
      .cont {
        background: #fff;
        line-height: 24px;
        .info {
          position: relative;
          padding-top: 10px;
          span {
            display: inline-block;
            width: 70px;
            text-align: center;
          }
          input {
            width: 170px;
            height: 22px;
            padding: 0 10px;
            outline-color: #f3ac12;
            border: 1px solid #d9d9d9;
          }
          select {
            width: 192px;
            height: 24px;
            padding-left: 10px;
            outline-color: #f3ac12;
            border: 1px solid #d9d9d9;
          }
        }
        .module-list {
          .el-checkbox:first-child { margin-left: 15px; }
        }
        .btn-wrapper {
          padding: 10px;
        }
      }
    }
  }
  .wrapper {
    position: relative;
    padding: 20px;
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    header {
      margin-bottom: 20px;
      .btn-wrapper {
        float: right;
      }
    }
    .table-wrapper {
      min-height: 443px;
      .module-wrapper {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        .modules+.modules {
          margin-left: 5px;
        }
      }
    }
    .pagination-wrapper { margin: 10px 0; }
  }
}
</style>

<style lang='scss'>
#UserManagement {
  .el-pagination { float: right; }
  .el-table__body-wrapper {
    overflow-x: hidden !important;
    overflow-y: auto !important;
  }
  .el-checkbox+.el-checkbox {
    margin-left: 15px;
  }
}
</style>
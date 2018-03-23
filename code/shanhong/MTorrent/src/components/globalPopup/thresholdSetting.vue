<template>
  <main id="thresholdSettingPopup" class="global-popup" v-drag>
    <header>
      <span>阈值设置</span>
      <em @click="storePopupStatus_global({ key: 'thresholdSetting', action: false })"></em>
    </header>
    <div class="content">
      <div class="wrapper">

        <template v-if="typeSelected === 'rain'">
          <table class="warning-table" v-if="typeSelected === 'rain'">
            <thead>
              <tr>
                <th>等级</th>
                <th>1h</th>
                <th>3h</th>
                <th>6h</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="level"><em class="color yellow"></em>I级</td>
                <td><input type="text" v-model="rainWarningInfo.rain1h1"></td>
                <td><input type="text" v-model="rainWarningInfo.rain3h1"></td>
                <td><input type="text" v-model="rainWarningInfo.rain6h1"></td>
              </tr>
              <tr>
                <td class="level"><em class="color orange"></em>II级</td>
                <td><input type="text" v-model="rainWarningInfo.rain1h2"></td>
                <td><input type="text" v-model="rainWarningInfo.rain3h2"></td>
                <td><input type="text" v-model="rainWarningInfo.rain6h2"></td>
              </tr>
              <tr>
                <td class="level"><em class="color red"></em>III级</td>
                <td><input type="text" v-model="rainWarningInfo.rain1h3"></td>
                <td><input type="text" v-model="rainWarningInfo.rain3h3"></td>
                <td><input type="text" v-model="rainWarningInfo.rain6h3"></td>
              </tr>
            </tbody>
          </table>
          <div class="rain-station">
            <span class="desc" :title="'当前分区站点数为：' + totalStation">
              达到预警所需超过站点个数(<span class="station">{{ totalStation }}</span>)为：
            </span>
            <input type="text" v-model="rainWarningInfo.stationNumber">
          </div>
        </template>

        <table class="warning-table" v-else-if="typeSelected === 'qpf'">
          <thead>
            <tr>
              <th>等级</th>
              <th>1h</th>
              <th>2h</th>
              <th>3h</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="level"><em class="color yellow"></em>I级</td>
              <td><input type="text" v-model="qpfWarningInfo.rain11h"></td>
              <td><input type="text" v-model="qpfWarningInfo.rain21h"></td>
              <td><input type="text" v-model="qpfWarningInfo.rain31h"></td>
            </tr>
            <tr>
              <td class="level"><em class="color orange"></em>II级</td>
              <td><input type="text" v-model="qpfWarningInfo.rain12h"></td>
              <td><input type="text" v-model="qpfWarningInfo.rain22h"></td>
              <td><input type="text" v-model="qpfWarningInfo.rain32h"></td>
            </tr>
            <tr>
              <td class="level"><em class="color red"></em>III级</td>
              <td><input type="text" v-model="qpfWarningInfo.rain13h"></td>
              <td><input type="text" v-model="qpfWarningInfo.rain23h"></td>
              <td><input type="text" v-model="qpfWarningInfo.rain33h"></td>
            </tr>
          </tbody>
        </table>

        <table class="warning-table" v-else-if="typeSelected === 'cappi'">
          <thead>
            <tr>
              <th>等级</th>
              <th>强度</th>
              <th>面积</th>
              <th>描述</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(el, index) of cappiWarningInfo" :key="index">
              <td>
                <select v-model="el.level">
                  <option v-for="i in 3" :key="i" :value="i">{{ i }}</option>
                </select>
              </td>
              <td><input type="text" v-model="el.intension"></td>
              <td><input type="text" v-model="el.area"></td>
              <td class="desc">
                <span :title="`分区范围内出现强度大于${el.intension}dbz且面积大于${el.area}平方公里的回波`">
                  分区范围内出现强度大于{{ el.intension }}dbz且面积大于{{ el.area }}平方公里的回波
                </span>
              </td>
              <td><span class="del" @click="deleteRow(index, el.id)">删除</span></td>
            </tr>
          </tbody>
        </table>

        <table class="warning-table" v-else-if="typeSelected === 'wind'">
          <thead>
            <tr>
              <th>等级</th>
              <th :title="'当前分区站点数为：' + totalStation">
                站点数 (<span class="station">{{ totalStation }}</span>)
              </th>
              <th>平均风</th>
              <!-- <th>最大风</th> -->
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(el, index) of windWarningInfo" :key="index">
              <td>
                <select v-model="el.level">
                  <option v-for="i in 3" :key="i" :value="i">{{ i }}</option>
                </select>
              </td>
              <td><input type="text" v-model="el.stationNumber"></td>
              <td><input type="text" v-model="el.averageWind"></td>
              <!-- <td><input type="text" v-model="el.strongWind"></td> -->
              <td><span class="del" @click="deleteRow(index, el.id)">删除</span></td>
            </tr>
          </tbody>
        </table>

        <div class="bottom cf">
          <el-select class="opts" v-model="typeSelected" placeholder="请选择" size="mini">
            <el-option v-for="(el, key) in types" :key="key" :label="el" :value="key"></el-option>
          </el-select>
          <div class="btn-wrapper">
            <!-- <el-button :plain="true" type="warning" @click="delRainWarning" size="small" v-if="typeSelected === 'rain' || typeSelected === 'qpf'">重置</el-button>
            <el-button :plain="true" type="warning" @click="addRow" size="small" v-else>新增</el-button> -->
            <el-button :plain="true" type="warning" @click="addRow" size="small" v-if="typeSelected === 'cappi' || typeSelected === 'wind'">新增</el-button>
            <el-button :plain="true" type="warning" @click="setThreshold" size="small">确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { userThresholdsClient, productClient } from '../../util/clientHelper'
  import { rainWarningDefault, qpfWarningDefault } from ' ../../config/thresholdConf'

  @Component
  export default class thresholdSettingPopup extends Vue {
    @Getter('systemStore/userInfo_global') userInfo_global: any
    @Action('systemStore/storePopupStatus_global') storePopupStatus_global: any
    @Action('systemStore/storeResetThresholdp_global') storeResetThresholdp_global: any
    typeSelected: string = ''
    types: any = {
      rain: '降水预警',
      qpf: 'QPF预警',
      cappi: '强回波预警',
      wind: '大风预警'
    }
    rainWarningInfo: any = {}
    qpfWarningInfo: any = {}
    cappiWarningInfo: any[] = []
    windWarningInfo: any[] = []
    totalStation: number = 0

    mounted() {
      this.typeSelected = 'rain'
    }

    @Watch('typeSelected')
    onTypeSelectedChanged(val, oldVal) {
      if (val === 'rain') this.getRainWarningThreshold()
      else if (val === 'qpf') this.getQPFWarningThreshold()
      else if (val === 'cappi') this.getCappiWarningThreshold()
      else if (val === 'wind') this.getWindWarningThreshold()
    }

    // 获取降水预警阈值
    async getRainWarningThreshold() {
      if (!this.totalStation) this.findStationTotal()
      let userid = this.userInfo_global.user.id
      let res = await userThresholdsClient.getUserThreshold(userid)
      this.rainWarningInfo = res || Object.assign({ userid }, rainWarningDefault)
    }

    // 获取QPF预警阈值
    async getQPFWarningThreshold() {
      let userId = this.userInfo_global.user.id
      let res = await userThresholdsClient.getQPFThreshold(userId)
      this.qpfWarningInfo = res || Object.assign({ userId }, qpfWarningDefault)
    }

    // 获取回波预警阈值
    async getCappiWarningThreshold() {
      let userid = this.userInfo_global.user.id
      let res = await userThresholdsClient.getCappiThresholds(userid)
      if (res)
        this.cappiWarningInfo = res
    }

    // 获取大风预警阈值
    async getWindWarningThreshold() {
      if (!this.totalStation) this.findStationTotal()
      let userid = this.userInfo_global.user.id
      let res = await userThresholdsClient.getWindThresholds(userid)
      if (res)
        this.windWarningInfo = res
    }

    // 获取当前分区区域站点个数
    async findStationTotal() {
      let city = this.userInfo_global.user.cityid ? this.userInfo_global.user.cityName : ''
      let res = await productClient.findStationInfo('b', city)
      if (res) {
        let arr: any[] = []
        if (this.userInfo_global.user.countyId) {
          for (let el of res) {
            let reg = new RegExp(this.userInfo_global.user.countyName.slice(0, 2))
            if (reg.test(el.location.county))
              arr.push(el)
          }
        } else {
          arr = res
        }
        this.totalStation = arr.length
      }
    }

    // 回波、大风 新增行
    addRow() {
      if (this.typeSelected === 'cappi') {
        this.cappiWarningInfo.push({ id: "-1", level: 1, intension: 0, area: 0 })
      } else if (this.typeSelected === 'wind') {
        this.windWarningInfo.push({ id: "-1", level: 1, stationNumber: 0, averageWind: 0, strongWind: 0 })
      }
    }

    // 回波、大风 删除行
    deleteRow(index, id) {
      Vue['prototype']['$confirm']('确定删除改行阈值吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let info = this.typeSelected === 'cappi' ? this.cappiWarningInfo : this.windWarningInfo
        if (id !== '-1') {
          let res
          if (this.typeSelected === 'cappi')
            res = await userThresholdsClient.deleteCappiThresholds(id)
          else if (this.typeSelected === 'wind')
            res = await userThresholdsClient.deleteWindThresholds(id)
          if (res !== false) {
            info.splice(index, 1)
            Vue['prototype']['$message']({ type: 'success', message: '阈值删除成功' })
          } else
            Vue['prototype']['$message']({ type: 'error', message: '阈值删除失败，请稍后重试' })
        } else {
          info.splice(index, 1)
          Vue['prototype']['$message']({ type: 'success', message: '阈值删除成功' })
        }
      }).catch(() => {  })
    }

    // 设置阈值
    async setThreshold() {
      if (this.typeSelected === 'rain') {
        let param = this.rainWarningInfo
        for (let i in param)
          if (i !== 'id' && i !== 'userid') param[i] = Number(param[i])
        let res = await userThresholdsClient.saveThreshold(param)
        if (res !== false) {
          this.getRainWarningThreshold()
          Vue['prototype']['$message']({ type: 'success', message: '阈值设置成功' })
          this.storeResetThresholdp_global('RainWarning')   // 通知预警模块
        } else
          Vue['prototype']['$message']({ type: 'error', message: '阈值设置失败' })
      }
      else if (this.typeSelected === 'qpf') {
        let param = this.qpfWarningInfo
        for (let i in param)
          if (i !== 'id' && i !== 'userId') param[i] = Number(param[i])
        let res = await userThresholdsClient.saveQPFThreshold(param)
        if (res !== false) {
          this.getQPFWarningThreshold()
          Vue['prototype']['$message']({ type: 'success', message: '阈值设置成功' })
          this.storeResetThresholdp_global('QPFWarning')
        } else
          Vue['prototype']['$message']({ type: 'error', message: '阈值设置失败' })
      }
      else if (this.typeSelected === 'cappi') {
        let promiseArr: any[] = []
        for (let el of this.cappiWarningInfo) {
          let promise = new Promise(async (resolve, reject) => {
            for (let i in el)
              if (i === 'area' || i === 'intension') el[i] = Number(el[i])
            let param = Object.assign(el, { userid: this.userInfo_global.user.id })
            let res = await userThresholdsClient.saveCappiThresholds(param)
            if (res !== false) resolve()
            else reject()
          })
          promiseArr.push(promise)
        }
        Promise.all(promiseArr)
        .then(() => {
          this.getCappiWarningThreshold()
          Vue['prototype']['$message']({ type: 'success', message: '阈值设置成功' })
          this.storeResetThresholdp_global('CappiWarning')
        })
        .catch(e => {
          Vue['prototype']['$message']({ type: 'error', message: '阈值设置失败' })
        })
      }
      else if (this.typeSelected === 'wind') {
        let promiseArr: any[] = []
        for (let el of this.windWarningInfo) {
          let promise = new Promise(async (resolve, reject) => {
            for (let i in el)
              if (i === 'stationNumber' || i === 'averageWind' || i === 'strongWind') el[i] = Number(el[i])
            let param = Object.assign(el, { userId: this.userInfo_global.user.id })
            let res = await userThresholdsClient.saveWindThresholds(param)
            if (res !== false) resolve()
            else reject()
          })
          promiseArr.push(promise)
        }
        Promise.all(promiseArr)
        .then(() => {
          this.getWindWarningThreshold()
          Vue['prototype']['$message']({ type: 'success', message: '阈值设置成功' })
          this.storeResetThresholdp_global('WindWarning')
        })
        .catch(e => {
          Vue['prototype']['$message']({ type: 'error', message: '阈值设置失败' })
        })
      }
    }

    // 降水、QPF 删除阈值（重设按钮）
    delRainWarning() {
      Vue['prototype']['$confirm']('确定恢复默认阈值吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (this.typeSelected === 'rain') {
          let id = this.rainWarningInfo.id
          let res = await userThresholdsClient.deleteThreshold(id)
          if (res !== false) {
            Vue['prototype']['$message']({ type: 'success', message: '恢复默认阈值成功' })
            let userid = this.userInfo_global.user.id
            this.rainWarningInfo = Object.assign({ userid }, rainWarningDefault)
            this.storeResetThresholdp_global('RainWarning')
          } else
            Vue['prototype']['$message']({ type: 'warning', message: '恢复默认阈值失败，或已是默认阈值' })
        }
        else if (this.typeSelected === 'qpf') {
          let id = this.qpfWarningInfo.id
          let res = await userThresholdsClient.deleteQPFThreshold(id)
          if (res !== false) {
            Vue['prototype']['$message']({ type: 'success', message: '恢复默认阈值成功' })
            let userId = this.userInfo_global.user.id
            this.qpfWarningInfo = Object.assign({ userId }, qpfWarningDefault)
            this.storeResetThresholdp_global('QPFWarning')
          } else
            Vue['prototype']['$message']({ type: 'warning', message: '恢复默认阈值失败，或已是默认阈值' })
        }
      }).catch(() => {  })
    }
  }
</script>

<style lang='scss' scoped>
#thresholdSettingPopup {
  position: absolute;
  top: 30%;
  left: calc(50% - 175px);
  width: 350px;
  .content {
    padding-top: 8px;
    .wrapper {
      table.warning-table {
        color: #999;
        margin-left: 5px;
        width: calc(100% - 10px);
        thead {
          tr {
            th {
              text-align: center;
              line-height: 24px;
              &:first-child { width: 65px; }
              .station {
                color: #f3ac12;
              }
            }
          }
        }
        tbody {
          tr {
            td {
              text-align: center;
              &.level { text-indent: 10px; }
              line-height: 30px;
              &:first-child {
                position: relative;
                em.color {
                  position: absolute;
                  top: 9px;
                  left: 10px;
                  display: inline-block;
                  width: 10px;
                  height: 10px;
                  border-radius: 5px;
                  border: 1px solid #ccc;
                  &.yellow { background: yellow; }
                  &.orange { background: orange; }
                  &.red { background: red; }
                }
              }
              select {
                padding-left: 10px;
                width: 55px;
                height: 20px;
                border: 1px solid #d9d9d9;
                border-radius: 2px;
              }
              input[type="text"] {
                padding: 0 10px;
                width: 35px;
                height: 18px;
                outline-color: #f3ac12;
                border: 1px solid #d9d9d9;
                border-radius: 2px;
              }
              span.del {
                cursor: pointer;
                color: #666;
                &:hover {
                  color: #f3ac12;
                  text-decoration: underline;
                }
              }
              &.desc {
                max-width: 115px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
      .rain-station {
        margin-top: 5px;
        text-indent: 30px;
        height: 20px;
        line-height: 20px;
        color: #999;
        .desc {
          .station {
            color: #f3ac12;
          }
        }
        input[type="text"] {
          margin-left: 20px;
          padding: 0 10px;
          width: 35px;
          height: 18px;
          outline-color: #f3ac12;
          border: 1px solid #d9d9d9;
          border-radius: 2px;
        }
      }
      .bottom {
        padding: 10px 0;
        .opts {
          margin-left: 5px;
        }
        .btn-wrapper {
          float: right;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>

<style lang='scss'>
#thresholdSettingPopup {
  .el-input {
    width: 95px;
    .el-input__icon { display: inline-block; }
    .el-input__inner {
      padding: 3px 10px;
      color: #f3ac12;
      font-size: 12px;
      border: none;
      background: #fff;
      text-align: left;
      text-indent: 6px;
      border-radius: 0;
      cursor: pointer;
    }
  }
  .el-select .el-input .el-input__icon {
    color: #f3ac12;
  }
  .el-button--small {
    padding: 7px 15px;
    border-radius: 14px;
    background: #fff;
    border: 1px solid #bfcbd9;
    color: #1f2d3d;
    font-weight: 400;
  }
  .el-button--warning:hover, .el-button--warning:focus {
    color: #eb9e05;
    border-color: #f7d89b;
  }
}
</style>

<template>
  <main id="TargetRelease">
    <div class="select-popup" v-if="selectPopup">
      <ul class="list">
        <li v-for="(el, index) in currentList" :key="index" :class="{on: el.selected}"
            @click="el.selected = !el.selected">
          {{ el.name }}
        </li>
      </ul>
      <div class="btn-wrapper">
        <div class="primary-btn all" @click="toggleAllOpts">{{ toggleAllOptsText }}</div>
        <div class="primary-btn select" @click="closeSelectPopup">确定</div>
      </div>
    </div>

    <div class="main-wrapper" @click="blurControl = Date.now()">
      <div class="val"><span>政府部门</span></div>
      <div class="select-wrapper cf">
        <div class="select-info">
          <div class="select-info-list">
            <span v-for="(el, index) in depsList.filter(opt => opt.selected)" :key="index">{{ el.name }}</span>
          </div>
          <!-- <ul>
            <li v-for="(el, index) in depsList.filter(opt => opt.selected)" :key="index">
              <span>{{ el.name }}</span>
              <i @click="el.selected = false"></i>
            </li>
          </ul> -->
        </div>
        <div class="select-btn" @click.stop="togglePopup('deps')">＋</div>
      </div>

      <div class="val"><span>发布区域</span></div>
      <div class="select-wrapper cf">
        <div class="select-info">
          <div class="select-info-list">
            <span v-for="(el, index) in townList.filter(opt => opt.selected)" :key="index">{{ el.name }}</span>
          </div>
          <!-- <ul>
            <li v-for="(el, index) in townList.filter(opt => opt.selected)" :key="index">
              <span>{{ el.name }}</span>
              <i @click="el.selected = false"></i>
            </li>
          </ul> -->
        </div>
        <div class="select-btn" @click.stop="togglePopup('town')">＋</div>
      </div>

      <div class="val"><span>单位企业</span></div>
      <div class="select-wrapper cf">
        <div class="select-info">
          <div class="select-info-list">
            <span v-for="(el, index) in orgsList.filter(opt => opt.selected)" :key="index">{{ el.name }}</span>
          </div>
          <!-- <ul>
            <li v-for="(el, index) in orgsList.filter(opt => opt.selected)" :key="index">
              <span>{{ el.name }}</span>
              <i @click="el.selected = false"></i>
            </li>
          </ul> -->
        </div>
        <div class="select-btn" @click.stop="togglePopup('orgs')">＋</div>
      </div>

      <div class="val">信息内容</div>
      <textarea v-model="targetMessage" placeholder="填写发布内容"></textarea>
      <div class="primary-btn" @click="targetRelease">发布</div>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { geoClient, releaseClient } from '@/util/ClientHelper'

  @Component
  export default class TargetRelease extends Vue {
    @Getter('systemStore/userInfo_global') userInfoGlobal
    @Getter('decisionStore/region_global') region_global
    blurControl: boolean = false
    selectPopup: boolean = false
    targetMessage: string = ''
    depsList: any[] = []
    townList: any[] = []
    orgsList: any[] = []
    currentList: any[] = []

    mounted() {
      this.getDepartment()
      this.getArea()
      this.getUnit()
    }

    async getDepartment() {
      // let res: departmentDetail[] | false = await releaseClient.getDepartment()
      // if (!res) return
      
      // let dist = {}
      // for (let el of res) {
      //   if (!dist[el.department])
      //     dist[el.department] = {
      //       id: [el.did],
      //       name: el.department
      //     }
      //   else
      //     dist[el.department].id.push(el.did)
      // }
      // let arr: any[] = Object.values(dist)
      // for (let el of arr) {
      //   el.selected = false
      // }
      // this.depsList = arr

      let res: departmentheadDetail[] | false = await releaseClient.getDepartmenthead()
      if (!res) return
      let arr = []
      for (let el of res) {
        arr.push({ id: el.id, name: el.department, selected: false })
      }
      this.depsList = arr
    }

    async getArea() {
      let res = await geoClient.findCounties(this.region_global.cityId)
      if (!res) return
      let arr = []
      for (let el of res) {
        arr.push({ id: el.countyid, name: el.county, selected: false })
      }
      this.townList = arr
    }

    async getUnit() {
      this.orgsList = [
        { id: 1, name: '危化品企业', selected: false },
        { id: 3, name: '学校', selected: false },
        { id: 4, name: '应急物资', selected: false },
        { id: 5, name: '救援队', selected: false },
        { id: 6, name: '学校', selected: false },
        { id: 7, name: '避难所', selected: false },
        { id: 9, name: '灾害点', selected: false },
      ]
    }

    async togglePopup(type: 'deps' | 'town' | 'orgs') {
      this.selectPopup = true
      switch(type) {
        case 'deps': this.currentList = this.depsList; break;
        case 'town': this.currentList = this.townList; break;
        case 'orgs': this.currentList = this.orgsList; break;
      }
    }

    get toggleAllOptsText() {
      let arr: boolean[] = []
      for (let el of this.currentList) {
        arr.push(el.selected)
      }
      return arr.includes(false) ? '全选' : '清空'
    }

    toggleAllOpts() {
      let flag = true
      for (let el of this.currentList) {
        if (!el.selected) {
          flag = false
          break
        }
      }
      for (let el of this.currentList) {
        el.selected = !flag
      }
    }

    closeSelectPopup() {
      this.currentList = []
      this.selectPopup = false
    }

    @Watch('blurControl')
    onblurControlChanged (val: number, oldVal: number) {
      this.closeSelectPopup()
    }

    async targetRelease() {
      if (!this.targetMessage) {
        Vue['prototype']['$message']({ type: 'warning', message: '请填写发布内容' })
        return
      }

      // let govDepart = ''
      // let govArr: string[] = []
      // for (let el of this.depsList) {
      //   if (el.selected)
      //     govArr.push(el.id.join(','))
      // }
      // govDepart = govArr.join(',')
      let govDepart: number[] = []
      for (let el of this.depsList) {
        if (el.selected) govDepart.push(el.id)
      }

      let area: number[] = []
      for (let el of this.townList) {
        if (el.selected) area.push(el.id)
      }

      let unitEnt: number[] = []
      for (let el of this.orgsList) {
        if (el.selected) unitEnt.push(el.id)
      }

      let param = {
        govDepart: govDepart.join(','),
        area: area.join(','),
        unitEnt: unitEnt.join(','),
        content: this.targetMessage,
        enteringName: this.userInfoGlobal.nick
      }

      let res: null | false = await releaseClient.targetedRelease(param)
      if (res === null)
        Vue['prototype']['$message']({ type: 'success', message: '发布成功' })
      else
        Vue['prototype']['$message']({ type: 'error', message: '发布失败' })
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../../styles/theme.scss';
#TargetRelease {
  position: relative;
  .select-popup {
    z-index: 1;
    position: absolute;
    top: 30px;
    left: 0;
    padding: 10px 15px;
    width: 340px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 0 5px #8d9db5;
    ul.list {
      li {
        margin-bottom: 5px;
        margin-left: 2px; /*no*/
        display: inline-block;
        padding: 0 7px;
        height: 22px;
        line-height: 22px;
        background: #f5f5f5;
        border: 1px solid #fff;
        cursor: pointer;
        &.on {
          background: #dff3fc;
          border: 1px solid #00a0e9;
        }
      }
    }
    .btn-wrapper {
      margin-top: 5px;
      position: relative;
      height: 22px;
      .primary-btn {
        position: absolute;
        top: 0;
        height: 22px;
        line-height: 22px;
        &.all {
          left: 65px;
        }
        &.select {
          left: 155px;
        }
      }
    }
  }
  .main-wrapper {
    .val {
      position: relative;
      height: 30px;
      line-height: 30px;
      span {
        position: absolute;
        display: inline-block;
        left: 0;
      }
    }
    textarea {
      box-sizing: border-box;
      padding: 10px 15px;
      width: 340px;
      height: 100px;
      color: #777;
      border-color: #d8dce5;
    }
    >.primary-btn {
      margin: 10px 130px 0;
    }
    .select-wrapper {
      height: 30px;
      .select-info {
        position: relative;
        float: left;
        max-width: 310px;
        line-height: 30px;
        .select-info-list {
          position: relative;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          span {
            height: 30px;
            line-height: 30px;
            margin-right: 5px;
            color: #5a5e66;
          }
        }
        // >ul {
        //   position: relative;
        //   overflow: hidden;
        //   text-overflow: ellipsis;
        //   white-space: nowrap;
        //   li {
        //     display: inline-block;
        //     height: 30px;
        //     line-height: 30px;
        //     span {
        //       float: left;
        //       color: #5a5e66;
        //     }
        //     i {
        //       margin: 7px 7px 0 3px;
        //       display: inline-block;
        //       width: 16px;
        //       height: 16px;
        //       border-radius: 50%;
        //       cursor: pointer;
        //       background: $themeColor url(~Img/DecisionCommand/close.png) no-repeat center / 8px 8px;
        //     }
        //   }
        // }
      }
      .select-btn {
        float: left;
        box-sizing: border-box;
        margin-top: 3px;
        width: 24px;
        height: 24px;
        font-size: 22px;
        line-height: 22px;
        text-align: center;
        color: #adadad;
        background: #f2f2f2;
        border: 1px solid #d2d2d2;
        cursor: pointer;
      }
    }
  }
}
</style>
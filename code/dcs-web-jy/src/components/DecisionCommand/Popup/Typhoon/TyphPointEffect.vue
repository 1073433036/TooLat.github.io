<template>
  <main id="TyphPointEffect" class="decision-popup" v-drag>
    <header>
      <span>台风影响分析</span>
      <a @click="storePopupStatus_global({ key: 'typhPointEffect', action: false })"></a>
    </header>
    <div class="content" v-loading="isLoading" element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading">
      <div class="no-effect" v-if="!isWindCircleExistent">无风圈信息</div>

      <template v-if="isWindCircleExistent && tabOptSelected">
        <div class="tabs-wrapper">
          <ul class="tabs">
            <li v-for="(el, key) in windCircleTabOpt" :key="key"
                :class="{on: tabOptSelected === key}" v-if="el.existent"
                @click="tabOptSelected = key">
              {{ el.name }}
            </li>
          </ul>
        </div>

        <div class="effect-content">
          <ul>
            <li v-for="(el, key) in elementsConf" :key="key">
              <span>{{ el }}： </span>
              {{ key in windCircleTabOpt[tabOptSelected].effect
                ? windCircleTabOpt[tabOptSelected].effect[key]
                : '未知' }}
            </li>
          </ul>
        </div>

        <textarea v-model="messageString" placeholder="输入发送内容"></textarea>
        <div class="primary-btn" @click="release">靶向发布</div>
      </template>

    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { typhoonClient, releaseClient } from '@/util/ClientHelper'
  import { geoConf } from '@/config/geographyConf'

  let effectResult = {
    rr06: {}, rr07: {}, rr08: {}, rr10: {}
  }

  @Component
  export default class TyphPointEffect extends Vue {
    @Getter('decisionStore/region_global') region_global
    @Getter('decisionStore/typhPointEffect_global') typhPointEffect_global
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global

    isLoading: boolean = false
    elementsConf = geoConf.elementsConf
    windCircleTabOpt: any = {
      rr06: {
        name: '六级风圈',
        existent: false,
        effect: {}
      }, 
      rr07: {
        name: '七级风圈',
        existent: false,
        effect: {}
      }, 
      rr08: {
        name: '八级风圈',
        existent: false,
        effect: {}
      }, 
      rr10: {
        name: '十级风圈',
        existent: false,
        effect: {}
      }
    }
    tabOptSelected: string = 'rr06'
    get isWindCircleExistent () {
      let flag = false
      for (let i in this.windCircleTabOpt) {
        if (this.windCircleTabOpt[i].existent) {
          flag = true
          break
        }
      }
      return flag
    }
    messageString: string = ''

    mounted() {
      this.getWindCircleOpt()
    }

    async getWindCircleOpt() {
      this.isLoading = true
      let optSelected
      let lon = this.typhPointEffect_global.lon,
          lat = this.typhPointEffect_global.lat
      for (let i in this.windCircleTabOpt) {
        let flag = this.typhPointEffect_global[i] ? true : false
        this.windCircleTabOpt[i].existent = flag
        if (!flag) {
          this.windCircleTabOpt[i].effect = {}
          effectResult[i] = {}
          continue
        }
        if (!optSelected) optSelected = i

        let res: any = await typhoonClient.findPointInCircle(lon, lat, this.typhPointEffect_global[i])
        if (!res) {
          this.windCircleTabOpt[i].effect = {}
          effectResult[i] = {}
          continue
        }
        for (let type in res) {
          if (!this.elementsConf[type]) continue
          let arr: any[] = []
          for (let el of res[type]) {
            if (el.cityid === this.region_global.cityId)
              arr.push(el)
          }
          effectResult[i][type] = arr
          this.windCircleTabOpt[i].effect[type] = arr.length
        }
      }
      this.windCircleTabOpt = { ...this.windCircleTabOpt }
      console.log(effectResult)
      this.tabOptSelected = optSelected
      this.isLoading = false
    }

    @Watch('typhPointEffect_global')
    onTyphPointEffect_globalChanged (val: any, oldVal: any) {
      this.getWindCircleOpt()
    }

    async release() {
      if (!this.messageString) {
        Vue['prototype']['$message']({ type: 'warning', message: '请填写说明' })
        return
      }

      let phones = []
      for (let i in effectResult[this.tabOptSelected]) {
        for (let el of effectResult[this.tabOptSelected][i]) {
          if ('phone' in el) {
            phones.push(Number(el.phone))
            continue
          }
          if ('cellphone' in el) {
            phones.push(Number(el.cellphone))
            continue
          }
          if ('managercellphone' in el) {
            phones.push(Number(el.managercellphone))
            continue
          }
          if ('contactcellphone' in el)
            phones.push(Number(el.contactcellphone))
        }
      }

      if (!phones.length) {
        Vue['prototype']['$message']({ type: 'error', message: '发送对象为空' })
        return
      }

      let res: boolean = await releaseClient.sendMsgToDetail(this.messageString, phones)
      if (res)
        Vue['prototype']['$message']({ type: 'success', message: '发布成功' })
      else
        Vue['prototype']['$message']({ type: 'error', message: '发布失败' })
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../../styles/theme.scss';
#TyphPointEffect {
  position: absolute;
  top: calc(50vh - 193px);
  left: 400px;
  width: 320px;
  color: #575757;
  >.content {
    padding: 10px;
    min-height: 109px;
    .no-effect {
      line-height: 26px;
    }
    .tabs-wrapper {
      margin-bottom: 5px;
      ul.tabs {
        display: flex;
        justify-content: center;
        li {
          margin-left: 2px;
          width: 70px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          color: #777;
          background: #f5f5f5;
          cursor: pointer;
          &.on {
            color: #fff;
            background: $themeColor;
          }
        }
      }
    }
    .effect-content {
      >ul {
        > li {
          display: inline-block;
          height: 26px;
          line-height: 26px;
          width: 50%;
          cursor: pointer;
        }
      }
    }
    textarea {
      box-sizing: border-box;
      padding: 10px;
      border: 1px solid #bbb; /*no*/
      width: calc(100% - 20px);
      margin: 10px 0 10px 10px;
      height: 80px;
    }
    .primary-btn {
      margin-left: 110px;
    }
  }
}
</style>
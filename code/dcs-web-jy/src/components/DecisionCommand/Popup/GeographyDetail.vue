<template>
  <main id="GeographyDetail" class="decision-popup" v-drag>
    <header>
      <span>{{ (type === 4 || type === 5) ? point.address : (type > 900 ? point._name : point.name ) }}</span>
      <a @click="closePopup"></a>
    </header>
    <div class="content">

      <section class="material" v-if="type === 4">
        <ul class="category">
          <li v-for="(opt, key) in info" :key="key">
            <div class="category-title" @click="toggleCategory(key)">
              {{ key }}（<span style="color: #f00">{{ opt.sub.length }}</span>）
            </div>
            <ul :class="['lists scroll-bar', {mult: Object.keys(opt.sub).length > 1}]" v-if="opt.isSelected">
              <li v-for="(item, index) in opt.sub" :key="index">
                <ul class="details">
                  <li v-for="(el, key) in paramOpts" :key="key" :title="item[key]">
                    <span>{{ el + '：' }}</span>{{ !item[key] && item[key] !== 0 ?  ' --- ' : item[key] }}
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </section>

      <section class="rescueteam" v-else-if="type === 5">
        <ul :class="['lists scroll-bar', {mult: Object.keys(info).length > 1}]">
          <li v-for="(item, index) in info" :key="index">
            <ul class="details">
              <li :title="item['_name']">
                队伍名称： {{ !item['_name'] && item['_name'] !== 0 ?  ' --- ' : item['_name'] }}
              </li><li v-for="(el, key) in paramOpts" :key="key" :title="item[key]">
                <span>{{ el + '：' }}</span>{{ !item[key] && item[key] !== 0 ?  ' --- ' : item[key] }}
              </li>
            </ul>
          </li>
        </ul>
      </section>

      <section class="geography" v-else>
        <ul class="details">
          <li v-for="(el, key) in paramOpts" :key="key" :title="info[key]">
            <span>{{ el + '：' }}</span>{{ !info[key] && info[key] !== 0 ?  ' --- ' : info[key] }}
          </li>
        </ul>
      </section>

    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { geoConf } from '@/config/geographyConf'

  @Component
  export default class GeographyDetail extends Vue {
    @Getter('decisionStore/geoDetailType_global') type
    @Getter('decisionStore/geoDetailPoint_global') point
    @Getter('decisionStore/geoDetailInfo_global') info
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    @Action('decisionStore/storeGeoDetailInfo_global') storeGeoDetailInfo_global

    paramOpts: any = {}

    mounted() {
      this.changeParamOpts()
    }

    changeParamOpts() {
      let key = (this.type === 4 || this.type === 5) ? this.point._type : this.point._subType
      this.paramOpts = { ...geoConf.params[key] }
    }

    closePopup() {
      this.storePopupStatus_global({ key: 'geographyDetail', action: false })
      this.storeGeoDetailInfo_global({})
    }

    @Watch('type')
    onTypeChanged (val: any, oldVal: any) {
      this.changeParamOpts()
    }

    toggleCategory(key) {
      let flag = this.info[key].isSelected
      for (let i in this.info) {
        this.info[i].isSelected = false
      }
      this.info[key].isSelected = !flag
    }
  }
</script>

<style lang='scss' scoped>
#GeographyDetail {
  position: absolute;
  top: 80px;
  right: 20px; /*no*/
  transform: translateY(36px); /*no*/
  width: 580px;
  color: #575757;
  .content {
    padding: 15px;
    .material {
      >ul.category {
        >li {
          .category-title {
            height: 26px;
            line-height: 26px;
            border-bottom: 1px solid #dfe7f2; /*no*/
            cursor: pointer;
          }
        }
      }
    }
    ul.lists {
      &.mult {
        max-height: 220px;
        overflow: auto;
      }
      >li {
        position: relative;
        &:not(:nth-child(1)) {
          margin-top: 10px;
        }
      }
    }
    ul.details {
      >li {
        display: inline-block;
        width: 50%;
        padding: 0 2%;
        box-sizing: border-box;
        height: 26px;
        line-height: 26px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        >span {
          color: #575757;
        }
      }
    }
  }
}
</style>

<template>
  <main id="TyphSearch" class="cf">
    <div class="typh-year-wrapper cf" v-show="typhTimelineStatus_global !== 'search'">
      <em @click="changeTyphCurrentYear('preYear')"></em>
      <span>{{typhCurrentYear_global}}</span>
      <em @click="changeTyphCurrentYear('nextYear')"></em>
    </div>
    <div class="search-container cf">
      <span class="search-icon"></span>
      <input type="text" id="searchTyph" placeholder="搜索历史台风" v-model="searchText" @focus="searching = true">
    </div>
    <div class="action-indicator" @click="toggleTimelineStatus" 
        :style="{transform: typhTimelineStatus_global === 'search' ? 'rotateZ(0deg)' : (typhTimelineStatus_global === 'history' ? 'rotateZ(180deg)' : 'rotateZ(-90deg)')}">
    </div>
    
    <div class="search-result-wraper" v-show="searching">
      <ul>
        <li v-for="(el,index) in searchResult" :key="index" @click="selectTyph_global(el.tsid)">
          {{el.intlid}} {{(el.info && el.info.cname) ? el.info.cname : '未命名'}}
        </li>
        <transition name="searchNoResult">
          <li v-if="haveNoResult" class="have-no-result">没有匹配的台风!</li>
        </transition>
      </ul>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { searchTyph } from "./typhUtil"

  @Component
  export default class TyphSearch extends Vue {
    @Prop() maxTyphYear
    @Prop() minTyphYear

    @Getter('decisionStore/typhCurrentYear_global') typhCurrentYear_global
    @Getter('decisionStore/typhTimelineStatus_global') typhTimelineStatus_global
    @Action('decisionStore/changeTyphCurrentYear_global') changeTyphCurrentYear_global
    @Action('decisionStore/toggleTyphTimelineStatus_global') toggleTyphTimelineStatus_global
    @Action('decisionStore/selectTyph_global') selectTyph_global

    searchText: string = ''
    searchResult: Array<any> = []
    haveNoResult: boolean = false
    searchInputDelay: any = null
    searching: boolean = false

    @Watch('searchText')
    async onsearchTextChanged(val, oldVal: string) {
      this.searchResult = []
      setTimeout(() => {
        this.haveNoResult = false
      }, 300)
      if (this.searchInputDelay) clearTimeout(this.searchInputDelay)
      this.searchInputDelay = setTimeout(async () => {
        if (val === "") {
          this.searching = false
          this.searchResult = []
          return
        }

        let data: any[] = await searchTyph(val)
        
        if (data.length === 0) {
          this.haveNoResult = true
          return
        }
        this.searchResult = data
        this.searching = true
        console.info(this.searchResult)
      }, 500)
    }

    changeTyphCurrentYear(action: 'nextYear' | 'preYear') {
      if (action === 'nextYear') {
        if (this.typhCurrentYear_global == this.maxTyphYear) return
        this.changeTyphCurrentYear_global(this.typhCurrentYear_global + 1)
      }

      if (action === 'preYear') {
        if (this.typhCurrentYear_global == this.minTyphYear) return
        this.changeTyphCurrentYear_global(this.typhCurrentYear_global - 1)
      }
      this.toggleTyphTimelineStatus_global('history')
    }

    toggleTimelineStatus() {
      switch (this.typhTimelineStatus_global) {
        case 'search':
          this.toggleTyphTimelineStatus_global('history'); break
        case 'history':
          this.toggleTyphTimelineStatus_global('search'); break
        case 'detail':
          this.toggleTyphTimelineStatus_global('history'); break
        default:
          this.toggleTyphTimelineStatus_global('search')
      }
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../../styles/theme.scss';
#TyphSearch {
  height: 30px; /*no*/
  display: inline-block;
  margin: 0 0 2px 30px; /*no*/
  position: relative;
  div {
    float: left;
  }

  div.action-indicator {
    position: relative;
    cursor: pointer;
    height: 30px; /*no*/
    width: 30px; /*no*/
    margin-left: 1px; /*no*/
    background: #fff;
    &::before {
      position: absolute;
      top: 10px; /*no*/
      left: 7px; /*no*/
      content: '';
      width: 0;
      height: 0;
      border-left: 8px solid transparent; /*no*/
      border-right: 8px solid transparent; /*no*/
      border-bottom: 8px solid #989898; /*no*/
    }
    &::after {
      position: absolute;
      top: 12px; /*no*/
      left: 9px; /*no*/
      content: '';
      width: 0;
      height: 0;
      border-left: 6px solid transparent; /*no*/
      border-right: 6px solid transparent; /*no*/
      border-bottom: 6px solid #fff; /*no*/
    }
    &:hover {
      &::before {
        border-bottom: 8px solid $themeColor; /*no*/
      }
    }
  }

  .canntChangeYear {
    fill: gray !important;
  }

  .typh-year-wrapper {
    width: 70px; /*no*/
    height: 30px; /*no*/
    overflow: hidden;
    margin-right: 1px; /*no*/
    background-color: #fff;
    color: #666;
    span {
      width: 38px; /*no*/
      text-align: center;
      height: 30px; /*no*/
      line-height: 30px; /*no*/
      display: block;
      float: left;
    }
    em {
      display: block;
      float: left;
      position: relative;
      height: 30px; /*no*/
      line-height: 30px; /*no*/
      width: 16px; /*no*/
      cursor: pointer;
      &::after {
        position: absolute;
        top: 12px; /*no*/
        left: 5.5px; /*no*/
        content: '';
        width: 0;
        height: 0;
        border-top: 3px solid transparent; /*no*/
        border-bottom: 3px solid transparent; /*no*/
        border-right: 5px solid #989898; /*no*/
      }
      &:hover {
        &::after {
          border-right: 5px solid $themeColor; /*no*/
        }
      }
      &:last-of-type {
        transform: rotateZ(180deg);
      }
    }
  }

  div.search-container {
    background-color: white;
    height: 30px; /*no*/
    background-color: #fff; /*no*/
    position: relative;
    span.search-icon {
      display: block;
      float: left;
      width: 30px; /*no*/
      margin-left: 4px; /*no*/
      height: 100%;
      background-image: url(~Img/DecisionCommand/typh_search_pre.png);
      background-position: center;
      background-repeat: no-repeat;
    }
    input {
      width: 86px; /*no*/
      font-size: 12px; /*no*/
      line-height: 30px; /*no*/
      height: 30px; /*no*/
      border: none;
      background-color: transparent;
      transition: width .3s ease-out;
      color: #8d949e;
      &:focus {
        outline: none;
        width: 150px; /*no*/
        color: #000;
      }
      &::-webkit-input-placeholder {
        color: #8d949e;
      }
    }
  }

  div.search-result-wraper {
    position: absolute;
    width: 180px; /*no*/
    box-sizing: border-box;
    right: -185px; /*no*/
    top: 30px; /*no*/
    transform: translateY(-100%);
    ul {
      width: 100%;
    }
    li {
      width: 100%;
      box-sizing: border-box;
      padding-left: 30px; /*no*/
      color: #999;
      font-size: 12px; /*no*/
      line-height: 22px; /*no*/
      height: 22px; /*no*/
      letter-spacing: .5px; /*no*/
      background: #fff;
      cursor: pointer;
      &:hover {
        color: $themeColor;
      }
    }
  }

  .have-no-result {
    position: absolute;
    font-weight: bold;
    bottom: 0;
    color: #eb6671 !important;
  }

  .searchNoResult-enter {
    opacity: 0;
    transform: translateY(15px); /*no*/
  }

  .searchNoResult-leave-active {
    opacity: 0;
    transform: translateY(-15px); /*no*/
  }

  .searchNoResult-enter-active,
  .searchNoResult-leave {
    transition: all .3s cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  .list-complete-index {
    transition: all 1s;
    display: inline-block;
    margin-right: 10px; /*no*/
  }

  .list-complete-enter,
  .list-complete-leave-active {
    opacity: 0;
    transform: translateY(30px); /*no*/
  }

  .list-complete-leave-active {
    position: absolute;
  }
}
</style>
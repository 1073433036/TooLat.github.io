<template>
  <main id="typh-search-wraper" class="cf">
    <div class="action-indicator" @click="toggleTimelineStatus">
      <svg width="40px" height="30px">
        <rect cx="0" cy="0" width="40px" height="30px" />
        <path v-if="this.typhTimeLineStatus_global==='search'" data-for="up" d="M 10,20 L 20,10 L 30,20" />
        <path v-if="this.typhTimeLineStatus_global==='history'" data-for="down" d="M 10,10 L 20,20 L 30,10" />
        <path v-if="this.typhTimeLineStatus_global==='deteil'" data-for="left" d="M 25,5 L 15,15 L 25,25" />
      </svg>
    </div>
    <div class="status-indicator">
      <span class="status-text-container"
        v-if="typhTimeLineStatus_global !== 'history'">
      {{typhTimeLineStatus_global === 'deteil' ?  typhCurrentName_global : '历史台风'}}
      </span>
      <section class="toggle-history-typh-wraper cf ns" v-else>
        <svg @click="changeTyphCurrentYear('preYear')" width="16px" height="30px">
          <rect x="0" y="0" width="16px" height="30px" />
          <path d="M 10,11 L 6,15 L 10,19 Z"
            :class="{'canntChangeYear': typhCurrentYear_global === minYear}"/>
        </svg>
        <span>{{typhCurrentYear_global}}</span>
        <svg @click="changeTyphCurrentYear('nextYear')" width="16px" height="30px">
          <rect x="0" y="0" width="16px" height="30px" />
          <path d="M 6,11 L 10,15 L 6,19 Z"
            :class="{'canntChangeYear': typhCurrentYear_global === maxYear}"/>
        </svg>
      </section>
    </div>
    <div class="search-container">
      <svg width="12px" height="12px">
        <circle cx="5" cy="5" r="4.5" />
        <path d="M 12,12 L 8,8" />
      </svg>
      <input type="text" placeholder="输入台风中文名或英文名" v-model="searchText">
    </div>
    <div class="search-result-wraper" v-if="searching">
      <ul>
        <li v-for="(el, index) in searchResult" :key="index"
          @click="selectTyph(el.tsid)">
          {{el.intlid}}{{el.info.cname}}
        </li>
        <transition name="searchNoResult">
          <li v-if="haveNoResult" class="have-no-result">没有匹配的台风!</li>
        </transition>
      </ul>
    </div>
  </main>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import {getAllHistoryTyph, searchTyph} from './typhUtil'

let searchInputDelay = null;
export default{
  props: {
    allTyphData: Object
  },
  data() {
    return {
      typhHistoryYear: [],
      maxYear: null,
      minYear: null,

      searchText: '',
      searchResult: [],
      haveNoResult: false,
      searching: false
    }
  },
  mounted() {
    /*getAllHistoryTyph(this.$http, (data, arr) => {
      this.storeBefore03TyphIds_global(arr);
      for(let year in data) {
        if(!this.typhHistoryYear.includes(year)) {
          this.typhHistoryYear.unshift(Number(year));
        }
      }
      const nowYear = new Date().getFullYear();
      if(!this.typhHistoryYear.includes(nowYear)) {
        this.typhHistoryYear.unshift(nowYear);
      }

      this.changeTyphCurrentYear_global(this.typhHistoryYear[0]);

      this.maxYear = nowYear;
      this.minYear = this.typhHistoryYear[this.typhHistoryYear.length-1];
    });*/
  },
  watch: {
      allTyphData(data) {
        for(let year in data) {
          if(!this.typhHistoryYear.includes(year)) {
            this.typhHistoryYear.unshift(Number(year));
          }
        }
        const nowYear = new Date().getFullYear();
        if(!this.typhHistoryYear.includes(nowYear)) {
          this.typhHistoryYear.unshift(nowYear);
        }

        this.changeTyphCurrentYear_global(this.typhHistoryYear[0]);

        this.maxYear = nowYear;
        this.minYear = this.typhHistoryYear[this.typhHistoryYear.length-1];
      },
      searchText(nv) {
        this.searchResult = [];
        this.haveNoResult = false;
        this.searching = true;
        if(searchInputDelay)
          clearTimeout(searchInputDelay);
        searchInputDelay = setTimeout(() => {
          if(nv === "")
            return;

          searchTyph(this.$http, nv)
            .then(data => {
              if(!data || !data.length) {
                this.haveNoResult = true;
                setTimeout(() => {
                  if(this.searching)
                    this.searching = false;
                }, 3000);
                return;
              }
              this.searchResult = data.slice(0, 5);
            }).catch(err => {
              this.searching = false;
            });
        }, 800);
      }
  },
  computed: {
    ...mapGetters([
      'typhTimeLineStatus_global',
      'typhCurrentYear_global',
      'typhCurrentName_global',
      'containedTyph_global'
    ])
  },
  methods: {
    ...mapActions([
      'toggleTyphTimelineStatus_global',
      'changeTyphCurrentYear_global',
      'selectTyph_global',
      'storeBefore03TyphIds_global'
    ]),
    changeTyphCurrentYear(action) {
      if(action === 'nextYear') {
        if(this.typhCurrentYear_global === this.maxYear)
          return;
        this.changeTyphCurrentYear_global(this.typhCurrentYear_global + 1 );
      }

      if(action === 'preYear') {
        if(this.typhCurrentYear_global === this.minYear)
          return;
        this.changeTyphCurrentYear_global(this.typhCurrentYear_global - 1);
      }
    },
    toggleTimelineStatus() {
      switch(this.typhTimeLineStatus_global) {
        case 'search':
          this.toggleTyphTimelineStatus_global('history');
          break;
        case 'history':
          this.toggleTyphTimelineStatus_global('search');
          break;
        case 'deteil':
          this.toggleTyphTimelineStatus_global('history');
          break;
        default:
          this.toggleTyphTimelineStatus_global('search');
      }
    },
    selectTyph(tsId) {
      this.searching = false;
      this.searchText = "";
      for(let item of this.containedTyph_global) {
        if(item.tsId === tsId) {
          this.selectTyph_global(tsId);
          return;
        }
      }

      if(this.containedTyph_global.length === 4)
        return;
      this.selectTyph_global(tsId);
    }
  }
}

</script>
<style lang="scss">
#typh-search-wraper{
  background: rgba(70,70,70,.5);
  height: 30px;
  display: inline-block;
  margin: 0 0 3px 10px;
  position: relative;
  div{
    float: left;
  }
}
div.action-indicator{
  cursor: pointer;
  border-right: solid 1px rgba(255, 255, 255, .1);
  height: 30px;
  svg{
    rect{
      fill: none;
    }
    &:hover{
      rect{
        fill: rgba(0, 0, 0, .15);
      }
    }
  }
  path{
    fill: none;
    stroke: white;
    stroke-width: 1.5px;
  }
}
div.status-indicator{
  min-width: 24px;
  >span{
    display: inline-block;
    color: white;
    line-height: 30px;
    font-size: 12px;
    margin: 0 11px;
  }
  section.toggle-history-typh-wraper{
    padding: 0 2px;
    text-align: center;
    position: relative;
    svg{
      cursor: pointer;
      float: left;
      &:hover{
        rect{
          fill: rgba(0, 0, 0, .15);
        }
      }
      rect{
        fill: none;
      }
      path{
        fill: white;
      }
    }
    span{
      float: left;
      color: white;
      font-size: 12px;
      line-height: 30px;
      width: 39px;
      // display: inline-block;
    }
  }
}
.canntChangeYear{
  fill: gray !important;
}
div.search-container{
  background-color: white;
  width: 180px;
  height: 20px;
  margin: 5px 10px 5px 0;
  border-radius: 10px;
  position: relative;
  svg{
    position: absolute;
    top: 4px;
    left: 10px;
    circle, path{
      fill: none;
      stroke: #464646;
      stroke-width: 1px;
    }
  }
  input{
    width: 140px;
    margin-left: 30px;
    border: none;
    background-color: transparent;
    font-size: 12px;
    transform: translateY(1px);
    &:focus{
      outline: none;
    }
  }
}
div.search-result-wraper{
  position: absolute;
  background: transparent;
  width: 180px;
  box-sizing: border-box;
  right: 0;
  //height: 110px;
  //top: -120px;
  ul{
    width: 100%;
    position: absolute;
    bottom: 0;
    background-color: rgba(70,70,70,.3);
  }
  li{
    width: 100%;
    box-sizing: border-box;
    padding-left: 30px;
    color: white;
    font-size: 12px;
    line-height: 22px;
    height: 22px;
    //border-radius: 11px;
    letter-spacing: .5px;
    cursor: pointer;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, .6);
    &:hover{
      background-color: rgba(0, 0, 0, .1);
    }
  }
}
.have-no-result{
  position: absolute;
  font-weight: bold;
  bottom: 0;
  color: #eb6671 !important;
}

.searchNoResult-enter{
  opacity: 0;
  transform: translateY(15px);
}
.searchNoResult-leave-active{
  opacity: 0;
  transform: translateY(-15px);
}
.searchNoResult-enter-active, .searchNoResult-leave{
  transition: all .3s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.list-complete-index {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-active {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>

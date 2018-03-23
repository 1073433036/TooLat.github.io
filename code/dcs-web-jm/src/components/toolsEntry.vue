<template>
  <main id="tools-wrapper">
      <section class="tools-list">
          <ul>
              <li class="tool-layer" title="切换地图图层">
                <components class="maplayer-cpn" :is="mapLayerView"></components>
              </li>
              <li :class="['tool-route', {'item-selected': routeView}]" title="路线规划" @click="toggleRouteBar"></li>
              <li :class="['tool-measure', {'item-selected': isRanging}]" title="测距工具" @click="startRanging"></li>
              <li :class="['tool-search', {'item-selected': searchView}]" title="数据检索" @click="toggleSearchBar"></li>
              <li v-show="is3DEarth"
                  :class="['tool-nav', {'item-selected': navShow}]"
                  :title="navShow ? '关闭导航控件' : '启用导航控件'"
                  @click="toggleNavigationBar"></li>
          </ul>
      </section>
      <section class="tools-ctrl">
          <transition name="slide-fade">
              <components :is="searchView"></components>
          </transition>
          <transition name="slide-fade">
              <components :is="routeView"></components>
          </transition>
      </section>
  </main>
</template>
<script>
import { mapGetters } from 'vuex'
import mapLayer from './tools/mapLayer'
import search from './tools/search'
import routeNav from './tools/routeNav'
import { Helper } from '../util/Helper'
import Ranging from '../util/Ranging'

export default {
    data() {
        return {
            navShow: false,
            mapLayerView: null,
            searchView: null,
            routeView: null,
            isRanging: false
        }
    },
    computed: {
        ...mapGetters([
            'regionBounds',
            'is3DEarth'
        ])
    },
    components: {
        mapLayer,
        search,
        routeNav
    },
    mounted() {
        this.mapLayerView = mapLayer;
    },
    methods: {
        toggleNavigationBar() {
            this.navShow = !this.navShow;
            let helper = new Helper(viewer);
            this.navShow ? helper.addNavigationBar(this.regionBounds) : helper.removeNavigationBar();
            helper = null;
        },
        toggleSearchBar() {
            if(this.searchView) {
                this.searchView = null;
            } else {
                this.searchView = search;
                if(this.routeView)
                    this.routeView = null;
            }
        },
        toggleRouteBar() {
            if(this.routeView) {
                this.routeView = null;
            } else {
                this.routeView = routeNav;
                if(this.searchView)
                    this.searchView = null;
            }
        },
        startRanging() {
            if(this.isRanging) {
                this.rangInstance && this.rangInstance.endRanging();
                this.rangInstance.clearRanging();
                delete this.rangInstance;
                this.isRanging = false;
            } else {
                this.isRanging = true;
                let ranging = this.rangInstance = new Ranging(viewer);
                ranging.startRanging();
            }
        }
    },
    watch: {
        is3DEarth(bool) {
            if(!bool && this.navShow)
                this.toggleNavigationBar();
        }
    }
}

</script>
<style lang="scss" scoped>
#tools-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  .tools-list {
    width: 30px;
    position: absolute;
    top: 50px;
    right: 10px;
    background-color: rgba(70, 70, 70, .5);
    border: 1px solid rgba(255, 255, 255, .1);
    ul {
      font-size: 0;
      li {
        width: 100%;
        height: 30px;
        position: relative;
        display: inline-block;
        border-bottom: 1px solid rgba(255, 255, 255, .1);
        background: url(../assets/toolbar/tools.png) no-repeat;
        cursor: pointer;
        &:hover {
          background-color: rgba(0, 0, 0, 0.3);
        }
        &:last-of-type {
          border-bottom: none;
        }
      }
      .tool-layer {
        background-position: 2px -76px;

        .maplayer-cpn {
          display: none;
        }
        &:hover > .maplayer-cpn {
          display: block;
        }
      }
      .tool-route {
        background-position: 3px -158px;
      }
      .tool-measure {
        background-position: -21px 2px;
      }
      .tool-search {
        background-position: -22px -76px;
      }
      .tool-nav {
        background-position: -21px -130px;
      }
      .item-selected {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }

  .tools-ctrl {
    position: absolute;
    right: 42px;
    top: 50px;
  }
}

.slide-fade-enter-active {
  transition: all .3s ease;
}

.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-active {
  transform: translateX(10px);
  opacity: 0;
}
</style>

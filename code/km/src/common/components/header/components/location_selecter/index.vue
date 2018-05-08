<template>
  <transition enter-active-class="animated bounceInDown" leave-active-class="animated bounceOutRight">
    <div class="location_selecter" v-show="isOpen">
      <div class="location-layer">
          <div class="wrap">
            <div class="inner" ref="inner">
              <div class="head">
                <span>当前：广州市</span>
                <a class="close" v-on:click="handleClose()">关闭</a>
              </div>
              <div class="main">
                <div class="list-wrap">

                  <div class="hot-list">
                    <div class="caption">定位城市</div>
                    <div class="list-inner">
                      <div class="item">
                        <a>广州市</a>
                      </div>
                    </div>
                  </div>

<!--                   <div v-show="0 < histData.length" class="hot-list">
                    <div class="caption">最近访问城市</div>
                    <div class="list-inner">

                      <div v-for="(item, index) in histData" class="item">
                        <a>{{ item.region_name }}</a>
                      </div>

                    </div>
                  </div> -->

                </div>
              </div>
            </div>

            <div class="select-group" v-bind:style="{paddingTop: formTemp.mainHeight + 'px'}">
              <div class="list">
                <scroller>
                  <div class="prop">
                    <div v-for="(item, index) in provData"
                      :key="index"
                      :class="{ active: item.region_id === current.prov.region_id }"
                      class="item"
                      v-on:click="getCityData(item)">{{ item.region_name }}</div>
                  </div>
                </scroller>
              </div>
              <div class="list">
                <scroller>
                  <div v-show="0 < cityData.length" class="city">
                    <div v-for="(item, index) in cityData"
                      :key="index"
                      :class="{ active: item.region_id === current.city.region_id }"
                      class="item"
                      v-on:click="handleCitySelect(item)">{{ item.region_name }}</div>
                  </div>
                  <div v-show="0 >= cityData.length" class="no-data">请选择省份</div>
                </scroller>
              </div>
            </div>
          </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
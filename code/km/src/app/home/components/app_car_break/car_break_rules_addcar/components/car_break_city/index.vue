<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="app-car-break-city-list-page" v-show="isShow">
      <div class="location-layer">
          <div class="inner">
            <app-header title="地区选择" :isBack="false">
              <div class="slot" slot="right" v-on:click="closeCityList">
                <span>确定</span>
              </div>
            </app-header>
            <scroller ref="myCityScroller">
              <ul class="list" v-if="remark == 'province' ? true:false">
                <li v-for="(item, index) in formTemp.provinceAddress" class="item"
                  :key="index"
                  v-on:click="handleProvinceSubmit(item)">{{ item.provincename }}</li>
              </ul>
              <ul class="list" v-if="remark == 'city' ? true:false">
                <li v-for="(item, index) in formTemp.cityAddress" class="item"
                  :key="index"
                  v-on:click="handleCitySubmit(item)">{{ item.cityname }}</li>
              </ul>
            </scroller>
          </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
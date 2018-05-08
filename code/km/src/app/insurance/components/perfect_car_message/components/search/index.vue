<template>
  <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
    <div class="search-page" :value="value" v-show="visible">
      <div class="header">
        <a href="javascript:" class="back" @click="cancel"></a>
        <div class="title">车型搜索</div>
      </div>
      <scroller :on-refresh="refresh"
        :on-infinite="infinite"
        ref="my_scroller">
        <div class="body">
          <div class="head">
            <div class="search">
              <i class="sp sp-car-search"></i>
              <input type="text" v-model="keyword" placeholder="请输入搜索关键字">
              <i class="icon icon-close" v-show="keyword" @click="clearKeyword"></i>
            </div>
            <div class="search-btn" v-on:click="handleSearch">搜索</div>
          </div>
          <div class="search-tips" v-show="!isSuccess && !isFail">
            <div class="tips-item">
              <h3>精确查找</h3>
              <p>请按照行驶证上的车型输入</p>
            </div>
            <div class="tips-item">
              <h3>模糊查找</h3>
              <p>输入车辆品牌、车系名称、排气量等关键词，支持中文、英文和拼音输入，如：“奔驰”、“马自达2.0”等</p>
            </div>
            <div class="tips-item">
              <h3>进口车查找</h3>
              <p>请按照行驶证上的VIN码输入</p>
            </div>

            <div class="tips-item">
              <img src="~assets/images/car_license.png">
              <p class="tips">注：请在搜索栏中输入【丰田GTM7251HEVS】或【GTM7251HEVS】，然后点击搜索就可以，切勿输入“牌”字</p>
            </div>
          </div>
          <div class="search-result" v-show="isSuccess">
            <ul class="result-list">
              <li class="result-item" v-for="(item, index) in carList" :key="index" @click="selectCar(item)">
                <h4>{{ item.vehicleName }}</h4>
                <span class="car-type" v-show="item.gearbox">{{ item.gearbox }}</span>
                <span class="car-seatnum" v-show="item.seat">{{ item.seat }}座</span>
                <span class="car-date" v-show="item.yearStyle">{{ item.yearStyle }}年</span>
                <span class="car-money" v-show="item.price">￥{{ item.price }}</span>
              </li>
            </ul>
          </div>
          <div class="searchnone-tips" v-show="isFail">很抱歉！没有查找到你搜索的车辆型号。</div>
        </div>
      </scroller>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
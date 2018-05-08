<template>
  <div class="car-search-page">
    <app-header title="车型搜索"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="head">
          <div class="search">
            <i class="sp sp-car-search"></i>
            <input type="text" v-model="search" placeholder="请输入搜索关键字">
          </div>
          <div class="search-btn" v-on:click="handleSearch">搜索</div>
        </div>
        <div class="search-tips" v-show="isShowTips">
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
        </div>
        <div class="search-result" v-show="isShowResult">
          <ul class="result-list">
            <li class="result-item" v-for="item in carSearchList">
              <h4>{{item.carName}}</h4>
              <span class="car-type">{{item.type}}</span>
              <span class="car-seatnum">{{item.seatNum}}</span>
              <span class="car-date">{{item.date}}</span>
              <span class="car-money">￥{{item.money}}</span>
            </li>
          </ul>
        </div>
        <div class="searchnone-tips" v-show="isShowNoneTips">很抱歉！没有查找到你搜索的车辆型号。</div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
<template>
  <div class="app-car-break-rules-page">
    <app-header title="违章代缴" :other="true" v-on:other="goHomePage"></app-header>
    <div class="wrapper">
      <div class="break-rules-top">
        <div ref="swiperRoot">
          <ul class="list swiper-wrapper">
            <li class="item swiper-slide">
              <img class="top-img" src="~assets/images/break-rules-top.png" alt="">
            </li>
            <li class="item swiper-slide">
              <img class="top-img" src="~assets/images/break-rules-top1.jpg" alt="">
            </li>
          </ul>
          <div class="swiper-pagination"></div>
        </div>
      </div>
      <div class="break-rules-main">
        <div class="tips">
          <span class="car-break-notice">公告</span>
          <div class="notice">
            <div class="marquee">卡盟金服信贷流量服务平台：山西、陜西、云南（暂时）、广西、西藏、甘肃、青海、黑龙江、以上地区违章数据系统暂时查询不了</div>
          </div>
        </div>

        <div class="break-rules-menu">
          <div class="menu-item1" v-on:click="goMyCarPage">
            <div class="item-title">
              <h3>我的车辆</h3>
              <span>My Vehicle</span>
            </div>
            <div class="item-img">
              <i class="sp sp-app-sm-car-remark"></i>
            </div>
          </div>
          <div class="menu-item2" v-on:click="goAddCarPage">
            <div class="item-title">
              <h3>添加车辆</h3>
              <span>违章代缴</span>
            </div>
            <div class="item-img">
              <i class="sp sp-app-sm-car-remark1"></i>
            </div>
          </div>
          <div class="menu-item3" v-on:click="goMyOrderrPage">
            <div class="item-title">
              <h3>我的订单</h3>
              <span>My Order</span>
            </div>
            <div class="item-img">
              <i class="sp sp-app-sm-car-remark2"></i>
            </div>
          </div>
        </div>
        <router-link :to="{name: 'home.AppCodeQuery'}">
          <div class="break-code-query">
            <i class="sp sp-app-car-break-code-query"></i>
            <span>违章代码查询</span>
            <span class="tips">输入编号查看违章原因</span>
            <i class="sp sp-right"></i>
          </div>
        </router-link>
        <div class="user-tips">
          <div class="hint">【温馨提示】</div>
          <p>违章处理周期需要1-3个工作日，请您安排好处理时间，以免到期产生滞纳金，感谢您的配合！</p>
        </div>
      </div>
    </div>

    <div class="sweet-tips" v-if="isPhoneBundle" v-on:click.stop="isShowTipsWrapper = true">
      <div class="tips-wrapper" v-show="isShowTipsWrapper">
        <div class="tips-content">
          <h2>温馨提示</h2>
          <p>请您先在平台绑定手机号，否则将无法处理违章，感谢您的配合</p>
          <div class="btn-group">
            <div class="cancel" v-on:click.stop="cancel">取消</div>
            <div class="bundle" v-on:click.stop="goBundlePhonePage">绑定手机号</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

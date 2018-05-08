<template>
  <!-- 遮罩层 -->
  <div class="testBankcard-page">
    <div class="tit" ref="homeSwiper">
      <ul class="list swiper-wrapper">
        <!-- 第一版 -->
        <li class="item swiper-slide">
          <img src="~assets/images/Bank_card/change_card.gif" alt="">
          <img src="~assets/images/Bank_card/img13.png" alt="">
          <img src="~assets/images/Bank_card/img12.png" alt="">
          <a class="resPath" href="javascript:" @click="tuNextpage"></a>
        </li>
        <!-- 第二版 -->
        <li class="item02 swiper-slide" v-for="(item, index) in swiperList" :key="index">
          <span class="sp sp-kuang"></span>
          <div class="content-box">
            <span class="sp" :class="'sp-'+item.UserImage"></span>
            <span class="sp" :class="'sp-'+item.WhatSay"></span>
            <ul v-for="(Url,optionImg) in item.options" :key="optionImg" @click='chlick(Url)'>
              <li>
                <span class="sp" :class="'sp-'+Url.background"></span>
                <span class="sp" :class="'sp-'+Url.optionImg"></span>
              </li>
              <li v-if="Url.page==10&&optionImg==4">
                <router-link :to="{ name: 'home.BankCardReasult', query:{ Allmoney:Allmoney} }">
                  <span class="sp sp-toresult haveSesult"></span>
                </router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div class="swiper-pagination"></div>
    </div>
    <!-- <div class="testBankcard-panduan">卡盟金服办卡咨询</div> -->
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>
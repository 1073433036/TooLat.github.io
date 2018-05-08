<template>
  <div class="creditcard-share-invite-page">
    <app-header title="我也要邀请"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="banner">
            <img src="~assets/images/card-share-invite-top.png" alt="">
          </div>
          <div class="box mb20">
            <div class="big-title">
              <span>成功推荐奖</span>
            </div>
            <ul class="list">
              <li class="item" v-for="(item, index) in goodsList" :key="index">
                <a href="javascript:" @click="goodsItem = item, state.boxFlag = true">
                  <div class="image">
                    <img :src="item.image" alt="">
                  </div>
                  <div class="info">
                    <div class="title">{{ item.name }}</div>
                    <div class="profile">{{ item.profile }}</div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
          <div class="box">
            <div class="big-title">
              <span>成功推荐本期大奖</span>
            </div>
            <div class="reward-top">
              <img src="~assets/images/reward-num.png" alt="">
            </div>
            <div class="big-title text">
              <span>好友办卡成功，也可获得专属新人礼</span>
            </div>
            <div class="share-btn">
              <router-link :to="{ name: 'home.CreditCardShareInput' }">
                <i class="icon icon-share"></i>
                <span>分享我的邀请</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </scroller>
    <div class="layer">
      <div class="mask" v-show="state.boxFlag"></div>
      <transition name="fade" enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
        <div class="box" v-show="state.boxFlag">
          <div class="title">成功推荐单月奖</div>
          <div class="image">
            <img :src="goodsItem.image" alt="">
          </div>
          <div class="name">{{ goodsItem.name }}</div>
          <div class="text">{{ goodsItem.profile }}</div>
          <div class="text">价值人民币 <span class="money">{{ goodsItem.price }}</span> 元</div>
          <i class="icon icon-close" @click="state.boxFlag = false"></i>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
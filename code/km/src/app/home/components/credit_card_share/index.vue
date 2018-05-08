<template>
  <div class="creditcard-share-page">
    <app-header title="信用卡/办卡吧"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="head">
            <div class="nick">张三</div>
            <div class="text">邀请您申请银行信用卡</div>
            <div class="money">
              <div class="tips1">成功办卡即享刷卡金</div>
              <div class="tips2">特殊联名卡除外！</div>
              <div class="num">¥<span>80.00</span></div>
            </div>
            <div class="btn">
              <a href="javascript:" @click="state.layerFlag=true">立即申请</a>
            </div>
          </div>
          <ul class="list">
            <li class="item">
              <i class="icon icon-purse"></i>
              <router-link :to="{ name: 'home.CreditCardShareJoin' }" class="item">
                <div class="name">申请加入卡盟金服</div>
                <div class="text">立即申请加入卡盟金服</div>
              </router-link>
            </li>
            <li class="item">
              <i class="icon icon-fly"></i>
              <router-link :to="{ name: 'home.CreditCardShareInvite' }" class="item">
                <div class="name">我也要邀请</div>
                <div class="text">我是持卡人，立即分享我的邀请</div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </scroller>
    <div class="layer">
      <div class="mask" v-show="state.layerFlag" @click="state.layerFlag = false"></div>
      <transition name="fade" enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
        <div class="box" v-show="state.layerFlag">
          <router-link :to="{ name: 'home.CreditCard' }" class="item">忽略</router-link>
          <router-link :to="{ name: 'home.Simulate1' }" class="item">立即前往</router-link>
        </div>
      </transition>
    </div>
    <div class="layer" v-show="shareFlag">
      <div class="mask" @click="cancelShow"></div>
      <div class="share-image">
        <img src="~assets/images/creditcard-share-btn.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
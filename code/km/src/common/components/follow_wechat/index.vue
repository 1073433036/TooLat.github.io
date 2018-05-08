<template>
  <div class="follow-wechat-page">
    <!-- <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div v-show="isWechat" class="mask-inner">
        <div class="mask">
          <div class="content">
            <div class="head">
              <span>关注公众号免费送豪礼</span>
              <i v-on:click="isWechat = false" class="hp-close"></i>
            </div>
            <div class="body">
              <div v-if="0 < peerInfo.id" class="avatar">
                <img v-if="peerInfo.avatar" :src="peerInfo.avatar">
                <img v-else src="~assets/images/avatar.png">
                <div class="name">{{ peerInfo.user_nickname || peerInfo.name }}</div>
                <p>邀请您加入卡盟金服</p>
              </div>
              <div class="qr-code">
                <img src="~assets/images/wechat-code.jpg">
              </div>
            </div>
            <div class="foot">
              <h3>长按二维码关注公众号</h3>
              <p>为了更好的服务，请关注平台公众号</p>
              <p class="min-font">请先完善基本资料及手机号码，以便下次可以同账户.快捷登录APP</p>
            </div>
          </div>
        </div>
      </div>
    </transition> -->
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

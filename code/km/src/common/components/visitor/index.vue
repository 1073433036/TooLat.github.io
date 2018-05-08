<template>
   <!-- v-show="isShow" -->
  <div class="visitor-page">
    <div v-show="0 < visitors.length" class="visitor-wrapper">
      <div class="visitor-group">
        <div v-for="(item, index) in visitors" :key="index" class="items" v-on:click="handleGoToChat(item)">
          <!-- <div class="item text">用户</div> -->
          <div class="avatar">
            <img v-if="item.avatar" :src="item.avatar">
            <img v-else src="~assets/images/avatar.png">
          </div>
          <div class="item name">{{ item.user_nickname }}</div>
          <div class="item text">正在浏览您分享的链接</div>
        </div>
      </div>
    </div>


    <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
      <div v-show="isShow" class="body">
        <div class="head">
          <div class="avatar">
            <img v-if="formTemp.avatar" :src="formTemp.avatar">
            <img v-else src="~assets/images/avatar.png">
          </div>
          <div class="invite-info">
            <div class="name">{{ formTemp.user_nickname }}</div>
            <div class="level">
              <i class="sp" :class="'sp-level-0' + formTemp.level"></i>
              <span>{{ formTemp.level_name }}</span>
            </div>
          </div>

   <!-- v-on:click="handleQrcode()" -->
          <div class="close" v-on:click="isShow = false">
            <i class="sp sp-close"></i>
          </div>
        </div>

        <div class="foot">
          <a class="link" v-on:click="$toast('敬请期待')">
            <span>查看详情</span>
          </a>
          <a class="link link-02" v-on:click="handleUserQrcode()">
            <i class="sp sp-card_share_01"></i>
            <span>二维码</span>
          </a>
          <div class="link link-03" v-on:click="handleGotoChat()">
            <i class="sp sp-icon-invite-03"></i>
            <span>微聊</span>
          </div>
        </div>
      </div>
    </transition>

    <WechatCode v-on:wechatClose="wechatClose" :show="isWechat" :formTemp="{ title: '长按识别二维码', wx_qrcode: formTemp.wx_qrcode, wechat_account: formTemp.wechat_account }"></WechatCode>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
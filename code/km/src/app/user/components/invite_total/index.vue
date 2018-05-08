<template>
  <div class="invite-total-page">
    <app-header title="邀请好友"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="head">
            <div class="banner">
              <img src="~assets/images/invite-total-bg.jpg">
            </div>
            <div class="info">
              <div class="title">邀请业绩</div>
              <ul class="list">
                <li class="item">
                  <div class="num">{{ formData.list.invite_number }}</div>
                  <div class="name">邀请人数</div>
                </li>
                <li class="item">
                  <div class="num">{{ formData.list.certification_number }}</div>
                  <div class="name">认证人数</div>
                </li>
                <li class="item">
                  <div class="num">{{ formData.list.integral }}</div>
                  <div class="name">邀请积分</div>
                </li>
              </ul>
            </div>
          </div>
          <div class="submit-btn">
            <a class="btn" href="javascript:" v-on:click="isWechat = true">
              <i class="sp sp-repayment-07"></i>
              <span>给好友扫一扫</span>
            </a>
            <a class="btn" href="javascript:" @click="handleShareClick()">
              <i class="sp sp-repayment-06"></i>
              <span>分享我的邀请</span>
            </a>
          </div>
        </div>
      </div>
    </scroller>

    <WechatCode v-on:wechatClose="wechatClose" :show="isWechat" :formTemp="{ title: '微信二维码', wx_qrcode: userInfo.wx_qrcode, wechat_account: userInfo.wechat_account }"></WechatCode>

    <div class="layer" v-show="isShare">
      <div class="mask" @click="isShare = false"></div>
      <div class="share-image" @click="isShare = false">
        <img src="~assets/images/creditcard-share-btn.png">
      </div>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
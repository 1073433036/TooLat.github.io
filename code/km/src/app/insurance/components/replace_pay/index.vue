<template>
  <div class="replace-pay">
    <app-header title="代付订单"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="head">
            <div class="userinfo">
              <div class="avatar">
                <img v-if="formTemp.manager.avatar" :src="formTemp.manager.avatar">
                <img v-else src="~assets/images/user-avatar.png">
              </div>
              <div class="content info">
                <div class="name">
                  <span class="nick">{{ formTemp.manager.real_name || formTemp.manager.user_nickname || '未知' }}</span>
                  <span v-if="0 < formTemp.manager.level" class="sp" :class="'sp-level-0' + formTemp.manager.level"></span>
                </div>
                <div class="text">发来代付请求！</div>
              </div>
              <div class="price info">
                <div class="name" v-if="formTemp.list.q && formTemp.list.q.insureInfo && formTemp.list.q.insureInfo.totalPremium">¥{{ formTemp.list.q.insureInfo.totalPremium }}</div>
                <div class="text">代付金额</div>
              </div>
            </div>
            <div class="profile">我在卡盟金服平台购买了此保险，是时候该你仗义疏财啦，快帮我付个款吧，鄙人感激不尽！</div>
          </div>
          <div class="body">
            <div class="insurance">
              <div class="logo">
                <img v-if="formTemp.list.i && formTemp.list.i.logo" :src="formTemp.list.i.logo" alt="">
              </div>
              <div class="content info">
                <div class="name" v-if="formTemp.list.q && formTemp.list.q.prvName">{{ formTemp.list.q.prvName }}</div>
                <div class="status" v-if="formTemp.list.q && formTemp.list.q.taskStateDescription">{{ formTemp.list.q.taskStateDescription }}</div>
                <div class="time" v-if="formTemp.list.q && formTemp.list.q.errorMsg">{{ formTemp.list.q.errorMsg }}</div>
              </div>
              <div class="price info">
                <div class="name" v-if="formTemp.list.q && formTemp.list.q.insureInfo && formTemp.list.q.insureInfo.totalPremium">¥{{ formTemp.list.q.insureInfo.totalPremium }}</div>
                <div class="status"></div>
                <!-- <div class="time">查看详情</div> -->
              </div>
            </div>
          </div>
          <div class="foot">
            <div class="title">支付说明</div>
            <div class="text">1、付款请务必和好友再次确认，避免是诈骗行为。</div>
            <div class="text">2、如果将来您退款了，钱将退还到您好友的微信账户内。</div>
          </div>
        </div>
      </div>
    </scroller>
    <div class="pay-btn">
      <a href="javascript:" @click="handleInsure">立即支付</a>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
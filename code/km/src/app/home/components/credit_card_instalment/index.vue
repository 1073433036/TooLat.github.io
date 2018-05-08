<template>
  <div class="creditcard-instalment-page">
    <app-header title="我要分期"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="head">
            <div class="card">
              <div class="avatar">
                <img v-if="userInfo.avatar_full" :src="userInfo.avatar_full">
                <img v-if="!userInfo.avatar_full" src="~assets/images/default-avatar.png">
              </div>
              <div class="user">
                <div class="name">{{ userInfo.user_nickname }}</div>
                <div class="tips">欢迎来到服务中心，很高兴为你服务</div>
              </div>
              <div class="title">信用卡分期优势：</div>
              <div class="profile">只要向银行上缴消费总额的10%，便可保全自己良好的信用记录；信用卡分期可以帮助您缓解资金压力，降低您的信用卡负债，适当的分期还有助于您提高信用卡额度哦！</div>
            </div>
          </div>
          <div class="body">
            <div class="box">
              <div class="company">
                <span class="logo">
                  <img :src="formTemp.bankData.thumb_l" alt="">
                </span>
                <span class="line">服务热线</span>
              </div>
              <div class="call">
                <a class="c" :href="'tel:' + formTemp.bankData.tel">
                  <i class="icon icon-call"></i>
                  <span class="phone">{{ formTemp.bankData.tel }}</span>
                  <span class="tips">点击即可拨打</span>
                </a>
              </div>
              <div class="profile">
                <div class="title">温馨提示</div>
                <div class="text">建议您在账单日前一天提前还款哦，这样可以有效的降低您的负债，30%左右的负债是比较合理的，这样能更好的维护您的信用，更好的提升您的信用卡额度！</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

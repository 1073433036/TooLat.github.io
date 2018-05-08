<template>
  <div class="auth-page">
    <app-header title="申请开通"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="top">
            <!-- <div class="image">
              <img src="~assets/images/shield-01.png" alt="">
            </div> -->
            <div class="banner">
              <img src="~assets/images/auth-bg01.jpg" alt="">
            </div>
            <!-- <div class="profile">您目前尚未开通无卡支付功能，请您绑定您的储蓄卡进行实名认证，认证成功后将为您免费开通无卡支付功能！</div> -->
						<div class="dredge">
							<div class="approve">实名认证审核通过，开通成功有礼：</div>
							<div class="insurance">送50万赔付意外险，中国人保承保。</div>
						</div>
          </div>
          <div class="mode">
						<div class="info">[卡盟金服]无卡支付是一款智能手机POS机APP，不需要任何外置设备即可刷卡，与银联快捷支付合作，到账快、资金安全，费率低，只需0.3%~0.49%。</div>
            <router-link :to="{ name: 'home.AuthFlow' }">
              <h3 class="title-h">开通无卡支付需要</h3>
              <div class="title">银行储蓄卡方式进行实名认证</div>
              <div class="btn">
                <span class="name">开始认证</span>
              </div>
              <i class="icon icon-bank_card"></i>
            </router-link>
          </div>
					<div class="hint">
						<div class="warm-prompt">温馨提示：</div>
						<div class="text">欢迎您使用无卡支付，为了账户的安全请先实名注册收款账户需要绑定本人存储卡（他人账户不能给别人信用卡支付使用）</div>
					</div>
					<div class="way">
						<ul class="item">
							<li class="list">
								<router-link :to="{}" class="insurance">
									<img src="~assets/images/insurance.png" alt="">
								</router-link>
							</li>
							<li class="list">
								<router-link :to="{}" class="unionpay">
									<img src="~assets/images/unionpay.png" alt="">
								</router-link>
							</li>
							<li class="list">
								<router-link :to="{}" class="wechat">
									<img src="~assets/images/wechat.png" alt="">
								</router-link>
							</li>
							<li class="list">
								<router-link :to="{}" class="alipay">
									<img src="~assets/images/alipay.png" alt="">
								</router-link>
							</li>
							<li class="list">
								<router-link :to="{}" class="wallet">
									<img src="~assets/images/wallet-01.png" alt="">
								</router-link>
							</li>
						</ul>
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
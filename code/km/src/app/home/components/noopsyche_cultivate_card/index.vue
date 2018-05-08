<template>
  <div class="noopsyche_cultivate_card_page">
    <app-header title="智能精养卡" :other="isOther" v-on:other="goHomePage">
      <div class="slot" slot="right">
        <!-- <router-link :to="{ name: 'home.PrenentTheft' }"> -->
				<a href="javascript:void(0)" @click="linkToRoute({ name: 'home.PrenentTheft' })">
          <span class="slot-name">盗刷险</span>
				</a>
        <!-- </router-link> -->
      </div>
    </app-header>
    <scroller>
      <div class="wrapper">
				<div class="tips">
          <i class="icon icon-horn"></i>
					<div class="notice">
          	<div class="marquee">卡盟金服信贷流量服务平台：信用卡精养自动代还系统特色，每个月卡内预留5%--10%的金额，（举例：500块钱就可以自动代还10000额度信用卡）自动刷卡15-25笔模拟真实消费，还款100%信用卡额度，每次消费都有短信通知，每个卡片账户安全，由中国人保财险承保账户资金安全，保单真实有效期一年，刷卡佣金奖励，由第三方支付公司统一结算支付，平台不收取任何前期费用，谨防金融诈骗，举报电话：400-018-8616</div>
        	</div>
        </div>
        <ul class="list">
          <!-- <router-link :to="{ name: 'home.SetPaymentPlan'}"> -->
          <li v-on:click="isVip(1)">
            <i class="sp sp-payment-plan"></i>
          </li>
          <!-- </router-link> -->
          <!-- <router-link :to="{ name: 'home.PaymentProgress' }"> -->
          <li v-on:click="isVip(2)">
            <i class="sp sp-payment-progress-query"></i>
          </li>
          <!-- </router-link> -->

          <!-- <router-link :to="{ name: 'home.CreditCardRepayment' }"> -->
					<a href="javascript:void(0)" @click="linkToRoute({ name: 'home.CreditCardRepayment' })">
            <li>
              <i class="sp sp-overdue"></i>
            </li>
					</a>
          <!-- </router-link> -->
            <li v-on:click.stop="handleTest">
              <i class="sp sp-payment-instalmen"></i>
            </li>
        </ul>
				<!-- <div class="backdrop" v-if="!isWechatClient"> -->
				<div class="backdrop">
					<img src="~assets/images/backdrop-03.png">
				</div>
        <!-- <div class="card-img" v-if="!isWechatClient"> -->
        <div class="card-img">
          <!-- <img src="~assets/images/card-advantage-02.jpg"> -->
          <img src="~assets/images/card-advantage-02_01.jpg">
          <img src="~assets/images/card-advantage-02_02.jpg">
        </div>
      </div>
    </scroller>

    <!-- <div class="year-notice" v-if="isShowYearNotice" v-on:touchstart.stop="showYearNotice($event)"></div> -->

    <div class="suspend">
      <a href="http://u5150735.viewer.maka.im/k/ARPMAMEY">
        <img src="~assets/images/suspend.png" class="suspend-img">
      </a>
    </div>

		<transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <!-- <div v-show="!isWechatClient && isMaskVip" class="mask-vip"> -->
      <div v-show="isMaskVip" class="mask-vip">
        <div class="mask" @click="closeVip"></div>
        <div class="inner">
          <div class="close" @click="closeVip">
            <i class="icon icon-close"></i>
          </div>
          <scroller>
            <img src="~assets/images/creditcard-02.jpg">
          </scroller>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>

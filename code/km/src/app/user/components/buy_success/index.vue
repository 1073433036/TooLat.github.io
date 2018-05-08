<template>
  <div class="noopsyche_cultivate_card_page">
    <app-header title="升级会员" :other="isOther" v-on:other="goHomePage"></app-header>
    <scroller>
      <div v-if="2 == formTemp.pay_type" class="pay-type" :class="{ on: active }">
        <div class="box">
  				<div class="wrapper">
          <div class="payment">
  					<div class="payment-log">
  						<span  class="sp sp-pay-complete"></span>
  					</div>
  					<p class="succeed">恭喜您，成功支付<em>{{ formTemp.total_fee }}</em>元！</p>
  				</div>
  				<div class="photo">
  					<img :src="formTemp.receipt" @click="isShow = true">
  				</div>
        </div>
  			<div  class="btn">
  				<div class="invite">
  					<a v-on:click="isShare = true">立即邀请</a>
  				</div>
  			</div>
  			</div>
      </div>

      <div v-else class="pay-type" :class="{ on: active }">
        <div class="box">
          <div class="wrapper">
          <div class="payment">
            <div class="payment-log">
              <span  class="sp sp-pay-complete"></span>
            </div>
            <p class="succeed">恭喜您，支付成功！</p>
          </div>
  <!--        <div class="activate">
            <div class="video-activate">
              <span class="sp sp-activate"></span>
              <span class="video-key">视频激活码：{{ formTemp.video_code }}</span>
              <div class="info">温馨提示：请您下载安装<a href="javascript:">全新视界</a>，输入激活码激活，祝您观看愉快！</div>
            </div>
          </div> -->
          <div class="photo">
            <!-- <img :src="formTemp.receipt" @click="isShow = true"> -->
          </div>
        </div>
        <!-- <div class="content">
          <div class="title">注释：</div>
          <div class="text">视频VIP会员，是第三方平台友情赞助，是免费赠送给平台会员使用一个月，不再收取其他费用，后期因第三方不可抗拒因素影响，导致VIP账号停用，卡盟金服平台不承担任何赔偿责任。
          </div>
        </div> -->
        <div  class="btn">
          <div class="go-back">
            <router-link :to="{ name: 'home.Home' }">返回首页</router-link>
          </div>
          <div class="download">
            <a v-on:click="goToDown()">前往下载APP</a>
          </div>
        </div>
        </div>
      </div>
    </scroller>

    <div class="enlarge" v-show="isShow" @click="isShow = false">
      <img :src="formTemp.receipt" @click.stop>
      <i class="icon icon-close"></i>
    </div>

    <div class="mask-layer" v-show="isShare">
      <div class="mask" @click="isShare = false"></div>
      <div class="share-image" @click="isShare = false">
        <img src="~assets/images/pay-share.png">
      </div>
    </div>


  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>

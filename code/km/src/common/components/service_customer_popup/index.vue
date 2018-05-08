<template>
  <main class="service-cuetomer-popup">
    <transition name="fade-left">
      <section v-if="isCustomer">
        <transition enter-active-class="animated zoomInUp" leave-active-class="animated zoomOutRight">
          <div class="qq-customer-menu" @click="isDetailPopupShow = true" v-show="!isDetailPopupShow"></div>
        </transition>
      </section>
    </transition>

    <transition enter-active-class="animated zoomInUp" leave-active-class="animated zoomOutRight">
      <div class="qq-customer-list" v-if="isDetailPopupShow">
        <div class="qq-customer-info">
          <a href="http://wpa.qq.com/msgrd?v=3&uin=717367412&site=qq&menu=yes" class="item bg-green">
            <i class="qq-customer-icon"></i>
            <div class="title">信用卡客服</div>
          </a>
          <a href="http://wpa.qq.com/msgrd?v=3&uin=516728079&site=qq&menu=yes" class="item bg-yellow">
            <i class="qq-customer-icon"></i>
            <div class="title">支付客服</div>
          </a>
          <a href="http://wpa.qq.com/msgrd?v=3&uin=3555982415&site=qq&menu=yes" class="item bg-blue">
            <i class="qq-customer-icon"></i>
            <div class="title">代还客服</div>
          </a>
          <a href="http://wpa.qq.com/msgrd?v=3&uin=535030059&site=qq&menu=yes"  class="item bg-green">
            <i class="qq-customer-icon"></i>
            <div class="title">车险客服</div>
          </a>
          <a href="javascript:void(0)"  @click.stop="isWechatCustomerShow = true" class="item bg-orange">
            <i class="qq-customer-icon wetchat-customer"></i>
            <div class="title">微信金牌客服</div>
          </a>

          <!-- <a class="QQGroup">
            <span class="left">QQ群：</span>
            <span class="right">
            431196408 <br/>
            258446548</span>
          </a> -->

          <div class="qq-customer-close" @click="isDetailPopupShow = false">
          </div>
        </div>
      </div>
    </transition>

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div class="wechat-customer-layer" v-if="isWechatCustomerShow">
        <div class="wechat-customer-wrapper">
          <span class="kf">卡盟客服</span>
          <span class="desc">微信金牌客服</span>
          <div class="tip">欢迎微信扫一扫</div>
          <img class="qr-code" src="~assets/images/kf-wechat-code.jpg" alt="客服二维码">
          <div class="close-btn" @click="isWechatCustomerShow = false"></div>
        </div>
      </div>
    </transition>
  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

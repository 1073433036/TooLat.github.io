<template>
  <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
    <div class="payment" :value="value" v-show="visible">
      <div class="mask" @click="cancel"></div>
      <div class="container">

        <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
          <div class="box">
            <div class="title">
              <span class="name">请选择支付方式</span>
              <div class="icon" @click="cancel">
                <i class="icon-close"></i>
              </div>
            </div>
            <div class="content">

              <div class="money">
                <span class="i">¥</span>
                <span class="t">{{ price || '0.00' }}</span>
              </div>

              <ul class="pay-list">
                <li class="item" v-for="(item, index) in payList" :class="{ 'on': payId == item.pay_id }" @click="selectPay(item)">
                  <i class="icon" :class="{ 'icon-alipay': item.type == 'ali', 'icon-wechat_pay': item.type == 'wechat' }"></i>
                  <div class="name">{{ item.pay_name }}</div>
                  <span class="select"></span>
                </li>
              </ul>

              <div class="submit-btn">
                <a href="javascript:" class="btn" @click="nowPay">立即支付</a>
              </div>
            </div>
          </div>
        </transition>

      </div>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
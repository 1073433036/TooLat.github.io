<template>
  <div class="order-pay-page">
    <div v-if="hasIntegral" class="owner-page">
      <app-header title="订单支付"></app-header>
      <div v-if="showPage" class="wrapper">
        <div class="container">
          <div class="tips">
            <i class="icon icon-horn"></i>
            <div class="notice">
              <div class="marquee">卡盟金服信贷流量服务平台：请您在23:59:59前完成支付以免商户订单失效</div>
            </div>
          </div>
          <div class="quickpay-mark">
            <i class="sp sp-unionpay-01"></i>
            <span>快捷支付</span>
          </div>
          <div class="form-group">
            <ul class="list">
              <li class="item">
                <div class="box">
                  <div class="name">订单金额</div>
                  <div class="content">
                    <div class="cr">{{formData.amount}}</div>
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">持卡人</div>
                  <div class="content">
                    <div class="text">{{formData.name}}</div>
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">卡号</div>
                  <div class="content">
                    <div class="text">{{formData.card_no}}</div>
                  </div>
                </div>
              </li>
            </ul>
            <ul class="list">
              <li class="item">
                <div class="box">
                  <div class="name">手机号</div>
                  <div class="content">
                    <input type="text" class="input-item" v-model="formData.phone" placeholder="请填写信用卡预留手机号码">
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">验证码</div>
                  <div class="content">
                    <input type="text" class="input-item" v-model="captcha" placeholder="请填写收到的验证码">
                  </div>
                  <div class="code">
                    <div class="phone-code" :class="{active: active}" v-on:click="getCaptcha">{{ phoneText }}</div>
                  </div>
                </div>
              </li>
            </ul>
            <div class="submit-btn">
              <div type="button" class="btn" :class="{active: !isRepeatPay}" v-on:click.stop="confirmPay">{{paymentTx}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="third-page" v-html="callBackData"></div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

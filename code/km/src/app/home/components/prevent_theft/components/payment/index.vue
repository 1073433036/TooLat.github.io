<template>
  <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
    <div class="payment" :value="value" v-show="visible">
      <div class="mask" @click="cancel"></div>
      <div class="container">

        <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
          <div class="box" v-show="payState">
            <div class="title">
              <span class="name">确认投保</span>
              <div class="icon" @click="cancel">
                <i class="icon-close"></i>
              </div>
            </div>
            <div class="content">

              <div class="money">
                <span class="i">¥</span>
                <span class="t">{{ goodsPrice || '0.00' }}</span>
              </div>

              <ul class="option-list">

                <li class="item">
                  <div class="name">{{ userInfo.level | levelText }}：</div>
                  <div class="option">{{ userInfo.user_nickname }}</div>
                </li>

                <li class="item" @click="payState = false, payType = true" v-show="userInfo.level == 1">
                  <div class="name">付款方式：</div>
                  <div class="option" :class="{ 'on': !payName }">{{ payName || '请选择支付方式' }}</div>
                  <i class="icon icon-enter"></i>
                </li>

                <!-- <li class="item">
                  <div class="name">平台赠送：</div>
                  <div class="option">账户盗刷险(价值5万元)</div>
                </li> -->

                <li class="item">
                  <div class="name">保险类型：</div>
                  <div class="option"></div>
                </li>

              </ul>

              <div class="insurance">
                <a href="javascript:" v-for="(item, index) in goodsList" :class="{ 'on': goodsId == item.goods_id }" @click="selectGoods(item)">{{ item.goods_name }}</a>
                <a href="javascript:" @click="$router.go(-2)">暂不购买</a>
              </div>

              <div class="submit-btn">
                <a href="javascript:" class="btn" @click="nowInsure">立即投保</a>
              </div>
            </div>
          </div>
        </transition>

        <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
          <div class="box" v-show="payType">
            <div class="title">
              <span class="name">选择付款方式</span>
              <div class="return" @click="payState = true, payType = false">
                <i class="icon-direction2"></i>
              </div>
            </div>
            <ul class="pay-list">
              <li class="item" v-for="(item, index) in payList" :class="{ 'on': payId == item.pay_id }" @click="selectPay(item)">
                <i class="icon" :class="{ 'icon-alipay': item.type == 'ali', 'icon-wechat_pay': item.type == 'wechat' }"></i>
                <div class="name">{{ item.pay_name }}</div>
                <span class="select"></span>
              </li>
              <!-- <li class="item">
                <i class="icon icon-wechat_pay"></i>
                <div class="name">微信支付</div>
                <span class="select"></span>
              </li> -->
            </ul>
          </div>
        </transition>

        <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
          <div class="box" v-show="successState">
            <div class="title">
              <span class="name"></span>
              <div class="icon" @click="cancel">
                <i class="icon-close"></i>
              </div>
            </div>
            <div class="success">
              <div class="banner">
                <img src="~assets/images/prenenttheft-bg01.png" alt="">
              </div>
            </div>
            <div class="bottom">
              <div class="t">恭喜你</div>
              <div class="p">您的账号已成功购买账号盗刷险，请您放心使用!</div>
              <div class="b">投保成功</div>
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
<template>
  <div class="emptypay-page">
    <app-header title="无卡支付" :other="true" v-on:other="goBackHomePage"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="top">
          <div class="money-gruop" @click="showSetMoneyPopup">
            <div class="money">{{ money }}</div>
            <div v-show="!money" class="set-money">
              <a href="javascript:" class="btn">设置金额(元)</a>
            </div>
          </div>
          <div class="text">选择收款方式</div>
          <ul class="list">
            <li class="item" v-on:click.stop="goToPaySlot('UnionPay')">
                <div class="logo">
                  <!-- <i class="sp sp-empty-01"></i> -->
                  <i class="sp sp-empty-unionpay"></i>
                </div>
                <span class="name">银联快捷</span>
            </li>
            <li class="item" v-on:click.stop="goToPaySlot('WechatPay')">
                <div class="logo">
                  <i class="sp sp-empty-02"></i>
                  <!-- <i class="icon icon-wechat_pay"></i> -->
                </div>
                <span class="name">微信支付</span>
            </li>
            <li class="item" v-on:click.stop="goToPaySlot('Alipay')">
                <div class="logo">
                  <i class="sp sp-empty-03"></i>
                  <!-- <i class="icon icon-alipay"></i> -->
                </div>
                <span class="name">支付宝</span>
            </li>
            <li class="item">
              <a href="javascript:">
                <div class="logo">
                  <i class="sp sp-empty-04"></i>
                  <!-- <i class="icon icon-scancode"></i> -->
                </div>
                <span class="name">扫一扫</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="head">
          <div class="body">
            <i class="sp sp-unionpay"></i>
            <div class="content">
              <div class="welcome">欢迎使用中国银联快捷支付服务</div>
            </div>
          </div>
        </div>
        <div class="menu">
          <!-- <router-link :to="{ name: 'home.EmptyPayBill' }"> -->
          <div class="content" v-on:click.stop="queryPayBill">
            <i class="sp sp-bill"></i>
            <span class="name">账单查询</span>
            <i class="sp sp-right"></i>
          </div>
          <!-- </router-link> -->

        </div>

        <div class="menu">
          <router-link :to="{ name: 'home.EmptyPayDepositCardList' }" tag="div" class="content">
            <i class="sp sp-profile-05"></i>
            <span class="name">储蓄卡管理</span>
            <i class="sp sp-right"></i>
          </router-link>
        </div>

        <div class="rate">
          <div class="title">无卡支付服务费率</div>
          <div class="table-group">
            <div class="table-item">
              <div class="name">
                <span>结算方式</span>
              </div>
              <div class="val">
                <span>D+0 有积分</span>
              </div>
            </div>

            <div class="table-item red">
              <div class="name">
                <span>
                  <i class="sp sp-badge-01"></i>
                  <em>
                    <!-- 经理 -->
                    <i class="sp sp-level-04"></i>
                  </em>
                </span>
              </div>
              <div class="val">
                <span>4.3‰<br>+2/笔</span>
              </div>
            </div>

            <div class="table-item orange">
              <div class="name">
                <span class="red">
                  <i class="sp sp-badge-02"></i>
                  <em>
                    <!-- 专员 -->
                    <i class="sp sp-level-03"></i>
                  </em>
                </span>
              </div>
              <div class="val">
                <span>4.4‰<br>+2/笔</span>
              </div>
            </div>

            <div class="table-item golden">
              <div class="name">
                <span class="red">
                  <i class="sp sp-badge-03"></i>
                  <em>
                    <!-- 高级会员 -->
                    <i class="sp sp-level-02"></i>
                  </em>
                </span>
              </div>
              <div class="val">
                <span>4.58‰<br>+2/笔</span>
              </div>
            </div>

            <div class="table-item">
              <div class="name">
                <span>普通用户</span>
              </div>
              <div class="val">
                <span>5‰<br>+2/笔</span>
              </div>
            </div>

          </div>

          <div class="remarks">
            <p>注：代理商使用收钱服务时，银行均按5.0‰(D+0有积分)，先行扣除收款服务费，而后平台在银行结算后再以奖励金的形式返现。(D+0即付款成功后，银行将于10分钟左右完成结算)</p>
          </div>

          <div class="tips">
            <p>商户收款服务支持银联快捷支付，不同等级服务费率不同，如等级发生变化，对应的收钱服务费率会在48小时内更新生效。</p>
          </div>

          <div class="prompt">
            <span>温馨提示</span>
            <p>请您在使用信用卡刷卡的时候尽量避免整数大额消费如：5000元、10000元整，这样对您的信用卡有好处哦！</p>
          </div>

        </div>
      </div>
      <div v-show="!checkBank" class="check-bank" v-on:click="handleMaskText()"></div>
    </scroller>

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <!-- <div v-show="!isWechatClient && isMaskVip" class="mask-vip"> -->
      <div v-show="isMaskVip" class="mask-vip">
        <div class="mask" @click="closeVip"></div>
        <div class="inner">
          <div class="close" @click="closeVip">
            <i class="icon icon-close"></i>
          </div>
          <scroller>
            <img src="~assets/images/creditcard-05.jpg">
          </scroller>
        </div>
      </div>
    </transition>

    <SetMoney v-model="state.setMoney" @submit="setAmount"></SetMoney>


  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

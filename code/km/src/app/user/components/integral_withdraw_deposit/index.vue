<template>
  <div class="integral-withdraw-page">
    <app-header title="积分提现"></app-header>
      <scroller>
        <div class="wrapper">
          <div class="deposit-top">
            <div class="left">到账银行卡</div>
            <div class="mid">
              <ul class="bank-info" v-on:click.stop="goBankListPage">
                <li>{{ bankInfo.bank_name }}</li>
                <li>{{ handleCardNo(bankInfo.bank_card) }}</li>
                <li class="tips">1-5个工作日到账</li>
              </ul>
            </div>
            <div class="right">
              <i class="sp sp-right"></i>
            </div>
          </div>
          <div class="deposit-info">
            <div class="left">
              当前积分：<span class="current-integral-value">{{integralWithdrawInfo.integral}}</span>
            </div>
<!--             <div class="right">
              <span v-if="integralWithdrawInfo.integral_ratio">{{integralWithdrawInfo.integral_ratio}}</span>
            </div> -->
            <!-- <span>可提取人民币</span> -->
            <!-- <span class="enabled-money">5元</span> -->
            <span class="money">（{{integralWithdrawInfo.integral_ratio}}积分等于1元）</span>
            <span class="all" v-on:click.stop="withdrawAllMoney">全部提现</span>
          </div>
          <div class="deposit-value">
            <h3>提取金额</h3>
            <div class="input-group">
              <span>￥</span>
              <input type="text" v-model="money">
            </div>
          </div>
          <div class="deposit-btn" v-on:click.stop="submitWithdrawData">立即提现</div>
          <div class="tips">
            <div class="title">积分提现说明：</div>
            <div class="content">高级会员及以上身份会员才有权限提现积分，需1000积分起提！谢谢配合！</div>
          </div>
        </div>
      </scroller>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>
<template>
  <div class="integral-detail-page" v-if="isShowPage">
    <app-header title="积分提现"></app-header>
    <scroller
    :on-refresh="refresh"
    :on-infinite="infinite">
      <div class="wrapper">
        <div class="integral-top">
          <div class="left">
            <i class="sp sp-integral-gift"></i>
            <div class="groud">
              <div class="item">当前积分：<span>{{ integralTotal }}</span></div>
              <div class="item">车险奖励积分：<span>{{ integral_freeze }}（冻结）</span></div>
            </div>
          </div>
          <div class="right-btn" v-on:click.stop="goIntegralWithdrawDepositPage">我要提取</div>
        </div>
        <div class="integral-time">说明：车险业务需在用户收到保单7个工作日后T+2提现</div>
        <div class="integral-detail">
          <ul class="integral-detail-list">
            <li class="item" v-for="item in integralList">
              <div class="left">
                <p>{{ handleJsonTime(item.add_time)[0] }}</p>
                <p class="hours">{{ handleJsonTime(item.add_time)[1] }}</p>
              </div>
              <div class="mid">{{ item.desc }}</div>
              <div class="right">
                <p>{{ item.integral }}</p>
                <p v-if="0 < item.integral" class="value add">积分</p>
                <p v-if="0 >= item.integral" class="value reduce">积分</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>
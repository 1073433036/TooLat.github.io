<template>
  <div class="withdraw-deposit-page">
    <app-header title="提现"></app-header>
      <div class="head">
        <div class="content">
          <div class="top">
            <div class="avatar">
              <router-link :to="{ name: 'user.Profile' }">
                <img v-if="userInfo.avatar_full" :src="userInfo.avatar_full">
                <img v-if="!userInfo.avatar_full" src="~assets/images/default-avatar.png">
              </router-link>
            </div>

            <div class="user-info">
              <div class="name">
                <span>{{ userInfo.user_nickname }}</span>
                <span class="practice sp-level">
                  <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
                  <em>({{ userInfo.level_name }})</em>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
      <scroller>
        <div class="wrapper">
          <div class="deposit-top" v-on:click.stop="goBankListPage">
            <div class="left">到账银行卡</div>
            <div class="mid">
              <ul class="bank-info">
                <li>{{ bankInfo.bank_name }}</li>
                <li>{{ handleCardNo(bankInfo.bank_card) }}</li>
                <!-- <li class="tips">1-5个工作日到账</li> -->
                <li class="tips">秒到账</li>
              </ul>
            </div>
            <div class="right">
              <i class="sp sp-right"></i>
            </div>
          </div>
          <div class="deposit-info">
            当前余额：<span>{{ userWithdrawInfo.account }}</span>
            <span class="all" v-on:click.stop="withdrawAllMoney">全部提现</span>
          </div>
          <div class="deposit-value">
            <h3>提取金额</h3>
            <div class="input-group">
              <span>￥</span>
              <input type="text" v-model="money">
            </div>
            <div class="tips">注：提现秒到账银行手续费单笔1元，最低提现金额11元</div>
          </div>
          <div class="deposit-btn" v-on:click.stop="submitWithdrawData">立即提现</div>

          <div class="foot">
            <div class="tips">提现秒到账政策：合作银行收取单笔1元手续费，最低提现金额11元，每天不限次数。请大家认真填写个人信息以及银行卡号，以免提现失败。</div>
          </div>
        </div>
      </scroller>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>

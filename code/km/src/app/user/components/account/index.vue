<template>
  <div class="user-account-page">
    <app-header title="账户管理"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="head">
            <div class="money">
              <em>￥</em>
              <span>{{ user.account || 0.00}}</span>
            </div>
            <p>可提现金额</p>
            <button type="button" v-on:click.stop="goWithdrawDepositPage">立即提现</button>
          </div>
          <div class="agree">
            <Checkbox v-model="single">
              <span>我已认真阅读</span>
              <a href="javascript:" class="link" @click="isShowStandard = true">《卡盟金服平台推广规范》</a>
              <span>，认同平台的经营模式，并自愿接受协议中的条款。</span>
            </Checkbox>
          </div>
          <div class="main">
            <ul class="input-group">
              <li class="input-item" @click="jumpIncome">
                <i class="sp sp-user-account-01"></i>
                <div class="name">
                  <span>收益明细</span>
                  <div class="prompt" v-show="user_account_balance">
                    <span>{{ user_account_balance }}</span>
                  </div>
                </div>
                <i class="sp sp-right"></i>
              </li>
              <router-link :to="{ name: 'user.PresentRecord' }" class="input-item" tag="li">
                <i class="sp sp-user-account-02"></i>
                <div class="name">
                  <span>提现记录</span>
                </div>
                <i class="sp sp-right"></i>
              </router-link>
              <router-link :to="{ name: 'user.BankList' }" class="input-item" tag="li">
                <i class="sp sp-user-account-03"></i>
                <div class="name">
                  <span>银行卡</span>
                </div>
                <i class="sp sp-right"></i>
              </router-link>
              <li class="input-item integral-tips" @click="jumpIntegral">
                <i class="sp sp-integral-gift"></i>
                <div class="name">
                  <span>积分提现</span>
                  <div class="prompt" v-show="user_account_integral">
                    <span>{{ user_account_integral }}</span>
                  </div>
                </div>
                <i class="sp sp-right"></i>

                <div v-if="1 === isNotice" class="tips">
                  <i class="sp sp-icon-integral-01"></i>
                  <span>您的保险佣金奖励已到账，请您点击进入<router-link :to="{ name: 'user.IntegralDetail' }">“积分提现”查收！</router-link></span>
                </div>
              </li>

              <li class="input-item" @click="jumpInsurance">
                <i class="sp sp-class_room_010"></i>
                <div class="name">
                  <span>保险明细</span>
                  <div class="prompt" v-show="user_account_insurance">
                    <span>{{ user_account_insurance }}</span>
                  </div>
                </div>
                <i class="sp sp-right"></i>
              </li>
            </ul>
          </div>

          <div v-if="1 >= userInfo.level" class="foot">
            <p>抱歉！您目前是实习会员身份，提现功能需要升级正式会员后开通，再推荐{{ zsNumberData }}个高级会员，您可要成功提现</p>
          </div>

        </div>
      </div>
    </scroller>
    <posterAgreement v-model="isShowStandard"></posterAgreement>
    <Socket ref="socket"></Socket>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
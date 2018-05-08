<template>
  <div class="repayment-page">
    <scroller
      :on-infinite="infinite"
      ref="scroller">
      <app-header title="信用卡还款" :status="headStatus"></app-header>
      <div class="wrapper">
        <div class="controller">
          <div class="head">
            <div class="btn-add">
              <router-link :to="{ name: 'home.CreditCardBillAdd' }">
                <span>＋ 添加信用卡账单</span>
                <i class="sp sp-repayment-01"></i>
                <em>银行级数据加密，多重安全保障</em>
              </router-link>
            </div>

            <div class="tags">
              <div class="tag">
                <i class="sp sp-repayment-02"></i>
                <span>提醒还款</span>
              </div>
              <div class="tag">
                <i class="sp sp-repayment-03"></i>
                <span>实时余额</span>
              </div>
              <div class="tag">
                <i class="sp sp-repayment-04"></i>
                <span>低息分期</span>
              </div>
            </div>

          </div>
          <ul class="list">
            <li class="item" v-for="(item, index) in formTemp.listData">
              <div class="body">
                <div class="left">
                  <!-- <i class="sp sp-bank-gs"></i> -->
                  <div class="logo">
                    <img :src="item.bank.thumb" alt="">
                  </div>
                  <h2 class="name" :style="{ color: item.bank.color }">{{ item.bank.bank_name }}</h2>
                </div>
                <div class="right">
                  <div class="top">
                    <div class="day-num">{{ item.repay_date | byBillDate }}</div>
                    <div class="day">
                      <p>天截止还款期</p>
                      <span>{{ item.repay_date.split(' ')[0] }}到期</span>
                    </div>
                    <div class="btn-group">
                      <i v-if="isDemo" class="sp sp-bank-demo"></i>
                      <!-- <button v-if="!isDemo" v-on:click="handleRepayment(item)" class="btn blue">立即还款</button> -->
                      <button v-if="!isDemo" v-on:click="instalment(item)" class="btn blue">我要分期</button>
                    </div>
                  </div>
                  <div class="bot">
                    <div class="txt">
                      <h3 class="title">本期账单</h3>
                      <p>¥ {{ item.bill_amount }}</p>
                    </div>
                    <div class="txt">
                      <h3 class="title">剩余应还</h3>
                      <p>¥ {{ item.repay_amount }}</p>
                    </div>
                    <div class="txt">
                      <h3 class="title">免息期</h3>
                      <p>{{ item.free_days }}天</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="foot">
                <div class="left">
                  <span>额度：{{ item.quota }}</span>
                </div>
                <div class="middle">
                  <span>户名：{{ item.account_name }}</span>
                  <span>尾号({{ item.account_no | sliceCard  }})</span>
                </div>
                <div class="right">
                  <span v-on:click="isSorry = true">我要代还</span>
                </div>
              </div>
            </li>

          </ul>

        </div>
      </div>
    </scroller>


<!--     <div class="btn-credit">
      <div class="btn-group">
        <div class="item" @click="shareInvite">
          <i class="sp sp-repayment-06"></i>
          <span>分享我的邀请</span>
        </div>
      </div>
    </div> -->

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div class="mask-layer" v-show="isSorry">
        <div class="mask-body mask-sorry">
          <div class="main">
            <h2>您的评分暂未达到标准，请您一个月后再次申请，祝您申请成功！</h2>

            <div class="btn">
              <button type="button" v-on:click="isSorry = false">我知道了</button>
            </div>
          </div>
        </div>

      </div>
    </transition>

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutDown">
      <div class="mask-layer" v-show="maskStatus">
        <div class="mask-body">
          <div class="head">
            <div class="title">
              <h2>快捷还款</h2>
              <em>到账快</em>
            </div>
            <i class="sp sp-close" v-on:click="maskStatus = false"></i>
          </div>
          <div class="main">
            <ol class="list">
              <li class="item">
                <span>信用卡</span>
                <input type="text" v-model="formData.credit.cardNum" readonly placeholder="请先选择信用卡">
                <i class="sp sp-right" v-on:click="handelChangeCredit()"></i>
              </li>
              <li class="item">
                <span>还款金额</span>
                <input v-model="formData.credit.money" type="text" placeholder="单笔最高50000.00">
              </li>
              <li class="item pay-type">
                <span>还款方式</span>
                <div class="pay-group">
                  <div class="pay-item"
                    v-for="(item, index) in formTemp.payData"
                    v-on:click="handlePayChange(item, index)"
                    :class="{ active: (index + 1) === formData.credit.payIndex }">
                    <i class="sp" :class="item.id | payType"></i>
                    <span>{{ item.name }}</span>
                  </div>

                </div>
              </li>
            </ol>
            <div class="agreement">
              <Checkbox v-model="formTemp.checked">
                <span>同意</span>
                <a class="link">用户还款服务协议</a>
              </Checkbox>
            </div>

            <div class="btn-pay">
              <button type="button" :class="{ transit: active }" :disabled="!active" v-on:click="handlePay()">立即支付</button>
            </div>
          </div>
        </div>

      </div>
    </transition>

    <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
      <div class="mask-layer" v-show="isPay">
        <div class="mask-body">
          <div class="head">
            <div class="close" v-on:click="handleClosePay()">
              <i class="sp sp-left-01"></i>
            </div>
            <div class="title">
              <h2>付款详情</h2>
            </div>
          </div>
          <div class="main">
            <ol class="list">
              <li class="item">
                <span>信用卡还款</span>
                <div class="right">
                  <span>{{ formData.credit.bankName }}({{ formData.credit.cardNum | sliceCard }})</span>
                </div>
              </li>
              <li class="item">
                <span>付款方式</span>
                <div class="right" v-on:click="handelChangeBankCard()">
                  <span>{{ formData.card.bankName }}({{ formData.card.cardNum | sliceCard }})</span>
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item">
                <span>需付款</span>
                <div class="right">
                  <span>
                    <em>¥</em>
                    {{ formData.credit.money }}
                  </span>
                </div>
              </li>
            </ol>
            <div class="btn-pay">
              <button type="button" class="transit">确认支付</button>
            </div>
          </div>
        </div>

      </div>
    </transition>


    <CreditCardlist @creditCardClick="handleCreditCardClcik" :change="creditCard" :select="formData.credit"></CreditCardlist>
    <BankList @bankCardClick="handleBankClcik" :change="bankCard" :select="formData.card"></BankList>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
<template>
  <div class="BankCard-page">
    <div class="layer" v-show="showMask" @click="closeMask()">
      <div class="mask">
        <span class="sp sp-mask"></span>
      </div>
    </div>
    <scroller>
      <img v-show="Allmoney<=5000" src="~assets/images/Bank_card/result8.png" alt="" class="ReasultImg">
      <img v-show="Allmoney<=10000&&Allmoney>=5000" src="~assets/images/Bank_card/result7.png" alt="" class="ReasultImg">
      <img v-show="Allmoney<=20000&&Allmoney>=10000" src="~assets/images/Bank_card/result5.png" alt="" class="ReasultImg">
      <img v-show="Allmoney<=30000&&Allmoney>=20000" src="~assets/images/Bank_card/result3.png" alt="" class="ReasultImg">
      <img v-show="Allmoney<=70000&&Allmoney>=30000" src="~assets/images/Bank_card/result2.png" alt="" class="ReasultImg">
      <img v-show="Allmoney>=70000" src="~assets/images/Bank_card/result1.png" alt="" class="ReasultImg">
      <!-- <span :class="'sp sp-'+ImageUrl+' ReasultImg'"></span> -->
      <div class="BankCard-options">
        <router-link :to="{name: 'home.TestTheBankCard'}">
          <span class="sp sp-layer-btn2 commonbtn"></span>
        </router-link>
        <a href="javascirpt:;">
          <span class="sp sp-layer-btn3 commonbtn" @click="handleShareClick()"></span>
        </a>
      </div>
      <div class="toCard">
        <span class="sp sp-card-tit Cart-title"></span>
        <div class="Card-content">
          <a href="javascript:;">
            <span :class="'sp sp-'+NewImg+'  BankCard'"></span>
          </a>
          <router-link :to="{ name : 'home.CreditCardList', params:{bid:Id} }" tag="a">
            <span class="sp sp-card-link toHaveCard"></span>
          </router-link>

        </div>
        <!-- <p>交行标准信用卡</p> -->
      </div>
      <p class="lasttext">
        * 银行会根据申请人填写的信息进行综合评分，给予相应额度，不同银行要 求不一。本额度仅供参考，具体额度以银行官网为准。
      </p>
    </scroller>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>
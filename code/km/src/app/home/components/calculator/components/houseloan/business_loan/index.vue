<template>
  <div class="business-loan-page">
    <ul class="list">
      <li class="item">
        <div class="left">
          <span>房款总价：</span>
        </div>
        <div class="right">
          <div class="input">
            <input type="text" v-model="formData.housePrice" class="width" placeholder="请填写">
          </div>
          <div class="tips">万元</div>
        </div>
      </li>
      <li class="item" @click="sendDownPaymentRatio('downPaymentRatio')">
        <div class="left">
          <span>首付比例：</span>
        </div>
        <div class="right">
          <div class="input" v-on:click="">
            <input type="text" class="readyonly-input" v-model="formData.downPaymentRatio" readonly placeholder="请选择">
          </div>
          <i class="sp sp-right"></i>
        </div>
      </li>
      <li class="item">
        <div class="left">
          <span>贷款总额：</span>
        </div>
        <div class="right">
          <div class="input">
            <input type="text" v-model="formData.amount" class="width" placeholder="请填写">
          </div>
          <div class="tips">万元</div>
        </div>
      </li>
      <li class="item" @click="sendDownPaymentRatio('mortgageYears')">
        <div class="left">
          <span>按揭年数：</span>
        </div>
        <div class="right">
          <div class="input" v-on:click="">
            <input type="text" class="readyonly-input" v-model="formData.mortgageYears" readonly placeholder="请选择">
          </div>
          <i class="sp sp-right"></i>
        </div>
      </li>
      <router-link :to="{name: 'RateChoice'}">
        <li class="item bordernone">
          <div class="left">
            <span>利率：</span>
          </div>
          <div class="right">
            <div class="input" v-on:click="">
              <input type="text" class="readyonly-input" v-model="formData.rate" readonly placeholder="请选择">
            </div>
            <i class="sp sp-right"></i>
          </div>
        </li>
      </router-link>
    </ul>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
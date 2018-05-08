<template>
  <div class="combination-loan-page">
    <ul class="businesslist">
      <li class="item">
        <div class="left">
          <span>商业贷款：</span>
        </div>
        <div class="right">
          <div class="input">
            <input type="text" v-model="formData.businessLoan" class="width" placeholder="请填写">
          </div>
          <div class="tips">万元</div>
        </div>
      </li>
      <li class="item">
        <div class="left">
          <span>按揭年数：</span>
        </div>
        <div class="right">
          <div class="input" v-on:click="">
            <input type="text" class="readyonly-input" v-model="formData.businessMortgageYears" readonly placeholder="请选择">
          </div>
          <i class="sp sp-right"></i>
        </div>
      </li>
      <li class="item bordernone">
        <div class="left">
          <span>利率：</span>
        </div>
        <div class="right">
          <div class="input" v-on:click="">
            <input type="text" class="readyonly-input" v-model="formData.businessRate" readonly placeholder="请选择">
          </div>
          <i class="sp sp-right"></i>
        </div>
      </li>
    </ul>

    <ul class="accumulationlist">
      <li class="item cut-line">
        <div class="left">
          <span>公积金贷款：</span>
        </div>
        <div class="right">
          <div class="input">
            <input type="text" v-model="formData.accumulationLoan" class="width" placeholder="请填写">
          </div>
          <div class="tips">万元</div>
        </div>
      </li>
      <li class="item">
        <div class="left">
          <span>按揭年数：</span>
        </div>
        <div class="right">
          <div class="input" v-on:click="">
            <input type="text" class="readyonly-input" v-model="formData.accumulationMortgageYears" readonly placeholder="请选择">
          </div>
          <i class="sp sp-right"></i>
        </div>
      </li>
      <li class="item bordernone">
        <div class="left">
          <span>利率：</span>
        </div>
        <div class="right">
          <div class="input" v-on:click="">
            <input type="text" class="readyonly-input" v-model="formData.accumulationRate" readonly placeholder="请选择">
          </div>
          <i class="sp sp-right"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
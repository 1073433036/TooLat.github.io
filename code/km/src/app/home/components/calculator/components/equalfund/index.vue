<template>
  <div class="equal-fund-page">
    <app-header :title="title"></app-header>
    <scroller>
      <div class="wrapper">
        <div v-show="!isCalculate" class="main">
          <ul class="list">
            <li class="item">
              <div class="left">
                <span>贷款金额：</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" v-model="formData.loanAmount" class="width" placeholder="请填写">
                </div>
                <div class="tips">万元</div>
              </div>
            </li>
            <li class="item" @click="handleBotSelectChange('loanDeadline')">
              <div class="left">
                <span>贷款期限：</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" class="readyonly-input" v-model="formData.loanDeadline.name" readonly placeholder="请选择">
                </div>
                <i class="sp sp-right"></i>
              </div>
            </li>
            <li class="item bordernone">
              <div class="left">
                <span>综合月利率：</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" v-model="formData.monthRate" class="width" placeholder="请填写">
                </div>
                <div class="tips">%</div>
              </div>
            </li>
          </ul>
          <div class="calculate">
            <router-link :to="{name: 'home.Equalfund', params: {id: 'loanresult'}}">
              <a id="calculate-btn">开始计算</a>
            </router-link>
            <a id="reset-btn" v-on:click="handlereset">重置</a>
          </div>
          <div id="list-title">输出结果</div>
          <ul class="list">
            <li class="item">
              <div class="left">
                <span>每月还款：</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" v-model="formData.repayment" class="width" placeholder="">
                </div>
                <div class="tips1">元</div>
              </div>
            </li>
            <li class="item">
              <div class="left">
                <span>总支付利息：</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" v-model="formData.amountInterest" class="width" placeholder="">
                </div>
                <div class="tips1">元</div>
              </div>
            </li>
            <li class="item bordernone">
              <div class="left">
                <span>本息总和：</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" v-model="formData.amount" class="width" placeholder="">
                </div>
                <div class="tips1">元</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div v-show="isCalculate" class="component-wrapper">
        <CalculateLoanResult></CalculateLoanResult>
      </div>
    </scroller>
    <BotSelect v-on:onChildClick="botSelectClick"
      :title="botTitle"
      :show="isShow"
      :formData="formTemp[formIndex]"
      :formIndex="formIndex"></BotSelect>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
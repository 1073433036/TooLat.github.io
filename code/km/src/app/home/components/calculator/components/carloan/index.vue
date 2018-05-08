<template>
  <div class="carloan-page">
    <app-header title="车贷"></app-header>
    <scroller>
      <div class="wrapper">
        <ul class="list">
          <li class="item">
            <div class="left">
              <span>输入车型：</span>
            </div>
            <div class="right">
              <div class="input">
                <input type="text" v-model="formData.loanAmount" class="width" placeholder="输入您的爱车">
              </div>
              <i class="sp sp-input-pen"></i>
            </div>
          </li>
          <li class="item">
            <div class="left">
              <span>裸车价：</span>
            </div>
            <div class="right">
              <div class="input">
                <input type="text" v-model="formData.loanAmount" class="width" placeholder="手动输入价格">
              </div>
              <div class="tips1">元</div>
            </div>
          </li>
          <li class="item" @click="handleBotSelectChange('downPaymentRate')">
            <div class="left">
              <span>首付：</span>
            </div>
            <div class="right">
              <div class="input">
                <input type="text" class="readyonly-input" v-model="formData.downPaymentRate.name" readonly placeholder="请选择">
              </div>
              <i class="sp sp-right"></i>
            </div>
          </li>
          <li class="item" @click="handleBotSelectChange('installment')">
            <div class="left">
              <span>月供：</span>
            </div>
            <div class="right">
              <div class="input">
                <input type="text" class="readyonly-input" v-model="formData.installment.name" readonly placeholder="请选择">
              </div>
              <i class="sp sp-right"></i>
            </div>
          </li>
          <li id="amountitem" class="item bordernone">
            <div class="left">
              <span>全款花费总额：</span>
            </div>
            <div class="right">
              <div class="input">
                <input type="text" v-model="formData.amount" class="width" placeholder="0.00">
              </div>
              <div class="tips1">元</div>
            </div>
          </li>
          <li class="item1">比全款购车多花：<span>{{extraPay}}</span></li>
          <li class="item1">贷款额：<span>{{loanLimit}}</span></li>
        </ul>
        <ul id="list-2" class="list">
          <li class="item">
            <div class="left">
              <span>必要花费：</span>
            </div>
            <div class="right">
              <div class="input">
                <input type="text" v-model="formData.amount" class="width" placeholder="0.00">
              </div>
              <div class="tips1">元</div>
            </div>
          </li>
          <li class="item">
            <div class="left">
              <span>购置税：</span>
            </div>
            <div class="right">
              <div class="input">
                <input type="text" v-model="formData.amount" class="width" placeholder="0.00">
              </div>
              <div class="tips1">元</div>
            </div>
          </li>
          <li class="item">
            <div class="left">
              <span>上牌费：</span>
            </div>
            <div class="right">
              <div class="input">
                <input type="text" v-model="formData.amount" class="width" placeholder="0.00">
              </div>
              <div class="tips1">元</div>
            </div>
          </li>
          <li class="item">
            <div class="left">
              <span>消费税：</span>
            </div>
            <div class="right">
              <div class="input">
                <input type="text" v-model="formData.amount" class="width" placeholder="0.00">
              </div>
              <div class="tips1">元</div>
            </div>
          </li>
        </ul>
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
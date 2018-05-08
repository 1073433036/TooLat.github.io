<template>
  <div class="calculate-loan-result-page">
    <div class="wrapper">
      <div class="change-btn-group">
        <a class="gone-btn active-btn" @click="goTaxfOrTaxgPage($event, 'taxgone')">等额本息</a>
        <a class="forward-btn" @click="goTaxfOrTaxgPage($event, 'taxforward')">等额本金</a>
      </div>
      <h3>Tips：每月还款金额固定，所还总利息较多</h3>
      <div id="graph1" class="echart-graph" ref="echartDom"></div>
      <div class="result-detail">
        <ul class="detail-list">
          <li>
            <i class="rect1"></i>
            <span>贷款总额：</span>
            <div class="right"><span class="color-a">{{loanAmount}}</span>万元</div>
          </li>
          <li>
            <i class="rect2"></i>
            <span>支付利息：</span>
            <div class="right"><span class="color-a">{{interest}}</span>元</div>
          </li>
          <li>
            <i class="rect2 hide"></i>
            <span>还款总额：</span>
            <div class="right"><span class="color-a">{{payAmount}}</span>万元</div>
          </li>
          <li>
            <i class="rect2 hide"></i>
            <span>首月月供：</span>
            <div class="right"><span class="color-a">{{monthPay}}</span>元</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
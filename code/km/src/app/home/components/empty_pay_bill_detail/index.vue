<template>
  <div class="bill-detail-page">
    <app-header title="账单详情"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="title">
            <span class="name">收款</span>
          </div>
          <div class="money">+10.00</div>
          <div class="status">支付完成</div>
          <ul class="list">
            <li class="item">
              <div class="left">交易手续费</div>
              <div class="right">0.01</div>
            </li>
            <li class="item">
              <div class="left">支付方式</div>
              <div class="right">微信</div>
            </li>
            <li class="item">
              <div class="left">交易时间</div>
              <div class="right">2017-11-16 18:25:45</div>
            </li>
            <li class="item">
              <div class="left">交易流水号</div>
              <div class="right">123456789012345</div>
            </li>
          </ul>
          <div class="title on"></div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
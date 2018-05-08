<template>
  <div class="past_plan">
    <app-header title="往期计划"></app-header>
    <scroller>
      <div class="content">
        <h3 class="h3">2017-12</h3>
        <ul class="list-payment-plan">
          <div class="info">
						<div class="money">总计划金额：{{paymentPlanData.PaymentPlanAmount}}<span>（含手续费{{paymentPlanData.serviceCharge}}）</span>
						<div class="deploy">计划配置：20天25笔</div>
						</div>
					</div>
          <li v-for="(item, index) in paymentMsg" :class="(paymentMsg[index + 1] === undefined ? 'item bordernone' : 'item')">
            <div class="top">
              <span>{{item.time}}</span>
              <span>{{item.paymentMoney}}</span>
            </div>
            <div class="bottom">
              <span class="color-1">{{item.paymentDate}}</span>
              <span>{{item.state}}</span>
            </div>
          </li>
        </ul>
      </div>
    </scroller>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>
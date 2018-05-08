<template>
  <div class="payment_progress_detail_page" v-if="isShowPage">
      <app-header title="还款进度查询"></app-header>
      <scroller>
        <div class="wrapper">
          <div class="top">
            <div class="content">
              <div class="amount">
                <span>￥{{paymentProgressInfo.total}}元</span>
                <span>还款总金额</span>
              </div>
              <div class="card">
                <div class="logo">
                    <img :src="paymentProgressInfo.thumb" alt="">
                </div>
                <div class="bank-name">{{ paymentProgressInfo.bank_name }}</div>
                <div class="number">{{ handleCardNo(paymentProgressInfo.card_no) }}</div>
                <div :class="(paymentProgressInfo.status === 1 ? 'state' : 'state underway-state')">{{paymentProgressInfo.status === 1 ? '已完成': '进行中'}}</div>
              </div>
            </div>
          </div>
          <div class="detail">
            <h3>还款计划</h3>
            <ul class="list">
              <li v-for="(item, index) in paymentDetailInfo" :class="(paymentDetailInfo[index+1] === undefined ? 'item bordernone' : 'item')">
                <div class="block">
                  <span class="bf">支付金额：{{item.total_fee}}元</span>
                  <span class="time">{{ item.plan_pay_time_f }}</span>
                  <span class="bs" :class="(item.status === 1 ? 'state' : 'state underway-state')">{{item.status === 1 ? '已完成': '未执行'}}</span>
                </div>
                <div class="block">
                  <span class="bf">到账金额：{{item.money_withdraw}}元</span>
                  <span class="time" v-show="item.back_time">{{ item.back_time_f }}</span>
                </div>
                <div class="block  block1">
                  <span>手续费：{{ (item.fee * 1).toFixed(2) }}元</span>
                  <span class="time">{{item.finish_date}}</span>
                  <span class="bs">费率：{{item.fee_rate}}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </scroller>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>
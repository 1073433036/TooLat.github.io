<template>
  <main class="setCreditCardPayment">
    <app-header title="设置还款计划"></app-header>
    <scroller ref="myscroller">
      <section class="basic_info_-wrapper">
        <form class="info_box" ref="form" @submit.prevent="handleSumbit">
          <ul class="info">
            <li class="detail_list">
              <em class="pay"></em>
              <span class="people">卡内当前可用金额</span>
              <input type="text"
                     class="input-item"
                     placeholder="请输入可用金额"
                     v-model="formData.card_money">
            </li>
            <li class="detail_list">
              <em class="cvn2"></em>
              <span class="people">每月最高还款笔数</span>
              <div class="num-item">
                <!--<i class="reduce" @click="reduceMax"></i>-->
                <input type="text"
                       class="input"
                       readonly
                       v-model="paymentNumMax">
                <!--<i class="add"  @click="addMax"></i>-->
              </div>
              <!--<input type="text"
                     class="input-item"
                     placeholder="20"
                     readonly
                     v-model="paymentNumMax">-->
            </li>
            <li class="detail_list">
              <em class="pay"></em>
              <span class="people">还款金额</span>
              <input type="text"
                     class="input-item"
                     placeholder="请输入还款金额"
                     v-model="formData.money">
            </li>
            <li class="detail_list" @click="handleDateChange('date2')">
              <em class="dueDate"></em>
              <span class="people">还款日期</span>
              <div class="input-item school date" v-if="date2.length">
                <div class="date-list">
                  <span v-for="(item, index) in date2" :key="index">{{item | day}}、</span>
                </div>
                <span v-if="date2.length > 6">...</span>
              </div>
              <div v-else class="input-item school date">设置日期</div>
              <div class="arrow"></div>
            </li>
            <li class="detail_list">
              <em class="cvn2"></em>
              <span class="people">消费笔数</span>
              <div class="num-item">
                <i class="reduce"  @click="reduce"></i>
                <input type="text"
                       class="input"
                       readonly
                       v-model="formData.paymentNum">
                <i class="add"  @click="add"></i>
              </div>
            </li>
          </ul>
        </form>
        <div :class="{'btn-group' : showBillList}">
          <button class="btn" :class="{ 'on': active }" @click="next">制定订单</button>
          <button class="btn on" @click="pushOrder" v-show="showBillList">提交订单</button>
        </div>
        <div v-if="showBillList">
          <div class="bill-block" v-if="billList.main_order && billList.main_order.add_time > 0">
            <div class="bill-block-head">
              <i class="icon icon-order"></i>我的账单计划
            </div>
            <div class="bill-block-content">
              <div class="content-row">
                <div>制定时间：<span>{{billList.main_order.add_time | allTime}} </span></div>
                <div>共计：<span>{{billList.main_order.num}}笔</span></div>
              </div>
              <div class="content-row">
                <div>还款金额：<span>{{billList.main_order.money_withdraw}}</span></div>
                <div>手续费：<span>{{billList.main_order.fee}}元</span></div>
              </div>
            </div>
            <div class="bill-block-foot" v-on:click="resetPlan()">
              <i class="icon icon-reset"></i>
              重置计划
            </div>
          </div>
          <div class="bill-block" v-for="(order, index) in billList.order_list" :key="index">
            <div class="bill-block-head">
              <i class="icon icon-order"></i>还款 &yen;{{order.money_withdraw}}
              <time>{{index}}</time>
            </div>
            <div class="bill-block-content">
              <div class="content-row" v-for="item in order.data">
                <div>消费（&yen;{{item.total_fee}}）</div>
                <div class="bill-label">{{item.mcc_name}}</div>
                <div>{{item.plan_pay_time | time}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="ad-print">
          <div class="title">温馨提示</div>
          <div class="sm-title">在精养代还计划执行期间，请确保卡内有充足的余额，<span class="red">大额信用卡建议您预留资金11%以上！</span>如因余额不足导致计划失败，所产生的后果由客户自行承担（如避免微信、支付宝绑定支付、便面卡内产生手续费、年费等费用、自动扣款、临时额度到期，可能导致余额不足，计划执行失败）</div>
        </div>
      </section>
    </scroller>
    <Days v-on:onDateClick="handelDateClick"
          :show="showDaySelect"
          :date="formTemp.date">
    </Days>
  </main>
</template>

<script>
  import Index from './index.js';

  export default Index;
</script>

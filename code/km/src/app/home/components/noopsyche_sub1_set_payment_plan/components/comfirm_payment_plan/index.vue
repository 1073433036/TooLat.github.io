<template>
  <div class="comfirm_payment_plan_page">
    <app-header title="确认还款计划">
			<!-- <div class="slot" slot="right">
        <span class="right" v-on:click.stop="isShowPreviousPlan =true">
						<i class="sp sp-past"></i>
						往期计划
        </span>
      </div> -->
		</app-header>
    <scroller>
      <div class="content">
        <ul class="list">
          <li class="item">
            <div class="left">
              <span>精养卡总金额</span>
            </div>
            <div class="right">
              <div class="input">
                <input type="text" class="readyonly-input" v-model="money" readonly>
              </div>
            </div>
          </li>
          <li class="item">
            <div class="left">
              <span>单笔最高金额</span>
            </div>
            <div class="right">
              <div class="input">
                <input type="text" class="readyonly-input" v-model="formData.onceMaxMoney" readonly>
              </div>
            </div>
          </li>
          <li class="item">
            <div class="left">
              <span>费率</span>
            </div>
            <div class="right">
              <div class="input">
                <input type="text" class="readyonly-input" v-model="formData.paymentRate" readonly>
              </div>
            </div>
          </li>
        </ul>
        <div class="display-payment">
          <div class="expense">
						<span>消费模式</span>
						<i class="sp sp-help"></i>
					</div>
					<div class="box">
						<ul class="select">
							<li class="choose">
                  <label class="radio-group" for="radio-h1">
                    <input type="radio" id="radio-h1" v-model="radioCheckedNum" value="1" name="housenum1" class="radio-h">
                    <span class="circle-radio">
                      <em class="hook"></em>
                    </span>
                    <span class="label" for="radio-h1">消费1</span>
                  </label>
							</li>
							<li class="choose">
								<div class="input">
                  <label class="radio-group" for="radio-h2">
                    <input type="radio" id="radio-h2" v-model="radioCheckedNum" value="2" name="housenum1" class="radio-h">
                    <span class="circle-radio">
                      <em class="hook"></em>
                    </span>
                    <span class="label" for="radio-h2">消费1-2</span>
                  </label>
                </div>
							</li>
							<li class="choose">
								<div class="input">
                  <label class="radio-group" for="radio-h3">
                    <input type="radio" id="radio-h3" v-model="radioCheckedNum" value="3" name="housenum1" class="radio-h">
                    <span class="circle-radio">
                      <em class="hook"></em>
                    </span>
                    <span class="label" for="radio-h3">消费1-3</span>
                  </label>
                </div>
							</li>
						</ul>
					</div>
        </div>
        <div class="protocol-group">
					<div class="plan">
						<ul class="project">
							<li class="choice" v-on:click.stop="goOtherPlanPage('modify')">
								<i class="sp sp-plan-03"></i>
								<span>修改计划</span>
							</li>
							<li class="choice" v-on:click.stop="sumitPayPlan">
								<i class="sp sp-plan-02"></i>
								<span>启动计划</span>
							</li>
							<li class="choice" v-on:click.stop="goOtherPlanPage('cancel')">
								<i class="sp sp-plan-01"></i>
								<span>取消计划</span>
							</li>
						</ul>
					</div>
        </div>
        <h3 class="h3">还款计划
					<i class="sp sp-plan-04"></i>
				</h3>
        <ul class="list-payment-plan">
          <div class="info">
						<div class="money">总计划金额：{{formData.PaymentPlanAmount}}<span>（含手续费{{formData.serviceCharge}}）</span>
						<div class="deploy">计划配置：{{formData.planDays}}天{{formData.count}}笔</div>
						</div>
					</div>
          <li v-for="(item, index) in paymentMsg" :class="(paymentMsg[index + 1] === undefined ? 'item bordernone' : 'item')">
            <div class="top">
              <span>{{ index + 1 }}/{{formData.count}}</span>
              <span>{{item.money}}元</span>
            </div>
            <div class="bottom">
              <span class="color-1">{{item.date}}</span>
              <span>{{ handleOrderState(item.status) }}</span>
            </div>
          </li>
        </ul>
      </div>
    </scroller>
    <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
      <div class="previous-plan" v-if="isShowPreviousPlan">
          <header class="previous-plan-header">
            <em class="rect" v-on:click.stop="isShowPreviousPlan = false"></em>
            <span>往期计划</span>
          </header>
          <scroller>
            <div class="content">
              <h3 class="h3">2017-12</h3>
              <ul class="list-payment-plan">
                <div class="info">
                  <div class="money">总计划金额：{{paymentPlanData.PaymentPlanAmount}}<span>（含手续费{{paymentPlanData.serviceCharge}}）</span>
                  <div class="deploy">计划配置：20天25笔</div>
                  </div>
                </div>
                <li v-for="(item, index) in paymentMsg1" :class="(paymentMsg1[index + 1] === undefined ? 'item bordernone' : 'item')">
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
    </transition>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>
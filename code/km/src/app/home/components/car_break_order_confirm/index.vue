<template>
  <main class="car-break-order-confirm-page">
    <app-header title="订单确认"></app-header>
    <scroller ref="myscroller">
      <div class="car-title">
        <div><img src="~assets/images/break-icon-che.png" alt="">
          {{ carNumber ? carNumber.substring(0, 2) + ' ' + carNumber.substring(2) : '' }}
        </div>
      </div>

      <div class="car-break-list-wrapper" v-if="breakRules.length">
        <div class="car-break-list" v-for="(el, index) in breakRules" :key="index">
          <div class="title">
            <div :class="['check-box', { on: el.selected }]" @click="toggleSingle(el)" v-if="el.status === 0"></div>
            <span v-else>已处理</span>
            <div :class="['time', { right: el.status === 1 }]">{{el.time}}</div>
          </div>
          <div class="conter">
            <div class="conter-tit">{{el.location}}</div>
            <p class="detail">{{el.reason}}</p>
          </div>
          <div class="bottom-btn">
            <ul>
              <li>
                <span class="blue">扣</span>{{el.actual_degree}}
              </li>
              <li>
                <span class="yellow">罚</span>{{el.count}}
              </li>
              <li>
                <span class="red">滞</span>{{el.latefine}}
              </li>
              <li>
                <span class="green">服</span>{{ el.servicePrice }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="tip-wrapper">
        <div class="tip-price">
          <div class="name">罚款总额</div>
          <div class="val" style="color: #f2812e;">￥{{ priceOfSelected }}元</div>
        </div>
        <div class="tip-price">
          <div class="name">代办服务费</div>
          <div class="val" style="color: #0cc30c;">￥{{ servicePriceOfSelected }}元</div>
        </div>
      </div>

      <div class="pos"></div>

    </scroller>

    <div class="deal-wrapper" v-if="breakRules.length">
      <div class="select-btn-wrapper" @click="toggleAllSelected">
        <em :class="{on : isAllSelected}"></em>
        <div class="select-btn">全选</div>
      </div>
      <div class="order-detail">
        <div class="top">已选 {{ countOfSelected }} 笔 共扣 {{ pointOfSelected }} 分</div>
        <div class="bottom">合计费用 <span>￥{{ priceOfSelected + servicePriceOfSelected }}</span></div>
      </div>
      <div :class="['deal-btn', { off: !hasSelected }]" @click="createOrder">去办理</div>
    </div>

    <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutLeft">
      <div class="pay-confirm" v-if="isPaying">
        <div class="inner">
          <div class="head">
            <div class="close" v-on:click="isPaying = false">
              <i class="sp sp-close"></i>
            </div>
            <span>违章处理</span>
          </div>

          <div class="money">￥{{ priceOfSelected + servicePriceOfSelected }}</div>

          <section class="item">
            <span>付款方式</span>
            <div class="right">
              <div class="pay-group">
                <div v-for="(item, index) in payTypeData" :key="index"
                  v-on:click="handleSelectType(item)" class="pay-item"
                  :class="{ active: formData.pay_id === item.pay_id}">
                  <i v-if="'ali' === item.type" class="sp sp-pay-alipay1"></i>
                  <i v-else-if="'wechat' === item.type" class="sp sp-pay-wechat"></i>
                  <i v-else class="sp sp-pay-card"></i>
                  <span>{{ item.pay_name }}</span>
                </div>
              </div>
            </div>
          </section>

          <div class="foot">
            <div class="pay">
              <button v-on:click="handleSumbitPay()">立即支付</button>
            </div>
          </div>

        </div>
      </div>
    </transition>

  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

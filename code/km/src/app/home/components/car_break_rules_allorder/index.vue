<template>
  <div class="my-car-break-my-order-page">
    <app-header title="我的订单"></app-header>
    <div class="order_nav">
      <nav>
        <div v-for="(item, index) in orderStatus" :key="index" @click="statusSelected = item.key"
            :class="{ active: item.key === statusSelected }">{{ item.text }}
          <span class="num" v-if="item.num && item.key !== statusSelected" :style="{ background: item.color }">
            {{ item.num }}
          </span>
        </div>
      </nav>
    </div>
    <scroller>
      <div class="wrapper">
        <ul v-if="orderList.length">
          <li v-for="(el, index) in orderList" :key="index">
            <!-- <p class="order_handle">{{ getStatusText(el.status) }}</p> -->
            <p class="vehicle_handle">
              <span class="car">{{ el.car_prefix + el.car_number.substring(0, 1) + ' ' + el.car_number.substring(1) }}</span>
              <span class="status" :class="'status-' + el.status"><i></i>{{ getStatusText(el.status) }}</span>
            </p>
            <div class="my_order_content">
              <p class="money code">订单编号: <span>{{ el.order_sn }}</span></p>
              <p class="time">下单时间：<span>{{ el.add_time }}</span></p>
              <p class="money">订单金额：<span>￥{{ el.order_total }}</span></p>
            </div>
            <div class="handle" v-if="el.status == 0">
              <!-- <span class="cancel" @click="isDelPopupShow = true">删除订单</span> -->
              <span class="pay"  @click="handlePayClick(el)">立即支付</span>
            </div>
          </li>
        </ul>
        <div class="no-result" v-else>暂无订单数据</div>
      </div>
    </scroller>

    <CarPayOype v-on:CarPayOypeClick="CarPayOypeClick" :title="'支付方式'" :show="Showpay" :formData="formTemp[formIndex]" :formIndex="formIndex">
    </CarPayOype>

    <transition name="fade">
      <div v-if="isDelPopupShow" class="dialog" >
        <div class="content">
          <div>
              <span><i class="warning"></i></span>
              <span class="close " v-on:click="isDelPopupShow = false"><i class="cancel2"></i></span>
          </div>
          <div class="bd">
            <p>你有未支付的订单，是否删除</p>
          </div>
          <button class="delect">确定删除</button>
        </div>
      </div>
    </transition>

    <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutLeft">
      <div class="pay-confirm" v-if="isPaying">
        <div class="inner">
          <div class="head">
            <div class="close-btn" v-on:click="isPaying = false">
              <i class="sp sp-close"></i>
            </div>
            <span>违章处理</span>
          </div>

          <div class="money">￥{{ orderListForPay.order_total }}</div>

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
  </div>

</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

<template>
  <div class="app-my-car-break-order-page">
    <app-header title="订单列表"></app-header>
    <scroller>
      <div class="wrapper" v-show="isShowPage">
        <div class="order-nav">
          <ul class="nav-list">
            <li><span :class="[(checkedItem == 'nonpay' ? 'active': '')]" v-on:click="tabItem('nonpay')">未支付</span></li>
            <li><span :class="[(checkedItem == 'handling' ? 'active': '')]" v-on:click="tabItem('handling')">处理中</span></li>
            <li><span :class="[(checkedItem == 'success' ? 'active': '')]"  v-on:click="tabItem('success')">已成功</span></li>
            <!-- <li><span :class="[(checkedItem == 'destroy' ? 'active': '')]"  v-on:click="tabItem('destroy')">已撤销</span></li> -->
            <li><span :class="[(checkedItem == 'all' ? 'active': '')]" v-on:click="tabItem('all')">全部</span></li>
          </ul>
        </div>

        <div class="order-detail-list">
          <div class="detail-item" v-show="handleOrderItemShow(item)" v-for="item in userOrderList">
            <h3>
              <span class="carno">{{ item.car_number }}</span>
              <span class="status">{{ handleStatus(item) }}</span>
            </h3>
            <ul class="list">
              <li class="orderno">订单编号：{{ item.order_sn }}</li>
              <li>下单时间：<span>{{ item.create_at }}</span></li>
              <!-- <li>报价时间：<span>2017-05-22 14:36:10</span></li> -->
              <!-- <li>支付时间：<span>2017-05-23 11:06:010</span></li> -->
              <li class="orderAmount">订单金额：<span>￥{{ item.price }}</span></li>
            </ul>
            <div class="delete-btn" v-if="item.status == 0 ? true: false" v-on:click.stop="goOrderPayPage(item)">去支付</div>
          </div>
        </div>

        <div class="peccancy-empty-img" v-if="isShowEmptyImg">
          <img src="~assets/images/car-break-empty-img.png" alt="">
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
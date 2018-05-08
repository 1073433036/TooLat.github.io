<template>
  <div class="bill-page">
    <app-header title="账单"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="menu">
            <a class="on" href="javascript:">全部</a>
            <a href="javascript:">支出</a>
            <a href="javascript:">收入</a>
          </div>
          <div class="ledger">
            <div class="money">¥100.00</div>
            <div class="date">2017-11</div>
            <a class="btn left" href="javascript:">
              <i class="icon icon-direction1"></i>
            </a>
            <a class="btn right" href="javascript:">
              <i class="icon icon-direction2"></i>
            </a>
          </div>
          <div class="headline">
            <span class="name">交易明细</span>
          </div>
          <ul class="month-list">
            <li class="month-item" v-for="month in 5">
              <div class="title">11月</div>
              <ul class="day-list">
                <li class="day-item" v-for="day in 5">
                  <router-link :to="{ name: 'home.EmptyPayBillDetail' }">
                    <div class="logo">
                      <img src="~assets/images/icon/loan-company-logo.png" alt="">
                    </div>
                    <div class="content">
                      <div class="name">微信</div>
                      <div class="date">2017-11-16  18:21:45</div>
                    </div>
                    <div class="money">+10.00</div>
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
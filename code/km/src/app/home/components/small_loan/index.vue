<template>
  <div class="user-loan-page">
    <app-header title="小贷查询"></app-header>
    <div class="head">
      <span>共申请2家贷款</span>
    </div>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="my_scroller">
      <div class="wrapper">
        <div class="container">
          <ul class="list">
            <li v-for="(item, index) in 5" :key="index" v-on:click="handleQuery()" class="item">
              <div class="avatar">
                <img src="~assets/images/avatar.png">
              </div>
              <div class="info">
                <h2 class="name">宜人贷借款</h2>
                <p class="desc">最高10万，日息低至0.6%</p>
                <div class="tags">
                  <span>一小时放款</span>
                  <span>期限20天</span>
                </div>
              </div>
              <i class="sp sp-right"></i>
            </li>
          </ul>
        </div>
      </div>
    </scroller>

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div v-show="isMask" class="loan-mask">
        <div class="inner">
          <div class="content">
            <div class="body">
              <i class="sp sp-success"></i>
              <!-- <i class="sp sp-fail"></i> -->
              <div class="title">贷款成功！</div>
              <p>
                <span>2017-11-22 13:30:31</span>
                <em>审核成功</em>
              </p>

              <div class="bot">
                <div class="tips">可用额度 (元)</div>
                <div class="money">20000.00</div>
              </div>
            </div>
            <div class="close">
              <i class="sp sp-loan-close" v-on:click="isMask = false"></i>
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
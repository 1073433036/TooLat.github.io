<template>
  <div class="creditcard-highquota-page">
    <app-header title="大额信用卡办理"></app-header>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="my_scroller">
      <div class="ranking">
        <ul class="ranking-list">
          <li class="item" v-for="(item, index) in 5">
            <router-link :to="{ name: 'home.CreditCardDetail', params:{ bid: item.bank_id, id:index } }">
              <div class="box">
                <div class="image">
                  <img src="~assets/images/creditcard-bg.png" alt="">
                </div>
                <div class="content">
                  <div class="title">
                    <span class="name">广发新聪明卡</span>
                    <i class="icon icon-recommend"></i>
                  </div>
                  <div class="focus">
                    <span>IQ300</span>
                    <span>分期5倍积分</span>
                  </div>
                  <div class="text">积分折抵消费余额</div>
                  <div class="text">最高额度：<span>￥40000</span></div>
                </div>
                <div class="apply-btn">
                  <span>立即申请</span>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
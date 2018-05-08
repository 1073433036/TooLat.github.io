<template>
  <div class="calculate-result-page">
    <scroller>
      <div class="wrapper">
        <div class="top">
          <span class="top-tx">{{amount}}</span>
          <span class="top-span">税后工资（元）</span>
        </div>
        <ul class="list">
          <li class="item">
            <div class="left">
              <span>应缴个税（元）：</span>
            </div>
            <div class="right">
              <div class="input">
                <input type="text" v-model="formData.youTax" readonly class="width" placeholder="请填写">
              </div>
            </div>
          </li>
          <router-link :to="{ name: 'home.IncomeTax', params: {id: 'resultdetail'}}">
            <li class="item bordernone">
              <div class="left">
                <span>社保及公积金缴纳明细：</span>
              </div>
              <div class="right">
                <i class="sp sp-right"></i>
              </div>
            </li>
          </router-link>
        </ul>
        <div class="detail-list">
          <ul class="ul-list">
            <li>
              <span>个人缴纳（元）</span>
              <span class="color-a">{{formData.youPayment}}</span>
            </li>
            <li class="line-li">
              <span>个人缴纳（元）</span>
              <span class="color-a">{{formData.youPayment}}</span>
            </li>
            <li>
              <span>个人缴纳（元）</span>
              <span class="color-a">{{formData.youPayment}}</span>
            </li>
            <li class="line-li">
              <span>个人缴纳（元）</span>
              <span class="color-a">{{formData.youPayment}}</span>
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
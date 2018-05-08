<template>
  <div class="query-credit-page">
    <scroller>
      <div class="wrapper">
        <div class="container">
          <router-link :to="{ name: 'home.Home' }"  class="return"></router-link>
          <div class="bg">
            <img src="~assets/images/query-credit-bg.jpg" alt="">
          </div>
          <div class="box">
            <div class="query-btn">
              <a href="javascript:void(0)" class="btn" @click="linkToRoute({ name: 'home.QueryCreditForm' })">点击查询</a>
            </div>
            <div class="report-btn">
              <!-- <router-link class="btn" :to="{ name: 'home.QueryCreditReport' }">教你解读报告</router-link> -->
              <a href="javascript:void(0)" class="btn" @click="linkToRoute({ name: 'home.QueryCreditReport' })">教你解读报告</a>
              <!-- <router-link class="btn" :to="{ name: 'home.QueryCreditHistory' }">查看历史报告</router-link> -->
              <a href="javascript:void(0)" class="btn" @click="linkToRoute({ name: 'home.QueryCreditHistory' })">查看历史报告</a>
            </div>
            <div class="title-style">
              <span class="name">版本功能说明</span>
            </div>
              <ul class="list">
                <li class="item" v-for="(item, index) in funcList" :key="index">
                  <a href="javascript:void(0)" @click="linkToRoute({ name: 'insurance.AutoQuery' })">
                    <div class="icon">
                      <span class="sp" :class="'sp-query-credit-icon' + item.icon"></span>
                    </div>
                    <div class="name">{{ item.name }}</div>
                  </a>
                </li>
              </ul>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

<template>
  <div class="query-credit-history-page">
    <app-header title="历史报告"></app-header>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="scroller">
      <div class="wrapper">
        <div class="container">
          <!-- 列表为空 -->
          <div class="empty-box" v-if="queryList.length == 0">
            <div class="text">~~ 没有查询记录哦 ~~</div>
            <div class="image">
              <img src="~assets/images/query-credit-history-icon01.png" alt="">
            </div>
            <div class="query-btn">
              <router-link :to="{ name: 'home.QueryCreditForm' }">立即查询</router-link>
            </div>
          </div>
          <!-- 列表有内容 -->
          <ul class="list" v-else>
            <li class="item" v-for="(item, index) in queryList">
              <i class="icon-dot"></i>
              <div class="content" @click="queryDetail(item)">
                <div class="title">扫描人：{{ item.name }}</div>
                <div class="text">身份证：{{ item.id_number | handleIdentity }}</div>
                <div class="text">{{ item.add_time | handleDate }}</div>
              </div>
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
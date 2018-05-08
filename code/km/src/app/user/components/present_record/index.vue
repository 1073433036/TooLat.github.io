<template>
  <div class="user-present-record-page">
    <app-header title="提现记录"></app-header>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite">
      <div class="wrapper">
        <div class="container">
          <ul class="list">
            <li v-for="(item, index) in formTemp.data" :key="index" class="item">
              <div class="left">
                <div class="day">{{ item.add_time * 1000 | fmtDate }}</div>
              </div>
              <div class="center">
                <span class="tit">卡盟金服</span>
                <span>提现</span>
              </div>
              <div class="right">
                <span>-{{ item.money }}</span>
                <em :class="{ err: '审核中' === item.lang_status}">{{ item.lang_status }}</em>
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
<template>
  <div class="message-insurance-page">
    <app-header title="保险收益明细"></app-header>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="my_scroller">
      <div class="wrapper">
        <div class="controller">
          <ul class="list">
            <li class="item" v-for="(item, index) in formTemp.list" :key="index">
<!--               <div class="time">
                <span>{{ item.time }}</span>
              </div> -->
              <div class="inner">
                <div class="head">
                  <span>积分明细</span>
                  <i class="sp sp-notice"></i>
                </div>
                <div class="day">{{ item.add_time }}</div>
                <div class="content">
                  <p>{{ item.desc }}</p>
                </div>
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
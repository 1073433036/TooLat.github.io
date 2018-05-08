<template>
  <div class="message-system-page">
    <app-header title="系统消息"></app-header>
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
                  <span>{{ item.title }}</span>
                  <i class="sp sp-notice"></i>
                </div>
                <div class="day">{{ item.day }}</div>
                <div class="content">
                  <p>{{ item.msg_content }}</p>
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
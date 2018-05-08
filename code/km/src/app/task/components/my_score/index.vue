<template>
  <div class="task-my_score-page">
    <app-header title="我的评价"></app-header>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="my_scroller">
      <div class="wrapper">
        <div class="controller">
          <ul class="list">
            <li v-for="(item, index) in formTemp.list" class="item">
              <div class="time">{{ item.add_time * 1000 | fmtDateTime }}</div>
              <div class="content">
                <div class="head">
                  <div class="head-left">
                    <div class="day">{{ item.add_time * 1000 | fmtDateDay }}</div>
                    <div class="time-end">截止评价至今已过 {{ item.add_time | checkTime }}</div>
                  </div>
                  <div v-if="true === item.can_cancel" class="head-right" v-on:click="handleCancel(item)">
                    <span>撤销此评价</span>
                  </div>
                </div>
                <div class="body">
                  <p>您对专属客户经理<span>{{ item.user_info.user_nickname }}</span>进行了评价，评价内容：<em>{{ item.content }}</em></p>
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
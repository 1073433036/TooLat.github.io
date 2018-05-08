<template>
  <div class="message-reward-detail-page">
    <app-header title="佣金提醒明细"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="content">
            <div class="head">
              <div class="title">佣金金额</div>
              <div class="money">
                <em>￥</em>
                <span>{{ formTemp.data.price }}</span>
              </div>
            </div>
            <div class="body">
              <div v-if="formTemp.data.list" v-for="(item, index) in formTemp.data.list" class="item">
                <em>佣金分配说明</em>
                <div class="user-info">
                  <span class="name">{{ item.user_name }}</span>
                  <span class="level">
                  ({{ item.level_name || '实习'}}
                    <i v-if="item.level" class="sp" :class="'sp-level-0' + item.level"></i>
                    <i v-else class="sp sp-level-01"></i>
                  )
                  </span>
                </div>
                <span class="commission">佣金￥<em :class="{ on: 1 >= item.level }">{{ item.money }}</em></span>
              </div>
              <div class="item">
                <em>当前状态</em>
                <span>{{ formTemp.data.status | status }}</span>
              </div>
              <div class="item">
                <em>交易时间</em>
                <span>{{ formTemp.data.date }}</span>
              </div>
              <div v-if="formTemp.data.from" class="item">
                <em>支付客户</em>
                <span>{{ formTemp.data.from }}</span>
              </div>
              <div class="item">
                <em>详情</em>
                <span>{{ formTemp.data.desc }}</span>
              </div>
            </div>
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
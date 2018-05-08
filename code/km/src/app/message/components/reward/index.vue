<template>
  <div class="message-reward-page">
    <app-header title="佣金提醒"></app-header>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="my_scroller">
      <div class="wrapper">
        <div class="controller">
          <ul class="list">
            <!-- <li class="item" v-for="(item, index) in formTemp.list" :key="index">
              <div class="time">
                <span>{{ item.time }}</span>
              </div>
              <div class="inner">
                <div class="head">{{ item.title }}</div>
                <div class="day">{{ item.day }}</div>
                <div class="content">
                  <p>{{ item.msg_content }}</p>
                </div>
                <router-link :to="{ name: 'message.RewardDetail', params: { id: item.extend.account_id } }" class="detail">详情</router-link>
              </div>
            </li> -->
            <li class="item" v-for="(item, index) in formTemp.list" :key="index">
              <div class="inner">
                <div class="head">{{ item.title }}</div>
                <div class="day">
									<span>{{ item.day }}</span>
									<span class="time">{{ item.time }}</span>
								</div>
                <div class="content">
                  <p>{{ item.msg_content }}</p>
                </div>
                <router-link :to="{ name: 'message.RewardDetail', params: { id: item.extend.account_id } }" class="detail">
									<i class="sp sp-car-search"></i>
									查看详情
								</router-link>
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
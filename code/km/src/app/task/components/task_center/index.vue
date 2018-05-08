<template>
  <div class="task-center-page">
    <app-header title="抢单中心"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="top">
            <div class="require">
              <div class="avatar">
                <img v-if="userInfo.avatar_full" :src="userInfo.avatar_full">
                <img v-else src="~assets/images/default-avatar.png">
              </div>
            </div>
            <div class="require on">
              <div class="nick">{{ userInfo.user_nickname }}</div>
              <i v-if="1 < userInfo.level" class="sp" :class="'sp-level-0' + userInfo.level"></i>
              <span v-else class="practice sp-level">
                <i class="sp sp-level-01"></i>
                <em>(实习)</em>
              </span>
            </div>
            <div class="require">
              <div class="label">{{ userInfo.city_name }}</div>
              <!-- <div class="label">lv{{ userInfo.level }}</div> -->
            </div>
          </div>
          <ul class="list">
            <li class="item" v-if="userInfo.is_lender_manager != 0">
              <router-link :to="{ name: 'task.TaskOrder' }">
                <i class="icon icon-cheats"></i>
                <span class="name">我的订单</span>
                <i class="sp sp-right"></i>
              </router-link>
            </li>
            <li class="item" v-if="userInfo.is_lender_manager != 0">
              <router-link :to="{ name: 'task.TaskSet' }">
                <i class="icon icon-set"></i>
                <span class="name">设置推送</span>
                <i class="sp sp-right"></i>
              </router-link>
            </li>
            <li class="item" v-if="userInfo.is_lender_manager == 0">
              <router-link :to="{ name: 'task.TaskAdd' }">
                <i class="icon icon-fly"></i>
                <span class="name">我要发布</span>
                <i class="sp sp-right"></i>
              </router-link>
            </li>
            <li class="item" v-if="userInfo.is_lender_manager == 0">
              <router-link :to="{ name: 'task.TaskService' }">
                <i class="icon icon-user"></i>
                <span class="name">专属服务经理</span>
                <i class="sp sp-right"></i>
              </router-link>
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

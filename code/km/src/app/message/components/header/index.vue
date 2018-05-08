<template>
  <div class="message-head-page">
    <div class="header">
      <!-- <router-link :to="{ name: 'message.Notify' }" class="item">通知</router-link> -->
      <router-link :to="{ name: 'message.Info' }" class="item">
        <span>朋友圈</span>
        <i v-show="0 < msgNum.data">{{ msgNum.data }}</i>
      </router-link>
      <router-link :to="{ name: 'message.Friend' }" class="item">好友</router-link>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
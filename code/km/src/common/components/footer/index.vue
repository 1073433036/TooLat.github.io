<template>
  <div class="footer-page">
    <div class="controller">
      <ul class="list">
        <li class="item" v-on:click="goToHome()" :class="{ active: -1 !== currentRoute.indexOf('home.') }">
          <i class="foot-menu foot-menu-home"></i>
          <i class="foot-menu foot-menu-home-act act"></i>
          <em class="foot-menu-em">首页</em>
          <div class="tips" v-show="message.index">
            <span>{{ message.index }}</span>
          </div>
        </li>
        <li class="item" @click="goToChat" :class="{ active: -1 !== currentRoute.indexOf('message.') && 'message.Notify' != currentRoute }">
          <i class="foot-menu foot-menu-rob"></i>
          <i class="foot-menu foot-menu-rob-act act"></i>
          <em class="foot-menu-em">微聊</em>
        </li>
        <router-link :to="{ name: 'insurance.Home' }" tag="li" class="item car-insurance-mid">
          <i class="foot-car-insurance"></i>
        </router-link>
        <li class="item" v-on:click="goToMsg()" :class="{ active: -1 !== currentRoute.indexOf('message.Notify') }">
          <i class="foot-menu foot-menu-msg"></i>
          <i class="foot-menu foot-menu-msg-act act"></i>
          <em class="foot-menu-em">客服</em>
          <div class="tips" v-show="formTemp.message">
            <span>{{ formTemp.message }}</span>
          </div>
        </li>
        <router-link :to="{ name: 'user.Home' }" class="item" tag="li" :class="{ active: -1 !== currentRoute.indexOf('user.') }">
          <i class="foot-menu foot-menu-me"></i>
          <i class="foot-menu foot-menu-me-act act"></i>
          <em class="foot-menu-em">我的</em>
          <div class="tips" v-show="formTemp.user">
            <span>{{ formTemp.user }}</span>
          </div>
        </router-link>
      </ul>
    </div>

    <Socket ref="socket"></Socket>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

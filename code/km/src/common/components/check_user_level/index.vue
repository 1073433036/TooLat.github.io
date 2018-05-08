<template>
  <div class="check-user-level-page">
    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div class="member-box" v-show="isShow">
        <div class="member">
          <span class="abolish" v-on:click="isShow = false">取消</span>
          <span class="commissioner" v-on:click="handleGoToVip()">立即前往</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
<template>
  <transition enter-active-class="animated zoomInUp" leave-active-class="animated zoomOutRight">
    <div v-show="isNotice" class="notify-popup">
      <div class="inner">
        <div class="content">
          <div class="head">
            <div class="head-inner">
              <span>系统通知</span>
              <i class="sp sp-notify-title"></i>
            </div>
            <i class="sp sp-close" v-on:click="handleNoticeClose()"></i>
          </div>
          <div class="body">
            <div class="body-inner">
              <div class="time">
                <i class="sp sp-notice"></i>
                <span>{{ noticeTime | fmtNewsDate }}</span>
              </div>
              <div class="text">
                <p v-for="(el, index) in content" :key="index">
                {{ el }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

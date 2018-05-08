<template>
  <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
    <div class="set-time-page" :class="{ 'on': show }">
      <div class="set-time-layer">
        <div class="set-time-inner">
          <div class="set-time-title">设置时间</div>
          <div class="set-time-box">
            <div class="set-time-item">
              <div class="set-time-swiper-container" ref="mySwiperHours">
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="(item, index) in 24">{{ index < 10 ? '0' + index : index }}</div>
                </div>
              </div>
            </div>
            <div class="set-time-item">
              <div class="set-time-swiper-container" ref="mySwiperMinutes">
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="(item, index) in 60">{{ index < 10 ? '0' + index : index }}</div>
                </div>
              </div>
            </div>
            <div class="set-time-item">
              <div class="set-time-swiper-container" ref="mySwiperSeconds">
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="(item, index) in 60">{{ index < 10 ? '0' + index : index }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="set-time-btn">
            <a href="javascript:" @click="dismiss">取消</a>
            <a href="javascript:" @click="submit">确定</a>
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
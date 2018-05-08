<template>
  <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
    <div class="credit-card-tips-page" v-if="isShow">
      <div class="swiper-container" ref="mySwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in list">
            <div class="content">{{ item }}</div>
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
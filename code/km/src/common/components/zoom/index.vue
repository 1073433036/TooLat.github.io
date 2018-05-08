<template>
  <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
  	<div class="swiper-zoom" v-show="isShow" ref="zoomSwiper" @click="onclose">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
        	<!-- swiper-zoom-container -->
          <div class="image">
            <img :src="image" alt="">
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
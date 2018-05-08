<template>
  <div class="wechat-card-page">
    <div class="wrapper">
      <div class="container">
        <div class="swiper-container" ref="mySwiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/swiper/wechat-card-bg03.jpg" alt="">
                <router-link :to="{ name: 'home.NoopsycheCultivateCard' }" class="jump"></router-link>
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="image-auto">
                <img src="~assets/images/swiper/wechat-card-bg04.jpg" alt="">
              </div>
            </div>
          </div>
          <div class="scrollbar"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
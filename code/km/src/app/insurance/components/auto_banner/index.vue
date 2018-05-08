<template>
  <div class="auto-banner-page">
    <div class="wrapper">
      <div class="container">
        <div class="swiper-container" ref="mySwiper">
          <div class="swiper-wrapper">

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/insurance-scroll1.jpg" alt="">
                <router-link :to="{ name: 'insurance.Home' }" class="jump"></router-link>
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/insurance-scroll2.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/insurance-scroll3.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/insurance-scroll4.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/insurance-scroll5.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/insurance-scroll6.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/insurance-scroll7.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/insurance-scroll8.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/insurance-scroll9.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/insurance-scroll10.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/insurance-scroll11.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/insurance-scroll12.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/insurance-scroll001.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/insurance-scroll13.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/insurance-scroll14.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
              <div class="join-tips">
                <span>目前已有</span>
                <span class="slide-num">{{changeNum}}</span>
                <span>人加入卡盟金服</span>
                <p>车险分销合伙人</p>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/insurance-scroll15.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/insurance-scroll16.jpg" alt="">
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
<template>
  <div class="auto-h5-page">
    <!-- <router-link class="back-btn" :to="{ name: 'home.Home' }" tag="div"></router-link> -->
    <!-- <div class="back-btn" @click="$router.go(-2)"></div> -->
    <div class="wrapper">
      <div class="container">
        <div class="swiper-container" ref="mySwiper">
          <div class="swiper-wrapper">

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/auto-h5-01.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/auto-h5-02.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/auto-h5-03.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/auto-h5-04.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/auto-h5-05.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/auto-h5-06.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/auto-h5-07.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/auto-h5-08.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/auto-h5-09.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/auto-h5-10.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/auto-h5-11.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/auto-h5-12.jpg" alt="">
              </div>
              <div class="btn">
                <button type="button" v-on:click="handleRead()">
                  <Radio v-model="formData.read" :dataList="formTemp.read"></Radio>
                </button>
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

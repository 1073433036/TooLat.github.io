<template>
  <div class="app-download-page">
    <div class="wrapper">
      <div class="container">
        <div class="swiper-container" ref="mySwiper">
          <div class="swiper-wrapper">

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/app-download/01.jpg" alt="">
              </div>
              <!-- <div class="upward">
                <span class="sp sp-upward"></span>
              </div> -->
              <a href="https://itunes.apple.com/us/app/%E5%8D%A1%E7%9B%9F%E9%87%91%E6%9C%8D-lite/id1335439711?mt=8&uo=4" class="ios-download"></a>
              <!-- <a href="http://www.pc6.com/az/564962.html" class="android-download"></a> -->
              <a href="javascript:void(0)" @click="downloadAndriod" class="android-download"></a>
              <!-- <router-link :to="{name: 'home.AppAndriodDownload'}" class="android-download"></router-link> -->
            </div>

            <!-- <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/app-download/02-1.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/app-download/03.png" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/app-download/04.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/app-download/05.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/app-download/06.png" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/app-download/07.png" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/app-download/08.png" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/app-download/09.png" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/app-download/10.png" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/app-download/12.jpg" alt="">
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>

    <div class="layer" v-show="isDownloadTip">
      <div class="mask" @click="isDownloadTip = false"></div>
      <div class="share-image" @click="isDownloadTip = false">
        <img src="~assets/images/layer-arrow.png">
        <div class="tip">
          <p>点击右上角，通过浏览器打开此页面</p>
          <p>点击下载按钮开始下载</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

<template>
  <div class="auto-h5-page">
  <app-header></app-header>
    <!-- <router-link class="back-btn" :to="{ name: 'home.Home' }" tag="div"></router-link> -->
    <!-- <div class="back-btn" @click="$router.go(-1)"></div> -->
    <div class="wrapper">
      <div class="container">
        <div class="swiper-container" ref="mySwiper">
          <div class="swiper-wrapper">

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_01.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_02.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_03.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_04.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_05.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_06.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_07.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_08.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_09.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_10.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_11.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_12.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_13.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_14.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_15.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_16.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_17.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_18.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_19.jpg" alt="">
              </div>
                <div class="upward">
                  <span class="sp sp-upward"></span>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_20.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_21.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/auto/query_credit_22.jpg" alt="">
                <router-link :to="{ name: 'home.QueryCredit' }" class="fakeBox"></router-link>
                <router-link :to="{ name: 'home.CreditCard' }" class="fakeBox_1"></router-link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import './index.scss';
  import 'swiper/dist/css/swiper.css';
  import Swiper       from 'swiper';
  import Header             from '~common/components/header';

  export default {
    name: 'index',
    data () {
      return {

      };
    },
    components: {
      'app-header': Header,
    },
    computed: {

    },
    mounted () {
      this.$nextTick(() => {
        let swiper = new Swiper(this.$refs.mySwiper, {
          direction: 'vertical',
          autoHeight: true
        });
      });
    },
    watch: {},
    methods: {

    }
  };
</script>

<style lang="scss" scoped>
  @import "~assets/styles/_bootstrap";
  .header-page {
    background:none;
  }
  .auto-h5-page {
    width: 100%;
    height: 100%;

  .back-btn {
    position: absolute;
    top: 0;
    left: 0;
    width: rem(90px);
    height: rem(90px);
    z-index: 2;

  &::after {
     content: '';
     display: block;
     width: rem(28px);
     height: rem(28px);
     position: absolute;
     top: 50%;
     left: 50%;
     margin-top: rem(-14px);
     margin-left: rem(-14px);
     border-bottom: 1px solid #666;
     border-left: 1px solid #666;
     transform: rotate(45deg);
     transform-origin: 50% 50%;
   }
  }

  .wrapper {
    width: 100%;
    height: 100%;

  .container {
    width: 100%;
    height: 100%;

  .swiper-container {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    position: relative;
    height: 100%;
    overflow: auto;

  .image {
    position: relative;
    width: 100%;
    height: 100%;
    .fakeBox{
      position: absolute;
      top: rem(190px);
      left: rem(130px);
      display: inline-block;
      width: rem(200px);
      height: rem(300px);
      text-indent: -99999em;
    }
    .fakeBox_1{
      position: absolute;
      top: rem(190px);
      right: rem(130px);
      display: inline-block;
      width: rem(200px);
      height: rem(300px);
      text-indent: -99999em;
    }

  .swiper-img {
    display: block;
    width: 100%;
    height: 100%;
  }
  }

  .btn {
    position: absolute;
    bottom: rem(40px);
    left: 0;
    right: 0;

  .radio-wrappe {
  .radio .sta {
    color: #fff;
  }
  }

  > button {
    display: block;
    margin: 0 auto;
    width: rem(710px);
    height: rem(100px);
    line-height: rem(100px);
    font-size: rem(32px);
    color: #fff;
    text-align: center;
    border: none;
    border-radius: rem(10px);
    background: #ffba00;
    cursor: pointer;
    box-shadow: 0 rem(10px) rem(10px) rgba(0, 0, 0, .5);

  }
  }

  .upward {
    position: absolute;
    left: 0;
    bottom: rem(60px);
    width: 100%;
    text-align: center;

  span {
    animation: start 1.5s infinite ease-in-out;
  }
  }
  }
  }
  }
  }
  @keyframes start {
    0%, 30% {
      opacity: 0;
      transform: translateY(0px);
    }
    60% {
      opacity: 1;
      transform: translate(-20);
    }
    100% {
      opacity: 0;
      transform: translateY(-36px);
    }
  }

</style>

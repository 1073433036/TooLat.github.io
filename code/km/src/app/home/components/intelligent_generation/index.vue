<template>
  <div class="intelligent-generation">

    <scroller>

      <div class="wrapper">
        <div class="slot left" slot="right" v-on:click="handleCityShowChange()">
          <a href="javascript:void(0)" class="">{{address}}
            <i class="icon-enter"></i>
          </a>
        </div>
        <div class="slot right" slot="right">
          <span class="">
            <a href="javascript:void(0)" >
              盗刷险
              <i class="icon-enter"></i>
            </a>
          </span>
        </div>
        <div class="controller">
          <div class="photo" ref="mySwiper">
            <div class="swiper-wrapper">
              <!-- <div class="swiper-slide">
                <div class="photo-item">
                  <img src="~assets/images/intelligent_generation/banner.jpg">
                </div>
              </div>
              <div class="swiper-slide">
                <div class="photo-item">
                  <img src="~assets/images/intelligent_generation/banner1.jpg">
                </div>
              </div>
              <div class="swiper-slide">
                <div class="photo-item">
                  <img src="~assets/images/intelligent_generation/banner2.jpg">
                </div>
              </div> -->
              <div class="swiper-slide">
                <div class="photo-item">
                  <img src="~assets/images/intelligent_generation/banner3.jpg">
                </div>
              </div>
              <div class="swiper-slide">
                <div class="photo-item">
                  <img src="~assets/images/intelligent_generation/banner4.jpg">
                </div>
              </div>
            </div>
            <div class="swiper-pagination"></div>
          </div>
					<div class="tips">
						<i class="icon icon-horn"></i>
						<div class="notice">
							<div class="marquee">卡盟金服信贷流量服务平台：全国落地商户代还通道，银联可查询商户，支持所有银联信用卡，不限制卡额度，费率只需0.65%+2元/笔，完善优化您的账单，减轻您的资金压力，让您快速提升额度。</div>
						</div>
          </div>
          <div class="main">
            <ul class="list">
              <li class="item"  @click="linkToIncreaseList('intensive')">
                  <div class="content-group">
                    <img src="~assets/images/intelligent_generation/generation_04.jpg" class="intensive">
                    <div class="content-txt">
                      <p class="tit">精养代还系统</p>
                      <p class="instruction">添加信用卡，设置计划代还信用卡</p>
                    </div>
                    <div class="content-r">
                      <a class="btn open">点击查询</a>
                    </div>
                  </div>
              </li>
              <li class="item">
                <div class="content-group">
                  <img src="~assets/images/intelligent_generation/generation_08.jpg" class="toast1">
                  <div class="content-txt">
                    <p class="tit">还款提醒</p>
                    <p class="instruction">暂未开放</p>
                  </div>
                </div>
              </li>
            </ul>

            <section class="back-table" @touchstart="isLayerShow = true" @touchend="isLayerShow = false">
              <i></i>分润表<em></em>
            </section>
          </div>
        </div>
      </div>

      <section class="footer-wrapper">
        <div class="footer">
          <div class="img-wrapper">
            <img src="~assets/images/china-unionpay.png" alt="银联">
          </div>
          <div class="fonter-desc">
            <p>全国落地真实商户</p>
            <p>支持全国所有银联信用卡</p>
          </div>
        </div>
      </section>

    </scroller>

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <section class="back-layer" v-if="isLayerShow">
        <img src="~assets/images/intelligent_generation/gen-back.png">
      </section>
    </transition>
    <CityList></CityList>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>

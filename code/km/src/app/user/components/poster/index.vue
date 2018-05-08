<template>
  <div class="user-poster-page">
    <app-header title="我的专属海报"></app-header>

    <div class="wrapper">
      <div class="container">
        <div class="body">
          <div class="box" ref="mySwiper">
						<ul class="list swiper-wrapper">

              <li class="item itme-12 swiper-slide">
                <img v-if="canvasDom[11].isCanvas" :src="canvasDom[11].canvasImage">
                <div v-else class="inner">
                  <img src="~assets/images/poster/poster-bg12.jpg">
                  <div class="userinfo">
                    <div class="avatar">
                      <img v-if="formTemp.avatar_64" :src="formTemp.avatar_64">
                      <img v-else src="~assets/images/avatar.png">
                    </div>
                    <div class="text">
                      <div class="name">{{ formTemp.name }}</div>
                      <div class="job" v-show="userInfo.level != 1">{{ formTemp.job }}</div>
                      <div class="job_no">{{ userInfo.invite_code }}</div>
                    </div>
                    <div class="qrcode">
                      <img :src="formTemp.qrcode_64">
                      <p>推荐办卡<br>还有佣金收</p>
                    </div>
                  </div>
                </div>
              </li>

              <li class="item itme-13 swiper-slide">
                <img v-if="canvasDom[12].isCanvas" :src="canvasDom[12].canvasImage">
                <div v-else class="inner">
                  <img src="~assets/images/poster/poster-bg13.jpg">
                  <div class="userinfo">
                    <div class="qrcode">
                      <img :src="formTemp.qrcode_64">
                    </div>
                  </div>
                </div>
              </li>

              <li class="item itme-05 swiper-slide">
                <img v-if="canvasDom[4].isCanvas" :src="canvasDom[4].canvasImage">
                <div v-else class="inner">
                  <img src="~assets/images/poster/poster-bg05.jpg">
                  <div class="userinfo">
                    <div class="avatar">
                      <img v-if="formTemp.avatar_64" :src="formTemp.avatar_64">
                      <img v-else src="~assets/images/avatar.png">
                    </div>
                    <div class="text">
                      <div class="name">{{ formTemp.name }}</div>
                      <div class="job" v-show="userInfo.level != 1">{{ formTemp.job }}</div>
                      <div class="job_no">{{ userInfo.invite_code }}</div>
                    </div>
                    <div class="qrcode">
                      <img :src="formTemp.qrcode_64">
                      <p>识别二维码<br>马上做代理</p>
                    </div>
                  </div>
                </div>
              </li>

              <li class="item itme-06 swiper-slide">
                <img v-if="canvasDom[5].isCanvas" :src="canvasDom[5].canvasImage">
                <div v-else class="inner">
                  <img src="~assets/images/poster/poster-bg06.jpg">
                  <div class="userinfo">
                    <div class="avatar">
                      <img v-if="formTemp.avatar_64" :src="formTemp.avatar_64">
                      <img v-else src="~assets/images/avatar.png">
                    </div>
                    <div class="text">
                      <div class="name">{{ formTemp.name }}</div>
                      <div class="job" v-show="userInfo.level != 1">{{ formTemp.job }}</div>
                      <div class="job_no">{{ userInfo.invite_code }}</div>
                    </div>
                    <div class="qrcode">
                      <img :src="formTemp.qrcode_64">
                      <p>识别二维码做车险代理</p>
                    </div>
                  </div>
                </div>
              </li>

              <!-- <li class="item itme-01 swiper-slide">
                <img v-if="canvasDom[0].isCanvas" :src="canvasDom[0].canvasImage">
                <div v-else class="inner">
                  <img src="~assets/images/poster/poster-bg01.jpg">
                  <div class="userinfo">
                    <div class="avatar">
                      <img v-if="formTemp.avatar_64" :src="formTemp.avatar_64">
                      <img v-else src="~assets/images/avatar.png">
                    </div>
                    <div class="text">
                      <div class="name">{{ formTemp.name }}</div>
                      <div class="job" v-show="userInfo.level != 1">{{ formTemp.job }}</div>
                      <div class="job_no">{{ userInfo.invite_code }}</div>
                    </div>
                    <div class="qrcode">
                      <img :src="formTemp.qrcode_64">
                      <p>解放全国卡奴找你当代理</p>
                    </div>
                  </div>
                </div>
              </li> -->

              <!-- <li class="item itme-02 swiper-slide">
                <img v-if="canvasDom[1].isCanvas" :src="canvasDom[1].canvasImage">
                <div v-else class="inner">
                  <img src="~assets/images/poster/poster-bg02.jpg">
                  <div class="userinfo">
                    <div class="avatar">
                      <img v-if="formTemp.avatar_64" :src="formTemp.avatar_64">
                      <img v-else src="~assets/images/avatar.png">
                    </div>
                    <div class="text">
                      <div class="name">{{ formTemp.name }}</div>
                      <div class="job" v-show="userInfo.level != 1">{{ formTemp.job }}</div>
                      <div class="job_no">{{ userInfo.invite_code }}</div>
                    </div>
                    <div class="qrcode">
                      <img :src="formTemp.qrcode_64">
                      <p>解放全国卡奴找你当代理</p>
                    </div>
                  </div>
                </div>
              </li> -->

              <!-- <li class="item itme-03 swiper-slide">
                <img v-if="canvasDom[2].isCanvas" :src="canvasDom[2].canvasImage">
                <div v-else class="inner">
                  <img src="~assets/images/poster/poster-bg03.jpg">
                  <div class="userinfo">
                    <div class="avatar">
                      <img v-if="formTemp.avatar_64" :src="formTemp.avatar_64">
                      <img v-else src="~assets/images/avatar.png">
                    </div>
                    <div class="text">
                      <div class="name">{{ formTemp.name }}</div>
                      <div class="job" v-show="userInfo.level != 1">{{ formTemp.job }}</div>
                      <div class="job_no">{{ userInfo.invite_code }}</div>
                    </div>
                    <div class="qrcode">
                      <img :src="formTemp.qrcode_64">
                    </div>
                  </div>
                </div>
              </li> -->

              <li class="item itme-07 swiper-slide">
                <img v-if="canvasDom[6].isCanvas" :src="canvasDom[6].canvasImage">
                <div v-else class="inner">
                  <img src="~assets/images/poster/poster-bg07.jpg">
                  <div class="userinfo">
                    <div class="avatar">
                      <img v-if="formTemp.avatar_64" :src="formTemp.avatar_64">
                      <img v-else src="~assets/images/avatar.png">
                    </div>
                    <div class="text">
                      <div class="name">{{ formTemp.name }}</div>
                      <div class="job" v-show="userInfo.level != 1">{{ formTemp.job }}</div>
                      <div class="job_no">{{ userInfo.invite_code }}</div>
                    </div>
                    <div class="qrcode">
                      <img :src="formTemp.qrcode_64">
                      <!--<p>识别二维码马上做代理</p>-->
                    </div>
                  </div>
                </div>
              </li>

              <li class="item itme-08 swiper-slide">
                <img v-if="canvasDom[7].isCanvas" :src="canvasDom[7].canvasImage">
                <div v-else class="inner">
                  <img src="~assets/images/poster/poster-bg08.jpg">
                  <div class="userinfo">
                    <div class="avatar">
                      <img v-if="formTemp.avatar_64" :src="formTemp.avatar_64">
                      <img v-else src="~assets/images/avatar.png">
                    </div>
                    <div class="text">
                      <div class="name">{{ formTemp.name }}</div>
                      <div class="job" v-show="userInfo.level != 1">{{ formTemp.job }}</div>
                      <div class="job_no">{{ userInfo.invite_code }}</div>
                    </div>
                    <div class="qrcode">
                      <img :src="formTemp.qrcode_64">
                      <!--<p>识别二维码马上做代理</p>-->
                    </div>
                  </div>
                </div>
              </li>
              <li class="item itme-09 swiper-slide">
                <img v-if="canvasDom[8].isCanvas" :src="canvasDom[8].canvasImage">
                <div v-else class="inner">
                  <img src="~assets/images/poster/poster-bg09.jpg">
                  <div class="userinfo">
                    <div class="avatar">
                      <img v-if="formTemp.avatar_64" :src="formTemp.avatar_64">
                      <img v-else src="~assets/images/avatar.png">
                    </div>
                    <div class="text">
                      <div class="name">{{ formTemp.name }}</div>
                      <div class="job" v-show="userInfo.level != 1">{{ formTemp.job }}</div>
                      <div class="job_no">{{ userInfo.invite_code }}</div>
                    </div>
                    <div class="qrcode">
                      <img :src="formTemp.qrcode_64">
                      <p>识别二维码马上做代理</p>
                    </div>
                  </div>
                </div>
              </li>

              <li class="item itme-14 swiper-slide">
                <img v-if="canvasDom[13].isCanvas" :src="canvasDom[13].canvasImage">
                <div v-else class="inner">
                  <img src="~assets/images/poster/poster-bg14.jpg">
                  <div class="userinfo">
                    <div class="avatar">
                      <img v-if="formTemp.avatar_64" :src="formTemp.avatar_64">
                      <img v-else src="~assets/images/avatar.png">
                    </div>
                    <div class="text">
                      <div class="name">{{ formTemp.name }}</div>
                      <div class="job" v-show="userInfo.level != 1">{{ formTemp.job }}</div>
                      <div class="job_no">{{ userInfo.invite_code }}</div>
                    </div>
                    <div class="qrcode">
                      <img :src="formTemp.qrcode_64">
                    </div>
                  </div>
                </div>
              </li>
              <li class="item itme-15 swiper-slide">
                <img v-if="canvasDom[14].isCanvas" :src="canvasDom[14].canvasImage">
                <div v-else class="inner">
                  <img src="~assets/images/poster/poster-bg15.jpg">
                  <div class="userinfo">
                    <div class="avatar">
                      <img v-if="formTemp.avatar_64" :src="formTemp.avatar_64">
                      <img v-else src="~assets/images/avatar.png">
                    </div>
                    <div class="text">
                      <div class="name">{{ formTemp.name }}</div>
                      <div class="job" v-show="userInfo.level != 1">{{ formTemp.job }}</div>
                      <div class="job_no">{{ userInfo.invite_code }}</div>
                    </div>
                    <div class="qrcode">
                      <img :src="formTemp.qrcode_64">
                      <p>长按二维码<br>立刻享受高佣</p>
                    </div>
                  </div>
                </div>
              </li>

              <li class="item itme-04 swiper-slide">
                <img v-if="canvasDom[3].isCanvas" :src="canvasDom[3].canvasImage">
                <div v-else class="inner">
                  <img src="~assets/images/poster/poster-bg04.jpg">
                  <div class="userinfo">
                    <div class="avatar">
                      <img v-if="formTemp.avatar_64" :src="formTemp.avatar_64">
                      <img v-else src="~assets/images/avatar.png">
                    </div>
                    <div class="text">
                      <div class="name">{{ formTemp.name }}</div>
                      <div class="job" v-show="userInfo.level != 1">{{ formTemp.job }}</div>
                      <div class="job_no">{{ userInfo.invite_code }}</div>
                    </div>
                    <div class="qrcode">
                      <img :src="formTemp.qrcode_64">
                    </div>
                  </div>
                </div>
              </li>
              <li class="item itme-10 swiper-slide">
                <img v-if="canvasDom[9].isCanvas" :src="canvasDom[9].canvasImage">
                <div v-else class="inner">
                  <img src="~assets/images/poster/poster-bg10.jpg">
                  <div class="userinfo">
                    <div class="avatar">
                      <img v-if="formTemp.avatar_64" :src="formTemp.avatar_64">
                      <img v-else src="~assets/images/avatar.png">
                    </div>
                    <div class="text">
                      <div class="name">{{ formTemp.name }}</div>
                      <div class="job" v-show="userInfo.level != 1">{{ formTemp.job }}</div>
                      <div class="job_no">{{ userInfo.invite_code }}</div>
                    </div>
                    <div class="qrcode">
                      <img :src="formTemp.qrcode_64">
                      <!--<p>识别二维码马上做代理</p>-->
                    </div>
                  </div>
                </div>
              </li>

              <li class="item itme-11 swiper-slide">
                <img v-if="canvasDom[10].isCanvas" :src="canvasDom[10].canvasImage">
                <div v-else class="inner">
                  <img src="~assets/images/poster/poster-bg11.jpg">
                  <div class="userinfo">
                    <div class="avatar">
                      <img v-if="formTemp.avatar_64" :src="formTemp.avatar_64">
                      <img v-else src="~assets/images/avatar.png">
                    </div>
                    <div class="text">
                      <div class="name">{{ formTemp.name }}</div>
                      <div class="job" v-show="userInfo.level != 1">{{ formTemp.job }}</div>
                      <div class="job_no">{{ userInfo.invite_code }}</div>
                    </div>
                    <div class="qrcode">
                      <img :src="formTemp.qrcode_64">
                      <p>识别二维码马上做代理</p>
                    </div>
                  </div>
                </div>
              </li>

            </ul>
					</div>
					<div class="left swiper-button-prev" style="background-image: none"><i class="sp sp-left-01"></i></div>
					<div class="right swiper-button-next" style="background-image: none"><i class="sp sp-right"></i></div>
          <div class="tips">
            <span>长按保存图片</span>
            <div class="pib_rotate">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>

        <div class="foot">
					<div class="swiper-pagination"></div>
          <div class="agree">
            <Checkbox v-model="single">
              <span>我已认真阅读</span>
              <a href="javascript:" class="link" @click="isShow = true">《卡盟金服平台推广规范》</a>
              <span>，认同平台的经营模式，并自愿接受协议中的条款。</span>
            </Checkbox>
          </div>
          <div class="btn">
            <button type="button" @click="handleShareClick()">分享我的海报</button>
          </div>
        </div>
      </div>
    </div>

    <div class="layer" v-show="isShare">
      <div class="mask" @click="isShare = false"></div>
      <div class="share-image" @click="isShare = false">
        <img src="~assets/images/creditcard-share-btn.png" alt="">
      </div>
    </div>
  <posterAgreement v-model="isShow"></posterAgreement>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

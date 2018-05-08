<template>
  <div class="class-room-home-page">
    <div class="wrapper">
      <scroller>
        <header class="header">
          <div class="header-nav">
            <span class="shape" v-on:click.stop="backHome"></span>
          </div>
          <!-- <div class="header-top">
            <h2>
              <img src="~assets/images/class-room/room-top-title.png" alt="">
            </h2>
            <p>在卡盟可以实现人生的两个自由——财务自由和时间自由。</p>
            <div class="logo-tips">
              <i class="sp sp-kameng-icon"></i>
              <span class="year">2018</span>
              <span class="tips">坚持每天多学一点！</span>
            </div>
          </div> -->
        </header>
        <div class="class-room-content">
          <h2>
            <i class="sp sp-class-room-title-icon"></i>
            <span>精选好课</span>
          </h2>
          <div class="class-list">
            <router-link :to="{name: 'user.ClassRoom', params: {id: 'activity'}}">
              <div class="class-item">
                <img src="~assets/images/class-room/class1.png" alt="">
                <div class="item-bottom">
                  <h3>业务介绍</h3>
                  <div class="bottom-bar">
                    <div class="left">
                      <i class="sp sp-advertise-point"></i>
                      <span>26</span>
                    </div>
                    <div class="right">
                      <i class="sp sp-view"></i>
                      <span>285</span>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
            <router-link :to="{name: 'user.ClassRoom', params: {id: 'strategy'}}">
              <div class="class-item">
                <img src="~assets/images/class-room/class2.png" alt="">
                <div class="item-bottom">
                  <h3>团队打造攻略</h3>
                  <div class="bottom-bar">
                    <div class="left">
                      <i class="sp sp-advertise-point"></i>
                      <span>63</span>
                    </div>
                    <div class="right">
                      <i class="sp sp-view"></i>
                      <span>528</span>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
            <div class="class-item" v-on:click.stop="$toast('暂未放开，敬请期待！')">
              <img src="~assets/images/class-room/class3.jpg" alt="">
              <div class="item-bottom">
                <h3>往期直播</h3>
                <div class="bottom-bar">
                  <div class="left">
                    <i class="sp sp-advertise-point"></i>
                    <span>0</span>
                  </div>
                  <div class="right">
                    <i class="sp sp-view"></i>
                    <span>0</span>
                  </div>
                </div>
              </div>
            </div>
            <router-link :to="{name: 'user.ClassRoom', params: {id: 'insurance'}}">
              <div class="class-item">
                <img src="~assets/images/class-room/class4.jpg" alt="">
                <div class="item-bottom">
                  <h3>汽车保险实操讲解</h3>
                  <div class="bottom-bar">
                    <div class="left">
                      <i class="sp sp-advertise-point"></i>
                      <span>120</span>
                    </div>
                    <div class="right">
                      <i class="sp sp-view"></i>
                      <span>685</span>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
            <router-link :to="{name: 'user.ClassRoom', params: {id: 'study'}}">
              <div class="class-item">
                <img src="~assets/images/class-room/class5.jpg" alt="">
                <div class="item-bottom">
                  <h3>新手学习专区</h3>
                  <div class="bottom-bar">
                    <div class="left">
                      <i class="sp sp-advertise-point"></i>
                      <span>18</span>
                    </div>
                    <div class="right">
                      <i class="sp sp-view"></i>
                      <span>336</span>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
            <div class="class-item" v-on:click.stop="$toast('维护中...')">
              <img src="~assets/images/class-room/class6.jpg" alt="">
              <div class="item-bottom">
                <h3>高级核心团队培训</h3>
                <div class="bottom-bar">
                  <div class="left">
                    <i class="sp sp-advertise-point"></i>
                    <span>81</span>
                  </div>
                  <div class="right">
                    <i class="sp sp-view"></i>
                    <span>260</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroller>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
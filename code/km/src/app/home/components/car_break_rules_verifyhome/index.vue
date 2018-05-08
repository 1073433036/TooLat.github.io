<template>
  <div class="my-verify-page">
    <app-header title="身份验证"></app-header>
    <scroller>
      <div class="wrapper">
      <!-- <div>{{idx}}</div> -->
        <div class="car-title">
          <div ref = "car_code"><img src="~assets/images/break-icon-che.png" alt="">{{cartCode.substring(0, 2) + ' ' + cartCode.substring(2)}}</div>
        </div>
        <div class="car-state">
          <ul class="state-list">
            <li>
              <p class="num">0</p>
              <p>违章</p>
            </li>
            <li>
              <p class="num">0</p>
              <p>扣分</p>
            </li>
            <li>
              <p class="num">0</p>
              <p>罚款</p>
            </li>
          </ul>
           <div class="tip"><i></i><span>验证车主身份后，可查询违章详情</span></div>
        </div>

        <div class="car-verify">
          <div class="verify-title">
            <h2>选择验证方式</h2>
          </div>
          <ul class="verify-list">
        <!--     <li class="list-item" @click="codeDialog">
              <div class="icon"><img src="~assets/images/icon-iphone.png" alt=""></div>
              <div class="text">
                <p class="iphone">手机验证码验证</p>
                <p class="iphone-num">133******2313</p>
              </div>
              <div class="tool"></div>
            </li>
            <li class="list-item"  @click="identityDialog">
              <div class="icon"><img src="~assets/images/icon-id.png" alt=""></div>
              <div class="text">
                <p class="iphone">身份证信息验证</p>
                <p class="iphone-num">输入身份证后8位验证</p>
              </div>
              <div class="tool"></div>
            </li> -->
            <li class="list-item" @click="goCarInfoVerify">
              <div class="icon"><img src="~assets/images/icon-car.png" alt=""></div>
              <div class="text">
                <p class="iphone">车辆信息验证</p>
                <p class="iphone-num">输入或拍照获取车辆信息验证</p>
              </div>
              <div class="tool"></div>
            </li>
          </ul>
        </div>
      </div>
    </scroller>

 <!--   <transition name="fade">
     <div class="authentication" v-if="isDialogShow">
       <div class="bg" @click="closeDialog"></div>
       <div class="authentication_wrapper" v-if="identityShow">
          <header>
             身份验证
             <i class="close-btn" @click="closeDialog"></i>
          </header>
          <div class="authentication_content"><i class="addcart"></i><input type="text"  placeholder="请输入身份证后八位"  /></div>
          <div class="complete-btn" @click="complete">完成</div>
       </div>
        <div class="authentication_wrapper" v-if="codeShow">
           <header>
              手机验证
              <i class="close-btn" @click="closeDialog"></i><br/>
              <span class = "messages">已向133*****233手机发送了验证信息</span>
           </header>
           <div class="authentication_content"><i class = "code"></i><input type="text"  placeholder="输入验证码"  /></div>
           <div class="complete-btn" @click="complete">完成</div>
        </div>
       <div class="vin-default" v-if="isVinShow" @click="closeDialog"></div>
     </div>
   </transition> -->
    <transition name="fade">
      <div class="car-dialog" v-if="isDialogShow">
        <div class="bg" @click="isDialogShow = false"></div>
        <div class="take-photo-wrapper">
          <header>
            <i class="close-btn" @click="isDialogShow = false"></i>
          </header>
          <section class="take-photo-content">
            <router-link :to="{ name: 'home.CreditCard' }">
              <div class="photo-card-wrapper">
                  <img class="photo-card" alt="广告" src="~assets/images/creditcar_ad.png" />
              </div>
            </router-link>
          </section>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

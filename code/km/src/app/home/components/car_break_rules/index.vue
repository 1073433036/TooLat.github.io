<template>
  <div class="car-break-rules-page">
    <scroller>
      <div class="wrapper">
        <div class="break-rules-top">
          <div class="bg">
            <img src="~assets/images/break-head-bg.png" alt="">
          </div>
          <a class="return" @click="goHome"></a>
        </div>

        <div class="break-add"  @click="identityDialog">
          <div class="add-title">
            <img src="~assets/images/break-icon-jia.png" alt="">添加车辆查违章
          </div>
          <div class="serve">
            <img src="~assets/images/break-icon-wei.png" alt="">享受新违章通知，在线查询等服务
          </div>
        </div>

        <div class="break-cont"></div>

        <div class="break-container" ref="homeSwiper" v-if="carList.length">
          <ul class="swiper-wrapper">
            <li class="swiper-slide" v-for="(el, index) in carList" :key="index" @click="goDetailPage(el.id)">
              <div class="con-top">
                <div class="title">{{ el.car_number }}</div>

              </div>
              <div class="con-bottom">
                <ul>
                  <li>违章 {{ el.violation && el.violation.total_num ? el.violation.total_num : 0 }}</li>
                  <li class="pl"><span class="kou">扣</span>{{ el.violation && el.violation.total_degree ? el.violation.total_degree : 0 }}分</li>
                  <li class="pl"><span class="fa">罚</span>{{ el.violation && el.violation.total_count ? el.violation.total_count : 0 }}元</li>
                  <li @click.stop="goMyCarPage"><span>查看详情</span></li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div class="break-list">
          <router-link class="list-item" :to="{name: 'home.CreditCard'}" tag="div">
            <img src="~assets/images/card.png" alt="">
            <div class="item-right">
              <div class="title">车老板：办信用卡额度高，秒批！</div>
              <div class="chakan"><img src="~assets/images/break-icon-kan.png" alt="">1200人查看</div>
            </div>
          </router-link>
          <div class="list-item">
            <img src="~assets/images/break-item-1.jpg" alt="">
            <div class="item-right">
              <div class="title">足不出户办车险，全民砍价帮办！</div>
              <div class="chakan"><img src="~assets/images/break-icon-kan.png" alt="">1200人查看</div>
            </div>
          </div>
        </div>

        <app-footing></app-footing>
      </div>

    </scroller>

    <transition name="fade">
      <div class="authentication" v-if="isDialogShow">
        <div class="bg" @click="closeDialog"></div>
        <div class="authentication_wrapper" v-if="identityShow">
            <header>
              添加车辆
              <i class="close-btn" @click="closeDialog"></i>
            </header>
            <div class="authentication_content"><span class="yue" ref="location" @click="btnCarTxtShow">{{carTxt[carTxtIndex]}}&nbsp;></span><i class="addcart"></i><input type="text"  placeholder="请输入车牌号码" ref="carCode"/></div>
            <div class="complete-btn" @click="complete">完成</div>
        </div>
          <div class="authentication_wrapper" v-if="codeShow">
            <header>
                手机验证
                <i class="close-btn" @click="closeDialog"></i><br/>
                <span class = "messages">已向133*****233手机发送了验证信息</span>
            </header>
            <div class="authentication_content"><i class = "carode"></i><input type="text"  placeholder="输入验证码"  /></div>
            <div class="complete-btn" @click="complete">完成</div>
          </div>
        <div class="vin-default" v-if="isVinShow" @click="closeDialog"></div>
      </div>
    </transition>
    <div class="region" v-if="carTxtShow">
      <ul>
        <li v-for="(item,index) in carTxt" @click="carTxtItem(index)" :key="index">{{item}}</li>
      </ul>
    </div>

  </div>
  
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

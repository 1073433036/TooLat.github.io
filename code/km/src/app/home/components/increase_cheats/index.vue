<template>
  <div class="increase-cheats">
    <app-header title="提额秘籍">
      <div class="slot" slot="right">
        <span class="right" v-if=" $route.path == '/increase_cheats' ">
          <a href="javascript:void(0)" @click="linkToIncreaseList('IncreaseIssue')">
          <!-- <router-link :to="{ name: 'home.IncreaseIssue' }"> -->
						发布
						<i class="sp sp-issue"></i>
					<!-- </router-link> -->
          </a>
        </span>
      </div>
    </app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="photo" ref="mySwiper">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <div class="photo-item">
                  <img src="~assets/images/increase-00.jpg">
                </div>
              </div>

              <div class="swiper-slide">
                <div class="photo-item">
                  <img src="~assets/images/tie_peixunban03.jpg">
                </div>
              </div>
            </div>
            <div class="swiper-pagination"></div>
          </div>
					<div class="tips">
						<i class="icon icon-horn"></i>
						<div class="notice">
							<div class="marquee">卡盟金服信贷流量服务平台声明：提额秘籍里面所有内容只提供本平台高级会员查看，所有方法也是根据跟人实际情况作为参考，后期因银行或小贷公司对漏洞风控系统升级，导致部分方法无效，平台不但任何责任。</div>
						</div>
          </div>
          <div class="main">
            <ul class="list">
              <li class="item" v-for="(item, index) in formTemp.increaseData" :key="index" @click="linkToIncreaseList('IncreaseList', item.id)">
                  <div class="content-group">
                    <img :src="item.more.thumbnail">
                    <span class="name">{{item.name}}</span>
                    <span class="count" v-if="item.todayCount > 0">{{ item.todayCount }}</span>
                    <i class="sp sp-right"></i>
                  </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>

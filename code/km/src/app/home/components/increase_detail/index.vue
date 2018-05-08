<template>
  <div class="increase-detail" v-if="isShowPage">
    <app-header title="提额秘籍"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <h3 class="title">{{formTemp.detail.post_title}}</h3>
          <p class="date">
            <span>{{formTemp.detail.published_time}}</span>
            <span class="kamun">{{formTemp.detail.post_source}}</span>
            <a href="javascript:" class="share-btn" @click="isShare = true">
              <i class="icon icon-share"></i>
              <span class="name">分享可锁粉</span>
            </a>
          </p>
          <div class="kameng-header-img">
            <!-- <img src="~assets/images/kameng-header-img.jpg" alt=""> -->
            <img src="~assets/images/tie_peixunban04.jpg">
          </div>
          <div class="content">
            <div class="content-detail" v-html="formTemp.detail.post_content"></div>
            <div class="kameng-footer-img">
              <img src="~assets/images/kameng-footer-img.jpg" alt="">
              <!-- <img src="~assets/images/tie_peixunban04.jpg"> -->
            </div>
            <p class="read">阅读  {{formTemp.detail.post_hits}}
              <span class="like" v-on:click.stop="increaseLike">
                <i class="sp sp-like-01"></i>
                {{formTemp.detail.post_like}}
              </span>
            </p>
          </div>
        </div>
      </div>
    </scroller>
    <div class="layer" v-show="isShare" @click="isShare = false">
      <div class="mask"></div>
      <div class="share-image">
        <img src="~assets/images/creditcard-share-btn.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>
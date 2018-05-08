<template>
  <div class="advertise-home-page">
    <header class="advertise-header">
      <h3 :class="{'active-h3': typeRemark == 'financial'}" v-on:click.stop="turnType('financial')">金融</h3>
      <h3 :class="{'active-h3': typeRemark == 'insurance'}" v-on:click.stop="turnType('insurance')">保险</h3>
      <div class="back-btn" v-on:click.stop="routerBackHome"></div>
      <div class="award-tips" v-on:click="isShowAwardExplain = true">
        <span>奖励说明</span>
      </div>
    </header>
    <div class="advertise-search">
      <i class="sp sp-sea"></i>
      <input type="text" class="search-input" placeholder="搜索关键字/名称">
    </div>
    <div class="advertise-nav-group">
      <div class="left-nav" v-on:click.stop="setArticleOrVideo('article')">
        <div class="nav-wrap" :class="{'active-nav': itemRemark == 'article' ? true: false}">
          <i v-show="(itemRemark == 'article' ? true: false)" class="sp sp-advertise-article"></i>
          <i v-show="!(itemRemark == 'article' ? true: false)" class="sp sp-advertise-article-disabled"></i>
          <span>短文</span>
        </div>
      </div>
      <div class="cut-line"></div>
      <div class="mid-nav" v-on:click.stop="setArticleOrVideo('photo')">
        <div class="nav-wrap" :class="{'active-nav': itemRemark == 'photo' ? true: false}">
          <i v-show="(itemRemark == 'photo' ? true: false)" class="sp sp-advertise-photo-active"></i>
          <i v-show="!(itemRemark == 'photo' ? true: false)" class="sp sp-advertise-photo"></i>
          <span>图片</span>
        </div>
      </div>
      <div class="cut-line"></div>
      <div class="right-nav" v-on:click.stop="setArticleOrVideo('video')">
        <div class="nav-wrap" :class="{'active-nav': itemRemark == 'video' ? true: false}">
          <i v-show="(itemRemark == 'video' ? true: false)" class="sp sp-advertise-video-active"></i>
          <i v-show="!(itemRemark == 'video' ? true: false)" class="sp sp-advertise-video"></i>
          <span>视频</span>
        </div>
      </div>
      <div class="cut-line"></div>
      <div class="material-nav" v-on:click.stop="setArticleOrVideo('material')">
        <div class="nav-wrap" :class="{'active-nav': itemRemark == 'material' ? true: false}">
          <span>公司素材</span>
        </div>
      </div>
    </div>
    <div class="advertise-main-list">
      <scroller ref="scroller" :on-refresh="refresh" :on-infinite="infinite">

        <div v-if="(itemRemark == 'material')" class="material-extract-wrap">
          <div class="material-extract">
            <h4>印刷素材：</h4>
            <!-- <p class="content">
              百度云账号：<span class="account">17304464308</span>
              密码：<span>159357ab</span>
            </p> -->
            <!-- <div class="address">百度云地址：<a href="https://pan.baidu.com/s/1Sf4mFNmHQJX5xXq1ZBx3Tg" target="_blank">https://pan.baidu.com/s/1Sf4mFNmHQJX5xXq1ZBx3Tg</a></div> -->
            <div class="address">百度云地址：<a href="https://pan.baidu.com/s/1L2UA1cekYyhpqVP6O6CETQ" target="_blank">https://pan.baidu.com/s/1L2UA1cekYyhpqVP6O6CETQ</a></div>
          </div>
        </div>

        <div v-if="(itemRemark == 'article')" class="advertise-item-wrap">
          <div class="advertise-article-item" v-for="item in currentArticleList">
            <h4>{{ item.post_title }}</h4>
            <div class="text-content" v-html="hanldeTextContent(item.post_content)">
            </div>
            <div class="all-content-btn" v-on:click.stop="goDetailPage(item.id)">查看全文&nbsp;&hellip;</div>

            <div v-if="item.more.photos" class="img-group" :class="'img-0' + item.more.photos.length " v-on:click.stop="goDetailPage(item.id)">
              <div v-for="(child, key) in item.more.photos" class="img"><img :src="child.url"></div>
            </div>

            <div v-else class="img-group img-01" v-on:click.stop="goDetailPage(item.id)">
              <div class="img"><img :src="item.more.thumbnail"></div>
            </div>

            <div class="bottom-tips">
              <span class="author">作者：<em class="name">{{ item.user_nickname }}</em></span>
              <i class="sp sp-view"></i>
              <span class="post-hits">{{item.post_hits}}</span>
              <span class="time">{{item.published_time}}</span>
            </div>
          </div>
        </div>

        <div v-else class="advertise-item-wrap">
          <div class="advertise-video-item" v-for="(item, index) in currentArticleList">
            <h4 v-if="!(itemRemark == 'material')">
              {{ item.post_title }}
              <p v-if="(itemRemark == 'video')" v-on:click.stop="goDetailPage(item.id)">
                <span>（</span>
                <i class="sp sp-advertise-video-active"></i>
                <span>查看视频）</span>
              </p>
            </h4>
            <div v-if="item.more.photos" class="img-group" :class="'img-0' + item.more.photos.length " v-on:click.stop="goDetailPage(item.id)">
              <div v-for="(child, key) in item.more.photos" class="img"><img :src="child.url"></div>
            </div>

            <div v-else class="img-group img-01" v-on:click.stop="goDetailPage(item.id)">
              <div class="img"><img ref="thumbnailPhoto" :src="item.more.thumbnail"></div>
            </div>

            <div class="bottom-tips">
              <span class="author">作者：<em class="name">{{ item.user_nickname }}</em></span>
              <i class="sp sp-view"></i>
              <span class="post-hits">{{item.post_hits}}</span>
              <span class="time">{{item.published_time}}</span>
            </div>
          </div>
        </div>
      </scroller>
    </div>

    <div class="advertise-my-release" v-if="isHasMyRelease" v-on:click.stop="goMyReleasePage">
      <img src="~assets/images/advertise-my-release-btn.png">
    </div>

    <div class="advertise-upload-btn" v-on:click.stop="goUploadPage">
      <i class="sp sp-advertise-upload"></i>
      <span>上传素材</span>
    </div>

    <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
      <div class="award-page" v-show="isShowAwardExplain">
        <header class="header">
          <div class="back-btn" v-on:click.stop="isShowAwardExplain = false"></div>
          <h3>积分奖励说明</h3>
        </header>
        <div class="award-container">
          <scroller>
            <img src="~assets/images/advertise-award-explain.jpg">
          </scroller>
        </div>
      </div>
    </transition>

    <check-user-level></check-user-level>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>

<template>
  <div class="advertise-article-detail-page" id="advertise-article-detail-page">
    <app-header :title="headerTitle"></app-header>
    <div class="advertise-container" v-if="isShowPage">
      <scroller
      ref="myscroller"
      :on-refresh="refresh"
      :on-infinite="infinite">
        <div class="advertise-wrapper">
          <div class="article-detail">
            <h2 v-if="!(itemRemark == 'material')">{{ articleDetail.post_title || ''}}</h2>
            <div class="article-sildbar">
              <span class="release-time">{{ articleDetail.published_time }}</span>
              <span class="author">作者：<span style="margin-left:2px; color: #01b3f0">{{ articleDetail.user_nickname}}</span></span>
            </div>
            <p v-if="!('video' === itemRemark || 'material' === itemRemark)"  class="article-desc" v-html="articleContent"></p>
            <div ref="photoGroup" class="photo-group" v-if="!('video' === itemRemark)">
              <div class="photo-item" v-for="item in articleDetail.more.photos">
                <img :src="item.url" alt="">
              </div>
            </div>
            <div v-else class="video-group">
              <div v-if="isShowVideoCoverWrapper" class="video-cover-wrapper" v-on:click.stop="playVideo"></div>
              <video ref="myVideo" controls :poster="articleDetail.more.thumbnail" preload="none" v-if="articleDetail.more.files" >
                <source :src="articleDetail.more.files[0].url">
              </video>
            </div>
            <!-- <p v-if="!('video' === itemRemark)"  class="article-desc" v-html="articleContent"></p> -->
          </div>
          <ul class="comment-list">
            <li class="comment-item" v-for="item in articleCommentList">
              <img v-if="item.avatar" :src="item.avatar" alt="">
              <img v-else src="~assets/images/avatar.png" alt="">
              <div class="right">
                <h4>{{ item.name}}</h4>
                <p>{{ item.content }}</p>
              </div>
              <span class="comment-time">{{ item.add_time }}</span>
            </li>
            <li v-if="!articleCommentList.length" class="tips">该文章还没有评论，快来抢沙发吧！</li>
          </ul>
        </div>
      </scroller>
    </div>

    <div class="article-bottom-bar">
      <div class="write-comment" v-on:click.stop="isShowCommentPopup = true">
        <i class="sp sp-article-pen-remark"></i>
        <span>写评论</span>
      </div>
      <div class="msg">
        <span>阅读</span>
        <span style="margin-left:5px;">{{ articleDetail.post_hits }}</span>
      </div>
      <div class="thumbs" v-on:click.stop="postLike">
        <i class="sp sp-like-01"></i>
        <span>{{ articleDetail.post_like }}</span>
      </div>
     <!--  <div class="share">
        <i class="sp sp-article-share"></i>
      </div> -->
    </div>

    <transition name="slide-in">
      <div v-show="isShowCommentPopup" class="popup-comment-input">
        <div class="popup-wrapper">
          <div class="input">
            <textarea v-model="userComment" maxlength="220"  placeholder="输入您的评论，最多200字"></textarea>
          </div>
          <div class="submit-comment-btn-group">
            <span class="confirm-btn" v-on:click.stop="requestCommentArticle">发表评论</span>
            <span class="cancel-btn" v-on:click.stop="isShowCommentPopup = false">返回文章</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>
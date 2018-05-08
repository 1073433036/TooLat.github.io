<template>
  <div class="advertise-upload-material-page">
    <header class="advertise-header">
      <h3>上传素材</h3>
      <div class="back-btn" v-on:click.stop="routerBackHome"></div>
    </header>
    <scroller>
      <div class="advertise-wrapper">
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
        <div class="advertise-article-title" v-show="!(itemRemark === 'material')">
          <h3>{{itemStr}}标题：</h3>
          <div class="input-wrapper">
            <input type="text" v-model="articleTitle" maxlength="30" placeholder="点击输入标题，最多30字">
          </div>
        </div>
        <div class="advertise-article-desc"  v-show="!('video' === itemRemark || 'material' === itemRemark)">
          <h3>{{itemStr}}描述：</h3>
          <div class="desc-content">
            <div class="article-desc" v-on:click="isShowDescPopup = true">{{ articleDesc || '点击这里输入内容...' }}</div>
          </div>
        </div>
        <div class="advertise-upload">
          <h3 v-if="itemRemark == 'video'">上传视频：</h3>
          <h3 v-else>上传图片：</h3>
          <div class="img-group" v-show="!isVideoUpload">
            <div class="img-item" v-for="(item, index) in articleImages">
              <div class="img-wrapper">
                <img :src="item" alt="">
              </div>
              <i class="sp sp-fit-01"  v-on:click.stop="deleteImg(index)"></i>
            </div>
            <div class="upload-btn" v-show="!articleImages[2]">
              <label for="hidden-file-input" v-on:click.stop="Choosevalidate">
                <i class="sp sp-advertise-upload-btn"></i>
                <input id="hidden-file-input" class="hidden-file-input" type="file" name="file" v-on:change="setImage($event, 'photo')">
              </label>
            </div>
          </div>
          <div class="video-group" v-show="isVideoUpload">
            <div class="video-cover">
              <div v-if="videoCoverImg" class="cover-img-group">
                <div class="img-wrapper">
                  <img :src="videoCoverImg" alt="">
                </div>
                <i class="sp sp-fit-01"  v-on:click.stop="(videoCoverImg = '')"></i>
              </div>
              <label v-else for="video-cover-hidden-file-input" id="video-cover-label"  v-on:click.stop="Choosevalidate">
                <input id="video-cover-hidden-file-input" style="display: none;" type="file" name="file" v-on:change="setImage($event, 'video')">
                <span>上传视频封面</span>
              </label>
            </div>
            <div class="video-wrapper">
              <div v-if="videoSrc" class="video-pay-btn" v-on:click.stop="playVideo">
                <img src="~assets/images/advertise-video.png" alt="">
              </div>
              <video v-if="videoSrc" class="my-video" ref="myUploadVideo" v-on:click.stop="playVideo">
                <source :src="videoSrc" type="video/mp4">
              </video>
              <i v-if="videoSrc" class="sp sp-fit-01"  v-on:click.stop="deleteVideo"></i>
              <div v-show="!videoSrc" id="video-upload-btn">上传视频</div>
            </div>
          </div>
          <p class="upload-tips">{{ uploadTips }}</p>
        </div>
        <div class="submit-btn" v-on:click.stop="uploadArticle" v-show="!isVideoUpload">确定提交</div>
        <div class="submit-video-btn" :class="{'submit-disabled': !videoKey}" v-on:click.stop="uploadVideo" v-show="isVideoUpload">确定提交</div>
      </div>
    </scroller>

    <transition name="slide-in">
      <div v-show="isShowDescPopup" class="popup-desc-input">
        <div class="popup-wrapper">
          <div class="input">
            <textarea v-model="articleDesc" maxlength="2000"  placeholder="输入内容，最多2000字"></textarea>
          </div>
          <div class="submit-comment-btn-group">
            <span class="confirm-btn" v-on:click.stop="isShowDescPopup = false">确定</span>
            <span class="cancel-btn" v-on:click.stop="isShowDescPopup = false">返回</span>
          </div>
        </div>
      </div>
    </transition>

    <div class="video-upload-success-popup" v-if="isShowSuccessTips">
      <div class="tips-content">
        <h3>提示</h3>
        <p>您的视频已上传成功，确定需要替换视频吗？</p>
        <div class="confirm" v-on:click.stop="replaceVideo">确定</div>
        <div class="cancel-btn"  v-on:click.stop="isShowSuccessTips = false">取消</div>
      </div>
    </div>

    <cropper></cropper>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>
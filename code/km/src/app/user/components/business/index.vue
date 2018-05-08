<template>
  <div class="user-business-page">
    <app-header title="微名片">
      <div class="slot" slot="right">
        <router-link :to="{ name: 'user.BusinessEdit' }">
          <i class="sp sp-edit"></i>
          <span>编辑</span>
        </router-link>
      </div>
    </app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="user-info">
            <div class="head">
              <div class="avatar">
                <img v-if="formTemp.avatar" :src="formTemp.avatar">
                <img v-if="!formTemp.avatar" src="~assets/images/avatar.png" @click="perfect">
              </div>
              <div class="info">
                <h3 class="name">
                  <i class="sp sp-task-name"></i>
                  <span class="nick">{{ formTemp.name }}</span>
                  <i v-if="2 == formTemp.sex" class="sp sp-girl"></i>
                  <i v-if="1 == formTemp.sex" class="sp sp-male"></i>
                  <span v-if="formTemp.age" class="age">{{ formTemp.age }}</span>
                </h3>
                <em class="tag">{{ formTemp.business }}</em>
              </div>
            </div>

            <div class="body">
              <div class="item">
                <div class="left">
									<i class="sp sp-mobile"></i>
									<span v-if="formTemp.phone">{{ formTemp.phone }}</span>
									<span v-else class="text" @click="perfect">待完善</span>
								</div>
								<div class="right">
									<i class="sp sp-invite-02"></i>
									<span v-if="formTemp.wechat_account">{{ formTemp.wechat_account }}</span>
									<span v-else class="text" @click="perfect">待完善</span>
								</div>
              </div>
              <!-- <div class="item">
                <i class="sp sp-point"></i>
                <span>广州市白云区江夏红枫创意园</span>
              </div> -->
            </div>
          </div>

          <div class="content">
            <div class="company">
              <div class="item name">
                <i class="sp sp-business-01"></i>
                <span v-if="formTemp.company">所在单位： {{ formTemp.company }}</span>
                <span v-else>所在单位：<span class="text" @click="perfect">待完善</span></span>
              </div>
              <div class="item">
                <div class="profile">
                  <i class="sp sp-business-02"></i>
                  <span>公司介绍</span>
                </div>
								<p v-if="formTemp.company_desc" class="introduce on">{{ formTemp.company_desc }}</p>
                <p v-else class="introduce" @click="perfect">待完善</p>
                <div class="photo">
									<ul class="list">
										<li v-show="0 < formTemp.company_images.length" class="photo-item" v-for="(item, index) in formTemp.company_images" :key="index" v-on:click.stop="scalePhoto(item)">
                      <img v-if="-1 === item.indexOf('http')" src="~assets/images/uploading-02.png">
                      <img v-else="item" :src="item">
										</li>
                    <li v-show="0 >= formTemp.company_images.length" v-for="item in 4" class="photo-item no-border" @click="perfect">
                      <img src="~assets/images/uploading-02.png">
                    </li>
									</ul>
								</div>
              </div>
            </div>

            <div class="title" @click="isMore = true">
              <span>更多资料</span>
              <i class="icon icon-enter"></i>
            </div>

            <div class="item" v-show="isMore">
              <i class="sp sp-business-03"></i>
              <span>血型</span>
              <em v-if="formTemp.blood_type">{{ formTemp.blood_type }}血型</em>
              <em v-else class="text" @click="perfect">待完善</em>
            </div>
            <div class="item" v-show="isMore">
              <i class="sp sp-business-04"></i>
              <span>家乡</span>
              <em v-if="formTemp.hometown">{{ formTemp.hometown }}</em>
              <em v-else class="text" @click="perfect">待完善</em>
            </div>
          </div>

          <div class="foot" v-show="isShowBtn">
            <button type="button" @click="handleShareClick()">分享名片</button>
          </div>
        </div>
      </div>
    </scroller>
    <div class="layer" v-show="isShare">
      <div class="mask" @click="isShare = false"></div>
      <div class="share-image">
        <img src="~assets/images/creditcard-share-btn.png" alt="">
      </div>
    </div>
    <div v-show="isShowCompanyImg" class="scalePhoto" v-on:click.stop="chooseFixed">
      <div class="content-img">
        <img :src="photoSrc" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
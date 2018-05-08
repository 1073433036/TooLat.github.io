<template>
  <div class="tool-mylist-page">
    <header class="header">
      <h3 :class="{ active: 26 == currentTab }" v-on:click="handleCheckNav(26)">金融</h3>
      <h3 :class="{ active: 27 == currentTab }" v-on:click="handleCheckNav(27)">保险</h3>
      <div class="back-btn" v-on:click.stop="routerBack"></div>
      <div class="award-tips" v-on:click="handleBombBoxChange('filter')">
        <i class="sp sp-filter"></i>
        <span>筛选</span>
      </div>
    </header>
    <scroller :on-refresh="refresh"
      :on-infinite="infinite">

      <div class="head">
        <div class="content">
          <div class="top">
            <div class="avatar">
  						<img v-if="userInfo.avatar_full" :src="userInfo.avatar_full">
            	<img v-else src="~assets/images/default-avatar.png">
            </div>

            <div class="user-info">
              <div class="name">
                <span>{{ userInfo.user_nickname }}</span>
                <i v-if="1 < userInfo.level" class="sp" :class="'sp-level-0' + userInfo.level"></i>
                <span v-else class="practice sp-level">
                  <i class="sp sp-level-01"></i>
                  <em>(实习)</em>
                </span>
              </div>
            </div>

            <div class="num-group">
              <div class="item">
                <span>{{ formData.likes || 0 }}</span>
                <p>点赞数</p>
              </div>
              <div class="item">
                <span>{{ formData.hits || 0 }}</span>
                <p>浏览数</p>
              </div>
            </div>

          </div>
          <div class="nav-tab">
            <div v-for="(item, index) in formTemp.childNav"
              :key="index"
              class="item"
              :class="{ active: item.active }"
              v-on:click="handleCheckTab(item)">{{ item.name }}</div>
          </div>
        </div>
      </div>

      <div class="wrapper">
        <div class="container">
          <ul class="list">
            <li v-for="(item, index) in formTemp.list" :key="index" class="item">
              <div class="link">
                <div v-on:click="handleGoToDetail(item)">
                  <div class="sta-time">
                    <span class="tit">发布时间：</span>
                    <span class="val">{{ item.published_time }}</span>
                    <div v-if="0 == item.post_status" class="sta">
                      <i class="sp sp-tool-wait"></i>
                      <span class="wait">审核中</span>
                    </div>
                    <div v-if="1 == item.post_status" class="sta">
                      <i class="sp sp-tool-ok"></i>
                      <span class="ok">审核通过</span>
                    </div>
                    <div v-if="2 == item.post_status" class="sta">
                      <i class="sp sp-tool-err"></i>
                      <span class="err">审核失败</span>
                    </div>

                  </div>

                  <div class="body">
                    <h2 class="title">{{ item.post_title }}</h2>
                    <div class="imgs">
                      <div v-for="(child, key) in item.more.photos" :key="key" class="child" :class="'img-0' + item.more.photos.length">
                        <img :src="child.url">
                      </div>
                    </div>
                  </div>
                </div>

                <div class="foot">
                  <div class="icon-group">
                    <i class="sp sp-advertise-point"></i>
                    <span>{{ item.post_like }}</span>
                  </div>
                  <div class="icon-group">
                    <i class="sp sp-view"></i>
                    <span>{{ item.post_hits }}</span>
                  </div>

                  <div class="del" v-on:click="myPostDelete(item)">
                    <i class="sp sp-close"></i>
                  </div>
                </div>

              </div>

            </li>
          </ul>
        </div>
      </div>
    </scroller>

    <BombBox v-on:bombClick="handleBomb" :show="bombShow" :formData="formTemp[formIndex]" :formIndex="formIndex"></BombBox>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

<template>
  <div class="article-list-page">
    <app-header :title="$route.query.name"></app-header>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="my_scroller">
      <div class="wrapper">
        <div class="banner">
          <a href="javascript:">
            <img src="~assets/images/tier_miji.jpg" alt="">
          </a>
        </div>
        <ul class="list">
          <li class="item" v-for="(item, index) in formTemp.data">
            <router-link :to="{ name: 'home.ArticleDetail', params: {id: item.id} }">
              <div class="box">
                <div class="image">
                  <img :src="item.more.thumbnail" alt="">
                </div>
                <div class="content">
                  <div class="title">{{ item.post_title }}</div>
                  <div class="info">
                    <div class="read">阅读量<span>{{ item.post_hits }}</span></div>
                    <div class="date">{{ item.published_time }}</div>
                  </div>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
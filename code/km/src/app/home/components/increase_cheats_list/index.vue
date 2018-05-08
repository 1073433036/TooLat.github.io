<template>
  <div class="increaseList-page">
    <app-header title="信用卡办卡攻略">
      <div class="slot" slot="right">
        <span class="more" @click='change' v-if=" $route.path == '/increase_cheats_list' ">
          <span class="sp sp-ellipsis"></span>
          <transition name="fade">
            <ul class="select" v-show="flag">
              <li class="select-list">
								<router-link :to="{ name: 'home.IncreaseIssue' }">发 布</router-link>
							</li>
              <li class="select-list" @click="chnageBank()">筛 选</li>
            </ul>
          </transition>
        </span>
      </div>
    </app-header>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="my_scroller">
      <div class="wrapper">
        <div class="photo">
          <img src="~assets/images/tier_miji.jpg" alt="">
        </div>
        <div class="increase_list">
          <ul class="item">
            <li class="list" v-for="(item, index) in formTemp.increaseList" :key="index">
              <router-link :to="{ name: 'home.IncreaseDetail', params: { id: item.id } }" tag="div" class="article-item">
                <span class="bank-photo">
                  <img :src="item.more.thumbSrc ? item.more.thumbSrc : item.more.thumbnail" alt="">
                </span>
                <span class="bank_cheats">{{ item.post_title }}</span>
                <span class="read">阅读量  {{ item.post_hits }}</span>
                <span class="time">{{ item.published_time }}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </scroller>

    <Banks></Banks>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>
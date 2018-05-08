<template>
  <div class="user-ranking-list-page">
    <app-header title="排行榜"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="banner">
            <!-- <img src="~assets/images/ranking-list-bg.jpg" alt=""> -->
            <img src="~assets/images/ranking-list-bg-new.jpg" alt="">
          </div>
          <div class="tips" v-on:click.stop="goStimulatePage">
            <i class="icon icon-horn"></i>
            <div class="notice">
              <div class="marquee">卡盟金服信贷流量服务平台：卡盟龙虎榜推出招商收入、办卡收入、车险办理收入、贷款收入排行，每周一、周五中午12点为截止时间，人人参与、公平竞争，高额奖金等你来战！</div>
            </div>
          </div>
          <ul class="nav">
            <!-- <li class="item" :class="{ 'on': text == '积分' }">
              <span>积分排行</span>
            </li>
            <li class="item" :class="{ 'on': text == '收入' }" @click="switchRank('收入')">
              <span>收入排行</span>
            </li>
            <li class="item" :class="{ 'on': text == '锁粉' }">
              <span>锁粉排行</span>
            </li> -->
            <li class="item" :class="{ 'on': rankingTypeSelected == key }" @click="toggleNewRank(key)"
                v-for="(el, key) in rankingType" :key="key">
              <span>{{ el }}排行</span>
            </li>
          </ul>
          <ul class="list">
            <!-- <li class="item" v-for="(item, index) in formTemp.list" :key="index">
              <div class="number">
                <span v-show="index < 3" class="image sp" :class="'sp-ranking-list-top' + ( index + 1)"></span>
                <span class="text">{{ index + 1 }}</span>
              </div>
              <div class="avatar">
                <img v-if="item.avatar" :src="item.avatar" alt="">
                <img v-else src="~assets/images/user-avatar.png" alt="">
              </div>
              <div class="content left">
                <div class="name user-name">{{ item.name }}</div>
                <div class="text">工号：{{ item.job_no || '未知' }}</div>
              </div>
              <div class="content right">
                <div class="name" v-if="item.integral">{{ item.integral }}</div>
                <div class="name" v-if="item.account">{{ item.account }}</div>
                <div class="name" v-if="item.fans">{{ item.fans }}</div>
                <div class="text">{{ text }}</div>
              </div>
            </li> -->
            <li class="item" v-for="(item, index) in rankingList" :key="index">
               <div class="number">
                <span v-show="index < 3" class="image sp" :class="'sp-ranking-list-top' + ( index + 1)"></span>
                <span class="text">{{ index + 1 }}</span>
              </div>
              <div class="avatar">
                <img v-if="item.avatar" :src="item.avatar" alt="">
                <img v-else src="~assets/images/user-avatar.png" alt="">
              </div>
              <div class="content left">
                <div class="name user-name">{{ item.nick_name || '未知' }}</div>
                <div class="text">工号：{{ item.job_no ? item.job_no.substring(0, item.job_no.length - 4).replace(/\d/g, '*')
                    + item.job_no.substring(item.job_no.length - 4) : '未知' }}</div>
              </div>
              <div class="content right">
                <div class="name">{{ item.money }}</div>
                <div class="text">收入</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

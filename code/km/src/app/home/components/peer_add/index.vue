<template>
  <div class="peer-add-page">
    <app-header title="信贷经理" >
      <div class="slot" slot="right" v-on:click="handleCityShowChange()">
        <i class="sp sp-point"></i>
        <span>
          {{ !Object.keys(province).length || (province.region_name === '全国') ? '全国' : city.region_name }}
        </span>
        <i class="sp sp-drop-down" :class="{ rotate: isOpen }"></i>
      </div>
    </app-header>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite">
      <div class="wrapper">
        <div class="controller">
          <div class="header">
            <div class="search">
              <div class="inner">
                <i class="sp sp-sea"></i>
                <input type="text" v-model="name" placeholder="搜索姓名 / 备注 / 机构名">
                <i class="icon icon-close" v-show="name" @click="name = ''"></i>
                <!-- <button class="btn-sea" v-on:click="list()">搜索</button> -->
              </div>
            </div>
            <div class="tips">
              <i class="icon icon-horn"></i>
              <div class="notice">
                <div class="marquee">卡盟金服信贷流量服务平台信贷经理圈：可以免费为金融机构、信贷机构、信贷经理、金融大咖，免费做推广宣传的平台，帮助大家提高知名度，拓展业绩，让全国各地的朋友都可以看到你的业务广告</div>
              </div>
            </div>
						<div class="add-friend">
              <!-- <router-link :to="{ name: 'task.Home' }"> -->
              <a href="javascript:void(0)" @click="linkToRoute({name: 'task.Home'})">
              <!-- <router-link :to="{ name: 'home.Peer' }"> -->
                <i class="sp sp-friend-01"></i>
                <span>信贷客</span>

<!--                 <div class="right">
                  <dl>
                    <li v-for="(item, index) in friendList.data" v-show="2 >= index" :key="index"><img :src="item.avatar"></li>
                    <li>
                      <div class="text">
                        <span>{{ friendList.total }}</span>
                        <em v-if="20 <= friendList.total">+</em>
                      </div>
                    </li>
                  </dl>
                </div> -->
              </a>
              <!-- </router-link> -->
            </div>
            <div class="add-friend">
              <!-- <router-link :to="{ name: 'home.ApplyLoan' }"> -->
              <a href="javascript:void(0)" @click="linkToRoute({name: 'home.ApplyLoan'})">
                <i class="sp sp-friend-02"></i>
                <span>我要发布</span>
              </a>
              <!-- </router-link> -->
              <!-- <router-link :to="{ name: 'home.PeerEdit' }" class="edit" v-if="userInfo.is_lender_manager == 1"> -->
              <a href="javascript:void(0)" @click="linkToRoute({name: 'home.PeerEdit'})" class="edit" v-if="userInfo.is_lender_manager == 1">
                <i class="icon icon-edit"></i>
                <span>修改</span>
              </a>
              <!-- </router-link> -->
            </div>
          </div>

          <div v-show="0 < formTemp.data.length" class="main">
            <ul class="list">
              <li v-for="(item, index) in formTemp.data" :key="index" class="item">
                <!-- <router-link :to="{ name: 'home.PeerDetail', params: { id: item.user_id } }" class="link"> -->
                <a href="javascript:void(0)" @click="linkToRoute({ name: 'home.PeerDetail', params: { id: item.user_id } })" class="link">
                  <div class="head" v-bind:style="{ backgroundImage: 'url('+ item.avatar +')' }">
                    <div class="userinfo">
                      <div class="text">
                        <div class="name">
                          <span>{{ item.name }}</span>
                          <em>（经理）</em>
                        </div>
                        <div class="auth">
                          <span>已认证</span>
                          <em>资料完善：{{ item.perfect_degree || 0 }}%</em>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="foot">
                    <div class="company">{{ item.company }}</div>
                    <div class="rate">
                      <span>贷款利率：</span>
                      <span><em>{{ item.lender_rate || 0 }}%</em></span>
                    </div>
                    <div class="info">
                      <span v-show="item.lender_desc">{{ item.lender_desc }}</span>
                      <span v-show="item.lender_amount">最高<em>{{ item.lender_amount }}</em>元</span>
                      <span v-show="item.business">{{ item.business }}</span>
                    </div>
                  </div>
                </a>
                <!-- </router-link> -->
              </li>
            </ul>

          </div>

        </div>
      </div>
    </scroller>
    <CityList :showAllCity="true"></CityList>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

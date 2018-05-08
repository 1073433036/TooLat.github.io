<template>
  <div class="message-friend-add-page">
    <app-header></app-header>
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
              </div>
            </div>
          </div>
          <div class="new-friend">
            <ul class="list">
              <li v-for="(item, index) in newFriends" :key="index" class="item be">
                <div class="avatar">
                  <img v-if="item.extend.avatar" :src="item.extend.avatar">
                  <img v-else src="~assets/images/avatar.png">
                </div>
                <div class="info">
                  <div class="head">
                    <div class="tit">{{ item.extend.name }}</div>
                    <div class="time">{{ item.send_time }}</div>
                  </div>
                  <div class="msg">
                    <span>{{ item.msg_content }}</span>
                    <div class="btn">
                      <button v-show="1 === item.sta" class="close" type="button">已拒绝</button>
                      <button v-show="0 === item.sta" class="del" type="button" v-on:click="handleDisagree(item)">拒绝</button>
                      <button v-show="0 === item.sta" class="add" type="button" v-on:click="handleAgree(item)">添加</button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="main">
            <ul class="list">
              <li v-for="(item, index) in formTemp.data" :key="index" class="item">
                <router-link :to="{ name: 'home.PeerDetail', params:{ id: item.user_id } }">
                  <div class="avatar">
                    <img v-if="item.avatar" :src="item.avatar">
                    <img v-if="!item.avatar" src="~assets/images/avatar.png">
                  </div>
                </router-link>
                <router-link :to="{ name: 'message.FriendDetail', params: { id: item.user_id } }" class="userinfo" tag="div">
                  <div class="name">{{ item.name }}</div>
                  <div class="text">
                    <p>{{ item.business }}</p>
                    <p>{{ item.company }}</p>
                  </div>
                </router-link>
                <div class="btn-addpeer">
                  <a v-on:click="addFriend(item)">加同行</a>
                </div>
              </li>
            </ul>

          </div>

        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

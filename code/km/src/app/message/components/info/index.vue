<template>
  <div class="message-info-page">
    <app-header></app-header>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="my_scroller">
      <div class="wrapper">
        <div class="controller">
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
            <li v-for="(item, index) in formData.message" :key="index" class="item" :class="{ be: false === item.isRead }">
              <router-link :to="{ name: 'chat.Home', params: { id: item.uid } }">
                <div class="avatar">
                  <img v-if="item.avatar" :src="item.avatar">
                  <img v-else src="~assets/images/avatar.png">
                </div>
                <div class="info">
                  <div class="head">
                    <div class="tit">{{ item.username }}</div>
                    <div class="time">{{ item.time * 1000 | fmtDate }}</div>
                  </div>
                  <div class="msg">
                    <span>{{ 1 === item.type ? '[图片]' : item.msg }}</span>
                  </div>
                </div>
              </router-link>
            </li>

          </ul>
        </div>
      </div>
    </scroller>
    <app-footer></app-footer>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
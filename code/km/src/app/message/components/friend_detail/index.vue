<template>
  <div class="message-friend-detail-page">
    <app-header></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="main">
            <ul class="list">
              <li class="item">
                <div class="avatar">
                  <img v-if="formTemp.avatar" :src="formTemp.avatar">
                  <img v-else src="~assets/images/avatar.png">
                </div>
                <div class="userinfo">
                  <div class="name">{{ formTemp.name }}</div>
                  <div class="text">
                    <!-- <p>{{ formTemp.business }}</p> -->
                    <p>{{ formTemp.company}}</p>
                  </div>
                </div>
                <div v-show="formTemp.business" class="tags">
                  <div class="list">
                    <em class="item">{{ formTemp.business }}</em>
                  </div>
                </div>
              </li>
            </ul>

          </div>

          <div class="point-group">
            <i class="sp sp-point"></i>
            <span>地区</span>
            <strong>{{ formTemp.position }}</strong>
          </div>

          <div class="btn-add">
            <button v-if="1 === formTemp.is_friend * 1" type="button" v-on:click="$toast('敬请期待')">聊天</button>
            <button v-if="0 === formTemp.is_friend * 1" type="button" v-on:click="addFriend()">加好友</button>
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
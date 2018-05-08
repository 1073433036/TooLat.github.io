<template>
  <div class="message-friend-page">
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
                <input type="text" v-model="keyword" placeholder="在好友列表中搜索">
                <button class="btn-sea" v-on:click="handleSearch()">搜索</button>
              </div>
            </div>

            <div class="add-friend">
              <router-link :to="{ name: 'message.FriendAdd' }">
                <i class="sp sp-friend"></i>
                <span>添加同行</span>
                <div v-if="0 < notTotal * 1" class="tips">
                  <em>{{ notTotal }}</em>
                </div>
              </router-link>
            </div>
          </div>

          <div class="main">
            <ul class="list">

              <li v-for="(item, index) in formTemp.list" :key="index" class="item">
                <div class="caption">{{ item.chat }}</div>
                <div class="friend-group">
                  <router-link :to="{ name: 'message.FriendDetail', params: { id: child.user_id } }" v-for="(child, key) in item.data" :key="key" class="friend" tag="div">
                    <div class="avatar">
                      <img v-if="child.avatar" :src="child.avatar">
                      <img v-else src="~assets/images/avatar.png">
                    </div>
                    <div class="userinfo">
                      <div class="info">
                        <div class="name">{{ child.name }}</div>
                        <div class="text">
                          <p>{{ child.business }}</p>
                          <p>{{ child.company }}</p>
                        </div>
                      </div>
                      <div class="rate">签单率：{{ child.success_rate }}%</div>
                    </div>

                    <div class="chat">
                      <i class="sp sp-chat"></i>
                    </div>

                  </router-link>
                </div>
              </li>

            </ul>
          </div>

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
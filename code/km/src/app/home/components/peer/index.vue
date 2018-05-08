<template>
  <div class="peer-page">
    <app-header title="同行通讯录"></app-header>
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

            <div class="tips">
              <i class="icon icon-horn"></i>
							<div class="notice">
              	<div class="marquee">卡盟金服信贷流量服务平台：您可以在信贷经理圈免费发布消息，让更多人了解您的金融业务，提高业绩，平台不收取任何费用，谨防金融诈骗，举报电话：400-018-8616</div>
              	<div class="marquee">卡盟金服信贷流量服务平台：在信贷经理圈发布消息，平台不收取任何费用，谨防金融诈骗，举报电话：400-018-8616</div>
            	</div>
            </div>

            <div class="add-friend">
              <router-link :to="{ name: 'home.PeerAdd' }">
                <i class="sp sp-friend"></i>
								<i class="sp sp-add"></i>
                <span>添加同行</span>
              </router-link>
            </div>

          </div>

          <div class="main">
            <ul class="list">
              <li v-for="(item, index) in formTemp.list" :key="index" class="item">
                <div class="caption">{{ item.chat }}</div>
                <div class="friend-group">
                  <div v-for="(child, key) in item.data" :key="key" class="friend">
                    <div class="avatar">
                      <img v-if="child.avatar" :src="child.avatar">
                      <img v-else src="~assets/images/avatar.png">
                    </div>
                    <div class="userinfo">
                      <div class="info">
                        <router-link :to="{ name: 'home.PeerDetail', params: { id: child.user_id } }">
                          <div class="name">{{ child.name }}</div>
                        </router-link>
                        <div class="text">
                          <p>{{ child.business }}</p>
                          <p>{{ child.company }}</p>
                        </div>
                      </div>
                      <div class="rate">签单率：{{ child.success_rate }}%</div>
                    </div>
                    <router-link :to="{ name: 'chat.Home', params: { id: child.user_id } }" class="chat">
                      <i class="sp sp-chat"></i>
                    </router-link>
                  </div>

                </div>
              </li>

            </ul>

          </div>

        </div>
      </div>
			<app-footing></app-footing>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

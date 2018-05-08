<template>
  <div class="user-peer-page">
    <app-header title="我的信贷经理"></app-header>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite">
      <div class="wrapper">
        <div class="controller">
          <div class="header">
            <div class="add-friend">
              <i class="sp sp-team"></i>
              <span>共有<em>{{ formTemp.list.length || '0' }}</em>位信贷经理抢单</span>
            </div>
          </div>

          <div class="main">
            <ul class="list">
              <li v-for="(item, index) in formTemp.list" class="item">
                <router-link :to="{ name: 'user.PeerDetail', params: { id: item.id } }">
                  <div class="avatar">
                    <img v-if="item.avatar" :src="item.avatar">
                    <img v-else src="~assets/images/avatar.png">
                  </div>
                  <div class="userinfo">
                    <div class="name">{{ item.name }}</div>
                    <!-- <div class="rate">签单率：50%</div> -->
                    <div class="text">
                      <p>公司：{{ item.company || '暂无' }}</p>
                      <p>公司描述：{{ item.company_desc || '暂无' }}</p>
                    </div>
                  </div>
                  <i class="sp sp-chat"></i>
                </router-link>
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
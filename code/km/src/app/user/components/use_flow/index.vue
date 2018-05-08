<template>
  <div class="use-flow-page">
    <app-header title="卡盟流程说明"></app-header>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="my_scroller">
      <div class="wrapper">
        <div class="container">
          <ul class="list">
            <li class="item" v-for="(item, index) in formTemp.list" :key="index" v-if="item.id !== 2 || (item.id === 2 && userInfo.level > 1)">
              <router-link :to="{ name: 'user.UseDetail', query: { id: item.id, name: item.name } }">
                <div class="image">
                  <span class="sp" :class="'sp-use-flow-' + item.id"></span>
                </div>
                <div class="content">
                  <span>{{ item.name }}</span>
                </div>
                <i class="icon icon-enter"></i>
              </router-link>
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

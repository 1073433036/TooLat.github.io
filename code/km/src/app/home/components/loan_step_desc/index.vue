<template>
  <main class="loan-step-desc-page">
    <app-header title="申请步骤"></app-header>
    <scroller ref="myscroller">
      <div class="increase_list">
        <ul class="item">
          <li class="list" v-for="(item, index) in increaseList" :key="index">
            <router-link :to="{ name: 'home.IncreaseDetail', params: { id: item.id } }" tag="div" class="article-item">
              <span class="bank-photo">
                <img :src="item.more.thumbnail" alt="">
              </span>
              <span class="bank_cheats">{{ item.post_title }}</span>
              <span class="read">阅读量  {{ item.post_hits }}</span>
              <span class="time">{{ item.published_time }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </scroller>
  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>


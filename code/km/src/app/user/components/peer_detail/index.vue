<template>
  <div class="user-peer-detail-page">
    <app-header title="信贷经理"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="user-info">
            <div class="avatar">
              <img v-if="formTemp.list.avatar" :src="formTemp.list.avatar">
              <img v-else src="~assets/images/avatar.png">
            </div>
            <h2 class="name">{{ formTemp.list.name }}</h2>
            <div class="area">
              <i class="sp sp-point"></i>
              <span>{{ formTemp.list.hometown || '未知' }}</span>
            </div>
            <div class="tags">
              <span v-if="formTemp.list.job">{{ formTemp.list.job }}</span>
              <span v-if="formTemp.list.age">{{ formTemp.list.age }}岁</span>
              <span v-if="formTemp.list.blood_type">{{ formTemp.list.blood_type }}血型</span>
            </div>
          </div>

          <ul class="list">
            <li class="item">
              <i class="sp sp-task-nature"></i>
              <em>公司</em>
              <span>{{ formTemp.list.company || '未知' }}</span>
            </li>
            <li class="item">
              <i class="sp sp-task-mobile"></i>
              <em>联系方式</em>
              <span>{{ formTemp.list.phone || '未知' }}</span>
            </li>
            <li class="item">
              <i class="sp sp-business-06"></i>
              <em>业务范围</em>
              <span>{{ formTemp.list.business || '未知' }}</span>
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
<template>
  <div class="user-income-page">
    <app-header title="收益明细"></app-header>
    <div class="banner">
      <div class="avatar">
        <img v-if="userInfo.avatar_full" :src="userInfo.avatar_full">
        <img v-else src="~assets/images/default-avatar.png">
      </div>
      <div class="money">
        <em>￥</em>
        <span class="span-color001">{{ userInfo.income | money }}</span>
        <p>（总收益）</p>
      </div>
      <div class="income-tye" :class="{ active: bombShow }" v-on:click="handleBombBoxChange('incomeTpe')">
        <span>分类</span>
      </div>
    </div>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite">
      <div class="wrapper">
        <div class="container">
          <ul class="list">

            <li v-for="(item, index) in formTemp.data" class="item">
              <div class="head">
                <i class="sp" :class="'sp-user-profit-0' + item.type"></i>
                <div class="title">{{ item.type_val }}</div>
              </div>
              <div class="main">
                <div class="text-item">
                  <span class="title">申请人：</span>
                  <span class="info">
                    {{ item.real_name }}
                    <em class="level">
                      （{{ item.level_name }}
                      <i class="sp" :class="'sp-level-0' + item.level"></i>
                      ）
                    </em>
                  </span>
                </div>
                <div v-if="item.extend.commission" class="text-item">
                  <span class="title">总奖金：</span>
                  <span class="info commission">
                    <em>￥</em>
                      {{ item.extend.commission }}
                    <span></span>
                  </span>
                </div>
                <div class="text-item">
                  <span class="title">推广奖励：</span>
                  <span class="info money">
                    <em>￥</em>
                    {{ item.money }}
                  </span>
                </div>
                <div class="text-item">
                  <span class="title">分佣时间：</span>
                  <span class="info add_time">
                    {{ item.add_time }}
                  </span>
                </div>

<!--                 <div class="text-item">
                  <span class="title">订单号：</span>
                  <span class="info">{{ item.trade_no }}</span>
                </div>
                <div class="text-item money">
                  <span class="title">{{ item.type | incomeTye }}</span>
                  <span class="info">{{ item.money }}</span>
                </div> -->
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroller>

    <BombBox v-on:bombClick="handleBomb" :show="bombShow" :formData="formTemp[formIndex]" :formIndex="formIndex"></BombBox>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

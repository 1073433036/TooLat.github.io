<template>
  <div class="task-order-page">
    <app-header title="我的订单">
      <div class="slot" slot="right" v-on:click="handleBombBoxChange('type')">筛选</div>
    </app-header>
    <div class="nav">
      <div class="inner">
        <i class="sp sp-task-order"></i>
        <span>抢单总数：<em>{{ taskTotal }}单</em></span>
        <span>成交单数：<em>{{ finishTotal }}单</em></span>
      </div>
    </div>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <ul class="task-list">
            <li class="item" v-for="(item, index) in orderList" :key="index">
              <div class="person">
                <router-link :to="{ name: 'task.TaskDetail', params: {id: item.id} }">
                  <span class="name">{{ item.name }}</span>
                  <span class="text">贷款<span class="fc">{{ item.amount }}</span>元</span>
                  <span class="text"><span class="fc">{{ item.repay_date_limit }}</span>期还款</span>
                </router-link>
              </div>
              <div class="company">
                <div class="line">
                  <i class="sp sp-task-home"></i>
                  <div class="info">
                    <span>单位：</span>
                    <span>{{ item.company }}</span>
                  </div>
                </div>
                <div class="line">
                  <i class="sp sp-task-phone"></i>
                  <div class="info">
                    <span>联系方式：</span>
                    <a :href="'tel:' + item.phone">{{ item.phone }}</a>
                  </div>
                </div>
                <div class="line">
                  <i class="sp sp-task-order-02"></i>
                  <div class="info">
                    <span>订单状态：</span>
                    <div class="radio-wrappe" v-if="item.status == 0">
                      <label class="radio" :class="{ 'radio-checked': item.state == 3 }">
                        <span class="radio-inner"></span>
                        <input type="radio" :checked="item.state == 3" class="radio-input" @change="change(index, 3)">
                        <span class="sta">成功</span>
                      </label>
                      <label class="radio" :class="{ 'radio-checked': item.state == 2 }">
                        <span class="radio-inner"></span>
                        <input type="radio" :checked="item.state == 2" class="radio-input" @change="change(index, 2)">
                        <span class="sta">失败</span>
                      </label>
                    </div>
                    <span v-if="item.status == 1">成功</span>
                    <span v-if="item.status == 2">失败</span>
                    <span v-if="item.status == 3">审核中</span>
                  </div>
                </div>
              </div>
              <div class="status" v-if="item.status == 0">
                <div class="text">抢单中</div>
              </div>
              <div class="status on" v-if="item.status == 1">
                <div class="text">成功</div>
              </div>
              <div class="status off" v-if="item.status == 2">
                <div class="text">失败</div>
              </div>
              <div class="status" v-if="item.status == 3">
                <div class="text">审核中</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroller>
    <input type="file" hidden ref="file" @change="upload">
    <BombBox v-on:bombClick="handleBomb" :show="bombShow" :formData="formTemp[formIndex]" :formIndex="formIndex"></BombBox>
    <app-footer></app-footer>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="city-list-page" v-show="isShow">
      <div class="location-layer">
          <div class="inner">
            <app-header title="地区选择" :isBack="false">
              <div class="slot" slot="right" v-on:click="handleSubmit()">
                <span>确定</span>
              </div>
            </app-header>
            <div class="head">
              <ul class="city-nav">
                <li v-on:click="handleParent(1)" class="nav-item" :class="{ active: 1 === parentIndex }">{{ formData.prov.name || '请选择' }}</li>
                <li v-if="1 < parentIndex" v-on:click="handleParent(2)" class="nav-item" :class="{ active: 2 === parentIndex }">{{ formData.city.name || '请选择' }}</li>
              </ul>
            </div>
            <scroller>
              <ul class="list">
                <li v-for="(item, index) in formTemp.address" class="item"
                  :key="index"
                  v-on:click="handleSelect(item)"
                  :class="{ active: item.id === formData[formIndex].id }">{{ item.name }}</li>
              </ul>

              <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
                <div v-show="'prov' !== formIndex" class="tips">注：请选择您所要投保的城市，如无法找到，该区域将陆续对接开发，敬请谅解！</div>
              </transition>
            </scroller>
          </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
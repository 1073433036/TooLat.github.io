<template>
  <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
    <div class="a-p-page" v-show="show">
      <div class="layer">
        <div class="inner">
          <div class="header">
            <div class="trial" >试算价格：<span>￥334</span></div>
            <div class="title">{{ title }}</div>
            <div class="close " v-on:click="dismiss()"><i class="cancel"></i></div>
          </div>

          <div class="body">
            <div class="select-group">
              <scroller>
                <ul class="list">
                       <li v-for="(item, index) in formData" class="item"
                          :key="index"
                          v-on:click="handleItemChange(index)"
                          :class="{ active: item.value === formTemp.value }">
                          <p class="name">{{ item.name }}</p>
                          <p class="time">{{userInfo['time'+ index] ? userInfo['time'+ index] : '请选择' }}</p>
                          <p class="more"><i></i>&gt;</p>
                    </li>
                </ul>
              </scroller>
            </div>
          </div>
        </div>
      </div>
      <Dates v-on:onDateClick="handelDateClick" :show="Showdate" :today="false"></Dates>
    </div>
  </transition>

</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
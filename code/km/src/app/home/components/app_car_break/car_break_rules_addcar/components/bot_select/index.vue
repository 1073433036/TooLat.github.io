<template>
  <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
    <div class="app-car-prefix-bot-select-page" v-show="show">
      <div class="layer">
        <div class="inner">
          <div class="head">
            <div class="close" v-on:click="dismiss()">取消</div>
            <div class="title">{{ title }}</div>
            <div class="complete" v-on:click="submit()">完成</div>
          </div>

          <div class="body">
            <div class="select-group">
              <scroller>
                <ul class="list">
                  <li v-for="(item, index) in formData" class="item"
                    :key="index"
                    v-on:click="handleItemChange(item, index)"
                    :class="{ active: activeIndex === index }">{{ item }}</li>
                </ul>
              </scroller>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
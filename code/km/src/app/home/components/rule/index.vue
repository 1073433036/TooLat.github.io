<template>
  <div class="rule-page">
    <app-header title="常见问题"></app-header>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="my_scroller">
      <div class="wrapper">
        <div class="controller">
          <div class="help">
            <ul class="list" v-for="(item, index) in formTemp.list">
              <li class="item">
                <div class="generalize" @click="switchItem(index)">
                  <span class="num">{{ index + 1 }}、</span>
                  <span class="text">{{ item.post_title }}</span>
                  <div class="right">
                    <i class="sp sp-bottom" v-show="!item.status"></i>
                    <i class="sp sp-top" v-show="item.status"></i>
                  </div>
                  <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
                    <div class="content" v-show="item.status" v-html="item.post_content"></div>
                  </transition>
                </div>
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
<template>
  <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
    <div class="dates-page" v-show="show">
      <div class="layer">
        <div class="inner">
          <div class="head">
            <div class="left">
              <span v-on:click="dismiss()">取消</span>
            </div>
            <div class="right">
              <a class="item ok" v-on:click="submit()">完成</a>
            </div>
          </div>

          <div class="body">
            <div class="select-group" :class="'item-' + child.length">

              <div class="child">
                <scroller ref="province">
                  <ul class="list">
                    <li v-for="(item, index) in 12"
                      :key="index"
                      :class="{ act: province === item }"
                      v-on:click="province = item"
                      class="item">{{ item }}省</li>
                  </ul>
                </scroller>
              </div>

              <div class="child">
                <scroller ref="city">
                  <ul class="list">
                    <li v-for="item in 12"
                      :class="{ act: city === item }"
                      v-on:click="city = item"
                      class="item">{{ item | city }}市</li>
                  </ul>
                </scroller>
              </div>

              <div  class="child">
                <scroller ref="county">
                  <ul class="list">
                    <li v-for="(item, index) in 12"
                      :class="{ act: county === item }"
                      v-on:click="county = item"
                      class="item">{{ item | county }}区</li>
                  </ul>
                </scroller>
              </div>
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
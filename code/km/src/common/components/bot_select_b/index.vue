<template>
  <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
    <div class="bot-select-b-page" v-show="show">
      <div class="layer">
        <div class="inner">
          <div class="head">
            <!-- <div class="close" >取消</div> -->
            <div class="title">{{ title }}</div>
            <div class="close " v-on:click="dismiss()"><i class="cancel"></i></div>
          </div>

          <div class="body">
            <div class="select-group">
              <scroller>
                <ul class="list">
                       <li v-for="(item, index) in formData" class="item"
                    :key="index"
                    v-on:click="handleItemChange(item)"
                    :class="{ active: item.value === formTemp.value }"><p class="name">{{ item.name }}</p><p class="price">{{ item.price }}</p>
                    </li>
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
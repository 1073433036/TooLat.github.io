

<template>
  <div class="message-notify-page">
    <!-- <p class="confirm"  @click="goTo()">确定</p> -->
    <div class="header"><app-header title="选择城市"></app-header></div>
      <div class="college_list_right" >
          <a @click="scrollToByTag(item)" v-for="item in workList" >{{item}}</a>
      </div>
      <scroller
      ref="my_scroller">
      <div class="college_wrapper">
       <div class="subtitle" v-for="(item, idx) in workList" :key="idx">
         <p class="subtitle_title"><a class="tag" :id="item">{{item}}</a></p>
          <div class="subtitle_list" v-for="(i, ix) in rankList[idx]" :key="ix">
            <p  @click="selectGoods(i)" :class="{ 'selectA': i.id == formData.goodsId }">{{i.name}}</p>
         </div>
       </div>

      </div>
    </scroller>

    <!-- <app-footer ref="footer"></app-footer> -->

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

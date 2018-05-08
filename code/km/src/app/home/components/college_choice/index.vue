

<template>
  <div class="message-notify-page">
    <!-- <p class="confirm"  @click="goTo()">确定</p> -->
    <div class="header"><app-header title="选择大学"></app-header></div>
      <div class="college_list_right" >
          <a @click="scrollToByTag(item)" v-for="item in workList" >{{item}}</a>
      </div>
      <scroller
      ref="my_scroller">
      <div class="college_wrapper">
          <p class = "title"> 热门大学</p>
          <div  class="college_list">
            <div  class="college_list_left">
                <span class="list" v-for="(item, index) in schoolList"  @click="selectGoods(item)" :key="index" :class="{ 'select': item.id == formData.goodsId }">
                  {{item.name}}
                </span>
            </div>
          </div>
       <div class="subtitle" v-for="(item, idx) in workList">
         <p class="subtitle_title"><a class="tag" :id="item">{{item}}</a></p>
          <div class="subtitle_list" v-for="(i, ix) in rankList[idx]">
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

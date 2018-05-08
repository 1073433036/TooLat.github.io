<template>
  <div class="increase-detail">
    <app-header title="预览">
      <div class="slot" slot="right">
        <span class="right" v-if=" $route.path == '/issue_detail' " @click="handleTest()">发布</span>
      </div>
    </app-header>
      <scroller>
        <div class="wrapper">
          <div class="controller">
            <h3 class="title">{{articelTitle}}</h3>
            <p class="date">2017/11/24
              <span class="kamun">发布者</span>
            </p>
            <div class="content">
							<div class="text-middle"><img :src="articelImg" alt=""></div>
              <div class="text-top">{{content}}</div>
              <!-- <div class="text-bottom"><a href="#">信用卡提额并不难</a>，只要掌握一定技巧，额度可以飞速提升,信用卡提额并不难，只要掌握一定技巧，额度可以飞速提升，信用卡提额并不难，只要掌握一定技巧，额度可以飞速提升。</div> -->
            </div>
          </div>
        </div>
      </scroller>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>
<template>
  <div class="article-detail-page">
    <app-header title="文章详情"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="title">{{ article.post_title }}</div>
        <div class="author">
          <span class="date">{{ article.published_time }}</span>
          <a href="javascript:">{{ article.post_source }}</a>
        </div>
        <article v-html="article.post_content"></article>
        <div class="reading">
          <span class="read">阅读<span>{{ article.post_hits }}</span></span>
          <a href="javascript:" :class="{'on':state.focusFlag}" @click="getFocus">
            <i class="icon icon-setgood"></i>
            <span>{{ like }}</span>
          </a>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
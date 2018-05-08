<template>
  <div class="app-car-break-code-query-page">
    <app-header title="违章代码查询"></app-header>
    <div class="code-query-wrapper">
      <div class="code-query-search">
        <i class="sp sp-sea"></i>
        <input type="text" v-model="keyword" class="search-input" placeholder="搜索名字/备注/机构名">
      </div>
      <h2>违章代码</h2>
      <div class="code-query-list">
        <div class="query-item">
          <span class="code-item" v-on:click.stop="clickItem(0)">1001A</span>
          <span class="code-item mid-cut" v-on:click.stop="clickItem(1)">1013</span>
          <span class="code-item" v-on:click.stop="clickItem(2)">1014</span>
        </div>
        <div class="query-item">
          <span class="code-item" v-on:click.stop="clickItem(3)">1015</span>
          <span class="code-item mid-cut" v-on:click.stop="clickItem(4)">1016</span>
          <span class="code-item" v-on:click.stop="isShowCodeList = true">&bull;&bull;&bull;</span>
        </div>
      </div>
      <div class="query-code-nav">
        <h3>违章代码</h3>
        <h3>违章内容</h3>
        <h3>罚金</h3>
      </div>
      <div class="query-code-content-wrapper">
        <scroller ref="myCityScroller">
          <div class="query-code-content">
            <div v-for="(item, index) in codeList" class="content-item" :class="{ active: currentCode.id == item.id }">
              <span class="code-title">{{ item.id }}</span>
              <span class="code-content">{{ item.title }}</span>
              <span class="code-money">{{ item.money }}元</span>
            </div>
          </div>
          <p class="tips" v-show="isShowQueryTips">没有查询到相关的违章内容！</p>
        </scroller>
      </div>
    </div>
    <CodeList :isShow="isShowCodeList" :codeList="lastData" v-on:chooseCodeEvent="hanldCodeChoice"></CodeList>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
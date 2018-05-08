<template>
  <div class="user-insure-page">
    <app-header title="保险设置"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="user-info">
            <div class="avatar">
              <img src="~assets/images/avatar.png">
            </div>

            <div class="name-level">
              <h2 class="name">香格里拉</h2>
              <i class="sp sp-level-01"></i>
            </div>

          </div>

          <div class="inner">
            <div class="title">商业险</div>
            <ul class="list">
              <li v-for="(item, index) in formTemp.typeData" class="item" v-on:click="handleSelect(item)">
                <i v-if="item.active || item.id === formData.type.id" class="sp sp-select-ok"></i>
                <i v-else class="sp sp-select-no"></i>
                <div class="body">
                  <span class="tit">{{ item.title }}</span>
                  <span class="desc">{{ item.desc }}</span>
                </div>

                <div class="right">
                  <span :class="{ del: !item.active }">{{ item.text }}</span>
                  <i class="sp sp-right"></i>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </scroller>

    <!-- <insure-money></insure-money> -->
    <!-- <insure-name></insure-name> -->
    <insure-info></insure-info>

    <div class="btn">
      <button type="button" v-on:click="handleSubmit()">下一步</button>
    </div>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
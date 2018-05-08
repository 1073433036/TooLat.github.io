<template>
  <div class="user-insure-name-page">
    <app-header title="保险设置"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="inner">
            <div class="head">
              <i class="sp sp-insure"></i>
              <span>保险公司选择<em>(可多选)</em></span>
            </div>

            <ul class="list">
              <li v-for="(item, index) in formTemp.typeData" class="item" v-on:click="handleSelect(item)">
                <div class="body">
                  <span class="tit">{{ item.title }}</span>
                </div>

                <div class="right">
                  <i v-if="item.active || item.id === formData.data.id" class="sp sp-select-ok"></i>
                  <i v-else class="sp sp-select-no"></i>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </scroller>


    <div class="btn">
      <button type="button" v-on:click="handleSubmit()">下一步</button>
    </div>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
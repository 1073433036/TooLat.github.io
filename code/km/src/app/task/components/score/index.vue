<template>
  <div class="task-score-page">
    <app-header title="评价"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="content">
            <div class="title">
              <span>请选择以下问题评价</span>
            </div>
            <ul class="list">
              <li v-for="(item, index) in formTemp" class="item">
                <div class="left">{{ item.title }}</div>
                <div class="right">
                  <Radio :dataList="item.data" v-model="formData[index]"></Radio>
                </div>
              </li>
            </ul>
          </div>
          <div class="sumbit">
            <button type="button" v-on:click="handleSumbit()">立即提交</button>
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
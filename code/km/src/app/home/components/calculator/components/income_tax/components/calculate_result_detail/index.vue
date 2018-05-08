<template>
  <div class="calculate-result-detail-page">
    <scroller>
      <div class="wrapper">
        <div class="top">
          <ul class="list">
            <li class="radius-lf-li"></li>
            <li class="line-li color-a">个人（元）</li>
            <li class="radius-lr-li color-a">单位（元）</li>
          </ul>
          <ul class="list">
            <li></li>
            <li class="line-li">111.0</li>
            <li>111.0</li>
          </ul>
          <ul class="list">
            <li class="color-a">医疗</li>
            <li class="line-li"></li>
            <li></li>
          </ul>
          <ul class="list">
            <li class="color-a">失业</li>
            <li class="line-li"></li>
            <li></li>
          </ul>
          <ul class="list">
            <li class="color-a">工伤</li>
            <li class="line-li"></li>
            <li></li>
          </ul>
          <ul class="list">
            <li class="color-a">生育</li>
            <li class="line-li"></li>
            <li></li>
          </ul>
          <ul class="list">
            <li class="color-a">公积金</li>
            <li class="line-li"></li>
            <li></li>
          </ul>
          <ul class="list">
            <li class="radius-bf-li color-a">总计</li>
            <li class="line-li"></li>
            <li class="radius-br-li"></li>
          </ul>
        </div>

        <div class="payment-basic">
          <h3>缴纳基数（元）</h3>
          <ul class="list">
            <li class="radius-lf-li">养老15689</li>
            <li class="lr radius-lr-li"></li>
          </ul>
          <ul class="list">
            <li></li>
            <li class="lr"></li>
          </ul>
          <ul class="list">
            <li class="radius-bf-li"></li>
            <li class="lr radius-br-li"></li>
          </ul>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
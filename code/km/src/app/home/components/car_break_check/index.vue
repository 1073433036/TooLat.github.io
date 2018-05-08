<template>
  <main class="car-break-check-page">
    <app-header title="车险车检"></app-header>
    <scroller ref="myscroller">

      <div class="circle_box">
        <div class="bg"></div>
        <div class="cont-wrapper">
          <div class="progress-wrapper"></div>
          <div class="day">{{aday}}</div>
          <div class="day-tip">距年检可预约天数</div>
          <div class="cont-tip">暂无需年检</div>
        </div>
        <div class="circle">
            <div class="detail"></div>
        </div>
      </div>
     

      <div class="tip-top">目前尚无需进行年检，可放心驾驶</div>
      <div class="tip-bottom">您可于{{year}}年{{month}}月{{date}}日 预约年检办理</div>
      <div :class="['deal-btn', { off: true }]" @click="handleCheck">立即办理</div>

    </scroller>
  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

<template>
  <div class="video_play">
    <app-header title="视频讲解"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="vid-wrap">
            <video class="video" autoplay="autoplay" controls="controls">
              <source src="http://res.kamengjinfu.com/kameng.mp4" type="video/mp4">
            </video>
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
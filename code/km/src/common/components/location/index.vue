<template>
  <div class="location-page">
    <div class="location-layer">
        <div class="wrapper">
          <div class="inner">
            <div class="head">
              <span>当前：广州市</span>
              <a class="close">关闭</a>
            </div>
          </div>

          <div class="select-group">
            <div class="list">
              <scroller>
                <div class="prop">
                  <div v-for="item in 20" class="item">北京市</div>
                </div>
              </scroller>
            </div>
            <div class="list">
              <scroller>
                <div class="city">
                  <div v-for="item in 20" class="item">广州市</div>
                </div>
              </scroller>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
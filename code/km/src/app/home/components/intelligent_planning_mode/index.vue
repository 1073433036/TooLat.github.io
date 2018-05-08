<template>
  <div class="intelligentPlanningMode">
    <app-header title="计划模式"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="form-group" >
            <ul class="list">
              <li class="item">
                <div class="box">
                  <div class="recommend">
                    <img class="photo-cont" alt="图片" src="~assets/images/card_manage/plan2.png"   @click="addCustom" />
                    <!-- <input class="photo-cont" type="file" accept="image/*" @change="uploadLocalPhoto"> -->
                  </div>
                </div>
              </li>
            </ul>
            <ul class="list">
              <li class="item">
                <div class="box">
                  <div class="recommend">
                    <img class="photo-cont" alt="图片" src="~assets/images/card_manage/plan1.png"  @click="masterRecommend" />
                  </div>
                </div>
              </li>
            </ul>


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

<template>
  <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
    <div class="add-plan" v-show="show">
      <div class="layer">
        <div class="inner">
         
          <div class="body">
            <div class="select-group">
              <!-- <scroller> -->
                <ul class="info_box">
                    <li class="item" >
                      <span class="left">房屋面积：</span>
                      <span class="right">2018/04/21  15:30:31</span>
                    </li>
                    <li class="item" >
                      <span class="left">房屋面积：</span>
                      <span class="right">房屋面积</span>
                    </li>
                     <li class="item" >
                      <span class="left">房屋面积：</span>
                      <span class="right">房屋面积</span>
                    </li> 
                    <li class="item" >
                      <span class="left">消费笔数：2笔</span>
                      <span class="right">还款笔数：2笔</span>
                    </li> 
                    <li class="item" >
                      <span class="left">房屋面积：</span>
                      <span class="right">房屋面积</span>
                    </li>
                     <li class="item" >
                      <span class="left">消费费率：0.73%s</span>
                      <span class="right">还款手续费：1元/笔</i></span>
                    </li>
                </ul>
              <!-- </scroller> -->
               <div class="standard">*手续费以实际执行为准</div>
            </div>
          </div>

          <div class="bot">
            <p class="close" v-on:click="dismiss()">取消订单</p>
            <p class="complete" v-on:click="submit()">确认订单</p>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
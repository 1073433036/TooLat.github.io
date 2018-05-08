<template>
  <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
    <div class="car_pay_type" v-show="show">
      <div class="layer">
        <div class="inner">
          <div class="head">
            <!-- <div class="close" >取消</div> -->
            <div class="title">{{ title }}</div>
            <div class="close " v-on:click="dismiss()"><i class="cancel"></i></div>
          </div>

          <div class="body">
            <div class="select-group">
              <scroller>
              <div class="select-group-content">
                <ul class="list">
                  <li v-for="(item, index) in formData" class="item"
                    :key="index"
                    v-on:click="handleItemChange(item)"
                    :class="{ active: item.value === formTemp.value }">
                     <p class="name"><span class="pay_type"> {{ item.name }}</span>
                    </p>
                    <p class="price">
                      <i class="select"></i>
                    </p>
                    </li>
                </ul>
                <p class="toPay" :class="{ 'on': active }" @click="submit">立即支付</p>
              </div>
                
              </scroller>
            </div>
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
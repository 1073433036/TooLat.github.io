<template>
  <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
    <div class="bot-select-page" v-show="show">
      <div class="layer">
        <div class="inner">
          <div class="head">
            <div class="close" v-on:click="dismiss()">取消</div>
            <div class="title">{{ title }}</div>
            <div class="complete" v-on:click="submit()">完成</div>
          </div>

          <div class="body">
            <div class="select-group">
              <scroller>
                <ul class="list">
                  <li v-for="(item, index) in formData" v-if="isBankList" class="item"
                      :key="index"
                      v-on:click="handleItemChange(item)"
                      :class="{ active: item.id === formTemp.id }">{{ item.bank_name }}</li>
                  <li v-if="!isBankList" v-for="(item, index) in formData" class="item"
                    :key="index"
                    v-on:click="handleItemChange(item)"
                    :class="{ active: item.value === formTemp.value && item.mcc === formTemp.mcc && item.code === formTemp.code   }">{{ item.name }}</li>
                </ul>
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

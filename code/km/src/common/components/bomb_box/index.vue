<template>
  <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
    <div class="bomb-box-page" v-show="show">
      <div class="bomb-box-layer">
        <div class="bomb-box-inner">
          <div class="bomb-box-body">
            <div class="bomb-box-select-group">
              <ul class="bomb-box-list">
                <li v-for="(item, index) in formData" class="item"
                  :key="index"
                  v-on:click="handleItemChange(item)"
                  :class="{ active: item.value === formTemp.value && item.name === formTemp.name && beforeIndex == formIndex }">
                  {{ item.name }}
                </li>
                <slot></slot>
              </ul>
            </div>
          </div>

          <div class="bomb-box-foot">
            <button v-on:click="dismiss()">取消</button>
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
<template>
  <div class="radio-wrappe">
    <label v-for="(item, index) in dataList" :key="index" class="radio" :class="{ 'radio-checked': currentValue == item.value }">
      <span class="radio-inner"></span>
      <input type="radio" :checked="currentValue == item.value" @change="change(item)" class="radio-input">
      <span class="sta">{{ item.name }}</span>
    </label>
    <slot></slot>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>

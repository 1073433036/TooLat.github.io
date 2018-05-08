<template>
  <label class="checkbox-wrappe">
    <span class="checkbox" :class="{ 'checkbox-checked': currentValue }">
      <span class="checkbox-inner"></span>
      <input type="checkbox" :checked="currentValue" @change="change" class="checkbox-input">
    </span>
    <slot></slot>
  </label>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
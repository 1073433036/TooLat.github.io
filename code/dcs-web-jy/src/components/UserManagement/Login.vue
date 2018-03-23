<template>
  <a @click.stop="userLogin">登录</a>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import RouteHelper from '../../router/RouteHelper'

  @Component
  export default class Login extends Vue {
    userLogin() {
      let routeHelper = new RouteHelper(this.$router);
      routeHelper.gotoPath('/main');
    }
  }
</script>

<style lang="scss" scoped>
  a {
    width: 60px;
    position: relative;
    display: block;
    margin: 0 auto;
    cursor: pointer;
    font-size: 16px;
    text-align: center;
  }
</style>
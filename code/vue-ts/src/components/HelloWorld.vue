<template>
  <main id="HelloWorld">
    {{ msg }}
    {{ message_global }}
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  @Component
  export default class HelloWorld extends Vue {
    @Getter('systemStore/message_global') message_global
    @Action('systemStore/storeMessage_global') storeMessage_global
    
    msg: number = 0

    mounted() {
      setTimeout(() => {
        this.storeMessage_global('Hello')
      }, 2000)
    }
  }
</script>

<style lang='scss' scoped>
#HelloWorld {
  
}
</style>
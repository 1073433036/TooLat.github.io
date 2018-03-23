<template>
    <nav id="CommonNavMenu">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item v-for="(item,key) in NavMenu"
                      :key="key"
                      :index="item.value" >{{item.label}}</el-menu-item>
      </el-menu>
    </nav>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop } from 'vue-property-decorator'
  import NavMenuConfig from '../../config/NavMenuConfig'
  @Component({
    components:{

    }
  })
  export default class CommonNavMenu extends Vue {
    @Prop()
    NavMenuName
    get NavMenu(){
      return NavMenuConfig[this.NavMenuName]
    }
    activeIndex:string=''

    handleSelect(par:string){
      this.$emit('handleSelect',par)
    }
    mounted(){
      this.activeIndex=this.NavMenu[0].value
    }
  }
</script>

<style lang="scss" scoped>
  #CommonNavMenu{
    color: #2d2f33;
    height: 60px;
    margin-bottom: 2px;
    .el-menu-demo{
      padding-left: 60px;
      .el-menu-item{
        margin-right: 100px;
        font-size: 16px;
      }
      .is-active{
        font-weight: bold;
      }
    }
  }
</style>

<template>
  <main class="threshold" v-drag>
    <header class="threshold_header">
      {{thresholdType}}-阈值信息-{{typeName}}
      <i class="el-icon-close threshold_close" @click="thresholdClose"></i>
    </header>
    <section class="threshold_main">
      <el-table
        :data="thresholdData"
        max-height="400"
        border
        style="width: 100%">
        <el-table-column
          prop="key"
          align="center"
          label="时效">
        </el-table-column>
        <el-table-column
          prop="value"
          align="center"
          label="阈值(mm)">
        </el-table-column>
      </el-table>
    </section>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop,Watch } from 'vue-property-decorator'

  @Component
  export default class ThresholdPopup extends Vue {
    get thresholdData () {
      let arrObject:any=[]
      for(let key in JSON.parse(this.YuZhiInfo.value.threshold)){
        if(key.indexOf('p')!=-1){
          let obj:any={
            key:`过去${key.replace('p','')}小时`,
            value:JSON.parse(this.YuZhiInfo.value.threshold)[key]
          }
          arrObject.push(obj)
        }
        if(key.indexOf('r')!=-1){
          let obj:any={
            key:`未来${key.replace('r','')}小时`,
            value:JSON.parse(this.YuZhiInfo.value.threshold)[key]
          }
          arrObject.push(obj)
        }
      }
      return arrObject||[]
    }
    get thresholdType(){
      return this.YuZhiInfo.type||''
    }
    get typeName() {
      return this.YuZhiInfo.value.name||''
    }
    @Prop()
    thresholdClose
    @Prop()
    YuZhiInfo
    @Watch('YuZhiInfo')
    changeYuZhiInfo(val){

    }
    mounted(){

    }

  }
</script>

<style lang="scss" scoped>
  .threshold{
    box-shadow: 0px 0px 15px rgba(53, 53, 53, 0.30);
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -210px;
    margin-top: -240px;
    width:420px;
    overflow: hidden;
    background: white;
    z-index: 1000;
    .threshold_header{
      position: relative;
      line-height: 36px;
      height: 36px;
      color: white;
      background: #11A9F5;
      cursor: move;
      padding-left: 20px;
      font-size: 14px;
      font-family: "Microsoft YaHei";
      padding-right: 40px;
      overflow: hidden;
      .threshold_close{
        position: absolute;
        text-align: center;
        cursor: pointer;
        font-size: 18px;
        top: 0;
        right: 0;
        height: 36px;
        width: 36px;
        color: white;
        line-height: 36px;
      }
    }
    .threshold_main{
      width:380px;
      margin:10px 20px;
    }
  }
</style>

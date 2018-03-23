<template>
  <main class="hourRain" v-drag>
    <header class="hourRain_header">
      {{hourRainType}}-小时雨量-{{typeName}}
      <i class="el-icon-close hourRain_close" @click="hourRainClose"></i>
    </header>
    <div class="hourRain_title">
      <div>
        <span :class="{'current':!rainBtn}" @click="clickSwitch('one')">过去雨量</span>
        <span :class="{'current':rainBtn}" @click="clickSwitch('two')">未来雨量</span>
      </div>
    </div>
    <section class="hourRain_main">
      <div id="TableOne" style="height: 100%; width: 100%"></div>
    </section>
  </main>
</template>

<script lang="ts">
  import Highcharts from  'highcharts'
  import Vue from 'vue'
  import { Component,Prop,Watch } from 'vue-property-decorator'

  let chartImg
  @Component
  export default class HourRainPopup extends Vue {
    rainBtn: boolean = false
    get hourRainType() {
      return this.hourRainInfo.type || '--'
    }
    get typeName() {
      return this.hourRainInfo.value.name || '--'
    }
    get hourRainData() {
      let arrkey1:any = [],
          arrkey2:any = [],
          arrObject1:any = [],
          arrObject2:any = [];
      for(let key in JSON.parse(this.hourRainInfo.value.rain)) {
        if(key.indexOf('p') != -1) {
          if(key.replace('p','') == '0') {
            arrkey1.push(`现在`);
          } else {
            arrkey1.push(`过去${key.replace('p','')}小时`);
          }
          arrObject1.push(JSON.parse(this.hourRainInfo.value.rain)[key]);
        }
        if(key.indexOf('r') != -1) {
          arrkey2.push(`未来${key.replace('r','')}小时`);
          arrObject2.push(JSON.parse(this.hourRainInfo.value.rain)[key]);
        }
      }
      return [[arrkey1, arrObject1], [arrkey2, arrObject2]] || []
    }
    @Prop()
    hourRainClose
    @Prop()
    hourRainInfo

    @Watch('hourRainData')
    changehourRainInfo(val): void {
      if(this.rainBtn) {
        this.creatEchart(this.hourRainData[1]);
      } else {
        this.creatEchart(val[0]);
        console.log('')
      }
    }

    mounted(): void {
      this.creatEchart(this.hourRainData[0])
    }

    //创建表格
    creatEchart(params): void {
      chartImg=Highcharts['chart']('TableOne', {
        chart: {
          type: 'line'
        },
        credits:{
          enabled:false
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        yAxis: {
          title: {
            text: ''
          }
        },
        xAxis: {
          categories: params[0]
        },
        legend: {
          layout: 'vertical',
          align: 'center',
          verticalAlign: 'top',
          enabled:false
        },
        series: [
          {
          name: '雨量(mm)',
          data: params[1]
        }
        ],
      })
    }

    //过去雨量和未来雨量切换
    clickSwitch(par): void {
      switch (par){
        case 'one':
          if(!this.rainBtn) return
          this.rainBtn = false
          this.creatEchart(this.hourRainData[0])
          break
        case 'two':
          if(this.rainBtn) return
          this.rainBtn = true
          this.creatEchart(this.hourRainData[1])
          break
      }
    }
  }
</script>

<style lang="scss" scoped>
.hourRain{
  box-shadow: 0px 0px 15px rgba(53, 53, 53, 0.30);
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -350px;
  margin-top: -255px;
  width:700px;
  height: 510px;
  background: white;
  z-index: 1000000;
  .hourRain_header{
    line-height: 36px;
    height: 36px;
    color: white;
    background: #11A9F5;
    cursor: move;
    position: relative;
    padding-left: 20px;
    padding-right: 40px;
    overflow: hidden;
    font-family: "Microsoft YaHei";
    .hourRain_close{
      cursor: pointer;
      font-size: 18px;
      position: absolute;
      top: 0;
      right: 0;
      height: 36px;
      text-align: center;
      width: 36px;
      color: white;
      line-height: 36px;
    }
  }
  .hourRain_title{
    height: 30px;
    padding: 10px 0px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    >div{
      position: absolute;
      height: 30px;
      left:50%;
      top:10px;
      margin-left: -72px;
      span{
        background: #F5F5F5;
        cursor: pointer;
        width: 72px;
        line-height: 30px;
        float: left;
        text-align: center;
        margin-right: 5px;
      }
      span:hover{
        color: #11A9F5;
      }
      span.current{
        background: #11A9F5;
        color: white;
      }
    }
  }
  .hourRain_main{
    width: 660px;
    margin-left: 20px;
    height: 420px;
  }
}
</style>

<template>
  <section id="disaster-judge">
    <h1 class="section-title">灾害天气研判</h1>
    <div class="judge-info-wrapper">
      <el-collapse v-model="activeNames">
        <el-collapse-item v-for="item in disasters" :key="item.name" :name="item.name">
          <!-- <div class="judge-time">{{item.datetime}}</div> -->
          <template slot="title">
            <i class="header-icon el-icon-warning judge-info-title"></i>{{item.title}}
          </template>
          <div v-html="item.content"></div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </section>
</template>
<script lang="ts">
  import Vue from 'vue'
  import moment from 'moment'
  import { Component } from 'vue-property-decorator'

  interface JudgeItem {
    title: string
    content: string
    datetime: string
    name: string
  }

  @Component
  export default class DisasterJudge extends Vue{
    activeNames: string[] = ['typhoon', 'rain', 'wind', 'geology', 'thunder']
    disasterTypes: string[] = []
    disasters: JudgeItem[] = [
      {
        title: '台风概况',
        content: '2017年第12号强台风天鸽，2017年10月24日16时位于北纬23.2°、东经112.2°，距离揭阳市123.2公里，最大风速15m/s，中心气压1004hPa，近中心最大风力12级。</br>预计未来12小时将影响本市，带来降雨和大风天气。',
        datetime: moment().format('YYYY-MM-DD HH:mm'),
        name: 'typhoon'
      },
      {
        title: '雨情分析',
        content: '据统计，30日11时到31日11时（过去24小时），全市平均雨量10.11mm，揭东区埔田镇万竹园（G2998）录得最大雨量14.4mm。</br>预计未来3小时内全市平均雨量3mm，将不会有大雨及以上级别降雨天气出现，最大雨量将出现在揭东区白塔镇3.5mm。',
        datetime: moment().format('YYYY-MM-DD HH:mm'),
        name: 'rain'
      },
      {
        title: '大风分析',
        content: '据统计，31日10时到31日11时（过去1小时），盐田区背仔角站（G3690）录得最大瞬时风速22.6m/s，8-9级。</br>全市有2.86%(4个)气象站录得8~9级大风，11.43%(16个)气象站录得6~7级大风。</br>受6~7级及以上大风等级影响的区域包括榕城、揭东、揭西、普宁全区，惠来大部分地区。</br>预计未来6小时内，受6~7级及以上大风等级影响的区域有：榕城区（）、揭东区（）、普宁（）、惠来（）',
        datetime: moment().format('YYYY-MM-DD HH:mm'),
        name: 'wind'
      },
      {
        title: '地质灾害分析',
        content: '根据临界降雨量判据法，未来3小时，预计全市Ⅱ级风险隐患点3个（揭东县玉湖镇坪上村、揭东县新亨镇五房村宾逢下、普宁市梅林镇磜头村），Ⅲ级风险隐患点5个（揭东县新亨镇白石村白石老村、普宁市里湖镇龙兴村龙兴、普宁市大坪镇大坪村下径子、普宁市下架山镇横溪村新乡）。',
        datetime: moment().format('YYYY-MM-DD HH:mm'),
        name: 'geology'
      },
      {
        title: '强对流天气分析',
        content: '揭阳市过去6分钟出现弱雷，受影响的街道23个。</br>预计未来1小时，本市还将受雷电影响，受影响街道42个：榕城区（新兴街道、榕华街道、中山街道、西马街道、东兴街道、榕东街道、仙桥街道、梅云街道、东升街道、东阳街道）、揭东区（白塔镇、霖磐镇、桂岭镇、月城镇、玉湖镇、新亨镇）',
        datetime: moment().format('YYYY-MM-DD HH:mm'),
        name: 'thunder'
      }
    ]
  }
</script>
<style lang="scss" scoped>
  @import '../../styles/theme.scss';

  #disaster-judge {
    width: 100%;
    height: 720px;
    position: relative;
    .judge-info-wrapper {
      width: calc(100% - 40px);
      max-height: 660px;
      position: relative;
      padding: 0px 20px;
      margin-bottom: 10px;
      overflow-y: auto;
      @include scrollStyle;
      .judge-time {
        position: absolute;
        top: 15px;
        right: 50px;
        line-height: 20px;
      }
      .judge-info-title {
        color: darkorange;
        margin-right: 5px;
      }
    }
  }
</style>

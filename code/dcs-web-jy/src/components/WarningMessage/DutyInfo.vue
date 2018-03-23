<template>
  <section id="duty-info">
    <h1 class="section-title">值班信息</h1>
    <a class="more-info">更多</a>
    <div class="duty-info-wrapper" v-loading="isLoading">
      <div class="duty-info-table">
        <ul class="duty-info-title">
          <li v-for="(val, index) in dutyDay" :key="index" v-text="val" 
              @click.stop="selectDay(index)"
              :class="{'select-day': selectedIndex === index}"></li>
        </ul>
        <div class="duty-info-list">
          <ul>
            <li><span>主班</span>{{dutyData.captain_day || ''}}</li>
            <li><span>副班</span>{{dutyData.vice_day || ''}}</li>
            <li><span>夜班</span>{{dutyData.captain_night || ''}}</li>
            <li><span>办公班</span>{{dutyData.office || ''}}</li>
            <li><span>休息</span>{{dutyData.vacation || ''}}</li>
            <li><span>备注</span>{{dutyData.remark || ''}}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  import moment from 'moment'
  import { Component } from 'vue-property-decorator'
  import Duty from '../../interface/DutyInfo'
  import DutyHttp from '../../util/DutyHttp'


  @Component
  export default class DutyInfo extends Vue {
    dutyDay: string[] = ['昨日', '今日', '明日']
    dutyInfo: any[] = []
    selectedIndex: number = 1
    isLoading: boolean = false
    
    get dutyData() {
      return this.dutyInfo[this.selectedIndex] || {};
    }

    mounted(): void {
      let today = Date.now();
      let yesterday = today - 24 * 3600000,
          tomorrow = today + 24 * 3600000;
      [yesterday, today, tomorrow].forEach((el, i) => {
        this.getDutyInfo(moment(el).format('YYYY-MM-DD'), i);
      });
    }

    selectDay(index: number): void {
      if(this.selectedIndex === index)
        return;
      this.selectedIndex = index;
    }

    async getDutyInfo(datetime: string, index: number): Promise<void> {
      let dutyHttp = new DutyHttp();
      let dutyInfo: any = await dutyHttp.getDutyAllInfos({dutydate: datetime});
      if(dutyInfo.length) {
        this.dutyInfo[index] = dutyInfo[0];
      } else {
        this.dutyInfo[index] = {};
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/theme.scss';
  $contHeight: 400px;
  $trCount: 4;

  #duty-info {
    width: 100%;
    height: $contHeight;
    position: relative;
    .duty-info-wrapper {
      width: 100%;
      height: calc(100% - 50px);
      position: relative;
      background-color: white;
      .duty-info-table {
        width: 100%;
        height: 100%;
        position: relative;
        .duty-info-title {
          width: calc(100% - 20px);
          height: 40px;
          position: relative;
          display: block;
          padding: 0 10px;
          font-size: 0;
          text-align: center;
          >li {
            width: 80px;
            height: 100%;
            position: relative;
            display: inline-block;
            vertical-align: top;
            line-height: 40px;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            background-color: #eee;
            margin-left: 1px;
            cursor: pointer;
          }
          .select-day {
            background-color: $themeColor;
            color: white;
          }
        }
        .duty-info-list {
          width: calc(100% - 20px);
          position: relative;
          margin: 10px;
          border: 1px solid #ddd; /*no*/

          >ul {
            width: 100%;
            height: 100%;
            position: relative;
            display: block;
            font-size: 0;
            >li {
              width: 100%;
              height: calc(288px / 6);
              position: relative;
              display: inline-block;
              vertical-align: top;
              line-height: 50px;
              font-size: 14px;
              text-align: left;
              text-indent: 10px;
              overflow: hidden;
              >span {
                width: 60px;
                height: 100%;
                padding-right: 5px;
                display: inline-block;
              }
            }
          }
        }
      }
    }
  }
</style>

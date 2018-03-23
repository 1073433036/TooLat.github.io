<template>
  <section id="disaster-warning">
    <div class="disaster-types">
      <ul>
        <li v-for="(item, key) in disasterData" :key="key" 
            @click.stop="selectDisaster(item, key)"
            :class="[{'selected-type': selectedType === key}]">{{item.text}}</li>
      </ul>
    </div>
    <div class="disaster-operation">
      <div class="disaster-timeline">
        <div class="disaster-datetime">{{dataDatetime}}</div>
        <div class="disaster-datetime-list">
          <ul>
            <li v-for="(item, index) in dateArray" :key="item" :title="item" 
                @click.stop="selectDisasterDate(index)"></li>
          </ul>
        </div>
      </div>
      <div class="disaster-data-type" v-if="isShowDataType">
        <div class="disaster-data-select">色斑图</div>
        <div class="disaster-data-select">表格</div>
      </div>
      <div class="disaster-image-wrapper">
        <img :src="imageUrl" />
      </div>
      <div class="disaster-towns-table">

      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  import moment from 'moment'
  import { Component } from 'vue-property-decorator'
  import { Getter } from 'vuex-class'
  import { PRIVATE_URL } from '../../config/HttpUrlConf'
  import Region from '../../interface/Region'
  import DisasterEffect from '../../interface/DisasterWarning'
  import DisasterAnalysis from '../../util/DisasterAnalysis'

  interface Disasters {
    rain?: DisasterEffect[][][]
    wind?: DisasterEffect[][][]
    geology?: DisasterEffect[][][]
    storm?: DisasterEffect[][][]
    thunder?: DisasterEffect[][][]
  }

  interface DisasterItem {
    text: string, 
    dateArray: string[],
    effectTowns?: DisasterEffect[][][], 
    imageArray?: string[]
  }

  @Component
  export default class DisasterWarning extends Vue {
    @Getter('systemStore/region_global') regionGlobal

    selectedType: string = 'rain'
    selectedIndex: number = 0
    selectedDate: string = moment().format('YYYY-MM-DD HH:00')
    selectedEffectTowns: DisasterEffect[][][] = []
    disasterData = {
      rain: { text: '暴雨', dateArray: [], effectTowns: [], imageArray: [] },
      wind: { text: '大风', dateArray: [], effectTowns: [], imageArray: [] },
      geology: { text: '地质灾害', dateArray: [], effectTowns: [], imageArray: [] },
      torrent: { text: '洪涝', dateArray: [], imageArray: [] },
      waterlog: { text: '内涝', dateArray: [], imageArray: [] },
      thunder: { text: '雷电', dateArray: [], effectTowns: [] }
    }
    isShowDataType: boolean = false

    get dateArray(): string[] {
      return this.disasterData[this.selectedType].dateArray || [];
    }

    get imageArray(): string[] {
      return this.disasterData[this.selectedType].imageArray || [];
    }

    get dataDatetime(): string {
      return this.dateArray[this.selectedIndex] || '';
    }

    get imageUrl(): string {
      return this.imageArray[this.selectedIndex] || '';
    }

    mounted(): void {
      this.getDisasterImages(this.selectedType);
      this.disasterAnalysis();
    }

    selectDisaster(data: DisasterItem, key: string): void {
      if(this.selectedType === key)
        return;
      if(data.hasOwnProperty('effectTowns')) {
        this.selectedEffectTowns = data.effectTowns;
        if(data.hasOwnProperty('imageArray'))
          this.isShowDataType = true;
        return;
      }
      this.isShowDataType = false;
    }

    selectDisasterDate(index: number): void {
      if(this.selectedIndex === index)
        return;
      this.selectedIndex = index;
    }

    async getDisasterImages(type: string): Promise<void> {
      let ms: number = Date.now();
      let datetime: string = '';
      if(type === 'rain') {
        ms -= (ms%300000 + 900000);
        datetime = moment(ms).format('YYYYMMDDHHmm00');
      } else {
        if(new Date(ms).getMinutes() <= 15)
          ms -= 3600000;    //倒退一小时, 模式文件生成时间为每小时前15分钟左右
        datetime = moment(ms).format('YYYYMMDDHH0000');
      }
      
      let disasterAnalysis = new DisasterAnalysis(PRIVATE_URL);
      let data: string[] = await disasterAnalysis.getDisasterImage(type, type === 'wind' || type === 'rain' ? 1 : 3);
      console.log(data);
      if(Array.isArray(data) && !data.length)
        return;
      if(['waterlog', 'torrent', 'geology'].includes(type)) {
        let past1h = moment(ms - 3600000).format('YYYYMMDDHH0000'),
            past2h = moment(ms - 7200000).format('YYYYMMDDHH0000');
        let imgArray: string[] = [];
        [past1h, past2h, datetime].forEach((el, i) => {
          let arr = data.filter(val => val.indexOf(el) >= 0);
          if(!arr.length) {
            if(i < 2)
              imgArray.push('');
            else
              imgArray.push('', '', '', '');
          } else {
            if(i < 2)
              imgArray.push(arr[0]);
            else
              imgArray = imgArray.concat(arr);
          }
        })
        this.disasterData[type].imageArray = imgArray;
        //过去2、1小时, 当前, 未来1、2、3小时
        this.disasterData[type].dateArray = [-2, -1, 0, 1, 2, 3].map(el => moment(ms + el*3600000).format('YYYY-MM-DD HH:00'));
      }
      else if(type === 'wind') {
        let arr = data.filter(el => el.indexOf(datetime) >= 0);
        //未来3、6、12、24、48、72小时
        this.disasterData[type].dateArray = [3, 6, 12, 24, 48, 72].map(el => moment(ms + el*3600000).format('YYYY-MM-DD HH:00'));
        this.disasterData[type].imageArray = data;
      }
      else if(type.indexOf('rain') !== -1) {
        let arr = data.filter(el => el.indexOf(datetime) >= 0);
        //过去3、2、1小时, 现在, 未来1、2、3小时
        this.disasterData[type].dateArray = [-3, -2, -1, 0, 1, 2, 3].map(el => moment(ms + el*3600000).format('YYYY-MM-DD HH:00'));
        this.disasterData[type].imageArray = data;
      }
      console.log(type, this.disasterData[type]);
    }

    async disasterAnalysis(): Promise<void> {
      let ms: number = Date.now();
      ms -= (ms%300000 + 900000);  //5分钟取余, 再回退15分钟取数据
      let datetime: string = moment(ms).format('YYYY-MM-DD HH:mm:00');
      let regionInfo: Region = this.regionGlobal;
      let disasterAnalysis = new DisasterAnalysis(PRIVATE_URL);
      let data: DisasterEffect[] = await disasterAnalysis.getDisasterByDatetime(datetime, regionInfo.cityId, regionInfo.countyId);
      if(!data.length) {
        for(let i in this.disasterData) {
          if(this.disasterData[i].hasOwnProperty('effectTowns'))
            this.disasterData[i].effectTowns = [];
        }
      } else {
        let disasters: Disasters = {
          rain: [],
          wind: [],
          geology: [],
          thunder: []
        }
        for(let item of data) {
          let type = item.type,
              leadtime = item.leadtime,
              level = item.level;
          //雷电预报时效是10、20、30、40、50、60分钟
          if(leadtime > 3 && type !== 'thunder')
              continue;
          if(!disasters[type][leadtime])
            disasters[type][leadtime] = [];
          if(!disasters[type][leadtime][level])
            disasters[type][leadtime][level] = [];
          disasters[type][leadtime][level].push(item);
        }
        //补全数组中空缺的值
        for(let i in disasters) {
          if(!disasters[i].length)
            continue;
          disasters[i].forEach((element, index, arr) => {
            if(!element)
              arr[index] = [];
            else {
              arr[index].forEach((ele, subIndex, subArr) => {
                if(!ele)
                  subArr[subIndex] = [];
              });
            }
          });
          this.disasterData[i].effectTowns = disasters[i];
        }
        console.log(disasters);
      }
    }
  }
</script>

<style lang="scss" scoped>
  #disaster-warning {
    width: 100%;
    height: 720px;
    position: relative;
    .disaster-types {
      width: 100%;
      position: relative;
      padding-top: 20px;
      text-align: center;
      >ul {
        width: 100%;
        position: relative;
        display: block;
        font-size: 0;
        >li {
          width: 80px;
          height: 40px;
          position: relative;
          display: inline-block;
          vertical-align: top;
          margin-right: 1px;  /*no*/
          background-color: #eee;
          line-height: 40px;
          text-align: center;
          font-size: 14px;
          cursor: pointer;
          &:last-of-type {
            margin-right: 0;
          }
        }
      }
    }
  }
</style>

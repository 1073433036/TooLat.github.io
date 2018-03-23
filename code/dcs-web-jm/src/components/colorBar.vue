<template>
    <div id="colorbar" class="ns" v-if="colorOptions.length">
      <div class="colorbar-minimize" v-if="isMinimize" title="展开色标" @click.stop="toggleColorBar"></div>
      <div class="colorbar-maximize" v-else>
        <div class="color-minimize-btn" title="最小化色标" @click.stop="toggleColorBar">-</div>
        <div class="color-element">
          <em :class="{'disabled-operate': disabledChange}" @click="changeColorTable('prev')"><a></a></em>
          <span @click="toggleColorOptionsShow">要素</span>
          <em :class="{'disabled-operate': disabledChange}" @click="changeColorTable('next')"><a></a></em>
        </div>
        <div class="color-wrapper">
          <span>{{ colorUnit }}</span>
          <ul :style="{maxHeight: defaultHeight+'px'}">
            <li v-for="item in colorArray" :style="{height: item.rowHeight}">
              <em :style="{backgroundColor: item.color}"></em>
              <span v-if="item.show">{{ item.value }}</span>
            </li>
          </ul>
        </div>
        <div class="color-options" v-show="colorOptionsShow">
          <ul>
            <li v-for="opt in colorTypeOptions" @click="selectColor(opt)">{{ opt.label }}</li>
          </ul>
        </div>
      </div>
    </div>
</template>
<script>
  export default {
    //colorTypeData: { type, flag, label }
    props: ['colorDeleteFlag', 'colorAddFlag', 'colorTypeData', 'deleteColorType'],
    data() {
      return {
        colorFlag: {},
        colorData: {},
        colorArray: [],
        colorOptions: [],
        selectedColor: '',
        colorUnit: '',
        defaultHeight: 300,
        defaultRowHeight: 20,
        rowHeight: '',
        colorOptionsShow: false,
        isMinimize: false,
        modelColorConfig: {
          torrent: [
            {value: 0.1, color: 'blue'},
            {value: 2.6, color: 'yellow'},
            {value: 8, color: 'orange'},
            {value: 16, color: 'red'}
          ],
          waterlogging: [
            {value: 0, color: 'chartreuse'},
            {value: 5, color: 'yellow'},
            {value: 15, color: 'red'}
          ],
          fire: [
            {value: 1, color: 'rgba(219, 0, 0, 192)'},
            {value: 30, color: 'rgba(240, 78, 53, 192)'},
            {value: 60, color: 'rgba(247, 109, 84, 192)'},
            {value: 90, color: 'rgba(252, 141, 121, 192)'},
            {value: 120, color: 'rgba(255, 172, 161, 192)'},
            {value: 150, color: 'rgba(255, 204, 204, 192)'}
          ],
          airpollution: [
            {value: "1e-5", color: "rgba(30,60,255,1)"},
            //{value: "1.5e-5", color: "rgba(0,200,200,1)"},
            {value: "2e-5", color: "rgba(0,210,140,1)"},
            //{value: "2.5e-5", color: "rgba(160,230,50,1)"},
            {value: "3e-5", color: "rgba(230,220,50,1)"},
            //{value: "3.5e-5", color: "rgba(240,130,40,1)"},
            {value: "4e-5", color: "rgba(250,60,60,1)"},
            {value: "1e-4", color: "rgba(240,0,130,1)"}
          ],
          geology: [
            {value: 'IV', color: "rgb(0, 0, 255)"},
            {value: 'III', color: "rgb(229, 244, 1)"},
            {value: 'II', color: "rgb(253, 176, 0)"},
            {value: 'I', color: "rgb(246, 19, 0)"}
          ]
        },
        elementUnit: {
          't2mm': '(摄氏度)',
          'visi': '(米)',
          'mslp': '(hPa)',
          'wind': '(m/s)',
          'wind10': '(m/s)',
          'temp': '(摄氏度)',
          'shum': '(%)',
          'rh': '(%)',
          'hght': '(m)',
          'omeg': '(m/s)',
          'lspe': '(mm)',
          'cpre': '(mm)',
          'wind': '(m/s)',
          'tide_wind': '(m/s)',
          'rain': '(mm)',
          'tide_rain': '(mm)',
          'tide': '(cm)',
          'torrent': '(mm)',
          'waterlogging': '(mm)',
          'airpollution': '(g/m3)',
          'fire': '(分钟)',
          'radar': '(dBz)',
          'qpf': '(mm)',
          'geology': '(级)'
        }
      }
    },
    computed: {
      disabledChange() {
        return this.colorTypeOptions.length <= 1;
      },
      colorTypeOptions() {
        let options = [];
        for(let opt of this.colorOptions) {
          if(!options.length) {
            options.push(opt);
            continue;
          }
          let index = options.findIndex(item => item.type === opt.type);
          if(index === -1)
            options.push(opt);
        }
        return options;
      }
    },
    methods: {
      toggleColorOptionsShow() {
        this.colorOptionsShow = !this.colorOptionsShow;
      },
      toggleColorBar() {
        this.isMinimize = !this.isMinimize;
        if(this.colorOptionsShow)
          this.colorOptionsShow = false;
      },
      changeColorTable(type) {
        if(this.disabledChange)
          return;
        let colorOptions = this.colorOptions;
        let index = colorOptions.findIndex((el) => { return el.type === this.selectedColor });
        if(index === -1)
          return;
        if(type === 'prev') {
          if(index)
            index--;
          else
            index = colorOptions.length - 1;
        } else {
          if(index === (colorOptions.length - 1))
            index = 0;
          else
            index++;
        }

        let currentColorData = colorOptions[index];
        const flag = currentColorData.flag;
        this.selectedColor =  currentColorData.type;
        this.colorArray = this.colorData[flag];
        this.colorUnit = this.elementUnit[type] || '';
      },
      selectColor(data) {
        this.colorOptionsShow = false;
        if(data.type === this.selectedColor)
          return;
        this.selectedColor = data.type;
        this.colorArray = this.colorData[data.flag];
        this.colorUnit = this.elementUnit[data.type];
      },
      async addColorBar() {
        let colorFlag = this.colorFlag;
        const flag = this.colorTypeData.flag,
              type = this.colorTypeData.type;

        if(colorFlag.hasOwnProperty(flag)) {
          colorFlag[flag]++;
          this.colorArray = this.colorData[flag];
          this.selectedColor = type;
          this.colorUnit = this.elementUnit[flag] || '';
          this.colorOptions.push(this.colorTypeData);
          return;
        }

        let colorData;
        if(this.modelColorConfig.hasOwnProperty(type)) {
          colorData = this.modelColorConfig[type];
        }
        else {
          const isTideModel = type === 'tide_wind' || type === 'tide_rain' || type === 'tide';

          let reqUrl, response;
          if(isTideModel) {
            reqUrl = `http://10.148.83.228:9002/nc/jsonp/colortable?colorTable=${type === 'tide' ? 'tide' : type.replace('tide_', '')}`;
          } else {
            reqUrl = `http://10.148.10.80:8111/discrete/colortable/value/${flag}/JSONP/`;
          }

          try {
            response = await this.$http.jsonp(reqUrl);
          }
          catch(err) {
            throw 'failed to get colorbar data';
          }

          colorData = [];
          if(isTideModel) {
            let data = response.data;
            let interval;
            switch(type) {
              case 'tide_rain':
              case 'tide_wind':
                interval = 1;
                break;
              case 'tide':
                interval = 20;
                break;
              default:
                interval = 10;
            }
            data.forEach((d, index) => {
              if(index%interval === 0) {
                colorData.push({
                  value: (Number(d.value) < 1 || type === 'tide_wind') ? d.value : parseInt(d.value),
                  color: d.fill
                });
              }
            });
          }
          else {
            let data = response.data[0].ColorTable;
            data.forEach((el, index) => {
              if(type === 'radar' && index%4)
                return true;
              for (let i in el) {
                colorData.push({
                  value: Number(i) < 1 ? ( i < 0 ? Number(i).toFixed(0) : i.substr(0, 3)) : Number(i).toFixed(0),
                  color: `rgba(${el[i]})`
                });
              }
            });
          }
        }

        this.computeColorRow(colorData);
        colorFlag[flag] = 1;
        this.colorArray = colorData;
        this.selectedColor = type;
        this.colorData[flag] = colorData;
        this.colorUnit = this.elementUnit[type];
        this.colorOptions.push(this.colorTypeData);
      },
      deleteColorBar() {
        let colorFlag = this.colorFlag;
        const type = this.deleteColorType;

        let flag;
        this.colorOptions.forEach((opt, index, arr) => {
          if(opt.type === type && !flag) {
            flag = opt.flag;
            arr.splice(index, 1);
            return;
          }
        });

        if(this.selectedColor === type && this.colorOptions.length) {
          let defaultOption = this.colorOptions[0];
          this.selectedColor = defaultOption.type;
          this.colorArray = this.colorData[defaultOption.flag];
          this.colorUnit = this.elementUnit[defaultOption.type];
        }

        if(colorFlag.hasOwnProperty(flag)) {
          if(colorFlag[flag] > 1) {
            colorFlag[flag]--;
            return;
          }
          delete colorFlag[flag];
          delete this.colorData[flag];
        }
      },
      computeColorRow(data) {
        const defaultHeight = this.defaultHeight;
        const maxLen = defaultHeight/this.defaultRowHeight,
              dataLen = data.length;
        if(dataLen > maxLen) {
          let rowHeight = defaultHeight/dataLen + 'px';
          const maxStrLen = parseInt(defaultHeight/12) - 5;  //一个字节12px, -5留出5个字节作为间隔
          const interval = dataLen > maxStrLen ? Math.ceil(dataLen/maxStrLen) : 1;
          data.forEach((d, index) => {
            d.rowHeight = rowHeight;
            if(interval === 1) {
              d.show = true;
            } else {
              d.show = index%interval ? false : true;
            }
          });
        } else {
          let rowHeight = this.defaultRowHeight + 'px';
          for(let d of data) {
            d.show = true;
            d.rowHeight = rowHeight;
          }
        }
      }
    },
    watch: {
      colorAddFlag(nv) {
        this.addColorBar().then(() => { console.log('success to add color table') });
      },
      colorDeleteFlag() {
        this.deleteColorBar();
      }
    }
  }
</script>
<style lang="scss" scoped>
#colorbar {
  position: absolute;
  top: 230px;
  right: 0px;
  .colorbar-minimize {
    width: 10px;
    height: 100px;
    position: relative;
    right: 0px;
    top: 0px;
    background: -webkit-linear-gradient(#ff0000, #ffff00, #00ff00, #0000ff, #cc00ff, #ff0033);
    background: -o-linear-gradient(#ff0000, #ffff00, #00ff00, #0000ff, #cc00ff, #ff0033);
    background: -moz-linear-gradient(#ff0000, #ffff00, #00ff00, #0000ff, #cc00ff, #ff0033);
    background: linear-gradient(#ff0000, #ffff00, #00ff00, #0000ff, #cc00ff, #ff0033);
    cursor: pointer;
  }

  .colorbar-maximize {
    width: 50px;
    position: relative;
    right: 6px;
    background-color: rgba(70, 70, 70, .5);
    .color-minimize-btn {
      width: 16px;
      height: 16px;
      position: absolute;
      top: -17px;
      right: 0px;
      font-size: 14px;
      color: white;
      line-height: 16px;
      text-align: center;
      background-color: rgba(70, 70, 70, .5);
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, .5);
      }
    }
    .color-element {
      width: 100%;
      height: 30px;
      position: relative;
      vertical-align: top;
      font-size: 0;
      border-bottom: 1px solid rgba(255, 255, 255, .1);
      em {
        width: 10px;
        height: 100%;
        position: relative;
        display: inline-block;
        vertical-align: top;
        text-align: center;
        cursor: pointer;
        &:hover {
          background-color: rgba(0, 0, 0, .2);
        }
        &.disabled-operate {
          cursor: default !important;
          &:hover {
            background-color: transparent !important;
          }
          &:first-of-type>a{
            border-color: transparent #929292 transparent transparent;
          }
          &:last-of-type>a {
            border-color: transparent transparent transparent #929292;
          }
        }

        &:first-of-type {
          a {
            width: 0;
            height: 0;
            border-width: 4px 4px 4px 0;
            border-style: solid;
            border-color: transparent white transparent transparent;
            margin: 11px 0px;
            position: relative;
            display: inline-block;
          }
        }
        &:last-of-type {
          a {
            width: 0;
            height: 0;
            border-width: 4px 0 4px 4px;
            border-style: solid;
            border-color: transparent transparent transparent white;
            margin: 11px 0px;
            position: relative;
            display: inline-block;
          }
        }
      }
      span {
        width: 30px;
        height: 100%;
        position: relative;
        display: inline-block;
        font-size: 12px;
        color: white;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
      }
    }

    .color-wrapper {
      width: 100%;
      position: relative;
      overflow: hidden;
      padding-bottom: 10px;
      span {
        width: 100%;
        height: 30px;
        position: relative;
        display: inline-block;
        margin-bottom: 5px;
        font-size: 12px;
        color: white;
        text-align: center;
        line-height: 30px;
      }
      ul {
        width: 100%;
        display: block;
        font-size: 0;
        li {
          width: 100%;
          position: relative;
          display: block;
          em {
            width: 10px;
            height: 100%;
            position: relative;
            display: inline-block;
            margin: 0px 6px;
          }
          span {
            width: calc(100% - 22px);
            height: 12px;
            position: relative;
            display: inline-block;
            vertical-align: top;
            line-height: 12px;
            font-size: 12px;
            color: white;
            text-align: left;
          }
        }
      }
    }

    .color-options {
      position: absolute;
      top: 0;
      right: 56px;
      background-color: rgba(70, 70, 70, .5);
      ul {
        display: block;
        font-size: 0;
        li {
          height: 30px;
          display: inline-block;
          padding: 0px 10px;
          white-space: nowrap;
          font-size: 12px;
          text-align: center;
          line-height: 30px;
          color: white;
          cursor: pointer;
          &:hover {
            background-color: rgba(0, 0, 0, .1);
          }
        }
      }
    }
  }
}
</style>

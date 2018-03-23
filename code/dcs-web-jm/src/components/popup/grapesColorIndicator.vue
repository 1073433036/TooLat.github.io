<template lang="pug">
main#grapes-color-indicator.cf(v-if="colorTableData.length > 0" v-bind:style="{backgroundColor: mini ? 'transparent' : 'rgba(70,70,70,0.5)', minWidth: mini ? 'auto' : '50px'}")
  div.scale-btn(v-if="!mini" @click="miniFy")
  header.control-btn.cf(v-if="!mini" @click="toggleColorBarCategory")
    div(v-bind:class="{upfold: displayColorBarCategory}")
    div 要素
  section.color-bar-category(v-if="!mini && displayColorBarCategory" )
    ul
      li(v-for="(el, index) in colorTableData" @click="changeColorTable(index)") {{el.cnName}}
  section.pre-btn(v-bind:class="{'n-pre': pageIndex === 0}" @click="pageGoUp" v-if="!mini")
  section.content-wraper.cf
    div(v-if="!mini") {{elementUnit[colorTableData[colorTableIndex].enName]}}
    ul.color-bar(v-bind:style="{padding: mini ? '0': '6px 5px 6px 6px'}" @click="maxFy")
      li(v-for="el in colorData[pageIndex]"
        v-bind:style="{backgroundColor: el.color}")
    ul.color-unit(v-if="!mini")
      li(v-for="el in colorData[pageIndex]") {{el.value}}
  section.next-btn(v-bind:class="{'n-next': pageIndex === (hasPages-1)}" @click="pageGoDown" v-if="!mini")
</template>

<script>
import { mapGetters } from 'vuex'
import { typhEleData, elementUnit } from '../../config/grapesConfig'

export default {
  data() {
    return {
      elementUnit,
      colorData: [],

      hasPages: 0,
      pageSize: 10,
      pageIndex: 0,
      mini: false,
      colorTableIndex: null,
      colorTableData: [],
      displayColorBarCategory: false,
      modelColors: {
        torrent: {
          text: '山洪面雨量',
          unit: 'mm',
          data: [
            {value: 0.1, color: 'blue'},
            {value: 2.6, color: 'yellow'},
            {value: 8, color: 'orange'},
            {value: 16, color: 'red'}
          ]
        },
        waterlogging: {
          text: '道路积水',
          unit: 'mm',
          data: [
            {value: 0, color: 'chartreuse'},
            {value: 5, color: 'yellow'},
            {value: 15, color: 'red'}
          ]
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    changeColorTable(index) {
      this.colorData = this.colorTableData[index].data;
      this.colorTableIndex = index;
      this.hasPages = this.colorTableData[index].data.length;
      this.displayColorBarCategory = false;
    },
    pageGoUp() {
      if (this.pageIndex === 0)
        return;
      this.pageIndex--;
    },
    pageGoDown() {
      if (this.pageIndex == (this.hasPages - 1))
        return;
      this.pageIndex++;
    },
    miniFy() {
      this.mini = !this.mini;
    },
    maxFy() {
      if (this.mini)
        this.mini = false;
    },
    toggleColorBarCategory() {
      this.displayColorBarCategory = !this.displayColorBarCategory;
    }
  },
  computed: {
    ...mapGetters([
      'colorTableToAdd_global',
      'colorTableToDelete_global'
    ])
  },
  watch: {
    colorTableToAdd_global(val, oldVal) {
      const excludeArr = ['tide', 'geology', 'fire', 'airpollution'];
      if(excludeArr.includes(val))
        return;
      parseColorData.call(this, val)
        .then(() => console.info('success'));
    },
    colorTableToDelete_global(val) {
      const excludeArr = ['tide', 'geology', 'fire', 'airpollution'];
      if(excludeArr.includes(val))
        return;
      this.colorTableData.forEach((item, i, arr) => {
        if(item.enName == val) {
          arr.splice(i, 1);
          this.colorTableIndex--;
          return;
        }
      });
    }
  }
}

async function parseColorData(colorTable) {
  this.colorData = new Array();
  let colorTableCnName = null;

  if(colorTable === 'torrent' || colorTable === 'waterlogging') {
    this.colorData.push(this.modelColors[colorTable].data);
    colorTableCnName = this.modelColors[colorTable].text;
  } else {
    let res,
        requstUrl = null,
        data;
    if (colorTable === 'tide_wind' || colorTable === 'tide_rain' || colorTable === 'tide') {
      requstUrl = `http://10.148.83.228:9002/nc/jsonp/colortable?colorTable=${colorTable === 'tide' ? 'tide' : colorTable.replace('tide_', '')}`;
    } else {
      //console.debug('parse', colorTable)
      let colorTableTemp = null;
      switch (colorTable) {
        case 't2mm':
          colorTableTemp = 'temp';
          break;
        case 'shum':
          colorTableTemp = 'rh';
          break;
        case 'omeg':
          colorTableTemp = 'surt';
          break;
        case 'lspe':
          colorTableTemp = 'rain';
          break;
        case 'cpre':
          colorTableTemp = 'rain';
          break;
        case 'wind10':
          colorTableTemp = 'wind';
          break;
        default:
          colorTableTemp = colorTable;
      }
      requstUrl = `http://10.148.10.80:8111/discrete/colortable/value/${colorTableTemp}/JSONP/`;
    }
    try {
      res = await this.$http.jsonp(requstUrl);
    }
    catch (err) {
      throw 'error';
    }

    if (colorTable === 'tide_wind' || colorTable === 'tide_rain' || colorTable === 'tide') {
      data = res.data;
      //console.log(data);
      let pageSize = this.pageSize,
          index = 0,
          increate;
      switch(colorTable) {
        case 'tide_rain':
          increate = 1;
          break;
        case 'tide_wind':
          increate = 15;
          break;
        case 'tide':
          increate = 20;
          break;
        default:
          increate = 10;
      }
      for (let i = 0; i < data.length; i += increate) {
        let indexFix = Math.floor(index / pageSize);
        if (!this.colorData[indexFix])
          this.colorData.push([]);
        this.colorData[indexFix].push({
          value: Number(data[i].value) < 1 ? data[i].value : Number(data[i].value).toFixed(0),
          color: data[i].fill
        });
        index++;
      }
    } else {
      data = res.data[0].ColorTable;
      let pageSize = this.pageSize,
          colorArr = [];
      data.forEach((el, index) => {
        if(colorTable === 'radar' && index%4)
          return true;
        if(colorArr.length >= pageSize) {
          this.colorData.push([].concat(colorArr));
          colorArr.length = 0;
        }
        for (let i in el) {
          colorArr.push({
            value: Number(i) < 1 ? ( i < 0 ? Number(i).toFixed(0) : i.substr(0, 3)) : Number(i).toFixed(0),
            color: `rgba(${el[i]})`
          });
        }
      })
    }
    for (let item of typhEleData) {
      if (item.value === colorTable) {
        colorTableCnName = item.text;
        break;
      }
    }
  }
  console.log(this.colorData);
  this.colorTableData.push({ enName: colorTable, cnName: colorTableCnName, data: this.colorData });
  this.colorTableIndex = this.colorTableData.length - 1;
  this.hasPages = this.colorData.length;
}
</script>


<style lang="scss" scoped>
#grapes-color-indicator {
  position: absolute;
  right: 4px;
  top: 30%;
  background-color: rgba(70, 70, 70, .5);
  font-size: 10px;
  min-width: 50px;
  color: white;
  ul.color-bar {
    float: left;
    padding: 6px 5px 6px 6px;
    li {
      height: 24px;
      min-width: 12px;
      text-align: center;
      line-height: 24px;
      color: white;
      text-shadow: 1px 1px 1px black;
    }
  }
  ul.color-unit {
    float: left;
    padding: 0px 5px 6px 0px;
    top: -4px;
    position: relative;
    li {
      height: 24px;
      color: white;
      line-height: 24px;
    }
  }
}

section.content-wraper {
  >div {
    text-align: center;
    margin-bottom: 5px;
  }
}

header.control-btn {
  height: 30px;
  border-bottom: solid 1px rgba(255, 255, 255, .1);
  cursor: pointer;
  &:hover {
    div:first-of-type {
      background-color: rgba(0, 0, 0, .1);
    }
  }
  div:first-of-type {
    width: 20px;
    float: left;
    height: 100%;
    background-image: url('../../assets/colorBar/fold.png');
    background-position: center center;
    background-repeat: no-repeat;
    cursor: pointer;
  }
  div:last-of-type {
    font-size: 10px;
    float: left;
    line-height: 30px;
    height: 100%;
    color: white;
    user-select: none;
  }
}

.upfold {
  background-image: url('../../assets/colorBar/unfold.png') !important
}

section.pre-btn,
section.next-btn {
  width: 100%;
  height: 14px;
  background-position: center center;
  background-repeat: no-repeat;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, .1);
  }
}

.pre-btn {
  background-image: url('../../assets/colorBar/up.png');
}

.next-btn {
  background-image: url('../../assets/colorBar/down.png')
}

.scale-btn {
  width: 16px;
  height: 16px;
  position: absolute;
  background-color: violet;
  right: 0;
  top: -20px;
  background-color: rgba(70, 70, 70, .5);
  background-image: url('../../assets/colorBar/minimize.png');
  background-position: center center;
  background-repeat: no-repeat;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, .1);
  }
}

.color-bar-category {
  position: absolute;
  left: -110px;
  top: 0px;
  width: 100px;
  background-color: rgba(70, 70, 70, .5);
  ul {
    width: 100%;
  }
  li {
    cursor: pointer;
    width: 100%;
    height: 30px;
    border-bottom: solid 1px rgba(255, 255, 255, .1);
    box-sizing: border-box;
    padding-left: 10px;
    line-height: 29px;
    &:hover {
      background-color: rgba(0, 0, 0, .1);
    }
  }
}

.n-pre {
  background-image: url('../../assets/colorBar/up_n.png');
}

.n-next {
  background-image: url('../../assets/colorBar/down_n.png');
}
</style>

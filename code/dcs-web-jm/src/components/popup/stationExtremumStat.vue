<template>
  <div id="station-extremum" class="ns" v-if="isShow">
    <ul>
      <li v-for="(item, key) in stationExtremum" :key="key"
          :class="[key.indexOf('max') >= 0 ? 'station-max' : 'station-min']">
        {{item.name + '：' + item.stationName + '(' + item.stationId + ') ' + item.value + item.unit}}
      </li>
    </ul>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'stationRealData',
        'stationExtremum'
      ]),
      isShow() {
        return Object.keys(this.stationRealData).length;
      }
    }
  }
</script>
<style lang="scss" scoped>
#station-extremum {
  position: absolute;
  top: 50px;
  right: 80px;
  background-color: rgba(255, 255, 255, .8);
  border-radius: 4px;
  ul {
    position: relative;
    display: block;
    font-size: 0;
    >li {
      height: 30px;
      position: relative;
      line-height: 30px;
      padding: 0 10px;
      font-size: 12px;
      text-indent: 15px;
      &:before {
        content: '';
        width: 16px;
        height: 16px;
        position: absolute;
        left: 0;
        top: 7px;
        margin: 0 5px;
        background-repeat: no-repeat;
      }
    }
    li.station-max:before {
      background-image: url(../../assets/station_max.png);
    }
    li.station-min:before {
      background-image: url(../../assets/station_min.png);
    }
  }
}
</style>

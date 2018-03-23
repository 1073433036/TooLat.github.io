<template>
    <div id="aqi-detail-popup" class="poi-detail-popup" v-if="aqiPopup.show">
        <div class="poi-detail-title" :title="aqiPopup.title">
            {{aqiPopup.title.substring(0, 24)}}
            <span @click="hideAQIDetailPopup">✕</span>
        </div>
        <div class="poi-detail-wrapper">
            <div class="aqi-detail-items">
                <div class="detail-item" v-for="(value, key) in aqiPopup.infos">
                    <span>{{key}}：</span>
                    <span>{{value}}</span>
                </div>
            </div>
            <div class="aqi-detail-items">
                <div class="detail-item" v-for="(value, key) in aqiPopup.AQI">
                    <span>• {{key}}：</span>
                    <span>{{value}}</span>
                </div>
            </div>
            <div class="aqi-detail-items">
                <div class="aqi-detail-list" v-for="(obj, name) in aqiPopup.elements">
                    <span>{{name}}(ug/m³)</span>
                    <ul>
                        <li v-for="(v, k) in obj">
                            <a>{{k}}</a>
                            <span>{{v}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default{
    data(){
        return{

        }
    },
    computed: {
        ...mapGetters([
            'aqiPopup'
        ])
    },
    methods: {
        ...mapActions([
            'hideAQIDetailPopup'
        ])
    }
}
</script>
<style lang="sass" scoped>
$popupWidth: 400px

#aqi-detail-popup
  width: $popupWidth
  .poi-detail-wrapper
    width: 100%
    position: relative
    .aqi-detail-items
      width: 100%
      position: relative
      padding: 5px 0px
      font-size: 0
      color: rgb(78,123,182)
      &:first-child
        border-bottom: 1px solid #ddd
      &:nth-child(2)
        .detail-item
          display: block
          width: $popupWidth - 20
          span:nth-child(2)
            color: rgb(73, 133, 37)
      .detail-item
        width: ($popupWidth/2 - 20)
        height: 26px
        position: relative
        display: inline-block
        padding: 0px 10px
        line-height: 26px
        font-size: 1.2rem
        overflow: hidden
        span:nth-child(2)
          color: rgb(85, 85, 85)
      .aqi-detail-list
        width: ($popupWidth/2 - 10)
        position: relative
        display: inline-block
        vertical-align: top
        padding-bottom: 5px
        &:nth-child(odd)
          padding-left: 10px
        &:nth-child(even)
          padding-right: 10px
        &:nth-child(5)
          width: $popupWidth - 20
          position: relative
          ul
            li
              width: $popupWidth - 22
        span
          width: 100%
          height: 26px
          position: relative
          display: inline-block
          font-size: 1.2rem
          line-height: 26px
          text-indent: 10px
        ul
          li
            width: ($popupWidth/2 - 12)
            height: 26px
            position: relative
            font-size: 1.2rem
            text-indent: 10px
            line-height: 26px
            background-color: rgb(233,238,244)
            border: 1px solid rgb(233,238,244)
            border-top-color: white
            &:nth-child(1)
              border-top-color: rgb(233,238,244)
            span
              width: 40px
              height: 100%
              position: absolute
              display: block
              right: 0
              top: 0
              text-align: center
              text-indent: 0
              background-color: white
              color: rgba(194, 61, 92, 1)
</style>

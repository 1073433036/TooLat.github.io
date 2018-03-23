<template>
    <transition name="popup-fade">
        <div id="station-real-popup"
             :style="{'top': realPopup.pos.top, 'left': realPopup.pos.left}"
             v-if="realPopup.show">
            <div class="station-real-wrapper" v-show="realPopup.detail">
                <div class="station-real-item" v-for="ele in realPopup.elements">
                    <em :id="ele.key"></em>
                    <span>{{ele.value}}</span>
                </div>
            </div>
            <div class="station-name" v-text="realPopup.name"></div>
        </div>
    </transition>
</template>
<script>
import { mapGetters } from 'vuex'

export default{
    computed: {
        ...mapGetters([
            'realPopup'
        ])
    }
}
</script>
<style lang="sass" scoped>
#station-real-popup
  width: 260px
  height: 70px
  position: absolute
  pointer-events: none
  .station-real-wrapper
    position: relative
    padding: 5px 10px
    background-color: rgba(255, 255, 255, 0.6)
    color: black
    border-radius: 4px
    .station-real-item
      width: 60px
      position: relative
      display: inline-block
      text-align: center
      font-size: 0
      em
        width: 100%
        height: 40px
        position: relative
        display: inline-block
      em#rain
        background: url(/static/img/station/rain.png) center center no-repeat
      em#ps
        background: url(/static/img/station/ps.png) center center no-repeat
      em#temp
        background: url(/static/img/station/temp.png) center center no-repeat
      em#wind
        background: url(/static/img/station/wind.png) center center no-repeat
      span
        width: 100%
        height: 20px
        position: relative
        display: inline-block
        font-size: 12px
        line-height: 20px
  .station-name
    width: 100%
    height: 30px
    position: absolute
    bottom: -35px
    left: 0
    color: white
    font-size: 1.4rem
    text-align: center
    line-height: 30px
    text-shadow: #000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0
    -webkit-text-shadow: #000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0
    -moz-text-shadow: #000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0
    *filter: Glow(color=#000, strength=1)

.popup-fade-enter-active, .popup-fade-leave-active
  transition: opacity .3s

.popup-fade-enter, .popup-fade-leave-active
  opacity: 0

</style>

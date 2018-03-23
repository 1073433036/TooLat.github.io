<template>
    <div id="poi-detail-popup" class="poi-detail-popup" v-if="poiDetail.show&&poiDetail.type!='reservoir'" v-drag="{handle: '.poi-detail-title'}">
        <div class="poi-detail-title" :title="poiDetail.title">
            {{poiDetail.title.substring(0, 24)}}
            <span @click="hidePoiDetailPopup">✕</span>
        </div>
        <div class="poi-detail-wrapper">
            <div class="poi-detail-group" v-for="(group, key) in poiDetail.details">
                <template v-if="group instanceof Array">
                    <span @click="showMaterialList(key)">
                        <a>• </a>{{key}}（<a>{{group.length}}</a>）
                        <em :class="{'show-list': key==poiDetail.selected}"></em>
                    </span>
                    <div class="poi-detail-list poi-detail-scroll" v-show="key==poiDetail.selected">
                        <div class="poi-detail-items" v-for="(params, n) in group">
                            <div class="poi-detail-item"
                                 v-for="(attr, name) in params"
                                 :title="attr">
                                {{name + '：' + attr}}
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="poi-detail-list">
                        <div class="poi-detail-item" v-for="(v, n) in group" :title="v">{{n + '：' + v}}</div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    computed: {
        ...mapGetters([
            'poiDetail'
        ]),
    },
    methods: {
        ...mapActions([
            'showMaterialList',
            'hidePoiDetailPopup'
        ]),
    },
}
</script>
<style lang="sass" scoped>
$popupWidth: 420px
@mixin scroll-style
  &::-webkit-scrollbar-track
    background-color: white
  &::-webkit-scrollbar
    width: 6px
    background-color: white
  &::-webkit-scrollbar-thumb
    background-color: rgba(206,217,237,1)
    border-radius: 4px

#poi-detail-popup
  width: $popupWidth
  .poi-detail-wrapper
    max-height: 400px
    position: relative
    margin: 5px 0px 10px 0px
    overflow-y: auto
    @include scroll-style
    .poi-detail-group
      height: 100%
      position: relative
      span
        height: 26px
        position: relative
        display: block
        margin: 0px 10px
        line-height: 26px
        border-bottom: 1px solid #dfe7f2
        cursor: pointer
        a:first-child
          color: #289cff
        a:nth-child(2)
          color: #df4664
        em
          width: 26px
          height: 26px
          position: absolute
          top: 0
          right: 0
          background: url(/static/img/panel-icon.png) -82px 0px no-repeat
          transform: rotate(180deg)
          cursor: pointer
        em.show-list
          background-position: -82px 1px
          transform: rotate(0deg)
      .poi-detail-scroll
        max-height: 131px
        overflow-y: auto
        @include scroll-style
        .poi-detail-items
          position: relative
          margin: 0px 10px
          border-bottom: 1px solid rgba(223, 231, 242, 1)
          .poi-detail-item
            width: ($popupWidth/2 - 30)!important
            padding: 0px 0px 0px 10px!important
      .poi-detail-list
        height: 100%
        position: relative
        padding: 5px 0px
        font-size: 0
        border-bottom: 1px solid rgba(223, 231, 242, 1)
        &:last-child
          border-bottom: none
        .poi-detail-item
          width: ($popupWidth/2 - 25)
          height: 26px
          position: relative
          display: inline-block
          padding-left: 15px
          line-height: 26px
          font-size: 1.2rem
          overflow: hidden
</style>

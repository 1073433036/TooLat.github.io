<template>
  <main id="geoMenu">
      <section class="sub-menu" v-for="(opt, key) in geoMenu" v-if="opt.enabled">
          <div class="sub-menu-title" v-text="opt.text"></div>
          <div class="sub-menu-wrapper">
              <div :class="['sub-menu-item', {'item-act': item.selected}]"
                   v-for="(item, subKey) in opt.menu"
                   @click="toggleGeography(item, key, subKey)">
                  {{item.text}}
                  <em></em>
              </div>
          </div>
      </section>
  </main>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'

    export default{
        computed: {
            ...mapGetters([
                'geoMenu',
                'geoCollection',
                'currentRegion',
            ])
        },
        methods: {
            toggleGeography(item, type, subType) {
                let currentRegion = this.currentRegion;
                item.selected = !item.selected;
                let teamType;
                if(type === 'baseInfo'){
                    type = subType;
                    subType = undefined;
                    teamType = undefined;
                } else if(type === 'rescueteam') {
                    teamType = item.text;
                }
                if(item.selected){
                    this.addGeoCollection({
                        type,
                        subType,
                        teamType,
                        $http: this.$http,
                        cityId: currentRegion.cityId,
                        countyId: currentRegion.countyId
                    });
                } else {
                    this.removeGeoCollection({type, subType});
                }
            },
            ...mapActions([
                'addGeoCollection',
                'removeGeoCollection',
            ])
        }
    }
</script>

<style lang="scss" scoped>
  section.sub-menu {
    position: relative;
    margin: 0px 10px 12px 10px;
    &:nth-child(1) {
      margin-top: 10px!important;
    }
    .sub-menu-title {
      width: 100%;
      position: relative;
      margin-bottom: 10px;
      font-size: 14px;
      color: #475f88;
      font-weight: bolder;
    }
    .sub-menu-wrapper {
      width: 100%;
      position: relative;
      font-size: 0;
      .sub-menu-item {
        position: relative;
        display: inline-block;
        vertical-align: top;
        padding-right: 12px;
        margin-right: 5px;
        margin-bottom: 8px;
        font-size: 12px;
        cursor: pointer;
        &:hover {
          color: #299dff;
        }
      }
      .item-act {
        color: #299dff;
        em {
          width: 12px;
          height: 12px;
          position: absolute;
          display: inline-block;
          top: 3px;
          right: 0;
          background: url(../../assets/mainMenu/modelIcon.png) -97px -6px no-repeat;
        }
      }
    }
  }
</style>

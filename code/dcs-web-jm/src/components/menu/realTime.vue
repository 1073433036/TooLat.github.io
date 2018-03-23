<template>
  <main id="realTime">
      <section class="sub-menu" v-for="(opt, key) in realMenu" v-if="opt.enabled">
          <div class="sub-menu-title" v-text="opt.text"></div>
          <div class="sub-menu-wrapper">
              <div :class="['sub-menu-item', {'item-act': item.selected}]"
                   v-for="(item, subKey) in opt.menu"
                   @click.stop="toggleRealMonitor(item, key, subKey)">
                  {{item.text}}
                  <em></em>
              </div>
          </div>
      </section>
  </main>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import { MeteoMonitor } from '../../util/MeteoMonitor'

  export default{
      data() {
          return {
              shipTimer: null,
              shipBounds: {
                  left: 111.736,
                  right: 113.329,
                  top: 22.908,
                  bottom: 20.7
              }
          }
      },
      mounted() {
          this.initMeteoContainer(new MeteoMonitor(this.$http));
      },
      computed: {
          ...mapGetters([
              'realMenu',
              'currentRegion',
              'dateTime',
              'regionBounds'
          ])
      },
      methods: {
          ...mapActions([
              'initMeteoContainer',
              'addMeteoStation',
              'getStationRealData',
              'removeMeteoStation',
              'addCloudLayer',
              'addSwanProduct',
              'addNewSwanProduct',
              'removeMeteoLayer',
              'addAQIStation',
              'getAQIStationData',
              'removeAQIStation',
              'addWaterStation',
              'removeWaterStation',
              'getWaterStationReal',
              'storeColorTable_global',
              'addShipModel',
              'removeShipModel',
              'showInfoTip_global'
          ]),
          toggleRealMonitor(item, key, subKey) {
              let currentRegion = this.currentRegion,
                  dateObj = this.dateTime;
              item.selected = !item.selected;

              if(key === 'meteorology') {
                  if(subKey === 'station') {
                      if(item.selected){
                          let minute = dateObj.getMinutes();
                          if(minute%5){
                              dateObj = new Date(dateObj.getTime() - minute%5*60000);
                          }
                          this.addMeteoStation({
                              city: currentRegion.cityName,
                              datetime: dateObj.Format('yyyy-MM-dd HH:00:00'),
                              county: currentRegion.countyName
                          });
                      } else {
                          this.removeMeteoStation();
                      }
                  }
                  else if(subKey === 'cloud') {
                      item.selected ?
                      this.addCloudLayer({
                          info: item,
                          type: subKey,
                          datetime: dateObj.Format('yyyy-MM-dd HH:00:00')
                      }) : this.removeMeteoLayer(subKey);
                  }
                  else if(subKey === 'radar' || subKey.indexOf('qpf') >= 0) {
                      if(item.selected) {
                          let params = {
                            info: item,
                            type: subKey,
                            datetime: dateObj.Format('yyyy-MM-dd HH:mm:00'),
                            element: subKey === 'radar' ? 'cappi' : 'qpf'
                          };
                          if(subKey !== 'radar') {
                              let time = subKey.split('_')[1];
                              params = Object.assign(params, { level: 3, time });
                          }

                          this.addNewSwanProduct(params);
                          subKey === 'radar' ? this.storeColorTable_global({type: 'add', data: {type: subKey, flag: subKey, label: '雷达拼图3km'}}) : this.storeColorTable_global({type: 'add', data: {type: 'qpf', flag: 'qpf', label: 'qpf'}});
                      } else {
                          this.removeMeteoLayer(subKey);
                          subKey === 'radar' ? this.storeColorTable_global({type: 'delete', data: {type: subKey}})
                            : this.storeColorTable_global({type: 'delete', data: {type: 'qpf'}});
                      }
                  }
                  else if(subKey === 'lightning') {
                      let minute = dateObj.getMinutes();
                      if(minute%6){
                          dateObj = new Date(dateObj.getTime() - minute%6*60000);
                      }
                      let type = 'pe1_1';
                      item.selected ?
                      this.addSwanProduct({
                          info: item,
                          type,
                          datetime: dateObj.Format('yyyy-MM-dd HH:mm:00')
                      }) : this.removeMeteoLayer(type);
                  }
              }
              else if(subKey === 'airquality') {
                  if(item.selected) {
                      let params = {
                          city: currentRegion.cityName,
                          county: currentRegion.countyName
                      };
                      this.addAQIStation(params);
                      this.getAQIStationData(Object.assign({
                          datetime: dateObj.Format('yyyy-MM-dd HH:00:00')
                      }, params));
                  } else {
                      this.removeAQIStation();
                  }
              }
              else if(subKey === 'water') {
                  if(item.selected) {
                      this.addWaterStation({
                        datetime: dateObj.Format('yyyy-MM-dd HH:00:00'),
                        cityId: currentRegion.cityId,
                        countyId: currentRegion.countyId,
                        isAdd: true
                      });
                  } else {
                      this.removeWaterStation();
                  }
              }
              else if(subKey === 'ship') {
                  if(item.selected) {
                      this.initShipModel();
                      this.shipTimer = setInterval(() => {
                          this.initShipModel();
                      }, 180000);
                  } else {
                      this.removeShipModel();
                      if(this.shipTimer)
                          clearInterval(this.shipTimer);
                      this.shipTimer = null;
                  }
              }
          },
          updateStationRealData(dt, city, county) {
              let minute = dt.getMinutes();
              if(minute%5){
                  dt = new Date(dt.getTime() - minute%5*60000);
              }
              this.getStationRealData({
                  city,
                  county,
                  datetime: dt.Format('yyyy-MM-dd HH:mm:00'),
              });
          },
          updateAQIStationData(dt, city) {
              this.getAQIStationData({
                  city,
                  datetime: dt.Format('yyyy-MM-dd HH:00:00')
              });
          },
          initShipModel() {
              const params = {
                  $http: this.$http,
                  bounds: this.shipBounds
              };
              this.addShipModel(params)
                .then(data => {
                    if(!data) {
                        this.showInfoTip_global({ text: '当前暂无船舶数据' });
                    }
                })
                .catch(err => {
                    this.showInfoTip_global({ text: '当前暂无船舶数据' });
                });
          }
      },
      watch: {
          dateTime: {
              handler(dateObj) {
                  const realMenu = this.realMenu,
                        curRegion = this.currentRegion;
                  const meteoMenu = realMenu.meteorology.menu;

                  for(let i in meteoMenu) {
                      let item = meteoMenu[i];
                      if(!item.selected)
                          continue;

                      if(i === 'station') {
                          this.updateStationRealData(dateObj, curRegion.cityName, curRegion.countyName);
                      }
                      else if(i === 'radar' || i.indexOf('qpf') >= 0) {
                          let params = {
                            type: i,
                            datetime: dateObj.Format('yyyy-MM-dd HH:mm:00'),
                            element: i === 'radar' ? 'cappi' : 'qpf'
                          };
                          if(i !== 'radar') {
                              let time = i.split('_')[1];
                              params = Object.assign(params, { level: 3, time });
                          }

                          this.removeMeteoLayer(i);
                          this.addNewSwanProduct(params);
                      }
                      else if(i === 'lightning') {
                          let minute = dateObj.getMinutes();
                          let datetime = dateObj;
                          if(minute%6){
                              datetime = new Date(datetime.getTime() - minute%6*60000);
                          }
                          let type = 'pe1_1';
                          this.removeMeteoLayer(type);
                          this.addSwanProduct({
                              type,
                              datetime: datetime.Format('yyyy-MM-dd HH:mm:00')
                          });
                      }
                      else if(i === 'cloud') {
                          this.removeMeteoLayer(i);
                          this.addCloudLayer({
                              type: i,
                              datetime: dateObj.Format('yyyy-MM-dd HH:00:00')
                          });
                      }
                  }

                  if(realMenu.environment.menu.airquality.selected) {
                      this.updateAQIStation(dateObj, curRegion.cityName, curRegion.countyName);
                  }
                  if(realMenu.water.menu.water.selected) {
                      this.addWaterStation({
                        datetime: dateObj.Format('yyyy-MM-dd HH:00:00'),
                        cityId: curRegion.cityId,
                        countyId: curRegion.countyId
                      });
                  }
              },
              deep: true
          },
          /*currentRegion: {
              handler(newRegion) {
                  const realMenu = this.realMenu;
                  const meteoMenu = realMenu.meteorology.menu;
                  const envMenu = realMenu.environment.menu;
                  let dateObj = this.dateTime;

                  if(meteoMenu.station.selected) {
                      this.updateStationRealData(dateObj, newRegion.cityName, newRegion.countyName);
                  }

                  if(envMenu.airquality.selected) {
                      this.updateAQIStationData(dateObj, newRegion.cityName, newRegion.countyName);
                  }
              },
              deep: true
          }*/
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

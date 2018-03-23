<template>
    <main id="route-nav" class="ns">
        <section class="route-address-wrapper">
            <ul>
                <li><em></em><span v-text="navPoint.startAddress" :title="navPoint.startAddress" @click="startNav('start')"></span></li>
                <li><em></em><span v-text="navPoint.endAddress" :title="navPoint.endAddress" @click="startNav('end')"></span></li>
            </ul>
        </section>
        <section class="route-plan-wrapper">
            <ul>
                <li @click="changeWay('driving')"><em :class="{'driving_selected': driving}"></em></li>
                <li @click="changeWay('walking')"><em :class="{'walking_selected': walking}"></em></li>
            </ul>
        </section>
        <section class="route-driving-plan" v-show="driving">
            <ul @click="changeStrategy('dS')">
                <li>时间最短</li>
                <li>{{ navPoint.speedFirst.duration }}</li>
                <li>{{ navPoint.speedFirst.distance }}公里</li>
            </ul>
            <ul @click="changeStrategy('dD')">
                <li>距离最短</li>
                <li>{{ navPoint.distanceFirst.duration }}</li>
                <li>{{ navPoint.distanceFirst.distance }}公里</li>
            </ul>
        </section>
        <section class="route-walking-plan" v-show="walking">
            <ul>
                <li>{{ navPoint.walking.duration }}</li>
                <li>{{ navPoint.walking.distance }}公里</li>
            </ul>
        </section>
    </main>
</template>

<script>
import { mapGetters, mapActions} from 'vuex'
import { Helper } from '../../util/Helper'

export default {
    data() {
        return {
            driving: true,
            walking: false,
            distanceFirst: false,
            speedFirst: true,
            navPoint: {
                startAddress: '选择起点',
                endAddress: '选择终点',
                speedFirst: {
                    distance: 0,
                    duration: 0
                },
                distanceFirst: {
                    distance: 0,
                    duration: 0
                },
                walking: {
                    duration: 0,
                    distance: 0
                }
            },
            navHandler: null,
            isStartPoint: true
        }
    },
    beforeDestroy() {
        let navPoint = this.navPoint;
        let helper = new Helper(viewer);
        navPoint.polyline && helper.removeEntity(navPoint.polyline);
        navPoint.startPoint && helper.removeEntity(navPoint.startPoint);
        navPoint.endPoint && helper.removeEntity(navPoint.endPoint);
        helper = null;
    },
    methods: {
        changeStrategy(type) {
            if(type === 'dS') {
                this.distanceFirst = false;
                this.speedFirst = true;
            } else {
                this.distanceFirst = true;
                this.speedFirst = false;
            }
            this.changeNav(type);
        },

        changeWay(type) {
            if(type === 'walking') {
                this.walking = true;
                this.driving = false;
                this.changeNav('walking');
            } else {
                this.walking = false;
                this.driving = true;
                this.changeNav(this.speedFirst ? 'dS' : 'dD');
            }
        },

        startNav(type) {
            let navPoint = this.navPoint;
            let helper = new Helper(viewer);
            let startPoint;

            if(type === 'start') {
                this.clearNav();
                this.isStartPoint = true;
                startPoint = navPoint.startPoint = helper.addBillboard([110, 22], './static/img/routeNav/starting_point.png', 'bottom', 'center', [0, 4], [0, 0, 1], true, 'navStartPoit');
            } else {
                if(!navPoint.startPoint)
                    return;
                navPoint.polyline && helper.removeEntity([navPoint.polyline, navPoint.endPoint]);
                navPoint.endAddress = '选择终点';
                for(let key of ['speedFirst', 'distanceFirst', 'walking']) {
                    navPoint[key] = { distance: 0, duration: 0 };
                }
                this.isStartPoint = false;
                startPoint = navPoint.startPoint;
            }

            if(!this.navHandler)
                this.navHandler = helper.getNewHandler();
            let navHandler = this.navHandler;

            let endPoint = navPoint.endPoint = helper.addBillboard([110, 22], './static/img/routeNav/end_point.png', 'bottom', 'center', [0, 4], [0, 0, 1], false, 'navEndPoint');

            // 添加鼠标移动事件，图标跟随鼠标移动
            helper.setAction('mouseOver', navHandler, null, (entity, index, movement) => {
                let pickedPos = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
                let pos = new Zearth.Cartesian3(pickedPos.x, pickedPos.y, pickedPos.z);
                if(this.isStartPoint)
                    startPoint.position = pos;
                else {
                    endPoint.show = true;
                    endPoint.position = pos;
                }
            });

            helper.setAction('click', navHandler, null, (entity, index, movement) => {
                let pickedPos = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
                let pos = new Zearth.Cartesian3(pickedPos.x, pickedPos.y, pickedPos.z);

                let pointCoor = helper.getCoorFromCtn3(pickedPos);
                let addressPromise = this.$http.jsonp(`http://restapi.amap.com/v3/geocode/regeo?key=67fbfcb22d9900a94cc95af73378c865&location=${pointCoor[0]},${pointCoor[1]}&extensions=base&batch=false&roadlevel=1`);
                if(this.isStartPoint) {
                    startPoint.position = pos;
                    navPoint.startPointCoor = pointCoor;
                    this.isStartPoint = false;

                    addressPromise.then(res => {
                        let data = res.data;
                        navPoint.startAddress = data.info === 'OK' ? data.regeocode.formatted_address : '获取位置失败';
                    });
                }
                else {
                    helper.removeAction(navHandler, 'mouseOver');
                    endPoint.position = pos;
                    navPoint.endPointCoor = pointCoor;

                    addressPromise.then(res => {
                        let data = res.data;
                        navPoint.endAddress = data.info === 'OK' ? data.regeocode.formatted_address : '获取位置失败';
                    });

                    let startPointCoor = navPoint.startPointCoor,
                        endPointCoor = navPoint.endPointCoor;
                    this.$http.jsonp(`http://restapi.amap.com/v3/direction/driving?key=67fbfcb22d9900a94cc95af73378c865&origin=${startPointCoor[0]},${startPointCoor[1]}&destination=${endPointCoor[0]},${endPointCoor[1]}&extensions=base&strategy=11`).then(res => {
                        let data = res.data;
                        if (!data.route) {
                            alert('超出范围');
                            helper.removeEntity([startPoint, endPoint]);
                            return;
                        }
                        let paths = data.route.paths;
                        if(paths.length) {
                            for(let path of paths) {
                                let datetime = this.transSecs2Text(Number(path.duration));
                                let key = path.strategy === '距离最短' ? 'distanceFirst' : 'speedFirst';
                                navPoint[key].duration = datetime;
                                navPoint[key].distance = (Number(path.distance)/1000).toFixed(1);
                                navPoint[key].steps = path.steps;
                            }
                        }

                        let walkingData = this.$http.jsonp(`http://restapi.amap.com/v3/direction/walking?key=67fbfcb22d9900a94cc95af73378c865&origin=${startPointCoor[0]},${startPointCoor[1]}&destination=${endPointCoor[0]},${endPointCoor[1]}`);

                        walkingData.then(res => {
                            let data = res.data;
                            if(data.status === '0' || !data.route) {
                                navPoint.walking.duration = '0时';
                                navPoint.walking.distance = 0;
                                navPoint.walking.steps = [];
                                return;
                            }
                            let path = data.route.paths[0];
                            navPoint.walking.duration = this.transSecs2Text(Number(path.duration));
                            navPoint.walking.distance = (Number(path.distance) / 1000).toFixed(1);
                            navPoint.walking.steps = path.steps;
                        })

                        let pathArray = [];
                        const steps = data.route.paths[0].steps;

                        // 选取每段路的起点最后一段路的终点
                        for (let step of steps) {
                            let lnglats = step.polyline.split(';');
                            for(let v of lnglats) {
                                let lnglat = v.split(',');
                                pathArray.push(lnglat[0], lnglat[1]);
                            }
                        }

                        navPoint.polyline = helper.addPolyline(pathArray, 3, 'chartreuse.7');

                        helper.removeAction(navHandler, 'click');
                        this.isStartPoint = true;
                    });
                }
            });
        },

        clearNav() {
            let helper = new Helper(viewer);
            let navPoint = this.navPoint;

            if(navPoint.polyline) {
                helper.removeEntity(navPoint.polyline);
                delete navPoint.polyline;
            }
            if(navPoint.startPoint) {
                helper.removeEntity(navPoint.startPoint);
                delete navPoint.startPoint;
            }
            if(navPoint.endPoint) {
                helper.removeEntity(navPoint.endPoint);
                delete navPoint.endPoint;
            }
            navPoint.startPointCoor && delete navPoint.startPointCoor;
            navPoint.endPointCoor && delete navPoint.endPointCoor;

            this.navHandler && helper.removeAction(this.navHandler, 'click');
            this.navHandler = null;

            navPoint.startAddress = '选择起点';
            navPoint.endAddress = '选择终点';
            for(let key of ['speedFirst', 'distanceFirst', 'walking']) {
                navPoint[key] = { distance: 0, duration: 0 };
            }

            helper = null;
        },

        changeNav(type) {
            let helper = new Helper(viewer);
            let navPoint = this.navPoint;

            navPoint.polyline && helper.removeEntity(navPoint.polyline);

            let steps;
            switch (type) {
                case 'dS':
                    steps = navPoint.speedFirst.steps;
                    break;
                case 'dD':
                    steps = navPoint.distanceFirst.steps;
                    break;
                case 'walking':
                    steps = navPoint.walking.steps;
                    break;
            }

            if(!steps)
              return;
            let pathArray = [];
            for (let step of steps) {
                let lnglats = step.polyline.split(';');
                for(let v of lnglats) {
                    let lnglat = v.split(',');
                    pathArray.push(lnglat[0], lnglat[1]);
                }
            }

            if(pathArray.length)
                navPoint.polyline = helper.addPolyline(pathArray, 3, 'chartreuse.7');

            helper = null;
        },

        transSecs2Text(s) {
            let hour = Math.floor(s/3600);
            let min = Math.floor(s/60) % 60;
            //let sec = s % 60;

            return `${hour || 0}小时${min ? min + '分' : ''}`;
        }
    },

    watch: {

    }
}
</script>

<style lang="scss" scoped>
#route-nav {
  width: 230px;
  position: absolute;
  top: 32px;
  right: 10px;
  background-color: rgba(70, 70, 70, .5);
  overflow: hidden;
  section.route-address-wrapper {
    width: 100%;
    position: relative;
    border-bottom: 1px solid rgba(255, 255, 255, .2);
    ul {
      display: inline-block;
      font-size: 0;
      li {
        width: 100%;
        height: 30px;
        position: relative;
        display: inline-block;
        font-size: 0;
        cursor: pointer;
        &:hover {
          span {
            color: #299dff;
          }
          em {
            background-position: -87px -7px;
          }
        }
        em {
          width: 20px;
          height: 20px;
          position: relative;
          display: inline-block;
          vertical-align: top;
          margin: 5px 0px 5px 10px;
          background: url(../../assets/toolbar/route_nav.png) -66px -7px no-repeat;
        }
        span {
          width: calc(100% - 38px);
          height: 100%;
          position: relative;
          display: inline-block;
          vertical-align: top;
          font-size: 12px;
          line-height: 30px;
          color: white;
          margin-left: 8px;
          overflow: hidden;
        }
      }
    }
  }

  section.route-plan-wrapper {
    width: 100%;
    height: 30px;
    position: relative;
    border-bottom: 1px solid rgba(255, 255, 255, .1);
    ul {
      width: 100%;
      height: 100%;
      display: inline-block;
      font-size: 0;
      li {
        width: 50%;
        height: 100%;
        position: relative;
        display: inline-block;
        vertical-align: middle;
        font-size: 0;
        cursor: pointer;
        &:hover {
          background-color: rgba(0, 0, 0, .1)!important;
        }
        &:first-of-type {
          width: calc(50% - 1px);
          border-right: 1px solid rgba(255, 255, 255, .1);
        }
        &:last-of-type {
          em {
            background-position: 0px -30px;
          }
        }
        em {
          width: 30px;
          height: 30px;
          position: relative;
          display: inline-block;
          vertical-align: top;
          margin: 0px calc(50% - 15px);
          background: url(../../assets/toolbar/route_nav.png) no-repeat;
        }
      }
      .driving_selected {
        background-position: -30px 0px;
      }
      .walking_selected {
        background-position: -30px -30px !important;
      }
    }
  }

  section.route-driving-plan {
    width: 100%;
    position: relative;
    padding: 10px 0px;
    font-size: 0;
    ul {
      width: calc(50% - 10px);
      position: relative;
      display: inline-block;
      vertical-align: top;
      padding-left: 10px;
      li {
        width: 100%;
        position: relative;
        display: inline-block;
        line-height: 22px;
        color: white;
        font-size: 12px;
        &:nth-child(2) {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
  }

  section.route-walking-plan {
    width: 100%;
    position: relative;
    padding: 10px;
    ul {
      width: 100%;
      li {
        width: calc(50% - 10px);
        height: 20px;
        position: relative;
        display: inline-block;
        vertical-align: top;
        color: white;
        line-height: 20px;
      }
    }
  }
}
</style>

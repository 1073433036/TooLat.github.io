import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './Ranging.html?style=./Ranging.scss'

import { Helper } from '../../../util/Helper'

@WithRender
@Component
export default class Ranging extends Vue {
  @Prop() closeFunc

  pickedColor: any = {
    red: true,
    yellow: false,
    green: false,
    blue: false,
  }
  state: any = {
    ranging: false,
    rangingColor: 'red',
    rangingCount: 0,
    rangingCountArray: {},
    rangingPointCollection: {},
    rangingPointCollectionArray: [],
    rangingLeftHandler: null,
    rangingRightHandler: null,
  }

  pickColor(type) {
    const pickedColor = this.pickedColor;
    if(pickedColor[type]) return;
    for(let i in pickedColor) {
      pickedColor[i] = type === i;
    }
    this.state.rangingColor = type;
  }
  ranging() {
    let helper = new Helper;

    const rangingLeftHandler = helper.getNewEventHandler();
    const rangingRightHandler = helper.getNewEventHandler();
    this.state.rangingLeftHandler = rangingLeftHandler;
    this.state.rangingRightHandler = rangingRightHandler;

    this.addTip();

    let rangingPointCollectionArray = this.state.rangingPointCollectionArray = [];

    helper.addEventListener(rangingLeftHandler, helper.getActionType('leftClick'), (movement) => {
      let pickedPos = helper.pickPosition(movement.position);

      if (!rangingPointCollectionArray.length) {
        rangingPointCollectionArray.push({
          id: rangingPointCollectionArray.length,
          position: pickedPos,
          point: helper.addPoint([pickedPos.x, pickedPos.y, pickedPos.z], 6, 'darkorange'),
          label: helper.addTLabel('起点', [pickedPos.x, pickedPos.y, pickedPos.z],
                      .5, 'white', 'center', 'right', [-5, 0], true, 0)
        });
      } else {
        rangingPointCollectionArray.push({
          id: rangingPointCollectionArray.length,
          position: pickedPos,
        });

        const len = rangingPointCollectionArray.length;
        let lastRangingCollection = rangingPointCollectionArray[len - 1];
        let linePoint = [];
        let buffer = [];

        for (let i = len - 2; i <= len - 1; i++) {
          linePoint.push(...helper.getLnglatFromCartesian(rangingPointCollectionArray[i].position));
        }

        lastRangingCollection.line = helper.addPolyline(linePoint, 4, this.state.rangingColor + '.7');

        lastRangingCollection.point = helper.addPoint([pickedPos.x, pickedPos.y, pickedPos.z], 6, 'darkorange');

        let lastDistance = 0;
        if (len > 2) {
          rangingPointCollectionArray.forEach(collection => {
            if(collection.label) {
              lastDistance += collection.label.name ? Number(collection.label.name) : 0;
            }
          });
        }

        let distance = helper.getDistance([linePoint[0], linePoint[1]], [linePoint[2], linePoint[3]]) / 1000;
        let labelText = (Number(lastDistance) + Number(distance)).toFixed(1) + "公里";
        lastRangingCollection.label = helper.addTLabel(labelText, [pickedPos.x, pickedPos.y, pickedPos.z],
          .5, 'white', 'center', 'left', [5,0], true, distance);
      }

      if (rangingPointCollectionArray.length > 1)
        return;

      // 添加右键点击事件 右键点击取消左键添加定位点
      helper.addEventListener(rangingRightHandler, helper.getActionType('rightClick'), (movement) => {

        ++this.state.rangingCount;
        this.state.rangingCountArray[this.state.rangingCount] = this.state.rangingColor;
        this.state.rangingCountArray = { ...this.state.rangingCountArray }
        this.state.rangingPointCollection[this.state.rangingCount] = rangingPointCollectionArray;
        this.state.rangingPointCollectionArray = [];
        helper.removeAction(rangingLeftHandler, 'leftClick');
        helper.removeAction(rangingRightHandler, 'rightClick');

        this.removeTip();
        setTimeout(()=>{
            helper = null;
        },2000);
      });
    });
  }
  clearRangingPoint(index) {
    let helper = new Helper;
    let rangingPointCollection = this.state.rangingPointCollection;

    if (index == 'all') {
      for(let i in rangingPointCollection) {
        let collection = rangingPointCollection[i];
        for(let entity of collection) {
          helper.removeEntity(entity.point);
          helper.removeEntity(entity.label);
          helper.removeEntity(entity.line);
        }
      }
      rangingPointCollection = {};
      this.state.rangingCount = 0;
      this.state.rangingCountArray = {};
   
      for(let entity of this.state.rangingPointCollectionArray) {   //清除未完成右键点击数据
        helper.removeEntity(entity.point);
        helper.removeEntity(entity.label);
        helper.removeEntity(entity.line);
      }
      this.state.rangingPointCollectionArray = [];
      this.removeTip();
      this.removeHandler();

    } else {
      for(let entity of rangingPointCollection[index]) {
        helper.removeEntity(entity.point);
        helper.removeEntity(entity.label);
        helper.removeEntity(entity.line);
      }
      delete rangingPointCollection[index];
      rangingPointCollection = { ...rangingPointCollection }
      delete this.state.rangingCountArray['' + index]
      this.state.rangingCountArray = { ...this.state.rangingCountArray }
    }
    helper = null;
  }
  removeHandler() {
    let helper = new Helper;
    this.state.rangingLeftHandler && helper.removeAction(this.state.rangingLeftHandler, 'leftClick');
    this.state.rangingRightHandler && helper.removeAction(this.state.rangingRightHandler, 'rightClick');
    helper = null;
  }
  addTip() {
    let tipEl = document.createElement('span')
    tipEl.id = 'rangTip'
    tipEl.innerText = '左键点击开始测量 右键点击结束本次测量'
    tipEl.style.bottom = '45px'
    tipEl.style.left = '50%'
    tipEl.style.transform = 'translateX(-50%)'
    tipEl.style.textAlign = 'center'
    tipEl.style.fontSize = '16px'
    tipEl.style.display = 'inline-block'
    tipEl.style.padding = '4px 14px'
    tipEl.style.color = 'rgb(203, 211, 222)'
    tipEl.style.border = 'solid 1px #6d6c6c'
    tipEl.style.zIndex = '999'
    tipEl.style.position = 'absolute'
    tipEl.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
    tipEl.style.whiteSpace = 'nowrap'
    tipEl.style.lineHeight = '30px'
    tipEl.style.borderRadius = '5px'
    document.body.appendChild(tipEl)
  }
  removeTip() {
    let tipEl = document.querySelector('#rangTip')
    if(tipEl)
      document.body.removeChild(tipEl)
  }

  mounted() {
    this.ranging();
  }
  destroyed() {
    this.clearRangingPoint('all');
  }
}
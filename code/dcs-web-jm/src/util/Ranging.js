export default class Ranging {
  constructor(viewer) {
    this._viewer = viewer;
    this._eventHandler = null;
    this._points = [];                      //存储坐标点
    this._tipBox = null;                    //信息提示框
    this._lineEntity = null;
    this._pointsEntity = [];
    this._labelsEntity = [];
    this._totalDistance = 0;
  }

  startRanging() {
    const viewer = this._viewer;
    let eventHandler = this._eventHandler = new Zearth.ScreenSpaceEventHandler(viewer.scene.canvas);

    //创建信息提示框
    this._creatTipBox();

    //添加鼠标移动事件
    eventHandler.setInputAction((movement) => {
      let pos = movement.endPosition;
      let tipText = this._points.length ? '左键单击添加测量点或右键单击结束测量' : '左键单击开始测量或右键点击退出';
      this._storeTipBox(pos, tipText);

      if(!this._points.length)
        return;
      let pickedPos = viewer.camera.pickEllipsoid(pos, viewer.scene.globe.ellipsoid);
      let lnglat = this._getCoordFromCartesian3(pickedPos);
      let positions = this._getLinePositions(lnglat);
      this.addLineEntity(positions);
    }, Zearth.ScreenSpaceEventType.MOUSE_MOVE);

    //添加鼠标左键单击事件
    eventHandler.setInputAction((movement) => {
      let pickedPos = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
      let lnglat = this._getCoordFromCartesian3(pickedPos);
      this._points.push(lnglat);
      this.addPointEntity();
      this.addLabelEntity();
    }, Zearth.ScreenSpaceEventType.LEFT_CLICK);

    //添加鼠标右键结束测量事件
    eventHandler.setInputAction((movement) => {
      let pickedPos = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
      this.endRanging();
      let degreesArray = this._getLinePositions();
      this.addLineEntity(degreesArray);
    }, Zearth.ScreenSpaceEventType.RIGHT_CLICK);
  }

  endRanging() {
    let eventHandler = this._eventHandler;
    if(eventHandler === null)
      return;

    this._removeTipBox();
    eventHandler.removeInputAction(Zearth.ScreenSpaceEventType.MOUSE_MOVE);
    eventHandler.removeInputAction(Zearth.ScreenSpaceEventType.LEFT_CLICK);
    eventHandler.removeInputAction(Zearth.ScreenSpaceEventType.RIGHT_CLICK);
    eventHandler.destroy();
  }

  clearRanging() {
    let entities = this._viewer.entities;
    if(this._lineEntity)
      entities.remove(this._lineEntity);
    if(this._pointsEntity.length) {
      for(let entity of this._pointsEntity) {
        entities.remove(entity);
      }
    }
    if(this._labelsEntity.length) {
      for(let entity of this._labelsEntity) {
        entities.remove(entity);
      }
    }
  }

  addLineEntity(pos) {
    let positions = new Zearth.Cartesian3.fromDegreesArray(pos);
    if(this._lineEntity) {
      this._lineEntity.polyline.positions = positions;
    } else {
      this._lineEntity = this._viewer.entities.add({
        name: 'rangingLine',
        polyline: {
          width: 4,
          positions,
          material: Zearth.Color.RED.withAlpha(.5),
        }
      });
    }
  }

  addPointEntity() {
    let pos = this._points[this._points.length - 1];
    let point = this._viewer.entities.add({
      name: 'rangingPoint',
      position: new Zearth.Cartesian3.fromDegrees(...pos),
      point: {
        pixelSize: 8,
        outline: true,
        outlineWidth: 1,
        color: Zearth.Color.RED,
        outlineColor: Zearth.Color.MAROON,
        eyeOffset: Zearth.Cartesian3(0, 0, 1)
      }
    });
    this._pointsEntity.push(point);
  }

  addLabelEntity() {
    let points = this._points;
    let len = points.length;
    let labelText;
    if(len > 1) {
      let p0 = points[len - 1],
          p1 = points[len - 2];
      let distance = this._getDistance(p0, p1)/1000;
      this._totalDistance += distance;
      labelText = `${Number(this._totalDistance.toFixed(1))}公里`;
    }
    else {
      labelText = '起点';
    }
    let pos = points[len - 1];
    let labelEntity = this._viewer.entities.add({
      name: 'rangingLabel',
      position: new Zearth.Cartesian3.fromDegrees(...pos),
      label: {
        scale: .4,
        text: labelText,
        fillColor: Zearth.Color.WHITE,
        horizontalOrigin: Zearth.HorizontalOrigin.CENTER,
        verticalOrigin: Zearth.VerticalOrigin.BOTTOM,
        pixelOffset: new Zearth.Cartesian2(...[0, -10]),
        outlineColor: Zearth.Color.RED,
        outlineWidth: 6,
        style: Zearth.LabelStyle.FILL_AND_OUTLINE
      }
    });
    this._labelsEntity.push(labelEntity);
  }

  _getDistance(p0, p1) {
    return Zearth.Cartesian3.distance(new Zearth.Cartesian3.fromDegrees(...p0), new Zearth.Cartesian3.fromDegrees(...p1));
  }

  _getLinePositions(pos) {
    let degreesArray = [];
    for(let p of this._points) {
      degreesArray.push(p[0], p[1]);
    }
    if(pos)
      degreesArray.push(pos[0], pos[1]);
    return degreesArray;
  }

  _creatTipBox() {
    let tipBox = this._tipBox = document.createElement('div');
    tipBox.style.position = 'absolute';
    tipBox.style.padding = '0px 10px';
    tipBox.style.backgroundColor = 'rgba(0, 0, 0, .3)';
    tipBox.style.color = 'white';
    tipBox.style.fontSize = '12px';
    tipBox.style.lineHeight = '20px';
    tipBox.style.borderRadius = '2px';
    tipBox.style.zIndex = 99;
    tipBox.innerText = '';
    document.querySelector('body').appendChild(tipBox);
  }

  _storeTipBox(pos, text) {
    if(this._tipBox === null)
      return;
    this._tipBox.style.top = `${pos.y - 10}px`;
    this._tipBox.style.left = `${pos.x + 10}px`;
    this._tipBox.innerText = text;
  }

  _removeTipBox() {
    if(this._tipBox) {
      document.querySelector('body').removeChild(this._tipBox);
      this._tipBox = null;
    }
  }

  _getCoordFromCartesian3(ctn3) {
    let buffer = Zearth.Cartographic.fromCartesian(ctn3);
    return [this._toDegrees(buffer.longitude), this._toDegrees(buffer.latitude)];
  }

  _toDegrees(val) {
    return Zearth.Math.toDegrees(val);
  }
}

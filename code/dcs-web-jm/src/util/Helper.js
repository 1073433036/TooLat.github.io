export class Helper {
    constructor(viewer) {
        this.viewer = viewer
        this.scene = viewer.scene
        this.entities = viewer.entities

        this.layerCollection = viewer.imageryLayers
    }

    billboard(pos, img, name = 'billboard', ver = 'center', hor = 'center', offset = [0, 0], angle=0) {
        return {
            id: name,
            position: Zearth.Cartesian3.fromDegrees(...pos),
            image: img,    //图片地址
            scale: 1,   //图标尺寸, 最大值1为图片原始大小
            scaleByDistance: new Zearth.NearFarScalar(1.5e2, 1.5, 8.0e5, 0.0),   //根据距离调整图标大小
            pixelOffset: new Zearth.Cartesian2(...offset),   //偏移像素
            horizontalOrigin: this.getHor(ver),   //水平对齐方式
            verticalOrigin: this.getVer(ver),    //垂直对齐方式,
            eyeOffset: new Zearth.Cartesian3(0.0, 0.0, 1000),
            rotation: angle
        }
    }

    polygon(pos, color = 'white', name = 'polygon', show = true, outline = false,
            outlineWidth = 1, outlineColor = 'black') {
        return {
            show: show,
            name: name,
            polygon: {
                hierarchy: {
                    positions: Zearth.Cartesian3.fromDegreesArray(pos)
                },
                outline: outline,
                outlineColor: outlineColor,
                outlineWidth: outlineWidth,
                positions: Zearth.Cartesian3.fromDegreesArray(pos),
                material: this.getColor(color),
            }
        }
    }

    label(text, pos, scale = 1, color = "white", name = 'label', borderStyle = 'fill', borderWidth = 2,
          borderColor = 'white', ver = 'center', hor = 'center', offset = [0, 0], show = true) {

        let style = Zearth.LabelStyle.FILL;
        if(borderStyle === 'outline') {
          style = Zearth.LabelStyle.OUTLINE;
        } else if(borderStyle === 'both') {
          style = Zearth.LabelStyle.FILL_AND_OUTLINE;
        }

        return {
            show,
            name,
            position: Zearth.Cartesian3.fromDegrees(...pos),
            scale: scale,
            text: text,
            fillColor: this.getColor(color),
            horizontalOrigin: this.getHor(hor),
            verticalOrigin: this.getVer(ver),
            scaleByDistance: new Zearth.NearFarScalar(1.5e2, 1.5, 5.0e5, 0.0),   //根据距离调整图标大小
            translucencyByDistance: new Zearth.NearFarScalar(1.5e2, 1.5, 5.0e5, 0.0),
            pixelOffset: new Zearth.Cartesian2(...offset),
            outlineColor : this.getColor(borderColor),
            outlineWidth : borderWidth,
            style
        }
    }

    polylineArrow(pos, width = 10, show = true, name = 'polylineArrow') {
        return {
            show: show,
            name: name,
            polyline: {
                width,
                positions: Zearth.Cartesian3.fromDegreesArray(pos),
                material: new Zearth.PolylineArrowMaterialProperty(Zearth.Color.CHARTREUSE)
            }
        };
    }

    addPoint(pos, size = 4, color = 'white', outlineWidth = 1,
        outlineColor = 'black', show = true, name = 'point', isAdd = true) {
        const coorType = pos.length%2 ? 'c' : 'd';
        const options = {
            show: show,
            name: name,
            position: this.getCoor(coorType, pos),
            point: {
                pixelSize: size,
                outline: true,
                outlineWidth: outlineWidth,
                color: this.getColor(color),
                outlineColor: this.getColor(outlineColor),
                eyeOffset: Zearth.Cartesian3(0, 0, 1),
                // heightReference: Zearth.HeightReference.CLAMP_TO_GROUND
            }
        };
        return isAdd ? this.entities.add(options) : options;
    }

    addBillboard(pos, img, ver = 'center', hor = 'center',
        offset = [0, 0], eyeOffset = [0, 0, 1], show = true, name = 'billboard') {

        const entities = this.entities;
        let coorType = pos.length % 2 == 0 ? 'd' : 'c';

        return entities.add({
            show: show,
            name: name,
            position: this.getCoor(coorType, pos),
            billboard: {
                image: img,
                horizontalOrigin: this.getHor(ver),
                verticalOrigin: this.getVer(ver),
                pixelOffset: new Zearth.Cartesian2(...offset),
                eyeOffset: new Zearth.Cartesian3(...eyeOffset)
            }
        });
    }

    addPolyline(pos, width = 2, color = 'white', show = true, name = 'polyline', hasHeight = false, isAdd = true) {
        const coorType = hasHeight ? 'dH' : (pos.length % 2 ? 'cA' : 'dA');
        const options = {
            show: show,
            name: name,
            polyline: {
                width: width,
                positions: this.getCoor(coorType, pos),
                material: this.getColor(color),
            }
        };

        return isAdd ? this.entities.add(options) : options;
    }

    addDashline(pos, width = 2, color = 'white', show = true, name = 'dashline', hasHeight = false, isAdd = true) {
        const coorType = hasHeight ? 'dH' : (pos.length%2 ? 'cA' : 'dA');
        const options = {
            show,
            name,
            polyline: {
                width,
                positions: this.getCoor(coorType, pos),
                material: new Zearth.PolylineDashMaterialProperty({
                    color: this.getColor(color)
                })
            }
        };
        return isAdd ? this.entities.add(options) : options;
    }

    addPolygon(pos, color = 'white', outline = false,
        outlineWidth = 1, outlineColor = 'black', show = true, name = 'polyline') {

        const entities = this.entities;
        let coorType;

        if (pos.length % 2 == 0) {
            coorType = 'dA';
        } else {
            coorType = 'cA';
        }

        return entities.add({
            show: show,
            name: name,
            polygon: {
                hierarchy: {
                    positions: this.getCoor(coorType, pos)
                },
                outline: outline,
                outlineColor: outlineColor,
                outlineWidth: outlineWidth,
                positions: this.getCoor(coorType, pos),
                material: this.getColor(color),
            }
        })

    }

    addLabel(text, pos, scale = 1,
        color = "white", ver = 'center', hor = 'center', offset = [0, 0],
        show = true, name = 'label', borderStyle = 'fill', borderWidth = 2, borderColor = 'white') {

        let coorType = pos.length % 2 == 0 ? 'd' : 'c';

        let style = Zearth.LabelStyle.FILL;
        if (borderStyle === 'outline') {
            style = Zearth.LabelStyle.OUTLINE;
        } else if (borderStyle === 'both') {
            style = Zearth.LabelStyle.FILL_AND_OUTLINE;
        }

        return this.entities.add({
            show: show,
            name: name,
            position: this.getCoor(coorType, pos),
            label: {
                scale: scale,
                text: text,
                fillColor: this.getColor(color),
                horizontalOrigin: this.getHor(hor),
                verticalOrigin: this.getVer(ver),
                pixelOffset: new Zearth.Cartesian2(...offset),
                outlineColor: this.getColor(borderColor),
                outlineWidth: borderWidth,
                style
            }
        })

    }

    addCylinder(pos, length, topR, bottomR, color = 'white', outline = false,
        outlineColor = 'white', outlineWidth = 1, show = true) {
        let coorType;

        if (pos.length % 2 == 0) {
            coorType = 'd';
        } else {
            coorType = 'c';
        }

        return this.entities.add({
            show: show,
            name: name,
            position: this.getCoor(coorType, pos),
            cylinder: {
                length: length * 100,
                topRadius: topR,
                bottomRadius: bottomR,
                outline: outline,
                outlineColor: this.getColor(outlineColor),
                outlineWidth: outlineWidth,
                material: this.getColor(color),
            }
        })
    }

    addEllipse(pos, xR, yR, fill = true, fillColor = 'yellow',
        outline = false, outlineColor = 'blue.5', outlineWidth = 1, show = true, height, name = 'ellipse') {
        let coorType = pos.length == 2 ? 'd' : 'c';
        return this.entities.add({
            show: show,
            name: name,
            position: this.getCoor(coorType, pos),
            ellipse: {
                extrudedHeight: height * 300,
                semiMajorAxis: xR,
                semiMinorAxis: yR,
                fill: fill,
                outline: outline,
                outlineColor: this.getColor(outlineColor),
                outlineWidth: outlineWidth,
                material: this.getColor(fillColor),
                // granularity: Zearth.Math.PI_OVER_TWO
            }
        })
    }

    addCorridor(pos, width = 500,
        color = 'white', outlineColor, outlineWidth = 200, cornerType = 'round', show = true, name = 'corridor') {

        let corner,
            outline = outlineColor !== "undefined",
            coorType = pos.length % 2 ? 'cA' : 'dA';

        switch (cornerType) {
            case "round", "r": return Zearth.CornerType.ROUNDED;
            case "sharp", "s": return Zearth.CornerType.MITERED;
            case "bevel", "b": return Zearth.CornerType.BEVELED;
        }

        return this.entities.add({
            show: show,
            name: name,
            corridor: {
                width: width,
                positions: this.getCoor(coorType, pos),
                material: this.getColor(color),
                cornerType: corner,
                outline: outline,
                outlineColor: outlineColor,
                outlineWidth: outlineWidth
            }
        });
    }

    addModel(url, degress, rotate, height=0, scale=200, color, collection, idObject) {
      let scene = this.scene;
      let modelMatrix = Zearth.Transforms.eastNorthUpToFixedFrame(Zearth.Cartesian3.fromDegrees(...degress, height));
      let quat = Zearth.Quaternion.fromAxisAngle(Zearth.Cartesian3.UNIT_Z, Zearth.Math.toRadians(rotate - 90));
      let mat3 = Zearth.Matrix3.fromQuaternion(quat);
      let mat4 = Zearth.Matrix4.fromRotationTranslation(mat3, Zearth.Cartesian3.ZERO);
      let m = Zearth.Matrix4.multiplyTransformation(modelMatrix, mat4, new Zearth.Matrix4());
      let model = Zearth.Model.fromGltf({
          url,
          modelMatrix: m,
          id: idObject,
          minimumPixelSize: scale,
          maximumScale: 100,
          asynchronous: false,
          //scale
      });
      if (collection) {
          collection.add(model);
      } else {
          scene.primitives.add(model);
      }

      if (color) {
          Zearth.when(model.readyPromise).then((model) => {
              let mtl = model.getMaterial('material')
              mtl.setValue('diffuse', Zearth.Cartesian4.fromColor(this.getColor(color)))
          });
      }

      if (!collection)
          return model;
    }

    pickModel(type, handler, callback) {
        handler.setInputAction((movement) => {
          let T, Entity, Index, pickedObj, position;
          if (type !== 'mouseOver') {
              pickedObj = this.scene.pick(movement.position);
              position = movement.position;
          }
          if (type === 'mouseOver') {
              pickedObj = this.scene.pick(movement.endPosition);
              position = movement.endPosition;
          }

          if (Zearth.defined(pickedObj) && Zearth.defined(pickedObj.node) && Zearth.defined(pickedObj.mesh)) {
              callback.call(T, position, pickedObj.id, pickedObj);
          }
        }, this.getActType(type));
    }

    customDataSource(name) {
        return new Zearth.CustomDataSource(name);
    }

    addCustomDataSource(dataSource) {
        this.viewer.dataSources.add(dataSource);
    }

    removeDataSource(dataSource) {
        this.viewer.dataSources.remove(dataSource);
    }

    entityCollection() {
        return new Zearth.EntityCollection();
    }

    labelCollection() {
        return new Zearth.LabelCollection();
    }

    billboardCollection() {
        return new Zearth.BillboardCollection();
    }

    polylineCollection() {
        return new Zearth.PolylineCollection();
    }

    primitiveCollection() {
        return new Zearth.PrimitiveCollection();
    }

    addCollection(collection) {
        this.scene.primitives.add(collection);
    }

    removeCollection(collection) {
        this.scene.primitives.remove(collection);
    }

    destroyPrimitive(primitive) {
        primitive.destroy();
    }

    removeEntity(entity) {
        if (Array.isArray(entity)) {
            for (let i of entity) {
                this.entities.remove(i);
            }
        } else {
            this.entities.remove(entity);
        }
    }

    changeTileLayer(tilelayer) {
        const layers = this.layerCollection;

        layers.addImageryProvider(Zearth.createOpenStreetMapImageryProvider({ //地图切片
            url : tilelayer.url,
            fileExtension: tilelayer.ext,
            tileWidth: 256,
            tileHeight: 256,
            minimumLevel: 0,
            maximumLevel: 18,
            tilingScheme: new Zearth.WebMercatorTilingScheme()
        }), 0);

        setTimeout(() => layers.remove(layers.get(1)), 1000);
    }

    setAction(type, handler, entity, callBack, info = `action`, isDrillPick = false) {
        const scene = this.scene;
        if (entity == null) {
            handler.setInputAction((movement) => {
                let T, Entity, Index, pickedObj, position;
                callBack.call(T, entity, Index, movement, info);
            }, this.getActType(type))
            return
        }

        handler.setInputAction((movement) => {
            let T, Entity, Index, pickedObj, position;

            if (type !== 'mouseOver') {
                if (isDrillPick)
                    pickedObj = scene.drillPick(movement.position)
                else
                    pickedObj = scene.pick(movement.position);
                position = movement.position;
            }

            if (type === 'mouseOver') {
                pickedObj = scene.pick(movement.endPosition);
                position = movement.endPosition;
            }

            if (Array.isArray(entity)) {
                if (Zearth.defined(pickedObj)) {
                    let pick = null
                    if (isDrillPick) {
                        let foundEntity = false
                        for (let item of pickedObj) {
                            entity.forEach((el, i, arr) => {
                                if (el === item.id) {
                                    Entity = item.id
                                    Index = i
                                    foundEntity = true
                                    return
                                }
                            })
                            if (foundEntity)
                                break
                        }
                    } else {
                        pick = typeof pickedObj.id !== 'object' ? pickedObj.primitive : pickedObj.id;
                        entity.forEach((el, i, arr) => {
                            if (el === pick) {
                                Entity = pick;
                                Index = i;
                                return
                            }
                        })
                    }
                }

            } else {
                if (Zearth.defined(pickedObj)) {
                    let pick
                    if (drillPick) {
                        for(let item of pickedObj) {
                            if(entity === item.id) {
                                Entity = item.id
                                break
                            }
                        }
                    } else {
                        pick = typeof pickedObj.id !== 'object' ? pickedObj.primitive : pickedObj.id;
                        if (entity === pick) {
                            Entity = pick;
                        }

                    }
                }

            }

            if (!Entity) {
                if (type != 'mouseOver')
                  return;
            }

            callBack.call(T, entity, Index, position, info);

        }, this.getActType(type));
    }

    removeAction(handler, type) {
        const hasThisAction = handler.getInputAction(this.getActType(type));
        if (hasThisAction)
          handler.removeInputAction(this.getActType(type));
    }

    flyTo(points, height) {
        let cH = height || this.viewer.camera.positionCartographic.height
        console.log(height)
        this.viewer.camera.flyTo({
            destination: new Zearth.Cartesian3.fromDegrees(...points, cH),
            // orientation: {
            //     // heading: Zearth.Math.toRadians(45), // east, default value is 0.0 (north)
            //     pitch: Zearth.Math.toRadians(-90),    // default value (looking down)
            //     roll: Zearth.Math.toRadians(0)         // default value
            // },
            duration: 1,
        });
    }

    getViewBounds() {
        const rect = viewer.camera.computeViewRectangle();

        const rectConverted = {
            east: Zearth.Math.toDegrees(rect.east),
            west: Zearth.Math.toDegrees(rect.west),
            north: Zearth.Math.toDegrees(rect.north),
            south: Zearth.Math.toDegrees(rect.south)
        };

        return rectConverted;
    }

    //添加有垂直高度图片
    addVerImgLayer(url, height, rect) {
      return this.entities.add({
        name: 'vertical_layer',
        rectangle: {
          coordinates: Zearth.Rectangle.fromDegrees(rect.left, rect.bottom, rect.right, rect.top),
          height,
          material: new Zearth.ImageMaterialProperty({image: url, transparent: true})
        }
      });
    }

    //添加图片
    addImgLayer(url, rect) {
        let layer = this.layerCollection.addImageryProvider(new Zearth.SingleTileImageryProvider({
            url,
            rectangle: Zearth.Rectangle.fromDegrees(rect.left, rect.bottom, rect.right, rect.top),
        }));
        return layer;
    }

    removeImgLayer(layer) {
        this.layerCollection.remove(layer);
    }

    addNavigationBar(bounds) {
        this.viewer.extend(Zearth.viewerZearthNavigationMixin, {
          defaultResetView: Zearth.Rectangle.fromDegrees(bounds.left, bounds.bottom, bounds.right, bounds.top),
          enableDistanceLegend: false
        });
        document.querySelector('.distance-legend').remove();
    }

    removeNavigationBar() {
        if(this.viewer.zearthNavigation) {
            this.viewer.zearthNavigation.destroy();
        }
    }

    startDrawing(drawType, hasZindex, callback) {
        const scene = this.scene;
        let drawHelper = new DrawHelper(this.viewer);
        switch (drawType) {
            case 'polyline':
                drawHelper.startDrawingPolyline({
                    callback: (positions) => {
                        let polyline = new DrawHelper.PolylinePrimitive({
                            positions,
                            width: 5,
                            geodesic: true
                        });
                        scene.primitives.add(polyline);
                        callback && callback(polyline);
                    }
                });
                break;
            case 'polygon':
                drawHelper.startDrawingPolygon({
                    callback: (positions) => {
                        let polygon;
                        if (hasZindex) {
                            polygon = new Zearth.GroundPrimitive({
                                geometryInstances: new Zearth.GeometryInstance({
                                    geometry: new Zearth.PolygonGeometry.fromPositions({ positions }),
                                    id: 'polygon',
                                    attributes: {
                                        color: new Zearth.ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, .5)
                                    }
                                }),
                            });
                            polygon.getPositions = () => positions;
                        } else {
                            polygon = new DrawHelper.PolygonPrimitive({
                                positions,
                                material: Zearth.Material.fromType('Color', {
                                    color: new Zearth.Color(1.0, 0.0, 0.0, .5)
                                })
                            });
                        }
                        scene.primitives.add(polygon);
                        callback && callback(polygon);
                    }
                });
                break;
            case 'circle':
                drawHelper.startDrawingCircle({
                    callback: (center, radius) => {
                        let circle;
                        if (hasZindex) {
                            circle = new Zearth.GroundPrimitive({
                                geometryInstances: new Zearth.GeometryInstance({
                                    geometry: new Zearth.CircleGeometry({
                                        center,
                                        radius,
                                        vertexFormat: Zearth.EllipsoidSurfaceAppearance.VERTEX_FORMAT
                                    }),
                                    id: 'circle',
                                    attributes: {
                                        color: new Zearth.ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, .5)
                                    }
                                })
                            });
                            circle.getCenter = () => center;
                            circle.getRadius = () => radius;
                        } else {
                            circle = new DrawHelper.CirclePrimitive({
                                center,
                                radius,
                                material: Zearth.Material.fromType('Color', {
                                    color: new Zearth.Color(1.0, 0.0, 0.0, .5)
                                })
                            });
                        }
                        scene.primitives.add(circle);
                        callback && callback(circle);
                    }
                });
                break;
            case 'rect':
                drawHelper.startDrawingExtent({
                    callback(extent) {
                        let extentPrimitive;
                        if (hasZindex) {
                            extentPrimitive = new Zearth.GroundPrimitive({
                                geometryInstances: new Zearth.GeometryInstance({
                                    geometry: new Zearth.RectangleGeometry({
                                        rectangle: extent,
                                        vertexFormat: Zearth.EllipsoidSurfaceAppearance.VERTEX_FORMAT
                                    }),
                                    id: 'extent',
                                    attributes: {
                                        color: new Zearth.ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, .5)
                                    }
                                })
                            });
                            extentPrimitive.getExtent = () => extent;
                        } else {
                            extentPrimitive = new DrawHelper.ExtentPrimitive({
                                extent,
                                material: Zearth.Material.fromType('Color', {
                                    color: new Zearth.Color(1.0, 0.0, 0.0, .5)
                                })
                            });
                        }
                        scene.primitives.add(extentPrimitive);
                        callback && callback(extentPrimitive);
                    }
                });
                break;
        }
        return drawHelper;
    }

    isPointInPolygon(p, poly) {
        let px = p.x,
            py = p.y,
            flag = false;

        for (let i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
            let p1 = this.getCtn2FromCtn3(poly[i]),
                p2 = this.getCtn2FromCtn3(poly[j]);
            let sx = p1.x,
                sy = p1.y,
                tx = p2.x,
                ty = p2.y;

            // 点与多边形顶点重合
            if ((sx === px && sy === py) || (tx === px && ty === py))
                return true;

            // 判断线段两端点是否在射线两侧
            if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
                // 线段上与射线 Y 坐标相同的点的 X 坐标
                let x = sx + (py - sy) * (tx - sx) / (ty - sy);

                // 点在多边形的边上
                if (x === px)
                    return true;

                // 射线穿过多边形的边界
                if (x > px)
                    flag = !flag;
            }
        }

        // 射线穿过多边形边界的次数为奇数时点在多边形内
        return flag;
    }

    removeHandler(handler) {
        if (handler instanceof Zearth.ScreenSpaceEventHandler)
            handler.destroy()
    }
    // support function
    getNewHandler() {
        return new Zearth.ScreenSpaceEventHandler(this.scene.canvas);
    }

    convertRadianToDegrees(value) {
        return Zearth.Math.toDegrees(value)
    }

    getDegByWinPos(position) {
        let pos = this.viewer.camera.pickEllipsoid(position, this.scene.globe.ellipsoid);

        return this.getCoorFromCtn3(pos)
    }

    getCoorFromCtn3(cartesian) {
        let buffer = Zearth.Cartographic.fromCartesian(cartesian)

        return [Zearth.Math.toDegrees(buffer.longitude), Zearth.Math.toDegrees(buffer.latitude)]
    }

    getCtn2FromCtn3(pos) {
        let c3 = new Zearth.Cartesian3.fromDegrees(...pos);
        return new Zearth.Cartesian2.fromCartesian3(c3);
    }

    getDistance(p1, p2) {
        let coorType;
        if (p1.length == 2) {
            coorType = 'd';
        } else {
            coorType = 'c';
        }

        return Zearth.Cartesian3.distance(this.getCoor(coorType, p1), this.getCoor(coorType, p2))
    }

    getVer(type) {
        switch (type) {
            case 'center':
                return Zearth.VerticalOrigin.CENTER;
            case 'top':
                return Zearth.VerticalOrigin.TOP;
            case 'bottom':
                return Zearth.VerticalOrigin.BOTTOM;
        }
    }

    getHor(type) {
        switch (type) {
            case 'center':
                return Zearth.HorizontalOrigin.CENTER;
            case 'right':
                return Zearth.HorizontalOrigin.RIGHT;
            case 'left':
                return Zearth.HorizontalOrigin.LEFT;
        }
    }

    getColor(color) {
        if (Array.isArray(color)) {
            let colorConvert;
            if (color.length === 4) {
                colorConvert = [Number((color[0] / 255).toFixed(6)), Number((color[1] / 255).toFixed(6)),
                Number((color[2] / 255).toFixed(6)), color[3]];
            } else {
                colorConvert = [Number((color[0] / 255).toFixed(6)), Number((color[1] / 255).toFixed(6)),
                Number((color[2] / 255).toFixed(6))];
            }
            return new Zearth.Color(...colorConvert);
        } else if (color.indexOf('#') === 0) {
            return Zearth.Color.fromCssColorString(color)
        } else {
            const isRandom = color.split('.');

            if (isRandom[0] == 'random') {
                if (isRandom.length == 1) {
                    let uc = isRandom[0];
                    return Zearth.Color.fromRandom()
                } else {
                    let uc = Number(isRandom[1]) / 10;
                    return Zearth.Color.fromRandom({ alpha: uc })
                }
            }

            if (isRandom.length == 1) {
                let uc = isRandom[0].toUpperCase()
                return Zearth.Color[uc]
            } else {
                let uc = isRandom[0].toUpperCase()
                return Zearth.Color[uc].withAlpha(isRandom[1] / 10);
            }
        }
    }

    getCoor(coorType, pos) {
        let posValidated = [];
        pos.forEach(el => {
            el && posValidated.push(el);
        });
        switch (coorType) {
            case 'd':
                return new Zearth.Cartesian3.fromDegrees(...posValidated);
            case 'c':
                return new Zearth.Cartesian3(...posValidated);
            case 'cA':
                return new Zearth.Cartesian3.fromArray(posValidated);
            case 'dA':
                return new Zearth.Cartesian3.fromDegreesArray(posValidated);
            case 'dH':
                return new Zearth.Cartesian3.fromDegreesArrayHeights(posValidated);
        }

    }

    getActType(type) {
        switch (type) {
            case 'click':
                return Zearth.ScreenSpaceEventType.LEFT_CLICK;
            case 'leftClick':
                return Zearth.ScreenSpaceEventType.LEFT_CLICK;
            case 'rightClick':
                return Zearth.ScreenSpaceEventType.RIGHT_CLICK;
            case 'leftDown':
                return Zearth.ScreenSpaceEventType.LEFT_DOWN;
            case 'leftUp':
                return Zearth.ScreenSpaceEventType.LEFT_UP;
            case 'rightUp':
                return Zearth.ScreenSpaceEventType.RIGHT_UP;
            case 'leftDoubleClick':
                return Zearth.ScreenSpaceEventType.LEFT_DOUBLE_CLICK;
            case 'rightDoubleClick':
                return Zearth.ScreenSpaceEventType.RIGHT_DOUBLE_CLICK;
            case 'mouseOver':
                return Zearth.ScreenSpaceEventType.MOUSE_MOVE;
        }
    }
}

export const tipBarDisplay = (text, classList = 'tip-bar', animationClass = 'tip-animation') => {
    let target = document.querySelector('.tip-bar')

    if (target) target.parentNode.removeChild(target)


    const tipBarElement = document.createElement('a');
    tipBarElement.className = classList;

    tipBarElement.innerText = text;

    document.querySelector('body').appendChild(tipBarElement);

    setTimeout(() => {
        tipBarElement.className = `animated ${classList} ${animationClass}`;
    }, 100);

    tipBarElement.remove = (time = 2000) => {
        setTimeout(function () {
            tipBarElement.className = classList;

            setTimeout(() => {
                tipBarElement.parentNode.removeChild(tipBarElement);
            }, 300)
        }, time);
    }

    tipBarElement.shake = () => {
        tipBarElement.className = `animated ${classList} ${animationClass} shake`
        setTimeout(function () {
            tipBarElement.classList = `animated ${classList} ${animationClass}`
        }, 1000);
    }

    tipBarElement.changeText = (text) => {
        tipBarElement.innerText = text
    }

    return tipBarElement;
}

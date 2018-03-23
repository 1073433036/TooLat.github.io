import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './RouteNav.html?style=./RouteNav.scss'

import { Helper } from '../../../util/Helper'
import fetchJsonp from 'fetch-jsonp'

@WithRender
@Component
export default class RouteNav extends Vue {
	@Prop() closeFunc

  driving: boolean = true
  walking: boolean = false
  startPointAddress: string = null
  endPointAddress: string = null
  drivingImg: string = '../../../../static/img/navigation/driving_click.png'
  walkingImg: string = '../../../../static/img/navigation/walking_normal.png'
  distanceFirst: boolean = false
  speedFirst: boolean = true
  state: any = {
    nav: false,
    navPoint: {
			startPointCoor: [],
			endPointCoor: [],
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
    navHandler: null
	}
	isPickPos: boolean = false

	changeStrategy(type){
		switch(type){
			case 'dS':
				this.distanceFirst = false;
				this.speedFirst = true;
				break;
			case 'dD':
				this.distanceFirst = true;
				this.speedFirst = false;
				break;
		}
		this.changeNav(type);
	}

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
	}

	pickPoint(type) {
		const Zearth = window["Zearth"],
					viewer = window["viewer"],
					scene = viewer.scene,
					entities = viewer.entities
		const state = this.state;
		this.removeHandler()
		
		const navHandler = new Zearth.ScreenSpaceEventHandler(scene.canvas);
		state.navHandler = navHandler;

		this.clearNavData(type)

		let point = entities.add({
			name: type,
			billboard: {
				image: `../../../../static/img/navigation/${type === 'startPoint' ? 'starting_point' : 'end_point'}.png`,
				verticalOrigin: Zearth.VerticalOrigin.BOTTOM,
				pixelOffset: Zearth.Cartesian2(0, 4),
			}
		})

		state.navPoint[type] = point;
		navHandler.setInputAction((movement) => {
			let pickedPos = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
			point.position = new Zearth.Cartesian3(pickedPos.x, pickedPos.y, pickedPos.z);
		}, Zearth.ScreenSpaceEventType.MOUSE_MOVE)

		navHandler.setInputAction(async movement => {
			let pickedPos = viewer.camera.pickEllipsoid(movement.position, scene.globe.ellipsoid);

			navHandler.removeInputAction(Zearth.ScreenSpaceEventType.MOUSE_MOVE);
			navHandler.removeInputAction(Zearth.ScreenSpaceEventType.LEFT_CLICK);
			this.state.navHandler = null

			point.position = new Zearth.Cartesian3(pickedPos.x, pickedPos.y, pickedPos.z);
			let sp = pickedPos;

			let buffer = Zearth.Cartographic.fromCartesian(sp);
			const coor = [Zearth.Math.toDegrees(buffer.longitude), Zearth.Math.toDegrees(buffer.latitude)]
			state.navPoint[type + 'Coor'] = coor;

			// 获得位置地名
			await fetchJsonp(`http://restapi.amap.com/v3/geocode/regeo?key=67fbfcb22d9900a94cc95af73378c865&location=${coor[0]},${coor[1]}&extensions=base&batch=false&roadlevel=1`)
			.then(async res => {
				let msg: any = await res.json();
				this.isPickPos = true
				this[type + 'Address'] = msg.regeocode.formatted_address;
			})

		}, Zearth.ScreenSpaceEventType.LEFT_CLICK);
	}

	removeHandler() {
		let state = this.state
		if (state.navHandler) {
			state.navHandler.removeInputAction(Zearth.ScreenSpaceEventType.MOUSE_MOVE)
			state.navHandler.removeInputAction(Zearth.ScreenSpaceEventType.LEFT_CLICK)
			state.navHandler = null
		}
	}

	@Watch('startPointAddress')
	async onstartPointAddressChanged(val: any, oldVal: any) {
		if (this.isPickPos)
			this.isPickPos = false
		else
			await this.getPosition('startPoint', val)
		if(this.endPointAddress)
			this.nav()
	}

	@Watch('endPointAddress')
	async onendPointAddressChanged(val: any, oldVal: any) {
		if (this.isPickPos)
			this.isPickPos = false
		else
			await this.getPosition('endPoint', val)
		if(this.startPointAddress)
			this.nav()
	}

	async getPosition(type, address) {
		this.clearNavData(type)

		let coor = type === 'startPoint' ? 'startPointCoor' : 'endPointCoor'
		let res = await fetchJsonp(`http://restapi.amap.com/v3/geocode/geo?address=${address}&output=JSON&key=67fbfcb22d9900a94cc95af73378c865`)
		let msg: any = await res.json()
		if (!msg.geocodes.length) {
			this.state.navPoint[coor] = []
			return
		}
		let location = msg.geocodes[0].location
		let lonlat = location.split(',')
		let lon = Number(lonlat[0]), lat = Number(lonlat[1])
		this.state.navPoint[coor] = [lon, lat]

		this.state.navPoint[type] = window["viewer"].entities.add({
			name: type,
			position: Zearth.Cartesian3.fromDegreesArray([lon, lat])[0],
			billboard: {
				image: `../../../../static/img/navigation/${type === 'startPoint' ? 'starting_point' : 'end_point'}.png`,
				verticalOrigin: Zearth.VerticalOrigin.BOTTOM,
				pixelOffset: window["Zearth"].Cartesian2(0, 4),
			}
		})
	}

	async nav() {
		let navPoint = this.state.navPoint
		let startPointCoor = navPoint.startPointCoor
		let endPointCoor = navPoint.endPointCoor
		if(!startPointCoor.length && !endPointCoor.length) return

		let res = await fetchJsonp(`http://restapi.amap.com/v3/direction/driving?key=67fbfcb22d9900a94cc95af73378c865&origin=${startPointCoor[0]},${startPointCoor[1]}&destination=${endPointCoor[0]},${endPointCoor[1]}&extensions=base&strategy=0`)
		let msg: any = await res.json()
		if (!msg.route) {
			alert('超出范围')
			window["viewer"].entities.remove(navPoint.startPoint)
			window["viewer"].entities.remove(navPoint.endPoint)
			return
		}
		navPoint.speedFirst.duration = (msg.route.paths[0].duration / 3600).toFixed(1)
		navPoint.speedFirst.distance = (msg.route.paths[0].distance / 1000).toFixed(1)
		navPoint.speedFirst.steps = msg.route.paths[0].steps

		const pathArray = [];
		const steps = msg.route.paths[0].steps;
		let buffer;
		// 选取每段路的起点  最后一段路的终点
		for (let i in steps) {
			buffer = steps[i].polyline.replace(/;/g, ',').split(',');
			pathArray.push(buffer[0], buffer[1]);
			if (Number(i) == steps.length - 1) {
				pathArray.push(buffer[buffer.length - 2], buffer[buffer.length - 1]);
			}
		}
		navPoint.polyline = window["viewer"].entities.add({
			polyline: {
				positions: window["Zearth"].Cartesian3.fromDegreesArray(pathArray),
				material: window["Zearth"].Color.fromRandom({ alpha: 0.7 }),
				width: 3
			}
		})

		res = await fetchJsonp(`http://restapi.amap.com/v3/direction/driving?key=67fbfcb22d9900a94cc95af73378c865&origin=${startPointCoor[0]},${startPointCoor[1]}&destination=${endPointCoor[0]},${endPointCoor[1]}&extensions=base&strategy=2`)
		msg = await res.json()
		navPoint.distanceFirst.duration = (msg.route.paths[0].duration / 3600).toFixed(1)
		navPoint.distanceFirst.distance = (msg.route.paths[0].distance / 1000).toFixed(1)
		navPoint.distanceFirst.steps = msg.route.paths[0].steps

		res = await fetchJsonp(`http://restapi.amap.com/v3/direction/walking?key=67fbfcb22d9900a94cc95af73378c865&origin=${startPointCoor[0]},${startPointCoor[1]}&destination=${endPointCoor[0]},${endPointCoor[1]}`)
		msg = await res.json()
		navPoint.walking.duration = (msg.route.paths[0].duration / 3600).toFixed(1)
		navPoint.walking.distance = (msg.route.paths[0].distance / 1000).toFixed(1)
		navPoint.walking.steps = msg.route.paths[0].steps
	}

	clearNavData(type) {
		this.state.navPoint.speedFirst.distance = 0
		this.state.navPoint.speedFirst.duration = 0
		this.state.navPoint.distanceFirst.distance = 0
		this.state.navPoint.distanceFirst.duration = 0
		this.state.navPoint.walking.distance = 0
		this.state.navPoint.walking.duration = 0
		if (this.state.navPoint.polyline)
			window["viewer"].entities.remove(this.state.navPoint.polyline)
		if (this.state.navPoint[type])
			window["viewer"].entities.remove(this.state.navPoint[type])
	}

	clearNav() {
		let helper = new Helper;
		this.state.navPoint.polyline && helper.removeEntity(this.state.navPoint.polyline);
		this.state.navPoint.endPoint && helper.removeEntity(this.state.navPoint.endPoint);
		this.state.navPoint.startPoint && helper.removeEntity(this.state.navPoint.startPoint);
		if(this.state.navHandler) {
			helper.removeAction(this.state.navHandler, 'leftClick');
			helper.removeAction(this.state.navHandler, 'mouseOver');
		}
		helper = null;
	}
  
	changeNav(type) {
		let helper = new Helper;

		const pathArray = [];
		let buffer;
		let steps;

		this.state.navPoint.polyline && helper.removeEntity(this.state.navPoint.polyline);

		switch (type) {
			case 'dS':
				steps = this.state.navPoint.speedFirst.steps;
				break;
			case 'dD':
				steps = this.state.navPoint.distanceFirst.steps;
				break;
			case 'walking':
				steps = this.state.navPoint.walking.steps;
				break;
		}

		for (let i in steps) {
			buffer = steps[i].polyline.replace(/;/g, ',').split(',');
			pathArray.push(buffer[0], buffer[1]);
			if (Number(i) === steps.length - 1) {
				pathArray.push(buffer[buffer.length - 2], buffer[buffer.length - 1]);
			}
		}

		if(pathArray.length != 0)
			this.state.navPoint.polyline = helper.addPolyline(pathArray, 3, 'random.7');

		helper = null;
	}

	@Watch('driving')
	ondrivingChanged(val: any, oldVal: any): void {
		this.drivingImg = `../../../../static/img/navigation/driving_${val ? 'click' : 'normal'}.png`;
	}
	@Watch('walking')
	onwalkingChanged(val: any, oldVal: any): void {
		this.walkingImg = `../../../../static/img/navigation/walking_${val ? 'click' : 'normal'}.png`;
	}

	beforeDestroy() {
		this.clearNav();
	}
}
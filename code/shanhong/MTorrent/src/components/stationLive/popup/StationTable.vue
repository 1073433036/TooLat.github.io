<template>
  <main id="StationTable" class="global-popup" v-drag>
    <header>
      <span>{{ stationTableInfo_global.station_id + ' ' + stationTableInfo_global.info.cname }}</span>
      <em @click="storePopupStatus_global({ key: 'StationTable', action: false })"></em>
    </header>
    <div class="content">
			<div class="opts">
				<select v-model="elementSelected" class="eles">
					<option v-for="(el, key) in elements" :key="key" :value="key">{{ el.name }}</option>
				</select>
				<el-radio class="radio" v-model="chartTypeSelected" :label="key" v-for="(el, key) in chartType" :key="key">
					{{ el }}
				</el-radio>
			</div>
			<div class="opts bt">
				<el-date-picker v-model="startDate" size="small" :editable="false" :clearable="false" type="date"></el-date-picker>
        <span>日</span>
        <select v-model="startHour">
          <option :value="0">00</option>
          <option v-for="i in 23" :key="i" :value="i">{{ i >= 10 ? i : '0' + i }}</option>
        </select>
        <span>时</span>
        <select v-model="startMinute">
          <option :value="0">00</option>
          <option v-for="i in 11" :key="i" :value="i*5">{{ i*5 >= 10 ? i*5 : '0' + i*5 }}</option>
        </select>
        <span>分</span>
				<span style="margin: 0 15px;">---</span>
				<el-date-picker v-model="endDate" size="small" :editable="false" :clearable="false" type="date"></el-date-picker>
        <span>日</span>
        <select v-model="endHour">
          <option :value="0">00</option>
          <option v-for="i in 23" :key="i" :value="i">{{ i >= 10 ? i : '0' + i }}</option>
        </select>
        <span>时</span>
        <select v-model="endMinute">
          <option :value="0">00</option>
          <option v-for="i in 11" :key="i" :value="i*5">{{ i*5 >= 10 ? i*5 : '0' + i*5 }}</option>
        </select>
        <span>分</span>
			</div>
			<figure v-loading="loading" element-loading-text="正在获取数据">
				<div class="table-wrapper" id="tableWrapper"></div>
			</figure>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
	import { Getter, Action } from 'vuex-class'
	import { productClient } from '../../../util/clientHelper'
  import { getVelLevel } from '../../../util/windHelper'
	import moment from 'moment'
	import echarts from 'echarts/lib/echarts'
	import 'echarts/lib/chart/line'
	import 'echarts/lib/chart/bar'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/title'

	let chartElement: any = null
	const colorToRgba = (color, alpha) => {
		if (color.length == 4) {
			let colorString = '#'
			for(let i = 1; i < 4; i++)
				colorString += color.slice(i,i+1).concat(color.slice(i,i+1))
			color = colorString
		}
		let colorArr: any[] = []
		for(let i = 1; i < 7; i += 2) {  
			colorArr.push(parseInt("0x" + color.slice(i, i + 2)))
		}
		return 'rgba(' + colorArr.join(', ') + ', ' + alpha + ')'
	}

  @Component
  export default class StationTable extends Vue {
    @Getter('systemStore/stationTableInfo_global') stationTableInfo_global: any
    @Action('systemStore/storePopupStatus_global') storePopupStatus_global: any
		info: any = {}
		elementSelected: string = 'temp'
		elements: any = {
      temp: { name: '气温', unit: '℃', color: '#fc302f' },
      ps: { name: '气压', unit: 'hpa', color: '#30302f' },
      rfhour: { name: '降水', unit: 'mm', color: '#018001' },
      dp: { name: '露点温度', unit: '℃', color: '#803000' },
      wd2df: { name: '2分钟风', unit: 'm/s', color: '#00de00' },
      wd10df: { name: '10分钟风', unit: 'm/s', color: '#aa3aaf' },
      wd10maxdf: { name: '最大风', unit: 'm/s', color: '#aa3aaf' },
      rh: { name: '相对湿度', unit: '%', color: '#9933cc' },
      rfday: { name: '日雨量', unit: 'mm', color: '#01b501' },
      tempdaymax: { name: '日最高温度', unit: '℃', color: '#f00' },
      t24: { name: '24时变温', unit: '℃', color: '#000' },
      tempdaymin: { name: '日最低温度', unit: '℃', color: '#2121fb' },
		}
		chartTypeSelected: string = 'line'
		chartType: any = { line: '折线图', bar: '柱状图' }
		hasInitTime: boolean = false
		startDate: Date = new Date()
    startHour: number = new Date().getHours()
		startMinute: number = 0
		endDate: Date = new Date()
    endHour: number = new Date().getHours()
		endMinute: number = 0
		loading: boolean = true

    mounted() {
			this.initDate()
			this.getInfo()
		}

		beforeDestroy() {
			chartElement = null
		}

		// 初始化日期
		initDate() {
			this.hasInitTime = false
			let endTime: any = this.stationTableInfo_global.datetime
			let startTime: any = moment(endTime).subtract(1, 'hours')
			startTime = new Date(startTime)
			this.startDate = startTime
			this.startHour = startTime.getHours()
			this.startMinute = startTime.getMinutes()
			endTime = new Date(endTime.replace(/-/g, '/'))
			this.endDate = endTime
			this.endHour = endTime.getHours()
			this.endMinute = endTime.getMinutes()
			setTimeout(() => this.hasInitTime = true, 0)
		}

		// 获取日期
		getDate(type: 'start' | 'end') {
			let date, hour, minute
			if (type === 'start') {
				date = this.startDate
				hour = this.startHour
				minute = this.startMinute
			} else if (type === 'end') {
				date = this.endDate
				hour = this.endHour
				minute = this.endMinute
			}
			hour = hour >= 10 ?  hour : '0' + hour
			minute = minute >= 10 ?  minute : '0' + minute
			return moment(date).format('YYYY-MM-DD') + ' ' + hour + ':' + minute + ':00'
		}

    // 获取站点范围数据
    async getInfo() {
			this.loading = true
			let stationId = this.stationTableInfo_global.station_id,
					startTime = this.getDate('start'),
					endTime = this.getDate('end')
			let res = await productClient.findStationTableData(stationId, startTime, endTime)
			this.loading = false
			if (res) {
				this.info = []
				for (let el of res) {
					this.info.unshift(el)
				}
				this.drawChart()
			} else {
				this.info = {}
				Vue['prototype']['$message']({
					type: 'error',
					message: '数据获取失败'
				})
			}
		}

		// 绘制图表
		drawChart() {
			let timeArr: any[] = []
			let eleArr: any[] = []
			let windRote: any[] = []

			let obj = {}
			for (let opt of this.info) {
				obj[opt.datetime] = opt
				timeArr.push(opt.datetime)
				eleArr.push(null)
				windRote.push(null)
			}
			timeArr.sort((a, b) => a - b)
			timeArr.map((time, index, self) => {
				eleArr[index] = obj[time].elements[this.elementSelected] === 9999 ? undefined : obj[time].elements[this.elementSelected]
				windRote[index] = obj[time].elements[this.elementSelected.replace('df', 'dd')]
				self[index] = moment(time).format('MM-DD HH:mm')
			})
			
			if (!chartElement)
				chartElement = echarts.init(document.getElementById('tableWrapper'))
			let item = this.elements[this.elementSelected]

      let series: any[] = [{
        name: item.name,
        type: this.chartTypeSelected,
        itemStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: item.color },
							{ offset: 0.5, color: colorToRgba(item.color, 0.7) },
							{ offset: 1, color: colorToRgba(item.color, 0.5) }
						])
					}
				},
        lineStyle: { normal: { color: item.color } },
        data: eleArr,
      }]
      let data: any = []
      if (/wd/.test(this.elementSelected)) {
        for (let index = 0; index < windRote.length; index++) {
          let url = 'image://' + 'static/img/echartsWind/' + getVelLevel(eleArr[index]) + '.png';
          data.push({
            value: eleArr[index],
            symbol: url,
            symbolSize: [38, 68],
            symbolRotate: 0-windRote[index],
          })
        }
        series[0].data = data
      }
			chartElement.setOption({
				title: { text: item.name },
				tooltip: {
          trigger: 'axis',
					formatter: function(params) {
						let ref = data.length > 1 ? params[0].data.value : params[0].data
						return params[0].name + ' : ' + ref + item.unit
						// let ref = data.length > 1 ? params.data.value : params.data
					  // return params.name + ' : ' + ref + item.unit
					}
				},
				xAxis: {
					data: timeArr,
					axisTick: {
						interval: 0,
						alignWithLabel: true
					}
				},
				yAxis: {
					type: 'value',
					axisLabel: {
            formatter: `{value} ${item.unit}`
        	}
				},
				series: series,
			})
		}

		@Watch('stationTableInfo_global')
		onStationTableInfo_globalChanged(val: any, oldVal: any) {
			this.initDate()
			this.getInfo()
		}

		@Watch('elementSelected')
		onElementSelected(val: string, oldVal: string) {
			this.drawChart()
		}
		@Watch('chartTypeSelected')
		onchartTypeSelectedChanged (val: string, oldVal: string) {
			this.drawChart()
		}

		timeChanged() {
			let startTime: any = this.getDate('start')
			startTime = new Date(startTime.replace(/-/g, '/')).getTime()
			let endTime: any = this.getDate('end')
			endTime = new Date(endTime.replace(/-/g, '/')).getTime()
			if (startTime > endTime) {
				Vue['prototype']['$message']({
					type: 'error',
					message: '起始时间不得晚于终止时间'
				})
			} else if (startTime < endTime - 12*60*60*1000) {
				Vue['prototype']['$message']({
					type: 'error',
					message: '起始时间与终止时间的间隔不得大于12小时'
				})
			} else {
				this.getInfo()
			}
		}

		@Watch('startDate')
		onstartDateChanged (val: any, oldVal: any) {
			if (this.hasInitTime) this.timeChanged()
		}
		@Watch('startHour')
		onstartHourChanged (val: number, oldVal: number) {
			if (this.hasInitTime) this.timeChanged()
		}
		@Watch('startMinute')
		onstartMinuteChanged (val: number, oldVal: number) {
			if (this.hasInitTime) this.timeChanged()
		}
		@Watch('endDate')
		onendDateChanged (val: any, oldVal: any) {
			if (this.hasInitTime) this.timeChanged()
		}
		@Watch('endHour')
		onendHourChanged (val: number, oldVal: number) {
			if (this.hasInitTime) this.timeChanged()
		}
		@Watch('endMinute')
		onendMinuteChanged (val: number, oldVal: number) {
			if (this.hasInitTime) this.timeChanged()
		}
  }
</script>

<style lang='scss' scoped>
#StationTable {
  position: absolute;
  top: calc(50% - 254px);
  left: calc(50% - 415px);
  width: 900px;
  .content {
		.opts {
			height: 44px;
			color: #999;
			line-height: 44px;
			&.bt {
				padding-left: 20px;
				border-bottom: 1px solid #ccc;
			}
			select {
        margin: 0 2px 0 10px;
        width: 55px;
        height: 24px;
        padding-left: 6px;
        border: 1px solid #dcdcdc;
        border-radius: 2px;
				&.eles {
        	margin: 0 20px;
					width: 120px;
				}
			}
		}
		.table-wrapper {
			width: 860px;
			height: 430px;
			padding: 20px;
		}
  }
}
</style>

<style lang='scss'>
#StationTable {
  .el-date-editor.el-input {
    margin-left: 0;
    width: 94px;
  }
  .el-input__inner {
    color: #000;
    border: 1px solid #dcdcdc;
    background: #fff;
  }
  .el-input--small .el-input__inner {
    height: 24px;
  }
  .el-input__inner {
    border-radius: 4px;
  }
	.el-radio__input.is-checked .el-radio__inner {
		border-color: #f3ac12;
    background: #f3ac12;
	}
	.el-radio__input.is-checked+.el-radio__label {
		color: #f3ac12;
	}
	figure {
    margin: 0;
    .el-loading-spinner {
      top: 40%;
    }
  }
}
</style>

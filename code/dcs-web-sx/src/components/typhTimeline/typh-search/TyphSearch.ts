import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './TyphSearch.html?style=./TyphSearch.scss'
import fetchJsonp from 'fetch-jsonp'

@WithRender
@Component
export default class TyphSearch extends Vue {
  @Prop() maxTyphYear
  @Prop() minTyphYear

  @Getter('systemStore/typhCurrentYear_global') typhCurrentYear_global
  @Getter('systemStore/typhTimelineStatus_global') typhTimelineStatus_global
  @Getter('systemStore/blurControl_global') blurControl_global
  @Action('systemStore/changeTyphCurrentYear_global') changeTyphCurrentYear_global
  @Action('systemStore/toggleTyphTimelineStatus_global') toggleTyphTimelineStatus_global
  @Action('systemStore/selectTyph_global') selectTyph_global

  searchText: string = ''
  searchResult: Array<any> = []
  haveNoResult: boolean = false
  searchInputDelay: any = null
  searching: boolean = false


  @Watch('searchText')
  async onsearchTextChanged(val, oldVal: string) {
    this.searchResult = []
    setTimeout(() => {
      this.haveNoResult = false
    }, 300)
    if (this.searchInputDelay) clearTimeout(this.searchInputDelay)
    this.searchInputDelay = setTimeout(async () => {
      if (val === "") {
        this.searching = false
        this.searchResult = []
        return
      }

      let url = 'http://10.148.83.228:8921/typhoon/info/find?' + (isNaN(Number(val)) ? 'cname=' : 'intlid=') + val
      let res = await fetch(url)
      let data: any = await res.json()
      
      if (data.length === 0) {
        this.haveNoResult = true
        return
      }
      this.searchResult = data
      this.searching = true
      console.info(this.searchResult)
    }, 500)
  }

  @Watch('blurControl_global')
  onblurControl_globalChanged(val: any, oldVal: any): void {
    let ele: any = document.querySelector('#searchTyph')
    ele.blur()
  }


  async mounted() {
  }
  changeTyphCurrentYear(action: 'nextYear' | 'preYear') {
    if (action === 'nextYear') {
      if (this.typhCurrentYear_global == this.maxTyphYear) return
      this.changeTyphCurrentYear_global(this.typhCurrentYear_global + 1)
    }

    if (action === 'preYear') {
      if (this.typhCurrentYear_global == this.minTyphYear) return
      this.changeTyphCurrentYear_global(this.typhCurrentYear_global - 1)
    }
    this.toggleTyphTimelineStatus_global('history')
  }

  toggleTimelineStatus() {
    switch (this.typhTimelineStatus_global) {
      case 'search':
        this.toggleTyphTimelineStatus_global('history'); break
      case 'history':
        this.toggleTyphTimelineStatus_global('search'); break
      case 'detail':
        this.toggleTyphTimelineStatus_global('history'); break
      default: this.toggleTyphTimelineStatus_global('search')
    }
  }
}





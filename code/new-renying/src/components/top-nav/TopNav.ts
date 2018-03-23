import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './TopNav.html?style=./TopNav.scss'
import { combinationClient } from '../../util/clientHelper'

@WithRender
@Component
export default class TopNav extends Vue {
  @Action('systemStore/changeSubMenu_global') changeSubMenu_global

  menu: any = []
  menuSelected: number = null
  width: string = null
  

  async mounted() {
    await this.getMenu()
    let num = this.menu.length
    this.width = (1 / num) * 100 + '%'
  }

  async getMenu() {
    let data = await combinationClient.getMenu()
    if (!data) return
    this.menu = data
    let key = data[0].id, submenu = data[0].combinationSuns
    this.toggleMenu(key, submenu)
  }

  toggleMenu(key, submenu) {
    this.menuSelected = key
    this.changeSubMenu_global(submenu)
  }
  
}
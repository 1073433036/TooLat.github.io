import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './UserManagement.html?style=./UserManagement.scss'

import InfoMoniter from './info-moniter/InfoMoniter'
import MultipleMoniter from './multiple-moniter/MultipleMoniter'
import UserSystem from './user-system/UserSystem'

@WithRender
@Component
export default class UserManagement extends Vue {
	@Getter('systemStore/systemTitle_global') systemTitle_global
	@Action('systemStore/toggleUserManagement_global') toggleUserManagement_global 

	currentView: any = InfoMoniter
	navOptionSelect: 'info' | 'multiple' | 'user' = 'info'

	togglePanel(type) {
		if(this.navOptionSelect !== type)
			this.navOptionSelect = type
	}

	@Watch('navOptionSelect')
	onNavOptionSelectChanged(val) {
		if(val === 'info')
			this.currentView = InfoMoniter
		if(val === 'multiple')
			this.currentView = MultipleMoniter
		if(val === 'user')
			this.currentView = UserSystem
	}
}
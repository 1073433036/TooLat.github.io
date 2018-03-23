import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import { userClient } from '../util/clientHelper'
import { Base64 } from 'js-base64'
import modulesConf from '../config/modulesConf'

const Login: any = () => import('@/components/Login.vue')
const MainViewer: any = () => import('@/components/MainViewer.vue')
const StationLiveEntry: any = () => import('@/components/stationLive/StationLiveEntry.vue')
const RiskWarningEntry: any = () => import('@/components/riskWarning/RiskWarningEntry.vue')
const PupProductEntry: any = () => import('@/components/pupProduct/PupProductEntry.vue')
const WarningAnalysisEntry: any = () => import('@/components/warningAnalysis/WarningAnalysisEntry.vue')
const typhoonEntry: any = () => import('@/components/typhoonInfo/typhoonEntry.vue')
const SatilliteCloud: any = () => import('@/components/satilliteCloud/satilliteCloud.vue')
const geolDisasterVue: any = () => import('@/components/geolDisaster/geolDisaster.vue')
const DecisionServiceVue: any = () => import('@/components/decisionService/decisionService.vue')
const EmergResponseEntry: any = () => import('@/components/emergResponse/EmergResponseEntry.vue')
const UserManagement: any = () => import('@/components/userManagement/UserManagement.vue')

let router = new VueRouter({
  routes: [
    {
      path: '*',
      beforeEnter: async (to, from, next) => {
        // 单点登录
        let key = to.fullPath.slice(1)
        let res: any = await userClient.ssoLogin(key)
        if (res) {
          sessionStorage.userId = res.user.id
          sessionStorage.username = res.user.name
          sessionStorage.password = Base64.encode( res.user.password)
          sessionStorage.cityid = res.user.cityid
          sessionStorage.cityName = res.user.cityName
          sessionStorage.countyId = res.user.countyId
          sessionStorage.countyName = res.user.countyName
          router.app.$store.dispatch('systemStore/storeUserInfo_global', res)
          let list: any[] = []
          if (res.authority) {
            let isAdministrator = false
            for (let el of res.authority) {
              if (el.description === 'user') {
                isAdministrator = true
                continue
              }
              list.push(el.description)
            }
            router.app.$store.dispatch('systemStore/storeAdministrator_global', isAdministrator)
          }
          // let list = ["station", "warning", "typhoon", "cloud", "geol", "decision"]     // old
          let modules: any = list.map((el: string) => (<any>modulesConf)[el])
          router.app.$store.dispatch('systemStore/storeModuleList_global', modules)
          return next({ name: 'MainViewer', replace: true })
        }
        else
          return next({ path: '/login', replace: true })
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'MainViewer',
      component: MainViewer,
      beforeEnter: (to, from, next) => {
        if (sessionStorage.userId) next()
        else next({ path: '/login', replace: true })
      },
      children: [
        { path: 'stationLive', name: 'stationLive', component: StationLiveEntry },
        { path: 'riskWarning', name: 'riskWarning', component: RiskWarningEntry },
        { path: 'pupProduct', name: 'pupProduct', component: PupProductEntry },
        { path: 'warningAnalysis', name: 'warningAnalysis', component: WarningAnalysisEntry },
        { path: 'typhoonInfo', name: 'typhoonInfo', component: typhoonEntry },
        { path: 'satilliteCloud', name: 'satilliteCloud', component: SatilliteCloud },
        { path: 'geolDisaster', name: 'geolDisaster', component: geolDisasterVue },
        { path: 'decisionService', name: 'decisionService', component: DecisionServiceVue },
        { path: 'emergResponse', name: 'emergResponse', component: EmergResponseEntry },
        { path: 'userManagement', name: 'userManagement', component: UserManagement }
      ]
    }
  ]
})

export default router
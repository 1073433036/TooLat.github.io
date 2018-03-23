import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const Login: any = () => import('@/components/UserManagement/Login.vue')
const MainViewer: any = () => import('@/components/MainViewer.vue')


const WarningMessage: any = () => import('@/components/WarningMessage/WarningMsgEntry.vue')
const DecisionCommand: any = () => import('@/components/DecisionCommand/DecisionEntry.vue')

const InfoManagement: any = () => import('@/components/InfoManagement/InfoManageEntry.vue')
const MD_typhoon: any =() => import('@/components/InfoManagement/MeteorologicalDisasters/HistoryTyphoonInfo.vue')
const MD_waterlogging: any = () => import('@/components/InfoManagement/MeteorologicalDisasters/WaterloggingInfo.vue')
const MD_mountainTorrents: any = () => import('@/components/InfoManagement/MeteorologicalDisasters/MountainTorrents.vue')
const MD_geologicalDisaster: any = () => import('@/components/InfoManagement/MeteorologicalDisasters/GeologicalDisaster.vue')

const InfoPublish: any = () => import('@/components/InfoManagement/InfoPublish/InfoPublish.vue')
const WaringEntry: any = () => import('@/components/InfoManagement/InfoPublish/WaringEntry.vue')
const PublishMonitoring: any = () => import('@/components/InfoManagement/InfoPublish/PublishMonitoring.vue')
const RetrievalStatistical: any = () => import('@/components/InfoManagement/InfoPublish/RetrievalStatistical.vue')
const GroupManagement: any = () => import('@/components/InfoManagement/InfoPublish/GroupManagement.vue')
const TemplateManagement: any = () => import('@/components/InfoManagement/InfoPublish/TemplateManagement.vue')
const AuditCenter: any = () => import('@/components/InfoManagement/InfoPublish/AuditCenter.vue')

const DisasterRelief: any = () => import('@/components/InfoManagement/DisasterRelief/DisasterRelief.vue')
const DisasterInformation: any = () => import('@/components/InfoManagement/DisasterInformation/DisasterInformation.vue')
const usersInfoManage: any = () => import('@/components/InfoManagement/UsersInfoMannage/UsersInfoManage.vue')
const contingencyPlanManage: any = () => import('@/components/InfoManagement/ContingencyPlan/ContingencyPlan.vue')

const routes = [
  {
    path: '/',
    name: 'MainViewer',
    component: MainViewer
  },
  {
    path: '/main',
    name: 'MainViewer',
    component: MainViewer
  },
  {
    path: '/InfoManagement',
    name: 'InfoManagement',
    component: InfoManagement,
    children: [
      { path: '',redirect:'MeteorologicalDisastersWaterlogging' },
      {
        path:'MeteorologicalDisastersWaterlogging',
        name: 'MD_waterlogging',
        component: MD_waterlogging,
      },
      {
        path:'MeteorologicalDisastersTyphoon',
        name: 'MD_typhoon',
        component: MD_typhoon,
      },
      {
        path:'MeteorologicalDisastersMountainTorrents',
        name: 'MD_mountainTorrents',
        component: MD_mountainTorrents,
      },
      {
        path:'MeteorologicalDisastersGeologicalDisaster',
        name: 'MD_geologicalDisaster',
        component: MD_geologicalDisaster,
      },
      { path: 'InfoPublish', name: 'InfoPublish', component: InfoPublish },
      { path: 'WaringEntry', name: 'WaringEntry', component: WaringEntry },
      { path: 'PublishMonitoring', name: 'PublishMonitoring', component: PublishMonitoring },
      { path: 'RetrievalStatistical', name: 'retrievalStatistical', component: RetrievalStatistical },
      { path: 'GroupManagement', name: 'GroupManagement', component: GroupManagement },
      { path: 'TemplateManagement', name: 'TemplateManagement', component: TemplateManagement },
      { path: 'AuditCenter', name: 'AuditCenter', component: AuditCenter },



      { path: 'DisasterRelief', name: 'DisasterRelief', component: DisasterRelief },
      { path: 'DisasterInformation', name: 'DisasterInformation', component: DisasterInformation },
      { path: 'usersInfoManage', name: 'usersInfoManage', component: usersInfoManage },
      { path: 'contingencyPlanManage', name: 'contingencyPlanManage', component: contingencyPlanManage }
    ]
  },
  {
    path: '/WarningMessage',
    name: 'WarningMessage',
    component: WarningMessage
  },
  {
    path: '/DecisionCommand',
    name: 'DecisionCommand',
    component: DecisionCommand
  }
]

export default new VueRouter({
  // mode: 'history',
  routes
})

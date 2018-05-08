
/**
 * 异步按需加载模块
 */
const Home                            = resolve => require(['./components/home'], resolve);
const TaskDetail                      = resolve => require(['./components/task_detail'], resolve);
const TaskCenter                      = resolve => require(['./components/task_center'], resolve);
const TaskOrder                       = resolve => require(['./components/task_order'], resolve);
const TaskAdd                         = resolve => require(['./components/task_add'], resolve);
const TaskService                     = resolve => require(['./components/service'], resolve);
const TaskSet                         = resolve => require(['./components/task_set'], resolve);
const MyScore                         = resolve => require(['./components/my_score'], resolve);
const Score                           = resolve => require(['./components/score'], resolve);

/**
* 路由配置
*/
let router = {
  linkActiveClass: 'active',

  routes: [

    // 信贷客
    {
      path: '/task',
      component: {
        template: '<router-view></router-view>',
      },
      meta: {
        authorization: true,
      },
      children: [
        {
          path: '/',
          name: 'task.Home',
          component: Home,
          meta: {
            title: '信贷客',
          }
        },
        {
          path: 'detail/:id',
          name: 'task.TaskDetail',
          component: TaskDetail,
          meta: {
            title: '抢单详情',
          }
        },
        {
          path: 'center',
          name: 'task.TaskCenter',
          component: TaskCenter,
          meta: {
            title: '抢单中心',
          }
        },
        {
          path: 'order',
          name: 'task.TaskOrder',
          component: TaskOrder,
          meta: {
            title: '我的订单',
          }
        },

        {
          path: 'add',
          name: 'task.TaskAdd',
          component: TaskAdd,
          meta: {
            title: '我要发布',
          }
        },

        {
          path: 'service',
          name: 'task.TaskService',
          component: TaskService,
          meta: {
            title: '专属服务经理',
          }
        },

        {
          path: 'set',
          name: 'task.TaskSet',
          component: TaskSet,
          meta: {
            title: '设置推送',
          }
        },
        {
          path: 'my_score',
          name: 'task.MyScore',
          component: MyScore,
          meta: {
            title: '我的评价',
          }
        },
        {
          path: 'score',
          name: 'task.Score',
          component: Score,
          meta: {
            title: '评价',
          }
        },
      ],
    },
  ]
};

export default router;
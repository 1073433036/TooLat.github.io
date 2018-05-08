
/**
 * 异步按需加载模块
 */
const Notify          = resolve => require(['./components/notify'], resolve);
const Info            = resolve => require(['./components/info'], resolve);
const Friend          = resolve => require(['./components/friend'], resolve);
const FriendAdd       = resolve => require(['./components/friend_add'], resolve);
const FriendDetail    = resolve => require(['./components/friend_detail'], resolve);
const Team            = resolve => require(['./components/team'], resolve);
const Systems         = resolve => require(['./components/system'], resolve);
const Reward          = resolve => require(['./components/reward'], resolve);
const RewardDetail    = resolve => require(['./components/reward_detail'], resolve);
const Insurance       = resolve => require(['./components/insurance'], resolve);

/**
* 路由配置
*/
let router = {
  linkActiveClass: 'active',

  routes: [

    {
      path: '/message',
      component: {
        template: '<router-view></router-view>',
      },
      meta: {
        authorization: true,
      },
      children: [
        // 通知
        {
          path: 'notify',
          query: {
            dt: ''
          },
          name: 'message.Notify',
          component: Notify,
          meta: {
            title: '通知',
          },
        },

        // 朋友圈
        {
          path: 'info',
          query: {
            dt: ''
          },
          name: 'message.Info',
          component: Info,
          meta: {
            title: '朋友圈',
          },
        },

        {
          path: 'friend',
          name: 'message.Friend',
          component: Friend,
          meta: {
            title: '同行通讯录',
          }
        },
        {
          path: 'friend/add',
          name: 'message.FriendAdd',
          component: FriendAdd,
          meta: {
            title: '添加好友',
          }
        },
        {
          path: 'friend/:id',
          name: 'message.FriendDetail',
          component: FriendDetail,
          meta: {
            title: '好友详情',
          }
        },

        // 意向代理
        {
          path: 'team',
          name: 'message.Team',
          component: Team,
          meta: {
            title: '意向代理',
          }
        },

        // 系统消息
        {
          path: 'system',
          name: 'message.Systems',
          component: Systems,
          meta: {
            title: '系统消息',
          }
        },

        // 佣金提醒
        {
          path: 'reward',
          name: 'message.Reward',
          component: Reward,
          meta: {
            title: '佣金提醒',
          }
        },

        // 佣金详情
        {
          path: 'reward/:id',
          name: 'message.RewardDetail',
          component: RewardDetail,
          meta: {
            title: '佣金详情',
          }
        },

        // 保险收益明细
        {
          path: 'insurance',
          name: 'message.Insurance',
          component: Insurance,
          meta: {
            title: '保险收益明细',
          }
        },

      ]
    },


  ]
};

export default router;
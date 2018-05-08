
/**
 * 异步按需加载模块
 */
const Home                            = resolve => require(['./components/home'], resolve);

/**
* 路由配置
*/
let router = {
  linkActiveClass: 'active',

  routes: [

    // 聊天
    {
      path: '/chat',
      component: {
        template: '<router-view></router-view>',
      },
      meta: {
        authorization: true,
      },
      children: [
        {
          path: ':id',
          name: 'chat.Home',
          component: Home,
          meta: {
            title: '在线聊天',
          }
        },
      ],
    },
  ]
};

export default router;
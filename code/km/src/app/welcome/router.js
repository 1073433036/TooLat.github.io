
/**
 * 异步按需加载模块
 */
const Login                          = resolve => require(['./components/login'], resolve);
// const Register                       = resolve => require(['./components/register'], resolve);
const Findpwd                        = resolve => require(['./components/findpwd'], resolve);


/**
* 路由配置
*/
let router = {
  linkActiveClass: 'active',

  routes: [

    // 用户登录
    {
      path: '/login',
      query: {
        dt: ''
      },
      name: 'welcome.Login',
      component: Login,
      meta: {
        title: '用户登录',
      },
    },

    // 用户注册
    // {
    //   path: '/register',
    //   name: 'welcome.Register',
    //   component: Register,
    //   meta: {
    //     title: '用户注册',
    //   },
    // },

    // 找回密码
    {
      path: '/findpwd',
      name: 'welcome.Findpwd',
      component: Findpwd,
      meta: {
        title: '找回密码',
      },
    },
  ]
};

export default router;

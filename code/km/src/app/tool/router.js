
/**
 * 异步按需加载模块
 */
const Home                 = resolve => require(['./components/home'], resolve);
const SelfdomMap           = resolve => require(['./components/selfdom_map'], resolve);
const SelfdomMapDetail     = resolve => require(['./components/selfdom_map_detail'], resolve);
const CompileMessage       = resolve => require(['./components/compile_message'], resolve);
const SelfdomCardDetail    = resolve => require(['./components/selfdom_card_detail'], resolve);
const AdvertiseHome        = resolve => require(['./components/advertise_home'], resolve);
const UploadMaterial       = resolve => require(['./components/advertise_upload_material'], resolve);
const ArticleDetail        = resolve => require(['./components/advertise_article_detail'], resolve);
const MyList               = resolve => require(['./components/my_list'], resolve);

/**
* 路由配置
*/
let router = {
  linkActiveClass: 'active',
  routes: [

    // 展业工具
    {
      path: '/tool',
      component: {
        template: '<router-view></router-view>',
      },
      meta: {
        authorization: true,
      },
      children: [
        {
          path: '/',
          name: 'tool.Home',
          component: Home,
          meta: {
            title: '展业工具'
          }
        },
        // 个性趣图
        {
          path: 'selfdom_map',
          name: 'tool.SelfdomMap',
          component: SelfdomMap,
          meta: {
            title: '个性趣图',
          },
        },
        // 个性趣图详情
        {
          path: 'selfdom_map_detail',
          name: 'tool.SelfdomMapDetail',
          component: SelfdomMapDetail,
          meta: {
            title: '个性趣图',
          },
        },
        // 编辑信息
        {
          path: 'compile_message',
          name: 'tool.CompileMessage',
          component: CompileMessage,
          meta: {
            title: '编辑信息',
          },
        },
        // 展业名片
        {
          path: 'selfdom_card_detail',
          name: 'tool.SelfdomCardDetail',
          component: SelfdomCardDetail,
          meta: {
            title: '展业名片',
          },
        },
        //行业爆料资料库
        {
          path: 'advertise/home',
          name: 'tool.AdvertiseHome',
          component: AdvertiseHome,
          meta: {
            title: '金融/保险',
          },
        },
        {
          path: 'advertise/uploadmaterial',
          name: 'tool.UploadMaterial',
          component: UploadMaterial,
          meta: {
            title: '上传素材',
          },
        },
        {
          path: 'advertise/article',
          name: 'tool.ArticleDetail',
          component: ArticleDetail,
          meta: {
            title: '文章',
          },
        },
        {
          path: 'my_list',
          name: 'tool.MyList',
          component: MyList,
          meta: {
            title: '我的发布',
          },
        },
      ]
    }
  ]
};

export default router;
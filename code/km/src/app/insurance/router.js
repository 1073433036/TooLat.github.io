
/**
 * 异步按需加载模块
 */
const Home                            = resolve => require(['./components/home'], resolve);
const InsuranceCompany                = resolve => require(['./components/insurance_company'], resolve);
const InsuranceAllocation             = resolve => require(['./components/insurance_allocation'], resolve);

const Indent             							= resolve => require(['./components/indent'], resolve);
const PerfectInsureMessage          	= resolve => require(['./components/perfect_insure_message'], resolve);
const SendSite          							= resolve => require(['./components/send_site'], resolve);
const PerfectCarMessage          			= resolve => require(['./components/perfect_car_message'], resolve);
const CarManage          							= resolve => require(['./components/car_manage'], resolve);
const InsuranceDeploy          				= resolve => require(['./components/insurance_deploy'], resolve);

const CarSearch                       = resolve => require(['./components/car_search'], resolve);
const CarInsuranceLimit               = resolve => require(['./components/car_insurance_limit'], resolve);
const CarInsuranceSuccessList         = resolve => require(['./components/car_insurance_success_list'], resolve);
const CarInsuranceDetail              = resolve => require(['./components/car_insurance_detail'], resolve);
const AutoBanner                      = resolve => require(['./components/auto_banner'], resolve);
const AutoH5                          = resolve => require(['./components/auto_h5'], resolve);
const AutoQuery                       = resolve => require(['./components/auto_query'], resolve);

const CopyStepsCompany                = resolve => require(['./components/copySteps/components/company'], resolve);
const CopyStepsDetail                 = resolve => require(['./components/copySteps/components/detail'], resolve);
const CopyStepsAllocation             = resolve => require(['./components/copySteps/components/allocation'], resolve);

const ReplacePay                      = resolve => require(['./components/replace_pay'], resolve);


/**
* 路由配置
*/
let router = {
  linkActiveClass: 'active',

  routes: [

    // 保险业务
    {
      path: '/insurance',
      component: {
        template: '<router-view></router-view>',
      },
      meta: {
        authorization: true,
      },
      children: [

        // 保险主页
        {
          path: '/',
          name: 'insurance.Home',
          component: Home,
          meta: {
            title: '汽车保险',
          }
        },
        {
          path: 'insurance_company',
          name: 'insurance.InsuranceCompany',
          component: InsuranceCompany,
          meta: {
            title: '保险公司',
          }
        },
        {
          path: 'insurance_allocation',
          name: 'insurance.InsuranceAllocation',
          component: InsuranceAllocation,
          meta: {
            title: '保险配置',
          }
        },
        {
          path: 'indent',
          name: 'insurance.Indent',
          component: Indent,
          meta: {
            title: '订单列表',
          }
        },
        {
          path: 'perfect_insure_message',
          name: 'insurance.PerfectInsureMessage',
          component: PerfectInsureMessage,
          meta: {
            title: '完善投保信息',
          }
        },
        {
          path: 'send_site',
          name: 'insurance.SendSite',
          component: SendSite,
          meta: {
            title: '收件地址',
          }
        },
        {
          path: 'perfect_car_message',
          name: 'insurance.PerfectCarMessage',
          component: PerfectCarMessage,
          meta: {
						title: '完善车辆信息',
					}
				},
				{
					path: 'car_manage',
					name: 'insurance.CarManage',
					component: CarManage,
					meta: {
						title: '车辆管理',
					}
				},
				{
					path: 'insurance_deploy',
					name: 'insurance.InsuranceDeploy',
					component: InsuranceDeploy,
					meta: {
						title: '保险配置',
					}
				},
        //车型搜索
        {
          path: 'carsearch',
          name: 'insurance.CarSearch',
          component: CarSearch,
          meta: {
            title: '车型搜索',
          }
        },
        //承保政策
        {
          path: 'carinsurancelimit',
          name: 'insurance.CarInsuranceLimit',
          component: CarInsuranceLimit,
          meta: {
            title: '报价列表',
          }
        },
        {
          path: 'successlist',
          name: 'insurance.CarInsuranceSuccessList',
          component: CarInsuranceSuccessList,
          meta: {
            title: '承保政策报价成功',
          }
        },
        {
          path: 'insuranceDetail',
          name: 'insurance.CarInsuranceDetail',
          component: CarInsuranceDetail,
          meta: {
            title: '查看详情',
          }
        },
        {
          path: 'auto_banner',
          name: 'insurance.AutoBanner',
          component: AutoBanner,
          meta: {
            title: '汽车保险',
          }
        },
        {
          path: 'auto_h5',
          name: 'insurance.AutoH5',
          component: AutoH5,
          meta: {
            title: '了解车险',
          }
        },
        {
          path: 'AutoQuery',
          name: 'insurance.AutoQuery',
          component: AutoQuery,
          meta: {
            title: '了解信用',
          }
        },
        {
          path: 'copySteps',
          component: {
            template: '<router-view></router-view>',
          },
          children: [
            {
              path: 'company',
              name: 'insurance.CopyStepsCompany',
              component: CopyStepsCompany,
              meta: {
                title: '保险公司',
              }
            },
            {
              path: 'detail',
              name: 'insurance.CopyStepsDetail',
              component: CopyStepsDetail,
              meta: {
                title: '查看详情',
              }
            },
            {
              path: 'allocation',
              name: 'insurance.CopyStepsAllocation',
              component: CopyStepsAllocation,
              meta: {
                title: '保险配置',
              }
            },
          ]
        },
        {
          path: 'replace_pay',
          name: 'insurance.ReplacePay',
          component: ReplacePay,
          meta: {
            title: '代付订单',
          }
        },
      ],
    },
  ]
};

export default router;

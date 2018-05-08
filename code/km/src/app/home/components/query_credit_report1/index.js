import './index.scss';
// import Echarts        from 'echarts';
import Header               from '~common/components/header';
import Models               from '~common/models';

export default {
  name: 'report',
  data () {
    return {
      isShow: true,
      urlId:'',
      loanInfo:{
        total:'',
        text:''
      },
      resultDesc:{
        id:'',
        result_desc: {
          ANTIFRAUD:{
            output_fields:{},
            final_score:{},
            risk_items:{}
          }
        },
        result_info: {
          car:{
            info:{}
          },
          card:{
            apply_list:{}
          },
        }
      },
      listData:{
        idCardHighRisk :{},
        idCardCourtDiscredit:{},
        idCardCrime:{},
        idCardCourtCarry :{},
        idCardTuitionArrears:{},
        idCardOverdueCredit:{},
        idCardHighRiskOrder :{},
        idCardLeaseDefault :{},
        idCardCourtCase:{},
        idCardOverdueCreditVague:{},
        idCardCourtDiscreditVague :{},
        idCardCourtCarryVague:{},
        idCardCourtCaseVague:{},
        idCardArrearsCompany:{},
        idCardIntentionalViolation:{},
        idCardArrears:{},
        idCardArrearsCompanyArrears:{},
        idCardOverdueCreditStill:{},
        phoneFalse:{},
        phoneTrumpet:{},
        phoneHarassment:{},
        phoneHighRisk:{},
        phoneOverdueCredit:{},
        phoneLeaseDefault:{},
        phoneFill:{},
        phoneArrearsCompany:{},
        phoneOverdueCreditStill:{},
        idCardAssociation:{},
        idAssociationCard:{},
        idCardMany:{},
        phoneMany:{},
        idCardDayMany:{},
        idCardDayLoan:{},
        monthLoan:{},
        monthsLoan:{},
        monthsCredit:{},
        proposerHighRisk:{},
        proposerLowRisk:{},
        phoneManyRefuse:{},
      },
      hdTitle:'信贷全流程报告',
    };
  },
  components: {
    'app-header'    : Header,
  },
  computed: {
  },
  mounted () {
    this.getId();
    this.credit();
  },
  watch: {},
  methods: {
    getId () {
      this.urlId = this.$route.query.id;
    },
    credit () {
      let self = this;
      Models.Credit
        .creditQuery({
          id : self.urlId
        })
        .then((res) => {
          if (res.code === 1) {
            /*
             name= idCardHighRisk ,rule_id = 3515077 // 身份证归属地位于高风险较为集中地区
             name = idCardCourtDiscredit ,id= 3515109// 身份证命中法院失信名单
             name = idCardCrime ,id= 3515135 // 身份证命中犯罪通缉名单
             name = idCardCourtCarry ,id= 3515143 // 身份证命中法院执行名单
             name = idCardTuitionArrears ,id=  3515149 // 身份证对应人存在助学贷款欠费历史
             name = idCardOverdueCredit ,id= 3515155 // 身份证命中信贷逾期名单
             name = idCardHighRiskOrder ,id= 3515163 // 身份证命中高风险关注名单
             name = idCardLeaseDefault ,id= 3515193 // 身份证命中车辆租赁违约名单
             name = idCardCourtCase ,id= 3515199 // 身份证命中法院结案名单
             name = idCardOverdueCreditVague ,id= 3515213// 身份证_姓名命中信贷逾期模糊名单
             name = idCardCourtDiscreditVague ,id= 3515219// 身份证_姓名命中法院失信模糊名单
             name = idCardCourtCarryVague ,id= 3515223 // 身份证_姓名命中法院执行模糊名单
             name = idCardCourtCaseVague ,id= 3515227 // 身份证_姓名命中法院结案模糊名单
             name = idCardArrearsCompany ,id= 3515233 // 身份证命中欠款公司法人代表名单
             name = idCardIntentionalViolation ,id= 3515239 // 身份证命中故意违章乘车名单
             name = idCardArrears ,id= 3515245 // 身份证命中欠税名单
             name = idCardArrearsCompanyArrears ,id= 3515251// 身份证命中欠税公司法人代表名单
             name = idCardOverdueCreditStill ,id= 3515255 // 身份证命中信贷逾期后还款名单
             name= phoneFalse,id= 3515045// 手机号命中虚假号码库
             name= phoneTrumpet,id=3515075 // 手机号命中通信小号库
             name= phoneHarassment,id=3515107 // 手机号命中诈骗骚扰库
             name= phoneHighRisk,id= 3515141 // 手机号命中高风险关注名单
             name= phoneOverdueCredit,id= 3515161 // 手机号命中信贷逾期名单
             name= phoneLeaseDefault,id= 3515189 // 手机号命中车辆租赁违约名单
             name= phoneFill, id= 3515191 // 手机号疑似乱填
             name= phoneArrearsCompany, id= 3515197 // 手机号命中欠款公司法人代表名单
             name= phoneOverdueCreditStill, id= 3515203// 手机号命中信贷逾期后还款名单
             name= idCardAssociation,id= 3515257 // 3个月内身份证关联多个申请信息
             name= idAssociationCard,id= 3515261// 3个月内申请信息关联多个身份证
             name= idCardMany,id= 3515267// 3个月内申请人身份证作为联系人身份证出现的次数过多
             name= phoneMany,id= 3515269// 3个月内申请人手机号作为联系人手机号出现的次数过多
             name= idCardDayMany ,id= 3515281 // 7天内设备或身份证或手机号申请次数过多
             name= idCardDayLoan ,id= 3515315// 7天内申请人在多个平台申请借款
             name= monthLoan,id= 3515317// 1个月内申请人在多个平台申请借款
             name= monthsLoan,id= 3515319// 3个月内申请人在多个平台申请借款
             name= monthsCredit,id= 3515321 // 3个月内申请人在多个平台被放款_不包含本合作方
             name=proposerHighRisk ,id= 3515345// 申请人信息命中中风险关注名单
             name=proposerLowRisk ,id= 3515347// 申请人信息命中低风险关注名单
             name= phoneManyRefuse,id= 3515247 // 1个月内同一个设备或手机号申请被拒次数过多
            */
            let listData = [
              {
                name: 'idCardHighRisk',
                key: 3515077,
                value: ''
              },
              {
                name: 'idCardCourtDiscredit',
                key: 3515109,
                value: ''
              },
              {
                name: 'idCardCrime',
                key: 3515135,
                value: ''
              },
              {
                name: 'idCardCourtCarry',
                key: 3515143,
                value: ''
              },
              {
                name: 'idCardTuitionArrears',
                key: 3515149,
                value: ''
              },
              {
                name: 'idCardOverdueCredit',
                key: 3515155,
                value: ''
              },
              {
                name: 'idCardHighRiskOrder',
                key: 3515163,
                value: ''
              },
              {
                name: 'idCardLeaseDefault',
                key: 3515193,
                value: ''
              },
              {
                name: 'idCardCourtCase',
                key: 3515199,
                value: ''
              },
              {
                name: 'idCardOverdueCreditVague',
                key: 3515213,
                value: ''
              },
              {
                name: 'idCardCourtDiscreditVague',
                key: 3515219,
                value: ''
              },
              {
                name: 'idCardCourtCarryVague',
                key: 3515223,
                value: ''
              },
              {
                name: 'idCardCourtCaseVague',
                key: 3515227,
                value: ''
              },
              {
                name: 'idCardArrearsCompany',
                key: 3515233,
                value: ''
              },
              {
                name: 'idCardIntentionalViolation',
                key: 3515239,
                value: ''
              },
              {
                name: 'idCardArrears',
                key: 3515245,
                value: ''
              },
              {
                name: 'idCardArrearsCompanyArrears',
                key: 3515251,
                value: ''
              },
              {
                name: 'idCardOverdueCreditStill',
                key: 3515255,
                value: ''
              },
              {
                name: 'phoneFalse',
                key: 3515045,
                value: ''
              },
              {
                name: 'phoneTrumpet',
                key: 3515075,
                value: ''
              },
              {
                name: 'phoneHarassment',
                key: 3515107,
                value: ''
              },
              {
                name: 'phoneHighRisk',
                key: 3515141,
                value: ''
              },
              {
                name: 'phoneOverdueCredit',
                key: 3515161,
                value: ''
              },
              {
                name: 'phoneLeaseDefault',
                key: 3515189,
                value: ''
              },
              {
                name: 'phoneFill',
                key: 3515191,
                value: ''
              },
              {
                name: 'phoneArrearsCompany',
                key: 3515197,
                value: ''
              },
              {
                name: 'phoneOverdueCreditStill',
                key: 3515203,
                value: ''
              },
              {
                name: 'idCardAssociation',
                key: 3515257,
                value: ''
              },
              {
                name: 'idAssociationCard',
                key: 3515261,
                value: ''
              },
              {
                name: 'idCardMany',
                key: 3515267,
                value: ''
              },
              {
                name: 'phoneMany',
                key: 3515269,
                value: ''
              },
              {
                name: 'idCardDayMany',
                key: 3515281,
                value: ''
              },
              {
                name: 'idCardDayLoan',
                key: 3515315,
                value: ''
              },
              {
                name: 'monthLoan',
                key: 3515317,
                value: ''
              },
              {
                name: 'monthsLoan',
                key: 3515319,
                value: ''
              },
              {
                name: 'monthsCredit',
                key: 3515321,
                value: ''
              },
              {
                name: 'proposerHighRisk',
                key: 3515345,
                value: ''
              },
              {
                name: 'proposerLowRisk',
                key: 3515347,
                value: ''
              },
              {
                name: 'phoneManyRefuse',
                key: 3515247,
                value: ''
              }
            ];
            let reprotData = {
              id:res.data.id,
              id_number:res.data.id_number,
              mobile:res.data.mobile,
              name:res.data.name,
              query_time:res.data.query_time,
              risk_items:res.data.result_desc.ANTIFRAUD.risk_items,
              result_info:res.data.result_info,
            };
            for (let i = 0, len = reprotData.risk_items.length; i < len; i ++) {
              if (listData[i].key === reprotData.risk_items[i].rule_id) {
                listData[i].value = reprotData.risk_items[i];
              }
            }
            let jsonData = {};
            for (let i = 0; i < listData.length; i ++) {
              let key = listData[i].name;
              let value = listData[i].value;
              jsonData[key] = value;
            }
            self.listData = jsonData;
            self.resultDesc = reprotData;
            console.log(self.resultDesc);
          }
          else {
            self.$toast(res.msg);
          }
        });
    }
  }
};

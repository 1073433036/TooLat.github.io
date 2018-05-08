import './index.scss';

// import _                  from 'lodash';
import Header             from '~common/components/header';
import Models             from '~common/models';

export default {
  name: 'replacePay',
  data () {
    return {
      formTemp: {
        manager: {},
        list: {},
      },
      param: {},
      delivery: {},
    };
  },
  components: {
    'app-header'    : Header,
  },
  computed: {
  },
  mounted () {
    this.init();
  },
  watch: {},
  methods: {

    init () {
      this.param = this.parseQueryString();
      this.list();
      this.getUser();
    },

    /*
     * 立即支付
     */
    handleInsure () {
      let self = this;

      let carLicenseNo = self.formTemp.list.q.carInfo.carLicenseNo;
      let totalPremium = self.formTemp.list.q.insureInfo.totalPremium;
      let prvName = self.formTemp.list.q.prvName;
      let message = `尊敬 车牌号：${carLicenseNo}的车主，您将购买${prvName}的汽车保险，保费总金额为:${totalPremium}元，请您确认无误后付款。感谢您对我们的支持！`;
      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : message,
        lists : [
          {
            msg: '取消'
          },
          {
            msg: '确认',
            class: 'ok',
            func () {

              self.$store.get.dispatch({
                type: 'Loading',
                isShow: true,
              });

              Models.Insurance
              .getDelivery({
                params: {
                  taskId: self.param.taskId
                }
              })
              .then((res) => {
                if (1 === res.code) {
                  self.delivery = {
                    deliveryType: res.data.deliveryType,
                    name: res.data.name,
                    phone: res.data.phone,
                    province: res.data.province,
                    city: res.data.city,
                    area: res.data.area,
                    address: res.data.address,
                  };

                  Models.Insurance
                  .updateTask({
                    taskId: self.param.taskId,
                    prvId: self.param.prvId,
                    delivery: self.delivery,
                  })
                  .then((res) => {
                    if (1 === res.code) {

                      Models.Insurance
                      .pay({
                        taskId: self.param.taskId,
                        prvId: self.param.prvId,
                        retUrl: 'https://m.kamengjinfu.com/insurance/indent',
                      })
                      .then((res) => {
                        if (1 === res.code) {
                          location.href = res.data.payUrl;
                        }
                        else {
                          self.$store.get.dispatch({
                            type: 'Loading',
                            isShow: false,
                          });
                          self.$store.get.dispatch({
                            type  : 'handleChangeDialog',
                            active: true,
                            title : '温馨提示',
                            msg   : res.msg,
                            lists : [
                              {
                                msg: '确定'
                              },
                            ]
                          });
                        }
                      })
                      .catch(() => {
                        self.$store.get.dispatch({
                          type: 'Loading',
                          isShow: false,
                        });
                      });

                    }
                    else {
                      self.$store.get.dispatch({
                        type: 'Loading',
                        isShow: false,
                      });
                      self.$toast(res.msg);
                    }
                  })
                  .catch(() => {
                    self.$store.get.dispatch({
                      type: 'Loading',
                      isShow: false,
                    });
                  });

                }
                else {
                  self.$store.get.dispatch({
                    type: 'Loading',
                    isShow: false,
                  });
                  self.$toast(res.msg);
                }
              })
              .catch(() => {
                self.$store.get.dispatch({
                  type: 'Loading',
                  isShow: false,
                });
              });

            }
          }
        ]
      });

    },

    /*
     * 获取用户信息
     */
    getUser () {
      let self = this;
      Models.User
      .inviteUserInfo({
        params: {
          invite_code: self.param.invite_code,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          self.formTemp.manager = res.data;
        }
      });
    },

    /*
     * 订单详情
     */
    list () {
      let self = this;
      Models.Insurance
      .orderQuoteInfo({
        params: {
          taskId: self.param.taskId,
          prvId: self.param.prvId,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          self.formTemp.list = res.data;
        }
      });
    },

    /*
     * 解析url里面参数为Json
     */
    parseQueryString () {
      let regUrl   = /^[^\?]+\?([\w\W]+)$/;
      let regPara  = /([^&=]+)=([\w\W]*?)(&|$|#)/g;
      let arrUrl =  regUrl.exec(window.location.href);
      let ret     = {};

      if (arrUrl && arrUrl[1]) {
       let strPara = arrUrl[1];
       let result;
       while (null !== (result = regPara.exec(strPara))) {
        ret[result[1]] = result[2];
       }
      }
      return ret;
    },

  }
};
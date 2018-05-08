import './index.scss';

import _                  from 'lodash';
import Header             from '~common/components/header';
import Models             from '~common/models';
import LocalStorage       from '~common/services/localStorage.cookie';

export default {
  name: 'carInsuranceLimit',
  data () {
    return {
      formTemp      : {
        list        : [],
      },
      /*
       * 分页
       */
      page          : 1,
      total         : 0,
      per_page      : 0,
      current_page  : 0,
      last_page     : 0,
      /*
       * 地址
       */
      delivery      : '',
      isShare       : false,
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    taskId () {
      return this.$route.query.id;
    },
    carLicenseNo () {
      return this.$route.query.name || '报价列表';
    },
    isWeChat () {
      return this.device.is('WeChat');
    },
    appShareData () {
      return _.get(this.$store.get.state, 'App.histData.appShareData') || {};
    },
  },
  mounted () {
    this.list();
    LocalStorage.set('insurOrder', {
      taskId: '',
      prvId: '',
    });
  },
  watch: {
  },
  methods: {

    /*
     * 报价列表
     */
    list () {
      let self = this;
      Models.Insurance
      .orderQuote({
        params: {
          taskId: self.taskId,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res;

          if (1 < self.page) {
            self.formTemp.list = _.concat(self.formTemp.list, data.data);
          }
          else {
            self.formTemp.list = data.data;
          }

          self.total         = data.total;
          self.per_page      = data.per_page;
          self.current_page  = data.current_page;
          self.last_page     = data.last_page;
        }
      });
    },

    /*
     * 马上投保
     */
    handleInsure (prvId, q) {
      let self = this;
      let carLicenseNo = q.carInfo.carLicenseNo;
      let totalPremium = q.insureInfo.totalPremium;
      let prvName = q.prvName;
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
                  taskId: self.taskId
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
                    taskId: self.taskId,
                    prvId: prvId,
                    delivery: self.delivery
                  })
                  .then((res) => {
                    if (1 === res.code) {

                      Models.Insurance
                      .pay({
                        taskId: self.taskId,
                        prvId: prvId,
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
     * 立即核保
     */
    checkInsur (prvId) {
      let self = this;
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth();
      let date = now.getDate();
      let day = now.getDay() * 1;
      let timeFlag = false;
      let day1 = now.getTime();
      let day2 = new Date(year, month, date, '08', '30', '00').getTime();
      let day3 = new Date(year, month, date, '18', '30', '00').getTime();

      if (day1 * 1 >= day2 * 1 && day1 * 1 <= day3 * 1) {
        timeFlag = true;
      }

      Models.Public
      .isHoliday()
      .then((res) => {
        if (1 === res.code) {
          if (false === res.data && timeFlag) {
            self.$router.push({
              name: 'insurance.PerfectInsureMessage',
              query: {
                taskId: self.taskId,
                prvId: prvId
              },
            });
          }
          else {
            self.$store.get.dispatch({
              type  : 'handleChangeDialog',
              active: true,
              title : '温馨提示',
              msg   : '抱歉！因上级保险公司规定，车险业务系统核保，必须要在工作日的工作时间内操作，谢谢配合！',
              lists : [
                {
                  msg: '确定'
                },
              ]
            });
          }
        }
        else {
          if (6 !== day && 0 !== day && timeFlag) {
            self.$router.push({
              name: 'insurance.PerfectInsureMessage',
              query: {
                taskId: self.taskId,
                prvId: prvId
              },
            });
          }
          else {
            self.$store.get.dispatch({
              type  : 'handleChangeDialog',
              active: true,
              title : '温馨提示',
              msg   : '抱歉！因上级保险公司规定，车险业务系统核保，必须要在工作日的工作时间内操作，谢谢配合！',
              lists : [
                {
                  msg: '确定'
                },
              ]
            });
          }
        }
      })
      .catch(() => {
        if (6 !== day && 0 !== day && timeFlag) {
          self.$router.push({
            name: 'insurance.PerfectInsureMessage',
            query: {
              taskId: self.taskId,
              prvId: prvId
            },
          });
        }
        else {
          self.$store.get.dispatch({
            type  : 'handleChangeDialog',
            active: true,
            title : '温馨提示',
            msg   : '抱歉！因上级保险公司规定，车险业务系统核保，必须要在工作日的工作时间内操作，谢谢配合！',
            lists : [
              {
                msg: '确定'
              },
            ]
          });
        }
      });
    },

    /*
     * 点击分享按钮 - 马上投保
     */
    handleShareClick (prvId) {
      let self = this;

      if (false === this.device.is('WeChat') && window.js_obj) {
        /* eslint-disable */
        let data = {
          title     : this.appShareData.title,
          desc      : this.appShareData.desc,
          url       : this.appShareData.link,
          share_img : this.appShareData.imgUrl
        };

        js_obj.shareWeb(JSON.stringify(data));
        /* eslint-enable */
      }
      else {
        self.isShare = true;
        LocalStorage.set('insurOrder', {
          taskId: self.taskId,
          prvId: prvId,
        });
      }
    },

  }
};
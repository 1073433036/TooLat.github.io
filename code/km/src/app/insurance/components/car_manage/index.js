import './index.scss';

import _                  from 'lodash';
import Header             from '~common/components/header';
import Models             from '~common/models';
import LocalStorage       from '~common/services/localStorage.cookie';

export default {
  name: 'CarManage',
  data () {
    return {
      loading: false,
      formTemp:{
        list: [],
			},
      /*
       * 分页
       */
      page          : 1,
      total         : 0,
      per_page      : 0,
      current_page  : 0,
      last_page     : 0,
    };
  },
  components: {
    'app-header'    : Header,
  },
  computed: {
  },
  mounted () {
    this.list();
  },
  watch: {},
  methods: {

    /*
     * 车辆管理 - 列表
     */
    list () {
      let self = this;
      Models.Insurance
      .carList({
        params: {
          page: self.page
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;

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
     * 车辆管理 - 删除
     */
    del (item) {
      let self = this;
      this.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '确定要删除该车辆信息？',
        lists : [
          {
            msg: '取消',
          },
          {
            msg: '确定',
            func () {
              self.$store.get.dispatch({
                type: 'Loading',
                isShow: true,
                Text: '正在删除，请稍等...'
              });

              Models.Insurance
              .carDel({
                id: item.id
              })
              .then((res) => {
                self.$store.get.dispatch({
                  type: 'Loading',
                  isShow: false,
                });
                self.$toast(res.msg);
                if (1 === res.code) {
                  self.list();
                }
              })
              .catch(() => {
                self.$store.get.dispatch({
                  type: 'Loading',
                  isShow: false,
                });
              });
            },
            class: 'ok',
          },
        ]
      });
    },

    /*
     * 投保
     */
    offer (item) {
      let self = this;
      if (item.carLicenseNo) {
        let info = {
          insureAreaCode: item.insureAreaCode,
          carLicenseNo: item.carLicenseNo,
          name: item.name,
        };

        self.$store.get.dispatch({
          type: 'Loading',
          isShow: true,
          Text: '正在查询，请稍等...',
        });

        Models.Insurance
        .createTaskA(info)
        .then((res) => {
          self.$store.get.dispatch({
            type: 'Loading',
            isShow: false,
          });

          self.storage(item);
          let params = {
            code: item.insureAreaCode,
          };

          if (1 === res.code) {
            let data = res.data;
            let carInfo = data.carInfo;

            let quoteInfo  = LocalStorage.get('quoteInfo');
            quoteInfo.data.carInfo = carInfo;
            LocalStorage.set('quoteInfo', quoteInfo.data);

            if (data.taskId) {
              params.taskId = data.taskId;
            }

            self.$router.push({
              name: 'insurance.InsuranceCompany',
              query: params,
            });
          }
          else {
            if (-1 !== item.engineNo.indexOf('*')) {
              self.$toast(res.msg);
            }
            else {
              self.$router.push({
                name: 'insurance.InsuranceCompany',
                query: params,
              });
            }
          }
        })
        .catch(() => {
          self.$store.get.dispatch({
            type: 'Loading',
            isShow: false,
          });
        });
      }
    },

    /*
     * 存储
     */
    storage (item) {
      // step1 start
      let step1 = {
        isNew                         : false,
        insureAreaCode                : item.insureAreaCode,
        carLicenseNo                  : item.carLicenseNo,
        vinCode                       : item.vinCode,
        name                          : item.name,
      };
      if (!item.carLicenseNo) {
        step1.isNew = true;
      }
      // step1 end

      LocalStorage.set('quoteInfo', {
        setp1: step1,
      });

      // step2 start
      let step2 = {
        idcardType                    : item.idcardType,
        idcardNo                      : item.idcardNo,
        registDate                    : item.registDate,
        // vinCode                       : item.vinCode,
        // engineNo                      : item.engineNo,
        // brand                         : item.vehicleName,
        // vehicleName                   : item.vehicleName,
        // vehicleId                     : item.vehicleId,
        // price                         : item.price,
        seat                          : item.seat,
        carLicenseNo                  : item.carLicenseNo,
        property                      : item.property,
        carProperty                   : item.carProperty,
        modelLoads                    : item.modelLoads,
        isTransferCar                 : item.isTransferCar,
      };
      if (-1 === item.engineNo.indexOf('*')) {
        step2.vinCode = item.vinCode;
        step2.engineNo = item.engineNo;
        step2.brand = item.vehicleName;
        step2.vehicleName = item.vehicleName;
        step2.vehicleId = item.vehicleId;
      }
      if (item.price * 1) {
        step2.price = item.price;
      }
      // step2 end

      let quoteInfo  = LocalStorage.get('quoteInfo');
      quoteInfo.data.setp2 = step2;
      LocalStorage.set('quoteInfo', quoteInfo.data);
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        self.list();
        done();
      }, 1500);
    },

    infinite (done) {
      let self = this;
      if (this.last_page <= this.current_page) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        self.page ++;
        self.list();
        done();
      }, 1500);
    },

  }
};
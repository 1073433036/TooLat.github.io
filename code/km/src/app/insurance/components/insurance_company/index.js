import './index.scss';

import _                  from 'lodash';
import Header             from '~common/components/header';
import Models             from '~common/models';
import LocalStorage       from '~common/services/localStorage.cookie';

export default {
  name: 'CardInsurance',
  data () {
    return {
      formDate: {
        prvList: [],
      },
      formTemp: {
        list: [],
      },
      prvId: 0,
      timer: '',
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    code () {
      return this.$route.query.code;
    },
    taskId () {
      return this.$route.query.taskId || '';
    },
  },
  mounted () {
    this.list();
    let self = this;
    this.$nextTick(() => {
      self.timer = setTimeout(() => {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: true,
        });
      }, 351);
    });
  },
  methods: {

    /*
     * 选择供应商
     */
    selectPrv (item) {
      let index = this.formDate.prvList.indexOf(item.prvId);
      if (-1 === index) {
        item.status = true;
        this.formDate.prvList.push(item.prvId);
      }
      else {
        item.status = false;
        this.formDate.prvList.splice(index, 1);
      }

      let arr = [];
      this.formDate.prvList.forEach((item) => {
        arr.push({
          prvId: item
        });
      });
      this.saveLocalStorage('autoInsur', 'prvList', arr);
    },

    /*
     * 获取供应商列表
     */
    list () {
      let self = this;
      Models.Insurance
      .getProviders({
        insureAreaCode: self.code
      })
      .then((res) => {

        if (1 === res.code) {
          clearTimeout(self.timer);
          self.$store.get.dispatch({
            type: 'Loading',
            isShow: false,
          });
          self.formTemp.list = [];
          res.data.forEach((item) => {
            let data = {
              businessType      : item.businessType,
              info              : item.info,
              prvId             : item.prvId,
              prvName           : item.prvName,
              status            : false,
            };
            self.formTemp.list.push(data);
          });

          LocalStorage.set('providersData', res.data);

          let autoInsur = LocalStorage.get('autoInsur');
          self.formDate.prvList = [];
          if (!_.isEmpty(_.get(autoInsur, 'data'))) {
            let prvList = autoInsur.data.prvList;
            _.each(self.formTemp.list, (item) => {
              _.each(prvList, (prv) => {
                if (item.prvId === prv.prvId) {
                  item.status = true;
                  self.formDate.prvList.push(prv.prvId);
                }
              });
            });
          }
        }
        else {
          self.$toast(res.msg || '请求失败');
        }
      });
    },

    /*
     * 提交
     * @param this.formDate.prvList  选中的供应商
     */
    submint () {
      let self = this;
      let arr = [];
      if (0 === this.formDate.prvList.length) {
        self.$toast('至少选择一个保险公司');
        return;
      }
      this.formDate.prvList.forEach((item) => {
        arr.push({
          prvId: item
        });
      });
      let quoteInfo  = LocalStorage.get('quoteInfo');
      if (!_.isEmpty(quoteInfo.data)) {
        quoteInfo.data.setp3 = arr;
      }
      LocalStorage.set('quoteInfo', quoteInfo.data);

      let params = {
        taskId: self.taskId,
      };

      if ('test' === _.get(self.$route, 'query.act')) {
        params.act = 'test';
      }

      this.$router.push({
        name: 'insurance.InsuranceAllocation',
        query: params,
      });
    },

    /*
     * 本地存储
     */
    saveLocalStorage (name, key, value) {
      let data = LocalStorage.get([name]);
      if (!_.isEmpty(data, 'data')) {
        data.data[key] = value;
        LocalStorage.set([name], data.data);
      }
      else {
        LocalStorage.set([name], {
          [key]: value,
        });
      }
    },

    /*
     * 下拉刷新
     */
    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.list();
        done();
      }, 1500);
    },

  },
  watch: {
  },
};
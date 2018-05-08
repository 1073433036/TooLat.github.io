import './index.scss';

import                'pinyin4js';
import _              from 'lodash';
import Header         from '~common/components/header';
import Selecter       from '~common/components/selecter';
import Dates          from '~common/components/dates';
import Models         from '~common/models';
import LocalStorage   from '~common/services/localStorage.cookie';
import Radio          from '~common/components/radio';

export default {
  name: 'simulate1',
  data () {
    return {
      prov: false,
      cityId: 0,
      lastId: 0,
      isShow: false,
      formData: {
        name          : '',
        sex           : '',
        birthday      : '',
        validity      : false,
        id_card_valid : '',
        work_time     : '',
        address       : '',
        marriage      : '',
        educationa    : '',
        house         : '',
        house_money   : '',
        house_time    : '',
        car           : '',
        car_money     : '',
        car_time      : '',
        prov          : {},
        city          : {},
        area          : {},
      },
      formTemp: {
        sex: [
          {
            name: '男',
            value: '男',
          },
          {
            name: '女',
            value: '女',
          }
        ],
        type: '',
        prov: {
          agency_id: '',
          parent_id: '',
          region_id: '',
          region_name: '请选择省',
          region_type: '',
        },
        city: {
          agency_id: '',
          parent_id: '',
          region_id: '',
          region_name: '请选择市',
          region_type: '',
        },
        area: {
          agency_id: '',
          parent_id: '',
          region_id: '',
          region_name: '请选择区',
          region_type: '',
        },
        address: [],
        marriage: [
          {
            name: '已婚',
            value: 1,
          },
          {
            name: '未婚',
            value: 2,
          },
          {
            name: '其他',
            value: 3,
          },
        ],
        educationa : [
          {
            name: '专科及以下',
            value: 1,
          },
          {
            name: '本科',
            value: 2,
          },
          {
            name: '硕士',
            value: 3,
          },
          {
            name: '博士及以上',
            value: 4,
          },
        ],
        house : [
          {
            name: '全额购房',
            value: 1,
          },
          {
            name: '按揭房',
            value: 2,
          },
          {
            name: '租房',
            value: 3,
          },
          {
            name: '其他',
            value: 4,
          },
        ],
        car : [
          {
            name: '全款车',
            value: 1,
          },
          {
            name: '按揭车',
            value: 2,
          },
          {
            name: '无',
            value: 3,
          },
        ],
      },
      formIndex: ''
    };
  },
  components: {
    'app-header': Header,
    Selecter,
    Dates,
    Radio,
  },
  computed: {
  },
  filters: {
    pinyin (value) {
      /* eslint-disable */
      let data = PinyinHelper.convertToPinyinString(value, ' ', PinyinFormat.WITHOUT_TONE);
      return data.toUpperCase();
      /* eslint-enable */
    },

  },
  mounted () {

    this.formData = _.assign({}, this.formData, {
      prov: this.formTemp.prov,
      city: this.formTemp.city,
      area: this.formTemp.area,
    });

    this.$nextTick(() => {
      this.historySimulateData();
    });

  },
  watch: {
  },
  methods: {

    // LocalStorage缓存信息
    historySimulateData () {
      let simulate  = LocalStorage.get('simulateData');
      let data      = _.get(simulate, 'data.setp1');
      if (!_.isEmpty(data)) {
        this.formData = _.assign({}, this.formData, data);
      }
    },

    // 请求接口
    getRegion () {
      Models.Region
      .get(this.cityId)
      .then((res) => {
        if (1 === res.code) {
          this.formTemp.address = res.data;
        }
      });
    },

    // 点击切换
    handleChangeAddres (obj) {
      this.cityId = obj.name === this.formTemp.type ? this.lastId : obj.id;

      if (_.isObject(obj)) {
        switch (obj.name) {
          case 'prov':
            this.cityId = 0;
            this.formTemp = _.assign({}, this.formTemp, {
              city: {
                agency_id: '',
                parent_id: '',
                region_id: '',
                region_name: '请选择市',
                region_type: '',
              },
              // area: {
              //   agency_id: '',
              //   parent_id: '',
              //   region_id: '',
              //   region_name: '请选择区',
              //   region_type: '',
              // },
            });
          break;
          case 'city':
            if (!this.formData.prov.region_name) {
              this.$toast('请选择省份');
              return;
            }
            // if (0 < this.lastId) {
            //   this.cityId = this.lastId;
            // }

            // this.formTemp = _.assign(this.formTemp, {
            //   area: {
            //     agency_id: '',
            //     parent_id: '',
            //     region_id: '',
            //     region_name: '请选择区',
            //     region_type: '',
            //   },
            // });
          break;
        }

        this.prov           = true;

        this.formTemp.type  = obj.name;
        this.getRegion();
      }
    },

    // 选中
    handelClick (item) {
      if (!_.isEmpty(this.formTemp.type)) {
        if ('area' !== this.formTemp.type) {
          this.lastId = this.cityId;
          this.cityId = item.region_id;
        }
        this.prov   = false;
        this.formTemp[this.formTemp.type] = item;

        this.formData = _.assign({}, this.formData, {
          prov: this.formTemp.prov,
          city: this.formTemp.city,
          area: this.formTemp.area,
        });
      }
    },

    // 日期组件回调
    handelDateClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isShow = obj.status;
          _.assign(this.formData, {
            [this.formIndex]: obj.content
          });
          return;
        }
      }
    },

    // 日期组件改变
    handleDateChange (item) {
      if (true === this.formData.validity && 'id_card_valid' === item) {
        return;
      }
      this.isShow     = true;
      this.formIndex  = item;
    },

    // 销毁窗口
    dismiss () {
      this.prov = false;
    },

    // 提交表单
    handleSumbit () {
      let self = this;

      self.formData = _.assign({}, self.formData, {
        prov: _.get(self.formData, 'prov.region_id') ? _.get(self.formData, 'prov') : self.formTemp.prov,
        city: _.get(self.formData, 'city.region_id') ? _.get(self.formData, 'city') : self.formTemp.city,
        area: _.get(self.formData, 'area.region_id') ? _.get(self.formData, 'area') : self.formTemp.area,
      });

      let res = self.$validator(self.$refs.form);
      if (0 !== res.code) {
        self.$toast(res.data.msg);
        return;
      }

      // 判断身份证有效期格式
      if (false === self.formData.validity && true !== self.$rules.identity(self.formData.id_card_valid)) {
        self.$toast('请填写正确的身份证号码');
        return;
      }

      // 长期有效
      if (true === self.formData.validity) {
        self.formData.id_card_valid = 0;
      }

      // 判断省、市是否选择
      if (!_.isNumber(_.get(self.formData, 'prov.region_id')) || !_.isNumber(_.get(self.formData, 'city.region_id'))) {
        self.$toast('请选择现住址');
        return;
      }

      // 详细地址
      if (_.isEmpty(self.formData.address)) {
        self.$toast('请输入详细地址');
        return;
      }

      self.formData.live_address = `${_.get(self.formData, 'prov.region_name') || ''}${_.get(self.formData, 'city.region_name') || ''}${_.get(self.formData, 'area.region_id') ? _.get(self.formData, 'area.region_name') : ''}${self.formData.address}`;

      // 婚姻状况
      if (!_.isNumber(self.formData.marriage)) {
        self.$toast('请选择婚姻状况');
        return;
      }

      // 教育程度
      if (!_.isNumber(self.formData.educationa)) {
        self.$toast('请选择教育程度');
        return;
      }

      // 住宅状况
      if (!_.isNumber(self.formData.house)) {
        self.$toast('请选择住宅状况');
        return;
      }

      if (1 === self.formData.house * 1 || 2 === self.formData.house * 1) {
        if (_.isEmpty(self.formData.house_money)) {
          self.$toast('请输入房产估值');
          return;
        }
        if (_.isEmpty(self.formData.house_time)) {
          self.$toast('请输入购房时限');
          return;
        }
      }
      else {
        self.formData.house_money = '';
        self.formData.house_time  = '';
      }

      // 车辆信息
      if (!_.isNumber(self.formData.car)) {
        self.$toast('请选择车辆信息');
        return;
      }

      if (1 === self.formData.car * 1 || 2 === self.formData.car * 1) {
        if (_.isEmpty(self.formData.car_money)) {
          self.$toast('请输入车辆估值');
          return;
        }
        if (_.isEmpty(self.formData.car_time)) {
          self.$toast('请输入购车时限');
          return;
        }
      }
      else {
        self.formData.car_money = '';
        self.formData.car_time  = '';
      }

      LocalStorage.set('simulateData', { setp1: self.formData });

      self.$router.push({
        name: 'home.Simulate2',
      });

      return;
    }
  }
};
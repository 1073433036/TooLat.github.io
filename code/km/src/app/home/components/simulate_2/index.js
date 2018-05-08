import './index.scss';

import _              from 'lodash';
import Header         from '~common/components/header';
import Selecter       from '~common/components/selecter';
import Dates          from '~common/components/dates';
import Models         from '~common/models';


import LocalStorage   from '~common/services/localStorage.cookie';

export default {
  name: 'simulate2',
  data () {
    return {
      prov: false,
      cityId: 0,
      lastId: 0,
      isShow: false,
      isToday: true,
      formData: {

        companyProv: {},
        companyCity: {},
        companyArea: {},

        job: '',
        company_nature: '',
        duties: '',

        company_name: '',
        company_address: '',

        job_time: '',
        job_time_end: '',
      },
      formTemp: {
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

        job  : [
          {
            name: '公司职员',
            value: 1,
          },
          {
            name: '公务员',
            value: 2,
          },
          {
            name: '事业单位员工',
            value: 3,
          },
          {
            name: '金融单位员工',
            value: 4,
          },
          {
            name: '军人',
            value: 5,
          },
          {
            name: '学生',
            value: 6,
          },
          {
            name: '其他',
            value: 7,
          },
        ],
        company_nature: [
          {
            name: '国有经济',
            value: 1,
          },
          {
            name: '私营/民营',
            value: 2,
          },
          {
            name: '股份制',
            value: 3,
          },
          {
            name: '三资',
            value: 4,
          },
          {
            name: '其他',
            value: 5,
          },
        ],
        duties: [
          {
            name: '普通职员',
            value: 1,
          },
          {
            name: '部门经理/部门主管',
            value: 2,
          },
          {
            name: '总经理',
            value: 3,
          },
          {
            name: '企业负责人',
            value: 4,
          },
          {
            name: '其他',
            value: 5,
          },
        ]

      }
    };
  },
  components: {
    'app-header': Header,
    Selecter,
    Dates
  },
  computed: {
  },
  filters: {

  },
  mounted () {
    this.formData = _.assign({}, this.formData, {
      companyProv: this.formTemp.prov,
      companyCity: this.formTemp.city,
      companyArea: this.formTemp.area,
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
      let setp1      = _.get(simulate, 'data.setp1');
      let data      = _.get(simulate, 'data.setp2');
      if (_.isEmpty(setp1)) {
        this.$router.push({
          name: 'home.Simulate1'
        });
        return;
      }
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
      if (_.isObject(obj)) {
        this.cityId         = obj.name === this.formTemp.type ? this.lastId : obj.id;

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
              area: {
                agency_id: '',
                parent_id: '',
                region_id: '',
                region_name: '请选择区',
                region_type: '',
              },
            });
          break;
          case 'city':
            if (!_.isNumber(_.get(this.formData, 'companyProv.region_id'))) {
              this.$toast('请选择省份');
              return;
            }
            if (0 < this.lastId) {
              this.cityId = this.lastId;
            }

            this.formTemp = _.assign(this.formTemp, {
              area: {
                agency_id: '',
                parent_id: '',
                region_id: '',
                region_name: '请选择区',
                region_type: '',
              },
            });
          break;
          case 'area':
            if (!_.isNumber(_.get(this.formData, 'companyCity.region_id'))) {
              this.$toast('请选择市');
              return;
            }
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
          companyProv: this.formTemp.prov,
          companyCity: this.formTemp.city,
          companyArea: this.formTemp.area,
        });
      }
    },

    handelDateClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isShow = obj.status;
          _.assign(this.formData, {
            [this.formIndex]: obj.content
          });

          if (!_.isEmpty(this.formData.job_time) && !_.isEmpty(this.formData.job_time_end)) {
            let start = new Date(this.formData.job_time).getTime() / 1000;
            let end   = new Date(this.formData.job_time_end).getTime() / 1000;

            if (end < start) {
              this.$toast('结束时间不能小于开时间');
              this.formData.job_time_end = '';
            }
          }
          return;
        }
      }
    },

    // 日期组件改变
    handleDateChange (item) {
      this.isToday = true;
      if ('job_time' === item) {
        this.isToday = false;
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

      let data = _.assign({}, self.formData, {
        companyProv: _.get(self.formData, 'companyProv.region_id') ? _.get(self.formData, 'companyProv') : self.formTemp.prov,
        companyCity: _.get(self.formData, 'companyCity.region_id') ? _.get(self.formData, 'companyCity') : self.formTemp.city,
        companyArea: _.get(self.formData, 'companyArea.region_id') ? _.get(self.formData, 'companyArea') : self.formTemp.area,
      });

      // 职业
      if (!_.isNumber(self.formData.job)) {
        self.$toast('请选择职业');
        return;
      }

      // 单位性质
      if (!_.isNumber(self.formData.company_nature)) {
        self.$toast('请选择单位性质');
        return;
      }

      // 职务
      if (!_.isNumber(self.formData.duties)) {
        self.$toast('请选择职务');
        return;
      }

      // 单位名称
      if (_.isEmpty(self.formData.company_name)) {
        self.$toast('请输入单位名称');
        return;
      }

      // 判断省、市是否选择
      if (!_.isNumber(_.get(self.formData, 'companyProv.region_id')) || !_.isNumber(_.get(self.formData, 'companyCity.region_id'))) {
        self.$toast('请选择现住址');
        return;
      }

      // 详细地址
      if (_.isEmpty(self.formData.company_address)) {
        self.$toast('请输入详细地址');
        return;
      }

      // 单位地址
      if (_.isEmpty(self.formData.company_address)) {
        self.$toast('请输入单位地址');
        return;
      }

      // 就职开始时间
      if (true !== self.$rules.date(self.formData.job_time)) {
        self.$toast('请输入就职开始时间');
        return;
      }

      // 就职结束时间
      if (true !== self.$rules.date(self.formData.job_time_end)) {
        self.$toast('请输入就职结束时间');
        return;
      }

      let simulate  = LocalStorage.get('simulateData');

      if (!_.isEmpty(simulate.data)) {
        simulate.data.setp2 = data;
      }

      LocalStorage.set('simulateData', simulate.data);

      this.$router.push({
        name: 'home.Simulate3',
      });

      return;
    }
  }
};
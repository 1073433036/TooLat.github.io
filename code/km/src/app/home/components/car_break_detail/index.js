import './index.scss';
import Header           from '~common/components/header';
import Models       from '~common/models';

let carBrand = {};

export default {
  name: 'CarBreakDetail',
  data () {
    return {
      carSelected: undefined,
      ctime: '',
      carList: [],
      violation: {},
      funList: [
        { key: 'check', name: '车险年检' },
        { key: 'firm', name: '添加车主本人驾照', desc: '查看驾照余分，到期清零提醒' },
        { key: 'fine', name: '罚单缴费', desc: '1分钟快速缴费，2小时极速办理' },
      ],
      furtherInfo: {}
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    carLogo () {
      let url = '';
      if (this.furtherInfo.brand_id) {
        url = carBrand[this.furtherInfo.brand_id].logo;
      }
      return url;
    },
    isFillData () {
      let flag = true;
      if (!this.furtherInfo.car_code || !this.furtherInfo.car_reg_date || !this.furtherInfo.car_check_date || !this.furtherInfo.brand_id
            || !this.furtherInfo.car_license_face || !this.furtherInfo.car_license_back || !this.furtherInfo.car_drive_number) {
        flag = false;
      }
      return flag;
    }
  },

  async mounted () {
    this.getCarBrand();
    await this.getMyCar();
    if (!this.carList.length) {
      return;
    }
    if (this.$route.params.cid) {
      this.carSelected = this.$route.params.cid;
    }
    else {
      this.carSelected = this.carList[0].id;
    }
  },

  watch: {
    carSelected (val) {
      this.getCarInfo();
      this.getCarViolation(val);
      this.annualDay();
    }
  },

  methods: {
    // 获取车辆品牌
    async getCarBrand () {
      if (Object.keys(carBrand).length) {
        return;
      }
      let res = await Models.CarVio.getCarBrand();
      if (res.code === 1) {
        for (let i in res.data) {
          let el = res.data[i];
          for (let opt of el) {
            carBrand[opt.id] = opt;
          }
        }
      }
    },

    // 获取补充资料
    async getCarInfo () {
      let res = await Models.CarVio.illegalIncome({
        params: {
          car_id: this.carSelected
        }
      });
      if (res.code === 1) {
        this.furtherInfo = res.data;
      }
    },

    // 获取我的车辆
    async getMyCar () {
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true
      });
      let res = await Models.CarVio.getMyCar();
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: false
      });
      if (res.code === 1) {
        if (this.$route.params.cid && res.data.length > 4) {
          let arr = [];
          for (let el of res.data) {
            if (el.id === this.$route.params.cid) {
              arr.unshift(el);
            }
            else {
              arr.push(el);
            }
          }
          this.carList = arr;
        }
        else {
          this.carList = res.data;
        }
      }
      else {
        this.$toast('车辆信息获取失败');
      }
    },

    //获取剩余天数
    async annualDay () {
      let res = await Models.CarVio.annualDay({
        params: {
          car_id: this.carSelected
        }
      });
      if (res.code === 1) {
        this.ctime = res.data.day;
       }
    },

    // 查询车辆违章信息
    getCarViolation (id) {
      let info = this.$store.get.state.CarBreakInfo.violation;
      this.violation = info[id] || {};
    },

    // 车辆验证
    Accreditation () {
      this.$store.get.commit('setCarId', this.carSelected);
      this.$store.get.commit('setcarCode', this.$refs.carcode.innerText);
      this.$router.push({
        name: 'home.CarAccreditation',
        query: {
          cid: this.carSelected,
          code: this.$refs.carcode.innerText
        },
      });
    },

    // 查看车辆详细信息
    goMyCarPage () {
      let carNumber = this.carList.filter(el => el.id === Number(this.carSelected))[0].car_number;
      this.$store.get.commit('setCarSelected', { cid: this.carSelected, carNumber });
      // sessionStorage.setItem('carQuery', JSON.stringify({ cid: this.carSelected, carNumber }));
      this.$router.push({ name: 'home.MyCarInfo' });
    },

    // 办理违章
    handleIllegal () {
      if (this.violation.unDeal && this.violation.unDeal.total_num) {
        this.goMyCarPage();
      }
    },

    selectFun (key) {
      switch (key) {
        /* eslint-disable */
        case 'check':
          this.$router.push({
            name: 'home.CarBreakCheck',
            query: {
              id: this.carSelected
            },
          });
          break;
        case 'firm':
          this.$router.push({
            name: 'home.AddLicence',
            params: {
              id: this.carSelected,
              code: this.$refs.carcode.innerText
            },
          });
          break;
        default:
          this.goMyCarPage();
      }
      /* eslint-enable */
    },

    // 删除车辆
    deleteCar () {
      let self = this;
      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '确定删除该车辆吗？',
        lists : [
          {
            msg: '取消'
          },
          {
            msg: '确定',
            class: 'ok',
            async func () {
              let id = self.carSelected;
              let res = await Models.CarVio.deleteCar({ id });
              if (res.code === 1) {
                self.$toast('车辆删除成功');
                setTimeout(() => {
                  self.$router.replace({ name: 'home.CarBreak' });
                }, 500);
              }
              else {
                self.$toast('删除车辆失败');
              }
            }
          },
        ]
      });
    },
  },
};

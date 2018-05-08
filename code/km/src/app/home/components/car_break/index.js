import './index.scss';
import _            from 'lodash';
import Header       from '~common/components/header';
import Models       from '~common/models';
import Footing      from '~common/components/page_footing';
import Swiper       from 'swiper';
import 'swiper/dist/css/swiper.min.css';

export default {
  name: 'carBreakRules',
  data () {
    return {
      carBrand: {},
      carCode: '',
      carList: [],
      isCarDialogShow: false,
      carFurther: {},
    };
  },
  beforeRouteEnter (to, from, next) {
    if ('home.AddCar' === from.name ) {
      next(vm => {
        vm.isCarDialogShow = true;
      });
    }
    else {
      next();
    }
  },
  components: {
    'app-header': Header,
    'app-footing': Footing,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    }
  },
  mounted () {
    this.getCarBrand();
    this.getForum();
    this.getMyCar();
  },
  watch: {
  },
  methods: {
    showUserDialog () {
      let self = this;
      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '请先完善个人资料',
        lists : [
          {
            msg: '取消',
          },
          {
            msg: '去完善',
            class: 'ok',
            func () {
              self.$router.push({ name: 'user.Profile', query: { dt: self.$route.path } });
            }
          },
        ]
      });
    },

    // 获取版块通知
    async getForum () {
      let res = await Models.Notify.forum('violation');
      if (res.code === 1) {
        this.$store.get.dispatch({
          type: 'setSystemMessage',
          message: res.data
        });
      }
    },

    identityDialog () {
      // 未完善个人信息
      // if (!this.userInfo.mobile) {
      //   this.showUserDialog();
      //   return;
      // }
      this.$router.push({ name: 'home.AddCar' });
    },

     // 获取车辆品牌
     async getCarBrand () {
      let res = await Models.CarVio.getCarBrand();
      if (res.code === 1) {
        for (let i in res.data) {
          let el = res.data[i];
          for (let opt of el) {
            this.carBrand[opt.id] = opt;
          }
        }
      }
    },

    // 获取我的车辆
    async getMyCar () {
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true
      });
      let res = await Models.CarVio.getMyCar();
      if (res.code === 1) {
        this.carList = res.data;

        if (this.carList.length) {
          this.$nextTick(() => {
            /* eslint-disable */
            let swiper = new Swiper(this.$refs.homeSwiper, {
              pagination : '.swiper-pagination',
              paginationClickable :true,
              bulletActiveClass: 'car-break-bullet-active',
            });
          });
          /* eslint-disable */
        }

        for (let el of this.carList) {
          this.getCarViolation(el);
          this.getCarInfo(el.id);
        }

        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
      }
      else {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
        this.$toast('车辆信息获取失败');
      }
    },

    // 获取车辆违章信息
    getCarViolation (el) {
      let violation = localStorage.getItem('violation');
      if (violation) {
        violation = JSON.parse(violation);
      }
      if (violation && el.id in violation) {
        let data = violation[el.id];
        let datatime = data.datatime;
        if (Date.now() - 3*24*60*60*1000 > datatime) {
          this.getViolation(el);
        }
        else {
          this.$set(el, 'violation', data);
          this.setViolationState(el.id, data);
        }
      }
      else {
        this.getViolation(el);
      }
    },

    // 调用接口获取违章信息
    getViolation (el) {
      Models.CarVio.violationInformation({
        params: { id: el.id }
      })
      .then(res => {
        if (res.code === 1) {
          let data = res.data;

          // 无违章记录
          if (Array.isArray(data) && !data.length) {
            this.$set(el, 'violation', {});
            this.setViolationState(el.id, {});
            this.setViolationCookie(el.id, {});
            return;
          }

          if (data.peccancy_list && Array.isArray(data.peccancy_list)) {
            for (let el of data.peccancy_list) {
              el.count = Number(el.count);
              el.degree = Number(el.degree);
              el.actual_degree = Number(el.actual_degree);
              el.latefine = Number(el.latefine);
              el.servicePrice = Number(el.servicePrice);
              el.status = Number(el.status);
              el.can_process  = Number(el.can_process );
              el.violation_id  = Number(el.violation_id );
            }
            // 未处理 违章记录
            data.unDeal = {
              total_degree: 0,
              total_count: 0,
              sumServicePrice: 0,
              total_num: 0
            }
            for (let el of data.peccancy_list) {
              if (el.status === 0) {
                data.unDeal.total_degree += el.actual_degree;
                data.unDeal.total_count += el.count;
                data.unDeal.sumServicePrice += el.servicePrice;
                data.unDeal.total_num += 1;
              }
            }
          }

          this.$set(el, 'violation', data);
          this.setViolationState(el.id, data);
          this.setViolationCookie(el.id, data);
        }
        else {
          this.$toast(el.msg || '查询失败');
          this.$set(el, 'violation', {});
          this.setViolationState(el.id, {});
          this.setViolationCookie(el.id, {});
        }
      });
    },

    // 设置localstorage
    setViolationCookie (id, data) {
      let newData = Object.assign({ datatime: Date.now() }, data);
      let violation = localStorage.getItem('violation');
      if (violation) {
        violation = JSON.parse(violation);
      }
      else {
        violation = {};
      }
      violation[id] = newData;
      violation = JSON.stringify(violation);
      localStorage.setItem('violation', violation);
    },

    // 设置vuex
    setViolationState (id, data) {
      this.$store.get.commit('setViolation', { id, data });
    },

    // 车辆详情页
    goDetailPage (id) {
      // 未完善个人信息
      // if (!this.userInfo.mobile) {
      //   this.showUserDialog();
      //   return;
      // }
      this.$router.push({ name: 'home.CarBreakDetail', params: { cid: id } });
    },

    // 判断资料是否完善
    isMsgFill (key) {
      let flag = true;
      let item = this.carFurther[key];
      if (!item || !item.car_code || !item.car_reg_date || !item.car_check_date || !item.brand_id || !item.car_license_face
            || !item.car_license_back || !item.car_drive_number) {
        flag = false;
      }
      return flag;
    },

    // 获取补充资料
    async getCarInfo (id) {
      let res = await Models.CarVio.illegalIncome({
        params: {
          car_id: id
        }
      });
      if (res.code === 1) {
        this.carFurther[id] = res.data;
      }
    },

    // 车辆验证
    Accreditation (el) {
      this.$store.get.commit('setCarId', el.id);
      this.$store.get.commit('setcarCode', el.car_number);
      this.$router.push({
        name: 'home.CarAccreditation',
        query: {
          cid: el.id,
          code: el.car_number
        },
      });
    },

    // 删除车辆
    deleteCar (id) {
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
              let res = await Models.CarVio.deleteCar({ id });
              if (res.code === 1) {
                self.$toast('车辆删除成功');
                setTimeout(() => {
                  self.getMyCar();
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

  }
};

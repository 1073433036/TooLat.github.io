import './index.scss';
import _                  from 'lodash';
import Header           from '~common/components/header';
import Dates              from '~common/components/dates';
import Models       from '~common/models';
export default {
  name: 'IllegalIncome',
  data () {
    return {
      loading: false,
			isShow: false,
      carId: '',
      cardata: {},
      carCode: '',
      userInfo: {
        code: '',
        number: '',
        seriaNumber: '',
        phone: '',
        phoneNum: '',
      },
      formData: {
        date1: '',
      },
      isApply: false
    };
  },
  components: {
    'app-header': Header,
     Dates,
  },
  computed: {
    active () {
      let bool = true;
      for (let i in this.userInfo) {
        if (!this.userInfo[i]) {
          bool = false;
          break;
        }
      }
      return bool;
    }
  },
  mounted () {
    this.carId = this.$route.query.id;
    this.carCode = this.$route.query.carNumber;
    this.illegalIncome();
    // console.log(this.carId);
  },
  watch: {
  },
  methods: {
    //获取补充资料
    async illegalIncome () {
      let res = await Models.CarVio.illegalIncome({
        params: {
          car_id: this.carId
        }
      });
      if (res.code === 1) {
        this.cardata = res.data;
        // console.log(this.cardata);
        this.userInfo.code = this.cardata.car_code;
        this.userInfo.number = this.cardata.driver_number;
        this.userInfo.seriaNumber = this.cardata.archive_number;
        this.userInfo.phone = this.cardata.phone;
        this.userInfo.phoneNum = this.cardata.phone;
      }
    },
    // 日期选择
    handleDateChange () {
      this.isShow     = true;
    },
    // 日期组件回调
    handelDateClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isShow = obj.status;
          _.assign(this.formData, {
            [this.userInfo.formIndex]: obj.content
          });
          this.userInfo.formIndex = obj.content;
          return;
        }
      }
    },
    handleSumbit () {
    },
    //保存
    async save () {
      /* eslint-disable */
      const identity = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      const file = /\b\d{12}\b/;
      const phoneNumber = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!identity.test(this.userInfo.number)) {
           this.$toast('驾驶证号完整 15位或者18位');
           return;
         }
         else if (!file.test(this.userInfo.seriaNumber)) {
           this.$toast('档案编号完整 12位');
           return;
         }
         else if (!phoneNumber.test(this.userInfo.phoneNum)) {
           this.$toast('手机号码格式错误');
           return;
         }
         else {
          let res = await Models.CarVio.updateFurther({
            params: {
              car_id: this.carId,
              car_code: this.userInfo.code,
              driver_number: this.userInfo.number,
              archive_number: this.userInfo.seriaNumber,
              phone: this.userInfo.phone,
            }
          });
          if (res.code === 1) {
            this.$toast('保存成功');
            setTimeout(() => {
              this.$router.push({ name:'home.CarBreakOrderConfirm' });
            }, 1000);
          }
          else {
            this.$toast(res.msg);
          }
         }
      /* eslint-enable */
    }
  }
};

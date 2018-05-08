import './index.scss';
import _            from 'lodash';
import Header       from '~common/components/header';
import Dates        from '~common/components/dates';
import Models       from '~common/models';
import Cropper      from '~common/components/cropper';
import BotSelect     from '~common/components/bot_select';

export default {
  name: 'noopsycheCheckData',
  data () {
    return {
      isBankList : '',
      status   : 1,
      idPic : '',
      loading: false,
			isShow: false,
      carId: '',
      botTitle:'',
      carCode: '',
      userInfo: {
        name: '',
        phone: '',
        bank_list: {},
        phone: '',
        date1:'',
      },
      formData: {
        date1: '',
        driverUrl: '',
        driverSecondUrl: '',
      },
      formTemp       : {
        bank_list:{},
      },
      isApply: false,
      currentFile: '',
      formIndex: false,
      Show:false,
    };
  },
  components: {
    'app-header': Header,
     Dates,
     Cropper,
     BotSelect
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
    },

    uploadImage () {
      let data = _.get(this.$store.get.state, 'Cropper.content.data');
      return data;
    },
  },
  mounted () {
    this.getBankList();
    this.carId = this.$route.params.id;
    this.carCode = this.$route.params.code;
    this.illegalIncome();
  },
  watch: {
    uploadImage (val) {
      if (!_.isEmpty(val.preview) && !_.isEmpty(val.url)) {

        // this.formData = _.assign({}, this.formData, {
        //   [this.currentFile]: val.preview
        // });

        // this.userInfo = _.assign({}, this.userInfo, {
        //   [this.currentFile]: val.url
        // });
        // this.$toast('上传成功');
        if ('code' === this.currentFile) {
          this.$toast('上传成功');
          // this.formData.id_pic = val.preview;
        }
        // else {
        //   this.idPic    = val.preview;
        //   this.formData.id_pic    = val.url;
        //   let data = {
        //     type: 2,
        //     url: this.formData.id_pic,
        //   };
        //   this.getIdentityInfo(data);
        // }
      }
    },
  },
  methods: {
  botSelectClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.Show = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.userInfo, {
              [this.formIndex]: {
                name : obj.content.name || obj.content.bank_name,
                value : obj.content.value || obj.content.id,
                bank_name : obj.content.bank_name || obj.content.name,
                id : obj.content.id || obj.content.value,
              }
            });
          }
          return;
        }
      }
    },

  handleBotSelectChange (index) {
      // console.log(index);
      this.formIndex  = index;
      this.Show     = true;
      if ( index === 'bank_list' ) {
        this.isBankList = true;
        this.botTitle = '请选择银行卡';
      }
    },
    getBankList () {
      let self = this;
      Models.Intelligent
        .bankList()
        .then((res) => {
          self.formTemp.bank_list = res.data.data;
          // console.log(res.data.data);
        });
    },
   // 切换办卡状态
    switchState (status) {
      if (status !== this.status) {
        this.status = status;
        // this.list();
      }
    },
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
        // this.userInfo.seriaNumber = this.cardata.archive_number;
        // this.userInfo.number = this.cardata.driver_number;
        // this.userInfo.name = this.cardata.name;
        // this.userInfo.formIndex = this.cardata.first_license_date;
        // this.userInfo.phone = this.cardata.phone;
        // this.userInfo.date2 = this.cardata.car_check_date;
      }
    },

    // 日期选择
    handleDateChange (item) {
      this.isShow = true;
      this.formIndex = item;
    },
    // 日期组件回调
    handelDateClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isShow = obj.status;
          console.log(obj.content);
          this.userInfo.date1 = obj.content;
          // _.assign(this.formData.data1, {
          //   [this.formIndex]: obj.content,
          // });
          return;
        }
      }
    },

    // 图片上传组件
    setImage (e, el) {
      if (!_.isEmpty(e)) {
        this.currentFile = el;
        const file = e.target.files[0];
        this.$store.get.dispatch({
          type  : 'cropperData',
          isShow: true,
          save  : 1,
          data: {
            file: file
          }
        });
      }
    },

    // 重置input file值
    fileClose () {
      this.$refs[this.currentFile].value = '';
    },

    //保存
    async save () {
      let self = this;
        self.$store.get.dispatch({
          type: 'handleChangeDialog',
          CustomClass: 'foot-between',
          active: true,
          width: '90%',
          title: '温馨提示',
          msg: '你的申请资料已提交成功，稍后我们会进行人工审核，请耐心等待！.00元，请保证此卡金额充足',
          lists: [
            {
              msg: '确定',
              func () {
                self.$router.push({
                  name: 'home.intelligentschedulelist',
                });
              }
            },
          ],
        });

    }
  },
};

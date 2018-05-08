import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import phoneCode  from '~common/components/phone_code';
import Checkbox   from '~common/components/checkbox';
import CityList   from '~common/components/city_list';
import Bank       from './components/bank';
import BankShow   from './components/bank_show';
// import ErrMsgShow   from './components/err_msg_show';
import Models     from '~common/models';
import Protocol   from '~common/components/protocol_detail';
import LocalStorage     from '~common/services/localStorage.cookie';

export default {
  name: 'creditcard-apply',
  data () {
    return {
      // 控制证件号码显示隐藏
      pcode : '',
      EMShow: false,
      selected : '',
      backBank:'',
      EMUserAvatar:'',
      EMUserNick:'',
      opacity:'',
      sselectstatus : false,
      icon : true,
      uname : '',
      uphone : '',
      showM : false,
      showMessage:false,
      nextColor : false,
      itemColor : false,
      need_id_card: null,
      state: {
        active        : false,
        agree         : true,
        addFlag       : false,
        jumpFlag      : false,
      },

      // 申请人信息
      formData: {
        id            : '',
        bank_id       : '',
        credit_card_id: '',
        credit_card_name :'',
        credit_card_thumb : '',
        name          : '',
        id_number     : '',
        code          : '',
			},

			creditList:[],

      data: {
        bank: {}
      },

      areaBankData: {},
      areaBankDataShow: {},
      selectAreaData: {},

      // 申请人信息列表
      formList      : [],
      loading       : false,
      single        : true,
      isBankShow    : false,
      isBankShowShow : false,
      second        : 5,
      areaText      : '',
			apply_jump_url: '',
      isOpenProtocol: false,
      show: false,
      more: '90',
      list: false,
      status: '查看更多',
      wd: '',
      localStorageNum: 0,
      localArr: [],
      // checkPhoneSame: false
    };
  },
  components: {
    'app-header': Header,
    phoneCode,
    Checkbox,
    CityList,
    Bank,
		BankShow,
    Protocol,
  },
  computed: {
    cityShow () {
      return _.get(this.$store.get.state, 'CityList.content.isShow') || false;
    },

    prov () {
      let data = _.get(this.$store.get.state, 'CityList.content.data.prov') || {};
      // this.formData.province_id = _.get(data, 'region_id') || '';
      return data;
    },

    city () {
      let data = _.get(this.$store.get.state, 'CityList.content.data.city') || {};
      // this.formData.city_id = _.get(data, 'region_id') || '';
      return data;
    },

    area () {
      let data = _.get(this.$store.get.state, 'CityList.content.data.area') || {};
      // this.formData.area_id = _.get(data, 'region_id') || '';
      return data;
    },

    address () {
      return `${_.get(this.prov, 'region_name') || ''}${_.get(this.city, 'region_name') || ''}${_.get(this.area, 'region_name') || ''}`;
    },

    active () {
      let bool = false;
      this.formData = Object.assign({}, this.formData);
      if (this.formData.name && this.formData.id_number && this.formData.phone && this.formData.code) {
        bool = true;
      }
      return bool;
    },
    accountName () {
      return this.formData.name;
    },
    formListLength () {
      return this.formList.length;
    },
    /*accountPhone () {
      return this.formData.phone;
    }*/
  },
  mounted () {
    // setTimeout(() => {
    //   this.EMShow = false;
    // }, 2000);
  //  if (this.itemColor = true) {
  //    this.nextColor = true;
  //  }
  //   setTimeout(() => {
  //     let itemList = document.querySelector('.info-wrapper li');
  //     itemList[0].trigger('click');
  //     console.log(itemList[0]);
  //   }, 3000);
    /* eslint-disable */
    this.$nextTick(() => {
      this.getAuthentication();
      this.formData.bank_id         = this.$route.query.bid ? this.$route.query.bid * 1 : '';
      this.formData.credit_card_id  = this.$route.query.id ? this.$route.query.id * 1 : '';
      // console.log(this.$route.query.bid, this.$route.query.credit_card_id);
      this.nameList();
      this.handleCreditDetail();
      this.localStorageNumCount();
    });
    // this.cardList();
    this.formData.credit_card_name  = this.$route.query.name ? this.$route.query.name: '';
    this.formData.credit_card_thumb  = this.$route.query.thumb ? this.$route.query.thumb : '';
    // console.log(this.formData.credit_card_name );
    // console.log(this.formData.credit_card_thumb);

  },
  watch: {
    /*accountPhone (newVal, oldVal) {
      if (this.formList.length > 0) {
        this.formList.forEach((item) => {
          if (parseInt(item.phone) === parseInt(newVal)) {
            this.checkPhoneSame = true;
          }
          else {
            this.checkPhoneSame = false;
          }
        });
      }
    },*/
    formListLength (val) {
      if (val === 0) {
        this.state.addFlag = false;
      }
    },
    accountName (newVal, oldVal) {
      let self = this;
      if (!_.isEmpty(oldVal)) {
        self.formList.forEach((item) => {
          if (_.trim(item.name) === _.trim(newVal)) {
            self.$store.get.dispatch({
              type  : 'handleChangeDialog',
              active: true,
              title : '温馨提示',
              msg   : '每个用户只能添加一条记录',
              lists : [
                {
                  msg: '关闭',
                  func () {

                  }
                },
              ]
            });
          }
          else {
            for (let item of this.localArr) {
              // console.log(item.value);
              if (newVal === item.value.data.name) {
                self.formData.id_number = item.value.data.id_number;
                self.formData.phone = item.value.data.phone;
              }
            }
          }
        });
      }
    },
    /*formData: {
      deep: true,
      handler () {
      },
    },*/
    area (val) {
      let self = this;
      if (_.get(val, 'region_name') && _.get(val, 'region_name') !== self.areaText) {
        self.areaText = _.get(val, 'region_name');
        self.areaBankDataShow = {
          bank    : self.data.bank.name,
          province: _.get(this.prov, 'region_name'),
          city    : _.get(this.city, 'region_name'),
          district: _.get(val, 'region_name'),
          logo    : self.data.bank.thumb,
        };
        Models.Bank
        .areaBank(self.areaBankDataShow)
        .then((res) => {
          if (1 === res.code && 0 === res.data.data.length) {
            self.isBankShowShow = true;
          }
        });
      }
    },
  },
  methods: {

    localStorageNumCount () {
      let reg = /^(account)/;
      for (let i = 0; i < localStorage.length; i ++) {
        if (reg.test(localStorage.key(i))) {
          this.localStorageNum ++;
          let _data = {
            key: localStorage.key(i),
            value: LocalStorage.get(localStorage.key(i))
          };
          this.localArr.push(_data);
        }
      }
    },
    MessageSubmit () {
      // else if (this.pcode) {
      //   this.$toast('验证码不正确');
      // }
      this.jump();
      this.showMessage = false;
    },
    MessageDismiss () {
      this.showMessage = false;
    },
    //点击查看更多
    rmore () {
      this.list = true;
    },
    // 获取基本共用字段
    getAuthentication () {
      Models.Profile
      .getAuthentication()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          this.creditList.name        = data.real_name;
          this.creditList.id_number   = data.id_card;
          this.creditList.phone       = data.mobile;

          this.formData.name          = data.real_name;
          this.formData.id_number     = data.id_card;
          this.formData.phone         = data.mobile;
        }
      });
    },

		/*
     * 自动填写办卡人信息
     */
		// cardList () {
  //     Models.Lender
  //     .nameList()
  //     .then((res) => {
  //       if (1 === res.code) {
		// 			let data = res.data;
  //         if (!_.isEmpty(data.data)) {
		// 				this.creditList = data.data[0];
		// 				this.formData.name = this.creditList.name;
  //           this.formData.id_number = this.creditList.id_number;
  //           this.formData.phone = this.creditList.phone;
  //         }
  //       }
  //     });
  //    },

    /*
     * 监控表单是否为空
     */
    handleIsempty () {
      this.state.active = true;
      for (let i in this.formData) {
        if (0 >= this.formData[i].length) {
          this.state.active = false;
          break;
        }
      }
    },

    // 城市切换
    handleCityShowChange () {
      this.$store.get.dispatch({
        type: 'cityListData',
        isShow: true,
      });
    },

    handleCreditDetail () {
      let self = this;
      Models.Credit
      .show({
        params: {
          id: self.formData.credit_card_id,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          this.need_id_card = data.need_id_card;
          if (_.isEmpty(data)) {
            self.$store.get.dispatch({
              type  : 'handleChangeDialog',
              active: true,
              title : '温馨提示',
              msg   : '内容不存在',
              lists : [
                {
                  msg: '关闭',
                  func () {
                    self.$router.push({
                      name: 'home.Home',
                    });
                  }
                },
              ]
            });
            return;
          }
          self.data = data;
        }
      });
    },

    /*
     * 申请人信息列表
     */
     nameList () {
       let self = this;
      Models.Credit
      .nameList()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          if (!_.isEmpty(_.get(data, 'list.data'))) {
            self.formList = _.get(data, 'list.data');
            _.each(self.formList, (item) => {
              item.address = `${_.get(item, 'province') || ''}${_.get(item, 'city') || ''}${_.get(item, 'area') || ''}`;
            });

            /*let objData = this.formList[0];

            self.formData = _.assign({}, self.formData, {
              area          : objData.area || '',
              area_id       : objData.area_id,
              city          : objData.city || '',
              city_id       : objData.city_id,
              province      : objData.province || '',
              province_id   : objData.province_id,
              id            : objData.id,
              name          : objData.name,
            });*/
          }
        }
      });
    },

    /*
     * 跳转倒计时
     */
    deleteData (item) {
      let self = this;
      this.more = this.formList.length * 99;
      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '是否确认删除申请人信息？',
        lists : [
          {
            msg: '取消',
            func () {
            }
          },
          {
            msg: '删除',
            class: 'ok',
            func () {
              Models.Credit
              .delete({
                id: item.id,
              })
              .then((res) => {
                self.$toast(res.msg);
                if (1 === res.code) {
                  self.formList.splice(item, 1);
                }
              });
            }
          }
        ]
      });

    },


    // 检查表单
    checkForm () {
      let self = this;
      if (false === self.single) {
        self.$toast('请阅读并同意《卡盟金服服务协议》');
        return;
      }

      // 通过身份证7到14位 判断年龄是否在18~55周岁之间
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      let idNumber = this.formData.id_number;
      if (reg.test(idNumber)) {
        let yearStr = idNumber.substring(6, 10),
            monthStr = idNumber.substring(10, 12),
            dateStr = idNumber.substring(12, 14);
        let eighteen = new Date(+yearStr + 18 + '/' + monthStr + '/' + dateStr).getTime(),
            fiftyFive = new Date(+yearStr + 55 + '/' + monthStr + '/' + dateStr).getTime(),
            now = Date.now();
        if (now < eighteen || now > fiftyFive) {
          this.$store.get.dispatch({
            type  : 'handleChangeDialog',
            active: true,
            title : '提示',
            msg   : '您的年龄未在规定年龄内，您的信用卡申请将无法通过哦！',
            lists : [
              {
                msg: '确定',
              },
            ]
          });
          return;
        }
      }
      else {
        this.$toast('请输入正确的身份证号码');
        return;
      }

      let res = self.$validator(self.$refs.form);
      if (0 !== res.code) {
        self.$toast(res.data.msg);
        return;
      }

      self.formData.province  = _.get(self.prov, 'region_name') || '';
      self.formData.city      = _.get(self.city, 'region_name') || '';
      self.formData.district  = _.get(self.area, 'region_name') || '';

      if (_.isEmpty(self.formData.province) || _.isEmpty(self.formData.city)) {
        self.$toast('请选择所在地');
        return;
      }

      /*self.areaBankData = {
        bank    : self.data.bank.name,
        province: self.formData.province,
        city    : self.formData.city,
        district: self.formData.district,
        logo    : self.data.bank.thumb,
      };*/
      Models.SmsCode
      .check({
        phone : self.formData.phone,
        code  : self.formData.code,
      })
      .then((res) => {
        if (1 !== res.code * 1) {
          self.$toast('验证码不正确');
          return;
        }
        self.saveAccount();
        self.handleSumbit();
      });

    },
    saveAccount () {
      let data = {
        id_number     : this.formData.id_number,
        name          : this.formData.name,
        phone         : this.formData.phone
      };
      let account = 'account-' + this.localStorageNum;
      LocalStorage.set(account, data, 2419200);
      this.localStorageNum ++;
    },
    /*
     * 查看附近银行
     */
    seeBankShow () {
      let self = this;

      self.formData.province  = _.get(self.prov, 'region_name') || '';
      self.formData.city      = _.get(self.city, 'region_name') || '';
      self.formData.district  = _.get(self.area, 'region_name') || '';

      if (_.isEmpty(self.formData.province) || _.isEmpty(self.formData.city)) {
        self.$toast('请选择所在地');
        return;
      }

      self.areaBankDataShow = {
        bank    : self.data.bank.name,
        province: self.formData.province,
        city    : self.formData.city,
        district: self.formData.district,
        logo    : self.data.bank.thumb,
      };

      self.isBankShowShow = true;
    },

    /*
     * 提交表单
     */
    handleSumbit () {
      let self = this;

      // 判断该信息是否已存在
      // let index = _.findIndex(self.formList, (item) => {
      //   if (item.name === self.formData.name && item.id_number === self.formData.id_number) {
      //     return item;
      //   }
      // });

      // if (-1 !== index) {
      //   self.$toast('该信息已存在');
      //   return;
      // }

      if (true === self.loading) {
        self.$toast('正在为您提交');
        return;
      }

      self.loading          = true;
      self.formData.id      = self.formList.length + 1;
      self.formData.address = self.address;


      let data = {
        bank_id       : this.formData.bank_id,
        credit_card_id: this.formData.credit_card_id,
        id_number     : this.formData.id_number,
        name          : this.formData.name,
        phone         : this.formData.phone,
        code          : this.formData.code,
        province_id   : _.get(this.prov, 'region_id'),
        city_id       : _.get(this.city, 'region_id'),
        area_id       : _.get(this.area, 'region_id'),
      };

      self.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
      });

      Models.Credit
      .create(data)
      .then((res) => {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
        // self.$toast(res.msg);
        if (2 === res.code) {
          // let res = {
          //   bank:"华夏银行、民生银行、上海银行、兴业银行",
          //   user_avatar:"http://res.kamengjinfu.com/admin/20180426/15247232164958135.jpeg",
          //   user_nick:"EastChina",
          // }
          this.backBank = res.data.bank;
          this.EMUserAvatar = res.data.user_avatar;
          this.EMUserNick = res.data.user_nick;
          // console.log(res.data);
          this.showM = true;
          setTimeout(() => {
            this.showM = false;
          }, 4000);
        }
        self.loading = false;
        if (1 === res.code) {
          // self.formData.id = _.get(res, 'data.id') ? _.get(res, 'data.id') : self.formData.id;
          // self.formList.push(self.formData);
          self.nameList();
          // 如果是添加的第一条记录，默认选中
          setTimeout(() => {
            if (self.formList.length === 1) {
              self.handelSelectData(self.formList[0].name, self.formList[0].phone, self.formList[0].id);
            }
          }, 1200);
          self.state.addFlag = false;

          // 清空申请人信息
          self.formData = _.assign({}, self.formData, {
            name: this.creditList.name,
            id_number: this.creditList.id_number,
            phone: this.creditList.phone,
            code: '',
          });
          // window.location.reload();
        }
      })
      .catch(() => {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
        self.loading = false;
      });

    },

    // 选中
    handelSelectData (name, phone, id) {
      this.itemColor = name;
      this.uname = name;
      this.state.addFlag = false;
      this.nextColor = true;
      this.sselectstatus = false ;
      this.formData.id = id;
      this.uphone = phone;
      // this.formData = _.assign({}, this.formData, item);
      // console.log(this.formData);
      console.log(name, phone, id);
    },

    handleBankVip () {
      if (this.state.addFlag) {
        this.$toast('请先确认添加信息');
        return;
      }
      if (true === _.get(this.data, 'is_guangda')) {
        this.show = true;
      }
      if (this.nextColor === false) {
        this.$toast('请正确填写或选择申请人信息才能进行下一步操作');
        this.sselectstatus = true;
        setTimeout(() => {
          this.sselectstatus = false;
        }, 3000);
        return;
      }
      if (this.nextColor === true) {
        this.showMessage = true;
        this.sselectstatus = false;
      }
        // this.jump();
    },

    /*
     * 跳转
     */
    jump () {
      let self = this;
      this.show = false;

      if (false === self.single) {
        self.$toast('请阅读并同意《卡盟金服服务协议》');
        return;
      }
      if (this.pcode === '') {
        self.$toast('请输入验证码');
        self.showMessage = true;
        return;
      }

      if (true === self.loading) {
        self.$toast('正在为您提交');
        return;
      }

      /*if (_.isEmpty(_.get(self.data, 'jump_url'))) {
        self.$store.get.dispatch({
          type  : 'handleChangeDialog',
          active: true,
          title : '温馨提示',
          msg   : '该信用卡申请已失效',
          lists : [
            {
              msg: '关闭'
            },
          ]
        });
        return;
      }*/


      self.loading = true;
      Models.SmsCode
        .check({
          phone : self.uphone,
          code  : self.pcode,
        })
        .then((res) => {
          if (1 !== res.code * 1) {
            self.$toast('验证码不正确');
            self.pcode = '';
            self.loading = false;
          }
          else {
            self.reapply();
          }
        });
    },
    reapply () {
      let self = this;
      Models.Credit
        .reapply({
          id            : self.formData.id,
          bank_id       : self.formData.bank_id,
          credit_card_id: self.formData.credit_card_id,
          code          : self.pcode,
        })
        .then((res) => {
          if (1 !== res.code) {
            self.$toast(res.msg);
          }
          else {
            self.apply_jump_url = res.data.jump_url;
            self.countDown();
          }
        })
        .catch(() => {
          self.loading = false;
        });
    },

    /*
     * 跳转倒计时
     */
    countDown () {
      let self = this;
      self.state.jumpFlag = true;
      let timer = setInterval(() => {
        if (self.second > 0) {
          self.second --;
        }
        else {
          self.state.jumpFlag = false;
          clearInterval(timer);
          window.location.href = self.apply_jump_url;
        }
      }, 1000);
    },

    // 添加申请人信息按钮
    handleApply () {
      this.state.addFlag  = true;
      this.itemColor = false;
      this.nextColor = false;
      // this.show = false;
      this.formData = _.assign({}, this.formData, {
        name: this.creditList.name || '',
        id_number: this.creditList.id_number || '',
				phone: this.creditList.phone || '',
				code:'',
      });
    },

    // 区域银行列表
    handleBankClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isBankShow = obj.status;
          _.assign(this.selectAreaData, obj.content);
          if (!_.isEmpty(obj.content)) {
            this.handleSumbit();
          }
          return;
        }
      }
    },

    // 还是区域银行列表
    handleBankClickShow (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isBankShowShow = obj.status;
        }
      }
		},
		//open协议
    openCardProtocol (item) {
      if ('card' === item) {
        this.isOpenProtocol = true;
      }
    },
  }
};

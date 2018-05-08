import './index.scss';

import _          					from 'lodash';
import Header     					from '~common/components/header';
import phoneCode  					from '~common/components/phone_code';
import Checkbox   					from '~common/components/checkbox';

import Models     					from '~common/models';
// import CityList       			from '~common/components/city_list';

import Protocol             from '~common/components/protocol_detail';
import LocalStorage     from '~common/services/localStorage.cookie';

export default {
  name: 'loanApply',
  data () {
    return {
      showM : false,
      backBank:'',
      EMUserAvatar:'',
      EMUserNick:'',
      state: {
        /*
         * 填写信息是否完整
         */
        active        : false,
        /*
         * 协议状态
         */
        agree         : true,
        /*
         * 是否已填写申请人信息
         */
        // applyed       : false,
        /*
         * 是否添加申请人信息
         */
        addFlag       : false,
        /*
         * 是否跳转
         */
        jumpFlag      : false,
      },
      /*
       * 申请人信息
       */
      formData: {
        id: '',
        lender_id     : '',
        name          : '',
        id_number     : '',
        phone         : '',
				code          : '',
				// location			:	'',
				// province      : '',
        // city          : '',
        // district      : '',
				// address       : {},
			},
			loansList:[],
			isShow: false,
			show:false,
      creditDetail: '',

      /*
       * 申请人信息列表
       */
      formList: [],
      loading: false,
      single: true,

      /*
       * 跳转贷款链接
       */
			loanUrl: '',

			isOpenProtocol: false,
      list: false,
      status: '查看更多',
      itemColor : false,
      nextColor : false,
      localStorageNum: 0,
      localArr: [],
      sselectstatus : false,
      showMessage: false,
      uname : '',
      uphone : '',
      pcode :'',
      second        : 5,
      // checkPhoneSame: false
    };
  },
  components: {
    'app-header': Header,
    phoneCode,
		Checkbox,
		// CityList,
		Protocol,
  },
  computed: {
		/*cityShow () {
      return _.get(this.$store.get.state, 'CityList.content.isShow') || false;
    },

    provObj () {
      return _.get(this.$store.get.state, 'CityList.content.data.prov') || {};
    },

    cityObj () {
      return _.get(this.$store.get.state, 'CityList.content.data.city') || {};
    },

    areaObj () {
      return _.get(this.$store.get.state, 'CityList.content.data.area') || {};
    },

    address () {
      return `${_.get(this.provObj, 'region_name') || ''}${_.get(this.cityObj, 'region_name') || ''}${_.get(this.areaObj, 'region_name') || ''}`;
      // if (_.isEmpty(data)) {
      //   data = `${this.userInfo.province_name || ''}${this.userInfo.city_name || ''}${this.userInfo.district_name || ''}`;
      // }
      // return data;
    },*/
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
    /* eslint-disable */
    let swiper = new Swiper(this.$refs.mySwiper, {
      notNextTick: true,
      autoplay: 3000,
      speed: 800,
      grabCursor : true,
      pagination : '.swiper-pagination',
      paginationClickable :true,
      mousewheelControl : false,
      observeParents:true,
      loop: true,
      autoplayDisableOnInteraction: false,
    });
    /* eslint-enable */
    // console.log(this.nextColor);
    this.getAuthentication();
    this.formData.lender_id = _.get(this.$route, 'params.id');
    // this.formData.id  = this.$route.query.id ? this.$route.query.id * 1 : '';
    this.nameList();
    // console.log(this.$route);
    // this.handleCreditDetail();
    this.$nextTick(() => {
      this.localStorageNumCount();
    });
    /*this.getLoan();*/
    // this.loanList();
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
    formData: {
      deep: true,
      handler () {
        this.handleIsempty();
      },
    }
  },
  methods: {
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
    // 选中
    handelSelectData (name, phone, id) {
      this.sselectstatus = false ;
      this.uname = name;
      this.state.addFlag = false;
      this.nextColor = true;
      this.itemColor = name;
      this.formData.id = id;
      this.uphone = phone;
      // this.formData = _.assign({}, this.formData, item);
      // console.log(this.formData);
      // console.log(name,phone);
    },
    // 获取基本共用字段
    getAuthentication () {
      Models.Profile
      .getAuthentication()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          this.loansList.name       = data.real_name;
          this.loansList.id_number  = data.id_card;
          this.loansList.phone      = data.mobile;
          this.formData.name        = data.real_name;
          this.formData.id_number   = data.id_card;
          this.formData.phone       = data.mobile;
        }
      });
    },

		/**
		 *自动天申请人信息
		 */
		// loanList () {
  //     Models.Credit
  //     .nameList()
  //     .then((res) => {
  //       if (1 === res.code) {
		// 			let data = res.data;
		// 			if (!_.isEmpty(data.list.data[0])) {
		// 				this.loansList = data.list.data[0];
		// 				this.formData.name = this.loansList.name;
  //           this.formData.id_number = this.loansList.id_number;
  //           this.formData.phone = this.loansList.phone;
  //         }
  //       }
  //     });
  //   },

		/*
     * 所在地
     */
		/*choose () {
			// console.log(123);
			this.$store.get.dispatch({
        type: 'cityListData',
        isShow: true,
      });
		},*/
    /*
     * 监控表单是否为空
     */
    handleIsempty () {
      this.state.active = true;
      for (let i in this.formData) {
        if (this.formData[i] && 0 >= this.formData[i].length) {
          this.state.active = false;
          break;
        }
      }
    },

    // 城市切换
    /*handleCityShowChange () {
      this.$store.get.dispatch({
        type: 'cityListData',
        isShow: true,
      });
    },*/

    /*handleCreditDetail () {
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
          if (_.isEmpty(data)) {
            self.$store.get.dispatch({
              type  : 'handleChangeDialog',
              active: true,
              title : '温馨提示',
              msg   : '内容不存在',
              lists : [
                {
                  msg: '关闭',
                  // func () {
                  //   self.$router.push({
                  //     name: 'home.Home',
                  //   });
                  // }
                },
              ]
            });
            return;
          }
          self.creditDetail = data;
        }
      });
    },*/

    /*
     * 申请人信息列表
     */
     nameList () {
       let self = this;
      Models.Lender
      .nameList()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          if (!_.isEmpty(data.data)) {
            self.formList = data.data;
            // this.formData = _.assign({}, this.formData, data.data[0]);
          }
        }
      });
     },
		/**
		 *删除
		 */
		deleteData (item) {
      let self = this;

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
              Models.Lender
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
    /*
     * 提交用户信息
     */
    handleSumbit () {
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

      /*self.formData.province  = _.get(self.prov, 'region_name') || '';
      self.formData.city      = _.get(self.city, 'region_name') || '';
      self.formData.district  = _.get(self.area, 'region_name') || '';
      if (_.isEmpty(self.formData.province) || _.isEmpty(self.formData.city)) {
        self.$toast('请选择所在地');
        return;
      }*/
      /*if (true === self.loading) {
        self.$toast('正在为您提交');
        return;
      }*/

      self.loading = true;
      self.formData.id  = self.formList.length ? self.formList.length + 1 : 1;
      this.saveAccount();
      Models.Lender
      .create({
        lender_id     : this.formData.lender_id,
        id_number     : this.formData.id_number,
        name          : this.formData.name,
        phone         : this.formData.phone,
        code          : this.formData.code,
      })
      .then((res) => {
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
          }, 1500);
          self.state.addFlag = false;

          // 清空申请人信息
          self.formData = _.assign({}, self.formData, {
            name: this.loansList.name,
            id_number: this.loansList.id_number,
            phone: this.loansList.phone,
            code: '',
          });
          // window.location.reload();
        }
      })
      .catch(() => {
        self.loading = false;
      });
    },

    // 添加申请人信息按钮
    handleApply () {
			this.state.addFlag = true;
			this.formData = _.assign({}, this.formData, {
				name: this.loansList.name || '',
				id_number: this.loansList.id_number || '',
				phone: this.loansList.phone || '',
				code: '',
			});
      this.itemColor = false;
      this.nextColor = false;
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
    //宜人贷信息推送
    yydSendMsg () {
        let self = this;
        Models.Lender
        .sendMsg()
        .then((res) => {
          self.$toast(res.msg);
          if (1 !== res.code) {
            return;
          }
        })
        .catch(() => {

        });
    },
    // 提交申请资料
    sumbit () {
      let self = this;
      if (false === self.single) {
        self.$toast('请阅读并同意《卡盟金服服务协议》');
        return;
      }
      /*if (this.formList.length === 1) {
        this.uphone = this.formList[0].phone;
        this.uname = this.formList[0].name;
      }*/
      if (this.nextColor === true) {
        this.showMessage = true;
        this.sselectstatus = false;
      }
      if (this.nextColor === false) {
        this.$toast('请正确填写或选择申请人信息才能进行下一步操作');
        this.sselectstatus = true;
        setTimeout(() => {
          this.sselectstatus = false;
        }, 4000);
        return;
      }
      // if (true === self.loading) {
      //   self.$toast('正在为您提交');
      //   return;
      // }
      self.loading = true;
      this.formData.lender_id = _.get(this.$route, 'params.id');
      if (44 === this.formData.lender_id) {
         self.yydSendMsg();
      }
      /*Models.Lender
      .reapply({
        id        : this.formData.id,
        lender_id : this.formData.lender_id * 1,
      })
      .then((res) => {
        self.$toast(res.msg);
        if (1 !== res.code) {
          self.loading = false;
          return;
        }
        self.loanUrl  = res.data.jump_url;
        setTimeout(() => {
          window.location.href = self.loanUrl;
        }, 2000);
      })
      .catch(() => {
        self.loading = false;
      });*/
    },
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

      /*if (true === self.loading) {
        self.$toast('正在为您提交');
        return;
      }*/
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
      Models.Lender
        .reapply({
          id        : self.formData.id,
          lender_id : self.formData.lender_id * 1,
          code      : self.pcode,
        })
        .then((res) => {
          if (1 !== res.code) {
            self.loading = false;
            self.$toast(res.msg);
          }
          else {
            self.loanUrl  = res.data.jump_url;
            self.showMessage = false;
            self.countDown();
          }
          /*setTimeout(() => {
            window.location.href = self.loanUrl;
          }, 2000);*/
        })
        .catch(() => {
          self.loading = false;
        });
    },
    countDown () {
      let self = this;
      self.state.jumpFlag = true;
      let timer = setInterval(() => {
        if (self.second > 0) {
          self.second --;
        }
        else {
          self.state.jumpFlag = false;
          window.location.href = self.loanUrl;
          clearInterval(timer);
        }
      }, 1000);
    },
    /*getLoan () {
      let self = this;
      let id = _.get(self.$route, 'params.id');
      Models.Lender
      .show({
        params: {
          id: id * 1,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data      = res.data;
        }
      });
		},*/

		//open协议
    openCardProtocol (item) {
      if ('card' === item) {
        this.isOpenProtocol = true;
      }
    },
  },
};

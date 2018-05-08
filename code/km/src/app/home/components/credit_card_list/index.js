import './index.scss';

import _            from 'lodash';
import domtoimage   from 'dom-to-image';
import html2canvas  from 'html2canvas';
import qrcode       from 'qrcode.vue';


import Header       from '~common/components/header';
import Models       from '~common/models';
import Tips         from './components/tips';

export default {
  name: 'creditcard-list',
  data () {
    return {
      id    : '',
      state : {},
      page  : 1,
      total : 0,
      per_page: 0,
      current_page: 0,
      last_page: 0,
      formTemp: {
        data: [],
        bank: {},
      },
      cardTye: '',
      isBonus: false,
      currentBank: {
        bank: {}
      },
      isShare: false,
      isWeChat: false,
      isOther: false,
      canvasImage: '',
      qrCodeUrl: '',

      canvasToImgSrc: '',
      userInfo: '',
      isBankTips: false,
    };
  },
  created () {
    this.getPoster();
  },
  components: {
    'app-header': Header,
    Tips,
    qrcode,
  },
  computed: {
    appShareData () {
      return _.get(this.$store.get.state, 'App.histData.appShareData') || {};
    },
    theUserInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || this.$user.get() || {};
    },
    isWechatClient () {
      return this.device.is('WeChat');
    },
  },
  mounted () {
    this.id = this.$route.params.bid ? this.$route.params.bid * 1 : '';
    this.list();
  },
  watch: {
    userInfo (value) {
      if (!_.isEmpty(value)) {
        let data = `${window.location.origin}/card_share?&bid=${this.id}&invite_code=${value.invite_code}`;
        this.createQr(data);
      }
    }
  },
  methods: {
    // 未完善个人信息
		linkToRoute (options) {
      // 未完善个人信息
      // if (!this.theUserInfo.mobile) {
      //   let self = this;
      //   self.$store.get.dispatch({
      //     type  : 'handleChangeDialog',
      //     active: true,
      //     title : '温馨提示',
      //     msg   : '请先完善个人资料',
      //     lists : [
      //       {
      //         msg: '取消',
      //       },
      //       {
      //         msg: '去完善',
      //         class: 'ok',
      //         func () {
      //           self.$router.push({ name: 'user.Profile', query: { dt: self.$route.path } });
      //         }
      //       },
      //     ]
      //   });
      // }
      // else {
      //   this.$router.push(options);
      // }
      this.$router.push(options);
    },

    // 生成二维码
    createQr (url) {
      Models.Home
      .createQr({
        content: url
      })
      .then((res) => {
        console.log(res.data);
        if (1 === res.code) {
          this.qrCodeUrl = res.data;
        }
      });
    },

    /*
     * 获取数据
     */
    getPoster () {
      let self = this;
      Models.User
      .myPoster()
      .then((res) => {
        if (1 === res.code) {
          self.userInfo = res.data;
          self.qrCodeUrl = `${window.location.origin}/card_share?&bid=${self.id}&invite_code=${self.userInfo.invite_code}`;
        }
      });
    },

    /*
     * 信用卡列表
     */
    list () {
      let self = this;

      let data = {
        params: {
          bank_id : self.id,
          page    : self.page,
        },
      };
      this.cardTye = _.get(this.$route, 'query.tye');
      if (1 === this.cardTye * 1) {
        data.params = {
          is_platinum_card : this.cardTye,
          page: self.page,
        };

        this.formTemp.bank.name = '大额信用卡申请';
      }

      Models.Credit
      .list(data)
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          if (1 < self.page) {
            self.formTemp.data = _.concat(self.formTemp.data, data.data);
          }
          else {
            self.formTemp.data = data.data;
          }

          self.total        = data.total;
          self.per_page     = data.per_page;
          self.current_page = data.current_page;
          self.last_page    = data.last_page;

          if (!_.isEmpty(self.formTemp.data)) {
            let val = self.formTemp.data[0];
            self.$store.get.dispatch({
              type: 'histData',
              data: {
                shareData: {
                  logo: val.bank.thumb,
                  name: val.bank.name,
                }
              },
            });
          }

          _.each(self.formTemp.data, (item) => {
            item.tags = _.split(item.tags, ',');

            if (1 !== this.cardTye && item && _.isEmpty(self.formTemp.bank)) {
              self.formTemp.bank = item.bank;
            }

            if ( 1 >= item.tags.length) {
              item.tags = _.split(item.tags, '，');
            }

            item.title = _.split(item.title, ',');

            if ( 1 >= item.title.length) {
              item.title = _.split(item.title, '，');
            }

          });
        }
      });
    },

    // 奖金说明 修改 +1
    handleBonus (item) {
      this.currentBank = item;
      this.isBonus    = true;

      this.isBankTips = false;

      if (11 === item.bank_id * 1) {
        this.isBankTips = true;
      }
    },


    /*
     * 申请指南
     */
    apply () {
      let self = this;
      let route = {
        name: 'home.CreateApplyGuide',
        params: {
          id: self.$route.params.bid
        }
      };
      self.$router.push(route);
    },

    // 点击分享按钮
    handleShareClick () {

      if (false === this.device.is('WeChat') && window.js_obj) {
        /* eslint-disable */
        let data = {
          title     : this.appShareData.title,
          desc      : this.appShareData.desc,
          url       : this.appShareData.link,
          share_img : this.appShareData.imgUrl
        };

        js_obj.shareWeb(JSON.stringify(data));
        /* eslint-enable */
      }
      else {
        this.isShare = true;
      }

    },

    // 二维码点击事件
    handleWeChatClick () {
      let self = this;

      self.isWeChat = true;
      self.isOther  = true;

      if (_.isEmpty(self.qrCodeUrl)) {
        self.$toast('二维码加载失败，请刷新');
        return;
      }

      if (_.isEmpty(self.canvasImage)) {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: true,
          Text: '正在生成图片...'
        });

        let device = self.device.os().toLowerCase();
        if ('ios' === device) {
          self.createCanvasImageIos();
        }
        else {
          self.createCanvasImageIos();
        }
      }



    },

    // 返回按钮
    handleOther () {
      this.isOther  = false;
      this.isWeChat = false;
    },

    // 生成授权证书图片
    createCanvasImage () {
      let self = this;
      self.$nextTick(() => {
        setTimeout(() => {
          domtoimage.toPng(self.$refs.content)
          .then((data) => {
            if (!_.isEmpty(data)) {
              self.canvasImage  = data;
              self.$forceUpdate();
              self.$store.get.dispatch({
                type: 'Loading',
                isShow: false
              });
            }
          });

        }, 1800);
      });
    },

    // 生成授权证书图片 - ios
    createCanvasImageIos () {
      let self = this;
      self.$nextTick(() => {
        setTimeout(() => {
          html2canvas(self.$refs.content, {
            useCORS: true,
            allowTaint: false,
            taintTest: true,
          }).then(canvas => {
            self.canvasImage  = canvas.toDataURL();
            self.$forceUpdate();
            self.$store.get.dispatch({
              type: 'Loading',
              isShow: false
            });
          });

        }, 1800);
      });
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.list();
        done();
      }, 1500);
    },

    infinite (done) {
      if (this.last_page <= this.current_page) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        this.page ++;
        this.list();
        done();
      }, 1500);
    },
  },
};

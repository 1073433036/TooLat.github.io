import './index.scss';
import Header from '~common/components/header';
import _              from 'lodash';
import Models         from '~common/models';
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.min.css';
import GetSpShare     from '../get_sp_share';
import NotifyPopup    from '~common/components/notify_popup';

export default {
  name: 'studentCreditCard',
  data () {
    return {
      page  : 1,
      total : 0,
      per_page: 0,
      current_page: 0,
      last_page: 0,
      banklist:[],
      shareId: 0,
      shareHolder: 0,
      isShare: false,

      isNoticeShow: false,
      noticeTime: new Date('2018/04/09 10:00:00').getTime(),
      notifyMsg: ['因银行业务第二季度任务发布，广发银行于2018-04-09开始对系统升级，广发校园卡通道暂停申请，预计维护时间2天，具体开放时间另行通知，感谢您的配合'],
    };
  },
  components: {
    'app-header': Header,
    'get-sp-share': GetSpShare,
    'notify-popup': NotifyPopup
  },
  computed: {
    appShareData () {
      return _.get(this.$store.get.state, 'App.histData.appShareData') || {};
		},
		userInfo () {
      return this.$user.get() || _.get(this.$store.get.state, 'App.userInfo');
    },
  },
  mounted () {
    this.getForum();
    this.getBankList();
    /* eslint-disable */
    let swiper = new Swiper(this.$refs.swiperRoot, {
      autoplay: 2000,
      pagination : '.swiper-pagination',
      paginationClickable :true,
      bulletActiveClass: 'car-break-bullet-active',
      loop: true
    });
    /* eslint-enable */
  },
  methods:{
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
      let res = await Models.Notify.forum('student_credit_card');
      if (res.code === 1) {
        this.$store.get.dispatch({
          type: 'setSystemMessage',
          message: res.data
        });
      }
    },

    bankDetails () {
      this.$router.push({
        name: 'home.BankDetails'
      });
    },
    goCGB (event) {
      let e = event || window.event;
      let target = e.target || e.srcElement;
      if (/swiper\-cgb/.test(target.className)) {
        this.$router.push({
          name: 'home.CgbDetail'
        });
      }
    },
    // 点击分享按钮
    handleShareClick (bankId) {

      if (19 === bankId || 21 === bankId) {
        this.$toast('敬请期待');
        return;
      }

      this.$store.get.dispatch({
        type: 'setShareBankId',
        bankId: bankId,
      });

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
    gettags (tags) {
      let tagarr = [];
      if (tags) {
        tagarr = tags.split(',').slice(0, 2);
      }
      return tagarr;
    },
    getBankList () {
      let self = this;
      Models.StudentCreditCard
      .creditcardlist({
        params: {
          page:self.page
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;

          if (1 < self.page) {
            this.banklist = _.concat(this.banklist, data.data);
          }
          else {
            this.banklist = data.data;
          }
          self.total        = data.total;
          self.per_page     = data.per_page;
          self.current_page = data.current_page;
          self.last_page    = data.last_page;
        }
      });
    },
    goapply (item) {
      // 未完善个人信息
			// if (!this.userInfo.mobile) {
      //   this.showUserDialog();
      //   return;
      // }
      if (19 === item.bank_id || 21 === item.bank_id) {
        this.$toast('敬请期待');
        return;
      }
      if (item.bank_id === 20) {
        this.notifyMsg = ['因银行业务第二季度任务发布，广发银行于2018-04-09开始对系统升级，广发校园卡通道暂停申请，预计维护时间2天，具体开放时间另行通知，感谢您的配合'];
        this.noticeTime = new Date('2018/04/09 10:00:00').getTime();
        this.isNoticeShow = true;
        return;
      }
      this.$router.push({ name: 'home.StudentCreditCardApply', query: { bankCardName: item.name, bankId: item.bank_id, creditCardId: item.id } });
    },
    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.getBankList();
        done();
      }, 1500);
    },

    infinite (done) {
      if (this.last_page * 1 <= this.current_page * 1) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        this.page ++;
        this.getBankList();
        done();
      }, 1500);
    },

    // 生成二维码
    showCardShare (bankId) {
      if (19 === bankId || 21 === bankId) {
        this.$toast('敬请期待');
        return;
      }
      this.shareId = bankId;
      this.shareHolder = Date.now();
    },

    // 关闭分享图层
    closeShareLayer () {
      this.$store.get.dispatch({
        type: 'setShareBankId',
        bankId: null,
      });
      this.isShare = false;
    },

    toggleNotifyFn () {
      this.isNoticeShow = false;
    }
  }
};

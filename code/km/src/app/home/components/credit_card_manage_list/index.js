import './index.scss';

import _            from 'lodash';
// import domtoimage   from 'dom-to-image';
// import html2canvas  from 'html2canvas';
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
    isWechatClient () {
      return this.device.is('WeChat');
    },
  },
  mounted () {
    this.id = this.$route.params.bid ? this.$route.params.bid * 1 : '';
    this.list();
  },
  watch: {
    /*userInfo (value) {
      if (!_.isEmpty(value)) {
        let data = `${window.location.origin}/card_share?&bid=${this.id}&invite_code=${value.invite_code}`;
        this.createQr(data);
      }
    }*/
  },
  methods: {
    selectFun () {
       this.$router.push({
          name: 'home.IntelligentAddCreditCards'
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

    addCreditcar () {
      this.$router.push({name: 'home.creditcardManageAdd'});
    }
  },
};

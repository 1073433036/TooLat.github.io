import './index.scss';

import Header           from '~common/components/header';
import Swiper           from 'swiper';
import Models           from '~common/models';
import phoneCode        from '~common/components/phone_code';
import NotifyPopup      from '~common/components/notify_popup';

export default {
  name: 'StudentCreditCardApply',
  data () {
    return {
			loading: false,
      cards: {
        normal: { name: '普卡', types: ['card', 'card', 'card'] },
        gold: { name: '金卡' },
        platinum: { name: '白金卡' }
      },
      cardSelected: '',
      cardName: '信用卡',
      userInfo: {
        bankId: '',
        creditCardId: '',
        name: '',
        phone: '',
        identity: '',
        school: '',
        studentId: '',
        verificationCode: ''
      },
      isApply: false,

      isNoticeShow: false,
      notifyMsg: ['民生校园卡填写资料注意事项', '住宅电话寝室有就填，没有就不填，单位电话知道学校电话就填，不知道就不填，最主要就是直亲联系人，至少要保证第一直亲真实有效，第二个如果实在不能填直亲可以填同学朋友。如果学校宿舍是ABC这种字母的栋数，需要转换成1栋2栋3栋，不能填写字母栋数，否则将无法通过民生银行系统审核，感谢您的配合！']
    };
  },
  components: {
    'app-header': Header,
    phoneCode,
    'notify-popup': NotifyPopup
  },
  computed: {
		bankName () {
			let arr = this.cardName.split('·');
			let newArr = [];
			for (let el of arr) {
				if (!/元/.test(el)) {
					newArr.push(el);
				}
			}
			return newArr.join('·');
		},
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
    this.cardSelected = Object.keys(this.cards)[0];

    if (this.$route.query.bankCardName) {
      this.cardName = this.$route.query.bankCardName;
    }

    for (let i in this.$route.query) {
      if (i in this.userInfo) {
        this.userInfo[i] = this.$route.query[i];
      }
    }

    if (Number(this.userInfo.bankId) === 18) {
      this.isNoticeShow = true;
    }

    this.$nextTick(function () {
      /* eslint-disable */
      let swiper = new Swiper(this.$refs.swiperRoot, {
        loop: true,
        prevButton: '.swiper-button-prev',
        nextButton: '.swiper-button-next',
      });
      /* eslint-enable */
    });
  },
  watch: {

  },
  methods: {
    goCGB () {
      this.$router.push({
        name: 'home.CgbDetail'
      });
    },

    // 大学选择
    selectSchool () {
      this.$router.push({ name: 'home.CollegeChoice', query: this.userInfo });
    },

    handleSumbit () {
      let self = this;

      let tips = self.$validator(self.$refs.form);
      if (0 !== tips.code) {
        self.$toast(tips.data.msg);
        return;
      }

      this.isApply = true;
    },

    applyCard () {
      this.isApply = false;

      let self = this;

      self.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
        Text: '正在申请中...'
      });

      let params = {
        bank_id: this.userInfo.bankId,
        credit_card_id: this.userInfo.creditCardId,
        name: this.userInfo.name,
        phone: this.userInfo.phone,
        id_number: this.userInfo.identity,
        school: this.userInfo.school,
        student_number: this.userInfo.studentId,
        code: this.userInfo.verificationCode,
      };
      Models.StudentCreditCard.applyCreditCard(params)
      .then((res) => {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });

        if (1 === res.code) {
          this.$toast('申请成功');
          let url = res.data.url;
          if (url) {
            setTimeout(() => {
              window.location.href = url;
            }, 1000);
          }
        }
        else {
          this.$toast(res.msg || '申请失败');
        }
      });
    },

    toggleNotifyFn () {
      this.isNoticeShow = false;
    }

  }
};

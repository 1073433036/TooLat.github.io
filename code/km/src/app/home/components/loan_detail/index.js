import './index.scss';

import _                  from 'lodash';
import Header             from '~common/components/header';
import Models             from '~common/models';

export default {
  name: 'loan_detail',
  data () {
    return {
      state: {
        moreFlag: false,
      },
      isShare: false,
      formTemp: {},
    };
  },
  components: {
    'app-header': Header,
  },
  filters: {
    interest (value) {
      let data = 10000 + 10000 * (value / 100) * 30;
      return data.toFixed(2);
    },
  },
  computed: {
    loanId () {
      return _.get(this.$route, 'params.id');
    },
    appShareData () {
      return _.get(this.$store.get.state, 'App.histData.appShareData') || {};
    },
    userInfo () {
      return this.$user.get() || _.get(this.$store.get.state, 'App.userInfo') || {};
    },
  },
  mounted () {
    this.getDetail();
  },
  watch: {
  },
  methods: {
    // 立即申请
    linkToLoanApply () {
      // 未完善个人信息
      this.$router.push({name: 'home.LoanApply', query:{ id: this.formTemp.id }});
    },

    getDetail () {
      let id = _.get(this.$route, 'params.id');
      if (!_.isNumber(id * 1)) {
        this.$store.get.dispatch({
          type  : 'handleChangeDialog',
          active: true,
          title : '温馨提示',
          msg   : '内容不存在',
          lists : [
            {
              msg: '关闭',
            },
          ]
        });
        return;
      }
      Models.Lender
      .show({
        params: {
          id: id * 1,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data      = res.data;
          this.formTemp = _.assign({}, this.formTemp, data);
          this.$store.get.dispatch({
            type: 'histData',
            data: {
              loanShareData: {
                loanId: this.loanId,
                name: data.name,
                logo: data.thumb,
              }
            },
          });
        }
      });
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

  },
};

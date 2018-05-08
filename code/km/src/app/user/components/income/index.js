import './index.scss';

import _        from 'lodash';
import Header   from '~common/components/header';
import BombBox  from '~common/components/bomb_box';
import Models   from '~common/models';

export default {
  name: 'userIncome',
  data () {
    return {
      page  : 1,
      total : 0,
      per_page: 0,
      current_page: 0,
      last_page: 0,
      formData: {
        incomeTpe: {
          name: '全部',
          value: 0,
        },
      },
      formTemp: {
        data: [],
        incomeTpe: [
          {
            name: '全部',
            value: 0,
          },
          {
            name: '无卡支付',
            value: 11,
          },
          {
            name: '推荐会员',
            value: 1,
          },
          {
            name: '精养代还',
            value: 12,
          },
          {
            name: '办信用卡',
            value: 2,
          },
          {
            name: '小额贷款',
            value: 3,
          },
          {
            name: '违章查询',
            value: 18,
          },
        ],
      },
      bombShow: false,
      formIndex: '',
    };
  },
  components: {
    'app-header': Header,
    BombBox
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    }
  },
  mounted () {
    this.list();
  },
  watch: {

  },
  filters: {
    incomeTye (value) {
      let data = '佣金';
      switch (value) {
        case 1:
        data = '招商佣金';
        break;
        case 2:
        data = '办卡佣金';
        break;
        case 3:
        data = '贷款佣金';
        break;
        case 4:
        data = '管理佣金';
        break;
        case 11:
        data = '交易佣金';
        break;
        case 12:
        data = '精养卡佣金';
        break;
        case 18:
        data = '违章查询佣金';
        break;
      }
      return data;
    }
  },
  methods: {

    list () {
      let self = this;
      Models.Account
      .list({
        params: {
          page: self.page,
          type: _.get(self.formData, 'incomeTpe.value')
        }
      })
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
        }
      });
    },

    // 底部弹框组件
    handleBomb (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.bombShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.formData, {
              [this.formIndex]: obj.content
            });
            this.page = 1;
            this.list();
          }
          return;
        }
      }
    },

    // 所属组件
    handleBombBoxChange (index) {
      this.formIndex  = index;
      this.bombShow   = true;
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
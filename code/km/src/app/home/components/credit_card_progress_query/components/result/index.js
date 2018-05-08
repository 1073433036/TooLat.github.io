import './index.scss';

import _          from 'lodash';
import Models     from '~common/models';

export default {
  name: 'result',
  props: ['show', 'tempData'],
  data () {
    return {
      page  : 1,
      total : 0,
      per_page: 0,
      current_page: 0,
      last_page: 0,
      formTemp: {
        data: []
      },
      visible: false,
      layerFlag: false,

    };
  },
  components: {
  },
  computed: {
  },
  mounted () {
  },
  watch: {
    show (val) {
      if (true === val) {
        this.list();
      }
      this.visible = val;
    },
  },
  filters: {
    formatTime (value) {
      let date = new Date(value * 1000);
      let y = 1900 + date.getYear();
      let m = '0' + (date.getMonth() + 1);
      let d = '0' + date.getDate();
      let time = y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length);
      return time;
    },
  },
  methods: {

    list () {
      let self = this;

      Models.Lender
      .creditCardQuery(self.tempData)
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;

          if (_.isObject(data) && _.isArray(data.data)) {
            self.layerFlag = true;
          }

          if (1 < self.page) {
            self.formTemp.data = _.concat(self.formTemp.data, data.data);
          }
          else {
            self.formTemp.data = data.data;
          }

          if (!_.isEmpty(self.formTemp.data)) {
            let bank = self.formTemp.data[0];
            self.$router.push({
              name: 'user.CardDetail',
              params: {
                id: bank.id
              },
              query: {
                type: bank.type
              }
            });
          }

          self.total        = data.total;
          self.per_page     = data.per_page;
          self.current_page = data.current_page;
          self.last_page    = data.last_page;
        }
        else {
          self.layerFlag = false;
          self.$toast(res.msg || '网络错误');
        }
      });
    },

    // 取消返回
    handleClose () {
      this.visible = false;
      this.$emit('handleClose', {
        status: false,
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

  }
};
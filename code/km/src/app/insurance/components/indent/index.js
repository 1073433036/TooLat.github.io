import './index.scss';

import _                  from 'lodash';
import Header             from '~common/components/header';
import Models             from '~common/models';

export default {
  name: 'Indent',
  data () {
    return {
      formTemp:{
        list: '',
      },
      /*
       * 分页
       */
      page          : 1,
      total         : 0,
      per_page      : 0,
      current_page  : 0,
      last_page     : 0,
      timer         : 0,
      isPopupShow   : false,
    };
  },
  components: {
    'app-header'    : Header,
  },
  computed: {
  },
  mounted () {
    this.list();
    this.loopList();
  },
  watch: {},
  methods: {

    /*
     * 订单列表
     */
    list () {
      let self = this;
      Models.Insurance
      .orderList({
        params: {
          page: self.page
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;

          if (1 === self.page) {
            self.formTemp.list = [];
          }

          data.data.forEach((item) => {
            let data = _.assign({}, item, {state: false});
            self.formTemp.list.push(data);
          });

          self.total         = data.total;
          self.per_page      = data.per_page;
          self.current_page  = data.current_page;
          self.last_page     = data.last_page;
        }
      });
    },

    /*
     * 展开收起报价
     */
    switchShow (item) {
      item.state = !item.state;
    },

    /*
     * 查看报价
     */
    quoted (item) {
      this.$router.push({
        name: 'insurance.CarInsuranceLimit',
        query: {
          id: item.taskId,
          name: item.carInfo.carLicenseNo,
        },
      });
    },

    /*
     * 删除订单
     */
    handleDelOrder (item, index) {
      // taskState等于20 核保成功 3天后才可删除
      if (item.taskState === 20) {
        let date = item.create_at.replace(/-/g, '/');
        date = new Date(date).getTime();
        if (Date.now() - date < 3 * 24 * 60 * 60 * 1000) {
          this.isPopupShow = true;
          return;
        }
      }

      let self = this;
      this.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '是否确定删除订单，删除后将无法找回',
        lists : [
          {
            msg: '取消'
          },
          {
            msg: '确定',
            class: 'ok',
            func () {

              self.$store.get.dispatch({
                type: 'Loading',
                isShow: true,
                Text: '正在删除，请稍等...',
              });

              Models.Insurance
              .delOrder({
                id: item.id
              })
              .then((res) => {
                self.$store.get.dispatch({
                  type: 'Loading',
                  isShow: false,
                });
                if (1 === res.code) {
                  self.$toast('删除成功');
                  self.formTemp.list.splice(index, 1);
                }
                else {
                  self.$toast(res.msg);
                }
              })
              .catch(() => {
                self.$store.get.dispatch({
                  type: 'Loading',
                  isShow: false,
                });
              });
            }
          }
        ]
      });
    },

    goBackHomePage () {
      this.$router.push({ name: 'insurance.Home' });
    },

    loopList () {
      let self = this;
      setTimeout(() => {
        if (5 > self.timer) {
          self.list();
          self.loopList();
          self.timer++;
        }
      }, 1000 * 60 * 2);
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        self.list();
        done();
      }, 1500);
    },

    infinite (done) {
      let self = this;
      if (this.last_page <= this.current_page) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        self.page ++;
        self.list();
        done();
      }, 1500);
    },

  },
};

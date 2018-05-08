import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import BombBox    from '~common/components/bomb_box';
import Models     from '~common/models';

export default {
  name: 'userHome',
  data () {
    return {
      currentTab: null,
      page          : 1,
      total         : 0,
      per_page      : 0,
      current_page  : 0,
      last_page     : 0,
      bombShow      : false,
      formIndex     : '',
      status        : '',
      formData      : {
        filter: {},
      },
      formTemp: {
        list: [],
        childNav: [],
        filter: [
          {
            name: '审核中',
            value: 0,
          },
          {
            name: '审核通过',
            value: 1,
          },
          {
            name: '审核失败',
            value: 2,
          },
        ],
      },

      itemRemark: 'article',
      act       : '',
    };
  },
  components: {
    'app-header': Header,
    BombBox,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },

  },
  mounted () {


    this.$nextTick(() => {
      // this.currentTab = 26;
      this.myPostData();
      let type = _.get(this.$route, 'query.type');
      this.act = _.get(this.$route, 'query.act');
      this.currentTab = type ? type * 1 : 26;

    });


  },
  watch: {
    currentTab (value) {
      if (26 === value) {
        this.formTemp.childNav = [
          {
            id: 28,
            name: '文章',
            active: false,
          },
          {
            id: 29,
            name: '视频',
            active: false,
          },
          {
            id: 33,
            name: '图片',
            active: false,
          },
          {
            id: 35,
            name: '公司素材',
            active: false,
          }
        ];
      }
      else {
        this.formTemp.childNav = [
          {
            id: 30,
            name: '文章',
            active: false,
          },
          {
            id: 31,
            name: '视频',
            active: false,
          },
          {
            id: 34,
            name: '图片',
            active: false,
          },
          {
            id: 36,
            name: '公司素材',
            active: false,
          }
        ];
      }

      this.handleChildAddActive();

      this.articleList();

    },

    'formData.filter' (val, old) {
      if (val !== old) {
        this.page = 1;
        this.articleList();
      }
    }
  },
  methods: {

    // 添加状态
    handleChildAddActive () {
      if (this.act) {
        _.each(this.formTemp.childNav, (item) => {
          if (item.id * 1 === this.act * 1) {
            item.active = true;
          }
        });
      }
      else {
        this.formTemp.childNav[0].active = true;
      }
    },

    // 我的文章数据统计
    myPostData () {
      Models.Advertise
      .myPostData()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          this.formData = _.assign({}, this.formData, data);
        }
      });
    },

    // 读取当前分类信息
    articleList () {
      let self = this;

      let arr = _.filter(self.formTemp.childNav, { active: true });

      if (!_.isEmpty(arr)) {
        let item    = arr[0];
        let status  = self.formData.filter;

        let data = {
          category_id: item.id,
          page   : self.page,
          self   : 1,
        };

        if (!_.isEmpty(status)) {
          data.status = status.value;
        }

        Models.Advertise
        .articleList(data)
        .then((res) => {
          if (1 === res.code) {
            let data = res.data;

            if (1 < self.page) {
              self.formTemp.list = _.concat(self.formTemp.list, data.data);
            }
            else {
              self.formTemp.list = data.data;
            }

            self.total         = data.total;
            self.per_page      = data.per_page;
            self.current_page  = data.current_page;
            self.last_page     = data.last_page;
          }
        });
      }
    },

    // 底部弹框组件2
    handleBomb (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.bombShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.formData, {
              [this.formIndex]: obj.content,
            });
          }
          return;
        }
      }
    },

    // 所属组件2
    handleBombBoxChange (index) {
      this.formIndex  = index;
      this.bombShow   = true;
    },

    // 后退
    routerBack () {
      this.$router.back();
    },

    // 切换
    handleCheckNav (index) {
      this.act = '';
      this.handleChildAddActive();
      this.currentTab = index;
      this.page       = 1;
    },

    // 选中
    handleCheckTab (item) {
      _.each(this.formTemp.childNav, (el) => {
        if (el.id === item.id) {
          this.handleItemRemark(item);
          el.active = true;
        }
        else {
          el.active = false;
        }
      });

      this.page = 1;
      this.articleList();
    },

    // 检查分类
    handleItemRemark (item) {
      if ('文章' === item.name) {
        this.itemRemark = 'article';
      }
      else if ('图片' === item.name) {
        this.itemRemark = 'photo';
      }
      else if ('视频' === item.name) {
        this.itemRemark = 'video';
      }
      else if ('公司素材' === item.name) {
        this.itemRemark = 'material';
      }
    },

    // 删除
    myPostDelete (item) {
      let self = this;

      this.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '确认要删除？',
        lists : [
          {
            msg: '取消',
          },
          {
            msg: '删除',
            class: 'ok',
            func () {
              Models.Advertise
              .deletePost({
                id: item.id,
              })
              .then((res) => {
                self.$toast(res.msg);
              });
            }
          }
        ]
      });


    },

    // 跳转详情
    handleGoToDetail (item) {
      if (_.isObject(item)) {
        if (0 === item.post_status) {
          this.$toast('审核中，无法查看');
          return;
        }
        if (2 === item.post_status) {
          this.$toast('审核失败，无法查看');
          return;
        }

        this.$router.push({
          name: 'tool.ArticleDetail',
          query: {
            articleId: item.id,
            itemRemark: this.itemRemark,
          }
        });
      }
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.articleList();
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
        this.articleList();
        done();
      }, 1500);
    },
  },
};
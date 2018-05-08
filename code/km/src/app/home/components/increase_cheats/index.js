import './index.scss';
import 'swiper/dist/css/swiper.css';

import _                from 'lodash';
import Header           from '~common/components/header';
import Models           from '~common/models';
import Swiper           from 'swiper';

export default {
  name: 'Increase',
  data () {
    return {
      isShow:true,
      formTemp: {
				increaseData:[]
      },
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    userInfo () {
      let data = _.get(this.$store.get.state, 'App.userInfo') || this.$user.get();
      return data;
    },
	},
	watch: {

  },
  mounted () {
		this.increase();

    this.$nextTick(() => {
      /* eslint-disable */
      let swiper = new Swiper(this.$refs.mySwiper, {
        notNextTick: true,
        autoplay: 2000,
        grabCursor : true,
        pagination : '.swiper-pagination',
        paginationClickable :true,
        mousewheelControl : false,
        observeParents:true,
        loop: true,
        autoplayDisableOnInteraction: false,
      });
      /* eslint-enable */
    });
  },
  methods: {

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

    goToThePage (item) {
      this.$store.get.commit('saveTypeId', {
        id: item.id,
        name: item.name,
      });
      // if (13 === item.id) {
      //   this.isShow = !this.isShow;
      //   return;
      // }
      this.$router.push({name: 'home.IncreaseList'});
    },

		/**
		 * 提额秘籍
		 */
		increase () {
			let self = this;
			Models.Increase
			.categories({
        params: {
					type:1
        }
      })
			.then(res => {
        if (1 === res.code) {
          res.data.forEach((item) => {
            self.formTemp.increaseData.push(item);
          });
          Models.Increase
          .categories({
            params: {
              type:15
            }
          })
          .then(result => {
            if (1 === result.code) {
              result.data.forEach((item) => {
                self.formTemp.increaseData.push(item);
              });
              self.dealNewestData();
            }
            else {
              self.$toast(result.msg);
            }
          });
        }
        else {
          self.$toast(res.msg);
        }
			});
    },

    // 处理最新文章数量
    dealNewestData () {
      let isReadData = localStorage.getItem('articleRead');
      // 存在已读新文章
      if (isReadData) {
        isReadData = JSON.parse(isReadData);
        let time = isReadData.time;
        let today = this.getToday();

        // 判断数据存储时间是否是今天
        if (today < time) {
          for (let el of this.formTemp.increaseData) {
            let todayCount = 0;
            if (el.today_count > 0) {
              todayCount = el.today_count - (isReadData.detail[el.id] ? isReadData.detail[el.id] : 0);
            }
            else {
              todayCount = el.today_count;
            }
            this.$set(el, 'todayCount', todayCount);
          }
        }
        else {
          for (let el of this.formTemp.increaseData) {
            this.$set(el, 'todayCount', el.today_count);
          }
        }
      }
      else {
        for (let el of this.formTemp.increaseData) {
          this.$set(el, 'todayCount', el.today_count);
        }
      }
    },

    // 获取今天0点时间戳
    getToday () {
      let y = new Date().getFullYear(),
          m = new Date().getMonth() + 1,
          d = new Date().getDate();
      return new Date(y + '/' + m + '/' + d).getTime();
    },

    // 设置已读数据
    setArticleRead (id) {
      let item = this.formTemp.increaseData.find(el => el.id === id);
      let todayCount = item ? item.today_count : 0;
      let isReadData = localStorage.getItem('articleRead');

      if (isReadData) {
        isReadData = JSON.parse(isReadData);
        let time = isReadData.time;
        let today = this.getToday();

        if (time < today) {
          isReadData.detail = {};
        }
        isReadData.time = Date.now();
      }
      else {
        isReadData = {
          time: Date.now(),
          detail: {}
        };
      }

      isReadData.detail[id] = todayCount;
      isReadData = JSON.stringify(isReadData);
      localStorage.setItem('articleRead', isReadData);
    },

    // 跳转至文章列表
    linkToIncreaseList (type, id) {
      // 未完善个人信息
			// if (!this.userInfo.mobile) {
      //   this.showUserDialog();
      //   return;
      // }
      this.setArticleRead(id);

      if (1 === this.userInfo.level) {
        let self = this;
        this.$store.get.dispatch({
          type  : 'handleChangeDialog',
          active: true,
          title : '温馨提示',
          msg   : '该板块功能仅对高级会员及以上身份会员开放，您可升级会员后使用该功能！',
          lists : [
            {
              msg: '关闭',
            },
            {
              msg: '立即升级',
              class: 'ok',
              func () {
                let route = {
                  name: 'user.BuyVip'
                };
                self.$router.push(route);
              },
            }
          ]
        });
      }
      else {
        if (type === 'IncreaseList') {
          this.$router.push({ name: 'home.IncreaseList', params: { id }});
        }
        else {
          this.$router.push({ name: 'home.' + type});
        }
      }
    }

  },
};

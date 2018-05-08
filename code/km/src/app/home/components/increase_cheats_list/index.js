import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import Banks      from '~common/components/banks';
import Models      from '~common/models';

export default {
  name: 'IncreaseList',
  data () {
    return {
      page  : 1,
      total : 0,
      per_page: 0,
      current_page: 0,
      last_page: 0,

			flag: false,
      formTemp: {
				increaseList:[]
      },
      id: null,
    };
  },
  components: {
    'app-header': Header,
     Banks,
  },
  watch: {
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || this.$user.get() || {};
    },
  },

  mounted () {
    this.id = _.get(this.$route, 'params.id');
    this.list();
  },

  methods: {

		/**
		 * 提额秘籍列表
		 */
		list () {
      let self = this;

			Models.Increase
			.list({
        params: {
					category_id: self.id,
          page: self.page,
          num: 6
        }
      })
			.then(res => {
        if (1 === res.code) {
          let data = res.data;

          let promiseHolder = [];
          for (let el of data.data) {
            promiseHolder.push(self.getBlob(el));
          }
          Promise.all(promiseHolder).then(() => {
            if (1 < self.page) {
              self.formTemp.increaseList = _.concat(self.formTemp.increaseList, data.data);
            }
            else {
              self.formTemp.increaseList = data.data;
            }
            self.total        = data.total;
            self.per_page     = data.per_page;
            self.current_page = data.current_page;
            self.last_page    = data.last_page;
          });
        }
			});
		},
    /**
      * 选择银行
      **/
    chnageBank () {
      this.$store.get.dispatch({
        type  : 'bankData',
        isShow: true
      });
    },

    change () {
      this.flag = !this.flag;
    },

    /*
     * 上拉刷新
     */
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

    // 解决图片跨域
    getBlob (el) {
      let self = this;
      return new Promise(resolve => {
        let xhr = new XMLHttpRequest();
        xhr.open('get', el.more.thumbnail, true);
        xhr.responseType = 'blob';
        xhr.onload = function () {
          if (this.status === 200) {
            self.getBase(URL.createObjectURL(this.response))
            .then(url => {
              el.more.thumbSrc = url;
              resolve();
            });
          }
        };
        xhr.onerror = () => {
          el.more.thumbSrc = '';
          resolve();
        };
        xhr.send();
      });
    },

    // 压缩图片
    getBase (url) {
      return new Promise(resolve => {
        let image = new Image(),
          canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        image.onload = () => {
          // let w = image.naturalWidth,
          //   h = image.naturalHeight;
          let w = 180,
              h = 180;
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(image, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        image.onerror = () => {
          resolve('');
        };
        image.src = url;
      });
    },

  },

};

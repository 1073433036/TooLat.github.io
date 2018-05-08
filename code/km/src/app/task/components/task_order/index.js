import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import Footer     from '~common/components/footer';
import BombBox    from '~common/components/bomb_box';
import Radio      from '~common/components/radio';
import Models     from '~common/models';

export default {
  name: 'taskOrder',
  data () {
    return {
      formData: {
        type: {}
      },
      formTemp : {
        type: [
          {
            name: '全部订单',
            value: 0,
          },
          {
            name: '可抢订单',
            value: 1,
          },
          {
            name: '其他',
            value: 2,
          },
        ],
        status: [
          {
            name: '成功',
            value: 1,
          },
          {
            name: '失败',
            value: 0,
          },
        ],
      },
      bombShow: false,
      formIndex: '',

      orderList: [],
      orderIndex: '',
      page: 1,
    };
  },
  components: {
    'app-header': Header,
    'app-footer': Footer,
    BombBox,
    Radio,
  },
  computed: {
    taskTotal () {
      return this.orderList.length;
    },
    finishTotal () {
      let total = 0;
      for (let i in this.orderList) {
        if (1 === this.orderList[i].status * 1) {
          total ++;
        }
      }
      return total;
    },
  },
  mounted () {
    this.getMyOrder();
  },
  watch: {
  },
  methods: {

    /*
     * 获取抢到的订单
     */
    getMyOrder () {
      let self = this;

      Models.Task
      .myGet({
        params: {
          page: self.page,
        },
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          data.data.map((item) => {
            let o = {
              add_time           : item.add_time,
              amount             : item.amount,
              company            : item.company,
              create_at          : item.create_at,
              id                 : item.id,
              name               : item.name,
              phone              : item.phone,
              repay_date_limit   : item.repay_date_limit,
              status             : item.status,
              user_id            : item.user_id,
              state              : item.status,
            };
            self.orderList.push(o);
          });
        }
      });
    },

    /*
     * 设置状态
     */
    change (index, state) {
      let self = this;
      let text = 2 === state ? '确认标记订单状态为失败？' : '确认标记订单状态为成功？并且上传贷款成功截图';
      self.orderIndex = index;

      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : text,
        lists : [
          {
            msg: '取消',
            func () {
            },
          },
          {
            msg: '确认',
            func () {
              if (2 === state) {
                Models.Task
                .setStatus({
                  order_id: self.orderList[index].id,
                  status  : 2,
                })
                .then((res) => {
                  self.$toast(res.msg);
                  if (1 === res.code) {
                    self.$set(self.orderList[index], 'status', 2);
                  }
                });
              }
              else {
                self.$refs.file.click();
              }
            },
            class: 'ok',
          },
        ]
      });

      let ran = Math.ceil(Math.random() * 10 + 5) + self.orderList[index].state * 1;
      self.$set(self.orderList[index], 'state', ran);
    },

    /*
     * 上传成功放款截图
     */
    upload (event) {
      let self = this;
      let file = event.target.files[0];
      if (file.size < 1024 * 1024 * 10) {
        self.bombShow = false;
        self.$toast('上传中，请稍等');
        self.getBase(file, function (data) {
          Models.Upload
          .uploadImage({
            image: data,
          })
          .then((res) => {
            self.$toast(res.msg);
            if (1 === res.code) {
              Models.Task
              .setStatus({
                order_id: self.orderList[self.orderIndex].id,
                status  : 3,
                image   : res.data.preview,
              })
              .then((res) => {
                self.$toast(res.msg);
                if (1 === res.code) {
                  self.$set(self.orderList[self.orderIndex], 'status', 3);
                }
              });
            }
          });
        });
      }
      else {
        self.$toast('注意:每张图片大小不超过10M');
      }
    },

    /*
     * 压缩图片
     */
    getBase (file, callback) {
      let reader = new FileReader(),
        image = new Image(),
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        data = '';
      reader.readAsDataURL(file);
      reader.onload = function () {
        image.src = this.result;
      };
      image.onload = function () {
        let w = image.naturalWidth,
          h = image.naturalHeight;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(image, 0, 0, w, h, 0, 0, w, h);
        data = canvas.toDataURL('image/jpeg', 0.8);
        if (callback && 'function' === typeof callback) {
          callback(data);
        }
      };
    },

    // 底部弹框组件2
    handleBomb (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.bombShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.formData, {
              [this.formIndex]: obj.content
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
    }
  }
};
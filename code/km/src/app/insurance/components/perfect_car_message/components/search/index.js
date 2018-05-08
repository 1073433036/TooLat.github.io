import './index.scss';

import _                  from 'lodash';
import Models             from '~common/models';

export default {
  name: 'setMoney',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    vehicleName: {
      type: String,
    },
  },
  data () {
    return {
      visible           : false,
      carList           : [],
      isSuccess         : false,
      isFail            : false,
      keyword           : '',
      page              : 1,
      totalSize         : 1,
    };
  },
  components: {
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
  },
  mounted () {
    if (this.value) {
      this.visible = true;
    }
  },
  watch: {
    value (val) {
      this.visible = val;
    },
    visible (val) {
      this.$emit('input', val);
    },
    vehicleName (val) {
      this.keyword = val;
    },
    keyword (val) {
      if (val) {
        this.keyword = val.toUpperCase();
      }
    },
  },
  methods: {

    /*
     * 搜索
     */
    handleSearch () {
      let self = this;
      if (!self.keyword) {
        self.$toast('请输入搜索关键字');
        self.isSuccess   = false;
        self.isFail      = false;
        self.carList   = [];
        return;
      }

      /*
       * 过滤filterArr关键字
       */
      let filterArr = ['牌'];
      let keywordArr = self.keyword.split('');
      filterArr.forEach((item) => {
        let index = keywordArr.indexOf(item);
        if (-1 !== index) {
          keywordArr.splice(index, 1);
        }
      });
      let keyword = keywordArr.join('');
      /*
       * 普通用户开始模拟
       * 麦广扬操刀 + 1
       */
      // if (1 >= self.userInfo.level * 1) {
      //   let flag = false;
      //   let vehicle = [
      //     ['宝骏', '比亚迪', '北汽幻速', '宝沃', '北汽绅宝', '北汽新能源', '长安', '长城', '东风风神', '东风风光', '东风风行', '东风小康', '菲亚特', '广汽传祺', '哈佛', '海马', '华泰', '哈飞', '吉利', '江淮', '金杯', '铃木', '猎豹汽车', '陆风', '纳智捷', '欧宝', '奇瑞', '启辰', '荣威', '五菱汽车', '众泰', '中华'],
      //     ['本田', '别克', '标志', '大众', 'DS', '丰田', '福特', 'MGC', 'Jeep', '马自达', '名爵', '讴歌', '起亚', '日产', '斯柯达', '三菱', '斯巴鲁', '现代', '雪佛兰', '雪铁龙'],
      //     ['奔驰', '宝马', '保时捷', '路虎', '奥迪', '宾利', '悍马', '捷豹', '卡迪拉克', '雷克萨斯', '林肯', '兰博基尼', '劳斯莱斯', '莲花汽车', '玛莎拉蒂', '迈巴赫', 'MINI', '特斯拉', '沃尔沃', '英菲尼迪', '幻影', '北方奔驰'],
      //   ];
      //   vehicle.forEach((item) => {
      //     item.forEach((brand) => {
      //       if (-1 !== keyword.indexOf(brand)) {
      //         flag = true;
      //       }
      //     });
      //   });
      //   if (!flag) {
      //     self.$toast('请输入汽车品牌');
      //     return;
      //   }
      // }

      self.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
      });

      Models.Insurance
      .queryCarModelInfos({
        vehicleName: keyword,
        page: self.page,
      })
      .then((res) => {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
        if (1 === res.code) {
          let data = res.data;
          self.totalSize = data.totalSize * 1;
          if (0 === data.totalSize * 1) {
            self.carList   = [];
            self.isSuccess = false;
            self.isFail    = true;
          }
          else {
            if (1 < self.page) {
              self.carList = _.concat(self.carList, data.carModelInfos);
            }
            else {
              self.carList   = data.carModelInfos;
            }
            self.isSuccess = true;
            self.isFail    = false;
          }
        }
        else {
          self.$toast(res.msg);
          self.isSuccess   = false;
          self.isFail      = false;
        }
      })
      .catch(() => {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
      });
    },

    /*
     * 选择车型号
     */
    selectCar (item) {
      this.$emit('handleCar', item);
      this.cancel();
    },

    /*
     * 取消设置
     */
    cancel () {
      this.visible = false;
    },

    clearKeyword () {
      this.keyword = '';
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.handleSearch();
        done();
      }, 1500);
    },

    infinite (done) {
      let self = this;
      if (Math.ceil(self.totalSize / 50) <= self.page) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        self.page ++;
        self.handleSearch();
        done();
      }, 1500);
    },

  }
};
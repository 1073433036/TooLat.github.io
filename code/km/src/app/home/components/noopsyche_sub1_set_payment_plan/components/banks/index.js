import './index.scss';

import _        from 'lodash';
import Models   from '~common/models';

export default {
  name: 'bankList',
  data () {
    return {
      /*2018年03月22日 11:40 管理员说把 '招商银行' 去掉*/
      /*2018年3月27日17:47:25 管理员又说把 '交通银行' 去掉*/
      filterArr: ['工商银行', '农业银行', '中国银行', '邮政银行', '光大银行', '中信银行', '华夏银行', '浦发银行', '民生银行', '广发银行', '兴业银行', '上海银行', '北京银行', '平安银行'],
      formTemp: [],
      lastData: [],
      count: 1,
      search: '',
    };
  },
  props: ['isShowBank'],
  mounted () {
    this.bank();
  },
  computed: {
    currentData () {
      let self = this;
      let result = [];
      result = this.formTemp.filter(function (item) {
        let hasItem = false;
        self.filterArr.some(function (arr) {
          if (item.name === arr) {
            hasItem = true;
          }
        });
        return hasItem;
      });
      return result;
    }
  },
  watch: {
    search (val, ovl) {
      if (val !== ovl) {
        this.formTemp = _.filter(this.lastData, (item) => {
          if (-1 < item.name.indexOf(val)) {
            return item;
					}
        });
      }
    }
  },
  components: {

  },
  methods: {


    // 银行列表
    bank () {
      Models.Cultivate
      .getBankList()
      .then((res) => {
        if (1 === res.code) {
          this.formTemp = res.data;
          this.lastData = res.data;
        }
        else {
          this.$toast(res.msg);
          if (this.count) {
            this.bank();
            this.count = 0;
          }
        }
      });
    },

    handleClose () {
      this.$emit('closeBankEvent');
    },

    handleClick (item) {
      this.$emit('chooseItemEvent', item);
      this.$emit('closeBankEvent');
    },
  }
};
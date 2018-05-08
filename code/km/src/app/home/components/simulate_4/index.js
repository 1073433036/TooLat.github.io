import './index.scss';

import _              from 'lodash';
import Header         from '~common/components/header';
import Bank           from './components/bank';
import LocalStorage   from '~common/services/localStorage.cookie';

export default {
  name: 'simulate4',
  data () {
    return {
      isBankShow: false,
      formData: {},
      formTemp: {},
    };
  },
  components: {
    'app-header': Header,
    Bank,
  },
  computed: {
  },
  filters: {

  },
  mounted () {
    this.getTestBankList();
  },
  watch: {
  },
  methods: {

    // LocalStorage缓存信息
    getTestBankList () {
      let data  = LocalStorage.get('testBankList');
      if (_.isEmpty(data.data)) {
        this.$router.push({
          name: 'home.Simulate1',
        });
      }
      else {
        this.formTemp = _.get(data, 'data') || {};
      }
    },

    // 预审额度查询
    handleBankChange () {
      if (!_.isEmpty(this.formTemp.bank_list)) {
        this.isBankShow = true;
      }
      else {
        this.$toast('暂无推荐银行');
      }
    },

    handleBankClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isBankShow = obj.status;
          _.assign(this.formData, obj.content);
          if (!_.isEmpty(obj.content)) {
            this.$router.push({
              name: 'home.PreMoney',
              params: {
                id: this.formData.id,
              }
            });
          }
          return;
        }
      }
    }
  }
};
import './index.scss';

import _      from 'lodash';
import Header from '~common/components/header';
import Money  from './components/money';
import Name   from './components/name';
import Info   from './components/info';

export default {
  name: 'userInsure',
  data () {
    return {
      formData: {
        type : {},
        money: {},
        name : {},
        info : {},
      },
      formTemp: {
        typeData: [
          {
            id: 1,
            title: '车损险',
            desc: '不投保',
            text: '不计免赔',
            active: false,
          },
          {
            id: 2,
            title: '三者险',
            desc: '100万',
            text: '不计免赔',
            active: false,
          },
          {
            id: 3,
            title: '司机责任险',
            desc: '不投保',
            text: '不计免赔',
            active: false,
          },
          {
            id: 4,
            title: '乘客责任险',
            desc: '不投保',
            text: '不计免赔',
            active: false,
          },
          {
            id: 5,
            title: '玻璃险',
            desc: '不投保',
            text: '不计免赔',
            active: false,
          }
        ]
      }
    };
  },
  components: {
    'app-header'  : Header,
    'insure-money': Money,
    'insure-name' : Name,
    'insure-info' : Info,
  },
  computed: {
  },
  mounted () {
  },
  watch: {
  },
  methods: {

    // 选择商业险类型
    handleSelect (item) {
      _.each(this.formTemp.typeData, (el) => {
        if (el.id !== item.id) {
          el.active = false;
        }
        else {
          el.active = true;
        }

        this.formData = _.assign({}, this.formData, {
          type: item,
          money: {},
          name : {},
          info : {},
        });
      });
    },

    // 提交下一步
    handleSubmit () {
      if (_.isEmpty(this.formData.type)) {
        this.$toast('请选择商业险种');
        return;
      }
    },

  }
};
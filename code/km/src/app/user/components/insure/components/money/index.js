import './index.scss';

import _      from 'lodash';
import Header from '~common/components/header';

export default {
  name: 'userInsureMoney',
  props: {
    // formTemp: {
    //   type: Object,
    //   default: () => {
    //     return {};
    //   },
    // },
  },
  data () {
    return {
      formData: {
        data: {},
      },
      formTemp: {
        data: [
          {
            id: 1,
            title: '5万',
            value: 50000,
            active: true,
          },
          {
            id: 2,
            title: '10万',
            value: 100000,
            active: false,
          },
          {
            id: 3,
            title: '15万',
            value: 150000,
            active: false,
          },
          {
            id: 4,
            title: '20万',
            value: 200000,
            active: false,
          },
          {
            id: 5,
            title: '30万',
            value: 300000,
            active: false,
          }
        ]
      }
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
  },
  watch: {
  },
  methods: {

    // 选择
    handleSelect (item) {
      _.each(this.formTemp.data, (el) => {
        if (el.id !== item.id) {
          el.active = false;
        }
        else {
          el.active = true;
        }

        this.formData = _.assign({}, this.formData, {
          data: item,
        });
      });
    }
  }
};
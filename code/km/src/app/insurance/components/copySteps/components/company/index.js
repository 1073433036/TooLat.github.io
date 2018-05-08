import './index.scss';

import _                  from 'lodash';
import Header             from '~common/components/header';
import LocalStorage       from '~common/services/localStorage.cookie';

export default {
  name: 'CardInsurance',
  data () {
    return {
      formDate: {
        prvList: [],
      },
      formTemp: {
        list: '',
      },
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    type () {
      return this.$route.query.type;
    },
  },
  mounted () {
    this.list();
  },
  watch: {
  },
  methods: {

    list () {
      let total = 0;
      switch (this.type * 1) {
        case 1:
          total = '2709.9';
          break;
        case 2:
          total = '2709.9';
          // total = '4704.41';
          break;
        case 3:
          total = '7059.42';
          break;
      }
      this.formTemp.list = [
        {
          prvId: 20074419,
          prvName: '平安财险',
          logo: 'http://res.kamengjinfu.com/admin/20180201/7a60db1c44ced19552ca7a0bfc5c1de0.png',
          price: total,
        },
        {
          prvId: 20054419,
          prvName: '人保财险',
          logo: 'http://res.kamengjinfu.com/admin/20180201/9f12ad1509933b6acc53d11f55b64fdb.png',
          price: total,
        },
        {
          prvId: 20114419,
          prvName: '太平洋财险',
          logo: 'http://res.kamengjinfu.com/admin/20180201/1befaa37b19745030d4bf0534d0c5cd2.png',
          price: total,
        },
      ];

      let quoteInfo = LocalStorage.get('quoteInfo');
      let setp3 = _.get(quoteInfo, 'data.setp3');
      if (!_.isEmpty(setp3)) {
        let provider = LocalStorage.get('providersData');

        if (!_.isEmpty(provider.data)) {
          this.formTemp.list = [];

          _.each(setp3, (item) => {
            let data = _.filter(provider.data, { prvId: item.prvId });
            if (!_.isEmpty(data)) {
              data[0].logo  = data[0].info.logo;
              data[0].price = total;
              this.formTemp.list = _.concat(this.formTemp.list, data);
            }
          });
        }

      }

    },

  },
};
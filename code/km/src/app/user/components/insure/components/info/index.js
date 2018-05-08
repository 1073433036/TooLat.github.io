import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import phoneCode  from '~common/components/phone_code';

export default {
  name: 'userInsure',
  data () {
    return {
      formData: {
        data : {},
      },
      formTemp: {
        typeData: [
          {
            id: 1,
            title: '平安保险',
            active: false,
          },
          {
            id: 2,
            title: '大地车险',
            active: false,
          },
        ]
      }
    };
  },
  components: {
    'app-header': Header,
    phoneCode
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
      let self = this;
      let res = self.$validator(self.$refs.form);
      if (0 !== res.code) {
        self.$toast(res.data.msg);
        return;
      }
    },

  }
};
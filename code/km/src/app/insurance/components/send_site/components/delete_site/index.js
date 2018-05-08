import './index.scss';

import _          			from 'lodash';
import CityList         from '~common/components/city_list';

export default {
  name: 'setMoney',
  props: {
    value: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      visible    : false,
			money      : '',
			formData:{
				address       : {},
			},
			formTemp: {
			},
			bombShow: false,
      formIndex: '',
    };
  },
  components: {
		CityList,
  },
  computed: {
		cityShow () {
      return _.get(this.$store.get.state, 'CityList.content.isShow') || false;
    },

    provObj () {
      return _.get(this.$store.get.state, 'CityList.content.data.prov') || {};
    },

    cityObj () {
      return _.get(this.$store.get.state, 'CityList.content.data.city') || {};
		},
		areaObj () {
      return _.get(this.$store.get.state, 'CityList.content.data.area') || {};
		},
		address () {
      let data = '';
      if (this.userInfo.province_name && this.userInfo.city_name && this.userInfo.district_name) {
        data = `${this.userInfo.province_name}${this.userInfo.city_name}${this.userInfo.district_name}`;
      }
      else {
        data = `${_.get(this.provObj, 'region_name') || ''}${_.get(this.cityObj, 'region_name') || ''}${_.get(this.areaObj, 'region_name') || ''}`;
      }
      return data;
		},
		userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    }
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
  },
  methods: {
    /*
     * 取消设置
     */
    cancel () {
      this.visible = false;
		},
		/**
		 * 选择地区
		 */
		select () {
			this.$store.get.dispatch({
        type: 'cityListData',
        isShow: true,
      });
		},
		delSite () {
			this.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '确定是否删除该地址信息？',
        lists : [
          {
            msg: '否',
          },
          {
            msg: '是',
            func () {
            },
            class: 'ok',
          },
        ]
      });
		},
  }
};
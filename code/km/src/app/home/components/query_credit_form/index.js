import './index.scss';

import Header               from '~common/components/header';
import Checkbox             from '~common/components/checkbox';
import Agreement            from './components/agreement';
import Payment              from './components/payment';
import Models               from '~common/models';

export default {
  name: 'auth',
  data () {
    return {
      single                : true,
      isSee                 : false,
      isPayment             : false,
      isShowPrice           : false,
      goodsList             : [],
      goodsId               : '',
      goodsPrice            : '',
      formData              : {
        mobile              : '',
        name                : '',
        id_number           : '',
        email               : '',
      },
      goodsInfo             : {},
    };
  },
  components: {
    'app-header'    : Header,
    Checkbox,
    Agreement,
    Payment,
  },
  computed: {
  },
  mounted () {
    this.list();
  },
  watch: {},
  methods: {

    list () {
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
        Text: '加载中...'
      });
      Models.Goods
      .list({
        params: {
          type: 6
        }
      })
      .then((res) => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
        if (1 === res.code) {
          this.goodsList = res.data;
          if (0 < this.goodsList.length) {
            // this.goodsId = this.goodsList[0].goods_id + '';
            this.goodsPrice = this.goodsList[0].price + '';
          }
        }
        else {
          this.$toast(res.msg);
        }
      })
      .catch(() => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
      });
    },

    selectGoods (item) {
      this.goodsId = item.goods_id + '';
      this.goodsPrice = item.price + '';
      this.isShowPrice = true;
    },

    getMeMoney () {
      if (!this.formData.name) {
        this.$toast('请输入姓名');
        this.$refs.name.focus();
        return;
      }

      if (!this.formData.mobile) {
        this.$toast('请输入手机号');
        this.$refs.mobile.focus();
        return;
      }
      else if (!this.$rules.phone(this.formData.mobile)) {
        this.$toast('请输入正确的手机号');
        this.$refs.mobile.focus();
        return;
      }

      if (!this.formData.id_number) {
        this.$toast('请输入身份证号');
        this.$refs.id_number.focus();
        return;
      }
      else if (!this.$rules.identity(this.formData.id_number)) {
        this.$toast('请输入正确的身份证号');
        this.$refs.id_number.focus();
        return;
      }

      if (!this.formData.email) {
        this.$toast('请输入邮箱');
        this.$refs.email.focus();
        return;
      }
      else if (!this.$rules.email(this.formData.email)) {
        this.$toast('请输入正确的邮箱');
        this.$refs.email.focus();
        return;
      }

      if (!this.goodsId) {
        this.$toast('请选择查询类型');
        return;
      }

      if (!this.single) {
        this.$toast('请认真阅读并同意用户购买协议');
        return;
      }

      // this.$toast('暂无开放，敬请期待');

      this.goodsInfo = {
        goods_id: this.goodsId,
        pay_method: 0,
        name: this.formData.name,
        mobile: this.formData.mobile,
        id_number: this.formData.id_number,
        email: this.formData.email,
      };

      this.isPayment = true;
    },

  }
};
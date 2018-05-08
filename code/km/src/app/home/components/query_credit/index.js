import './index.scss';
import Models     from '~common/models';
import _          from 'lodash';

export default {
  name: 'queryCredit',
  data () {
    return {
      funcList: [
        {
          icon: '01',
          name: '芝麻风险监测',
        },
        {
          icon: '02',
          name: '多平台借贷记录',
        },
        {
          icon: '03',
          name: '号码归属地监测',
        },
        {
          icon: '04',
          name: '不良信息扫描',
        },
        {
          icon: '05',
          name: '多平台黑名单',
        },
        {
          icon: '06',
          name: '客户行为监测',
        },
        {
          icon: '07',
          name: '查询不上央行记录',
        },
        {
          icon: '08',
          name: '检测信息是否被盗用',
        },
        {
          icon: '09',
          name: '提高下卡/款成功率',
        },
      ],
    };
  },
  components: {
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo');
    },
  },
  mounted () {
    this.getForum();
  },
  watch: {},
  methods: {

    linkToRoute (options) {
      // 未完善个人信息
      // if (!this.userInfo.mobile) {
      //   let self = this;
      //   self.$store.get.dispatch({
      //     type  : 'handleChangeDialog',
      //     active: true,
      //     title : '温馨提示',
      //     msg   : '请先完善个人资料',
      //     lists : [
      //       {
      //         msg: '取消',
      //       },
      //       {
      //         msg: '去完善',
      //         class: 'ok',
      //         func () {
      //           self.$router.push({ name: 'user.Profile', query: { dt: self.$route.path } });
      //         }
      //       },
      //     ]
      //   });
      // }
      // else {
      //   this.$router.push(options);
      // }
      this.$router.push(options);
    },

    // 获取版块通知
    async getForum () {
      let res = await Models.Notify.forum('credit');
      if (res.code === 1) {
        this.$store.get.dispatch({
          type: 'setSystemMessage',
          message: res.data
        });
      }
    },

    goBack () {
      this.$router.go(-1);
    },

  }
};

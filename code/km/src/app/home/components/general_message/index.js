import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import Footing    from '~common/components/page_footing';
import Models     from '~common/models';

export default {
  name: 'zx',
  data () {
    return {
      link: '',
    };
  },
  components: {
		'app-header': Header,
		'app-footing': Footing,
  },
  computed: {
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    getUserZx () {
      Models.User
      .zx({
        params: {
          // TODO 这里回调地址需要更换
          succ_url: `${window.location.href}/detail`,
        }
      })
      .then((res) => {
        if (res && 1 === res.code) {
          let data = res.data;
          this.link = data.url;
        }
      });
    },

    // 跳转征信查询
    goToAuth () {
      let self = this;

      this.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '征信报告需经本人授权确认后查询',
        lists : [
          {
            msg: '取消',
          },
          {
            msg: '确认',
            func () {
              self.getUserZx();
              setTimeout(() => {
                if (_.isEmpty(self.link)) {
                  self.$toast('征信授权链接错误');
                  return;
                }
                window.location.href = self.link;
              }, 1000);
            },
            class: 'ok'
          }
        ]
      });
    }
  }
};
import './index.scss';

import Header   from '~common/components/header';
import Models   from '~common/models';

export default {
  name: 'video_key',
  data () {
    return {
      videoKey: []
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.list();
  },
  watch: {
  },
  methods: {

    /*
     * 获取视频激活码
     */
    list () {
      Models.User.videoKey().then(res => {
        if (1 === res.code) {
          this.videoKey = res.data.data;
        }
        else {
          this.$toast(res.msg);
        }
      });
    },

    /*
     * 删除视频激活码
     */
    del (id) {
      let self = this;
      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '确认删除视频激活码？',
        lists : [
          {
            msg: '关闭',
          },
          {
            msg: '删除',
            class: 'ok',
            func () {
              Models.User
              .videoDel({
                id: id,
              })
              .then((res) => {
                self.$toast(res.msg);
                if (1 === res.code) {
                  self.list();
                }
              });
            }
          }
        ]
      });
    },

  },
};
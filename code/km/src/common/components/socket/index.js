import './index.scss';

import _              from 'lodash';
import Models         from '~common/models';

export default {
  name: 'websocket',
  data () {
    return {
      /*
       * 发送消息 - 对应键值
       * @param  message 消息
       * @param  message_team 团队消息
       * @param  message_system 系统消息
       * @param  message_friend 好友消息
       * @param  message_commission 佣金消息
       * @param  user 用户中心
       * @param  user_account 用户帐户
       * @param  user_account_integral 用户积分
       * @param  user_account_balance 用户余额
       * @param  user_team 用户团队
       */
      ws: '',
      msg: '',
      appMsgPush: 0,
    };
  },
  mounted () {
  },
  computed: {
    isSuccess () {
      return _.get(this.$store.get.state, 'Message.content.isSuccess');
    },
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo');
    },
  },
  watch: {
    userInfo (value) {
      if ('home.Home' === this.$route.name) {
        this.handleGetNotice(value.app_msg_push);
      }
    }
  },
  components: {
  },
  beforeDestroy () {
    // this.onClose();
  },
  methods: {

    /*
     * 连接socket服务器
     */
    connect () {
      // 当socket连接打开时
      this.ws = new WebSocket('wss://api.kamengjinfu.com/wsszmq/', 'wamp');

      this.ws.onopen = () => this.onopen();

      // 当有消息时根据消息类型显示不同信息
      this.ws.onmessage = (e) => this.onmessage(e);

      // 连接关闭，重连
      // this.ws.onclose = () => this.connect();

      // 出现错误，重连
      // this.ws.onerror = () => this.connect();
    },

    /*
     * 打开时登录用户
     */
    onopen () {
      let id = this.userInfo.id ? `tips-${this.userInfo.id}` : `tips-${this.$user.get().id}`;
      let msg = JSON.stringify([5, id]);
      this.ws.send(msg);

      /*this.$store.get.dispatch({
        type  : 'message',
        isSuccess: true,
      });*/
    },

    /*
     * 服务端发来消息时
     */
    onmessage (e) {
      let self = this;
      let data = JSON.parse(e.data);
      this.msg = 0 !== data[0] * 1 ? data[2] : '';
      this.$store.get.dispatch({
        type  : 'message',
        msg: self.msg,
      });
    },

    // 添加图片
    addImg (isrc) {
      let self = this;
      let Img = new Image();
      Img.style.display = 'none';
      Img.src = isrc;
      Img.onload = function () {
        self.$refs.audio.play();
        document.body.appendChild(Img);
      };
    },

    // 播放语音
    playAudio (key, msg) {
      let flag;
      if (msg > 0) {
        if (key === 'noticecard' || key === 'noticelender') {
          this.onsend(key);
        }

        flag = new Promise((resolve) => {
          this.$refs[key].play();
          this.$refs[key].onended = () => {
            setTimeout(() => {
              resolve();
            }, 1000);
          };
        });
      }
      else {
        flag = Promise.resolve();
      }
      return flag;
    },

    handleGetNotice (appMsgPush) {
      let uid = this.userInfo.id ? this.userInfo.id : this.$user.get().id;

      Models.Public.getMsg({
        params: {
          user_id: uid,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;

          if (1 === appMsgPush) {
            this.playAudio('message_commission', data.message_commission).then(() => {
              this.playAudio('user_team', data.user_team).then(() => {
                this.playAudio('noticecard', data.noticecard).then(() => {
                  this.playAudio('noticelender', data.noticelender).then(() => {
                    this.playAudio('user_yixiang', data.user_yixiang);
                  });
                });
              });
            });
          }

          // if (0 < data.message_commission && 1 === appMsgPush) {
          //   this.addImg('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJgAAACYCAIAAACXoLd2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWFJREFUeNrs3bEKgkAAgGFNhVJCAt//CeVCwhYNa2jQVrNUvn+7xcP79HA5jEMIkbbfwRKAFEiBFEiQAimQAglSIAVSIAUSpEAKpECCFEiBFEiQAimQAimQIAVSIAUSpEAKpECCFEiB1JdLd3lXt6YZD/OiSNIU5Pbqu248HIbB1iqQAimQIAVSIAVSIEEKpEAKJEiBFEiBBCmQAimQAglSIAVSIEEKpEAKpKK/H6t79P0Pzry9Zllk7bIM5Lt7236cZVxoliUue6kqW6tACiRIrb04hLC/u7rW9Xh4LstVfWF6IwUSpEAKpECCFEiBFEiBBCmQAimQIAVSIAUSpEAKpEAKJEiBFEiBBCmQAqlZ7fNn2ac8nzytSQJykx2nkLZWgRRIgQQpkAIpkAIJUiAFUiBBCqRACiRISwBSIAVSIEEKpEAKJEiBFEiBFEiQAimQAglSIAVSIEEKpFbQU4ABAAjYJN+GLf/VAAAAAElFTkSuQmCC');
          // }

          this.$store.get.dispatch({
            type: 'message',
            msg: data,
          });

        }
      });
    },

    /*
     * 发送消息 - 对应键值
     */
    onsend (key) {
      let self = this;
      Models.Public.updateTips({
        user_id: self.userInfo.id ? self.userInfo.id : self.$user.get().id,
        key: key,
      });
    },

    // 关闭
    onClose () {
      this.ws.close();
    }

  }
};

import './index.scss';

import WebIM          from '~common/plugs/webim.config';
import 'script-loader!easemob-websdk/dist/strophe-1.2.8.min';
import 'easemob-websdk';
import _              from 'lodash';
import Header         from '~common/components/header';
import Zoom           from '~common/components/zoom';
import Models         from '~common/models';
import LocalStorage   from '~common/services/localStorage.cookie';



export default {
  name: 'chat',
  data () {
    return {
      rows: 1,
      textarea: '',
      height: 0,
      toolSta: false,
      addSta: false,
      emojiSta: false,
      keyevt: '',

      lastInput: '',

      emojiObj: {
        '[):]' : '/assets/emoji/1.png',
        '[:-o]': '/assets/emoji/2.png',
        '[:@]' : '/assets/emoji/3.png',
        '[:(]' : '/assets/emoji/4.png',
        '[(a)]': '/assets/emoji/5.png',

        '[+o(]': '/assets/emoji/6.png',
        '[*-)]': '/assets/emoji/7.png',
        '[:D]' : '/assets/emoji/8.png',
        '[:p]' : '/assets/emoji/9.png',
        '[:s]' : '/assets/emoji/10.png',

        '[:\'(]': '/assets/emoji/11.png',
        '[8o|]': '/assets/emoji/12.png',
        '[<o)]': '/assets/emoji/13.png',
        '[:-#]': '/assets/emoji/14.png',
        '[;)]' : '/assets/emoji/15.png',

        '[(H)]': '/assets/emoji/16.png',
        '[:$]' : '/assets/emoji/17.png',
        '[:|]' : '/assets/emoji/18.png',
        '[8-|]': '/assets/emoji/19.png',
        '[|-)]': '/assets/emoji/20.png',

        '[:-*]': '/assets/emoji/21.png',
        '[(|)]': '/assets/emoji/22.png',
        '[(*)]': '/assets/emoji/23.png',
        '[({)]': '/assets/emoji/24.png',
        '[(F)]': '/assets/emoji/25.png',

        '[^o)]': '/assets/emoji/26.png',
        '[(u)]': '/assets/emoji/27.png',
        '[(#)]': '/assets/emoji/28.png',
        '[(})]': '/assets/emoji/29.png',
        '[(W)]': '/assets/emoji/30.png',

        '[8-)]': '/assets/emoji/31.png',
        '[(S)]': '/assets/emoji/32.png',
        '[(R)]': '/assets/emoji/33.png',
        '[(k)]': '/assets/emoji/34.png',
        '[(D)]': '/assets/emoji/35.png',
      },

      formData: [],
      formTemp: {
        friend: {},
      },
      conn    : null,
      checkLogin: false,
      isZoom  : false,
      zoomImage: '',
      options: {},
      params: 0,

      scrollHeight: 0,
      lastHeight  : 0,
      reSize      : false,
    };
  },
  components: {
    'app-header': Header,
    Zoom,
  },
  computed: {
    userInfo () {
      return this.$user.get() || _.get(this.$store.get.state, 'App.userInfo') || {};
    },
    connData () {
      return _.get(this.$store.get.state, 'App.histData.WebIM') || {};
    },
  },
  created () {
    this.getfriendInfo();
    this.handleBusiness();
  },
  mounted () {
    let self = this;

    self.$refs.textarea.blur(() => {
      window.scrollTop(0);
    });

    window.document.onkeydown = (evt) => {
      self.keyevt = evt ? evt : window.event;

      if (13 === self.keyevt.keyCode * 1) {
        self.sendMsgInfo();
      }
    };


    self.$nextTick(() => {
      // 判断聊天缓存是否足够
      self.handleCleanChat();
      if (!_.isEmpty(self.userInfo)) {
        setTimeout(() => {
          self.getChatListData();
          self.handleonReadMessage();
        }, 800);
      }
    });

  },
  updated () {
    if (0 >= this.lastHeight * 1) {
      this.scrollHeight = document.body.offsetHeight;
      this.lastHeight   = document.body.offsetHeight;
    }
  },
  beforeRouteLeave (to, from, next) {
    if (!_.isEmpty(this.conn)) {
      this.conn.close();
    }
    next();
  },
  watch: {
    textarea (val, old) {
      if (!_.isEmpty(val) && val !== old && 13 !== this.keyevt.keyCode * 1) {
        this.lastInput = val.replace(old, '');
        if (_.isEmpty(val)) {
          this.rows = 1;
          return;
        }
        this.height   = 0 >= this.height ? this.$refs.textarea.scrollHeight : this.height;
        let data      = Math.floor(this.$refs.textarea.scrollHeight / this.height);
        this.rows     = 4 <= data ? 4 : data;
      }
    },

    // 先判断有没有在我们的网站登录
     // && 'chat.Home' === self.$route.name
    userInfo (value) {
      let self = this;
      if (!_.isEmpty(value)) {
        setTimeout(() => {
          self.getChatListData();
          self.handleonReadMessage();
        }, 800);
      }
    },
  },
  filters: {
  },
  methods: {

    // 监听页面大小改变
    handleResize () {
      let self = this;

      if (_.isEmpty(self.conn) || false === self.checkLogin) {
        self.handleConn();
        self.$store.get.dispatch({
          type  : 'handleChangeDialog',
          active: true,
          title : '温馨提示',
          msg   : '登录聊天系统失败',
          lists : [
            {
              msg: '取消',
              func () {
                self.handleConn();
              }
            },
            {
              msg: '重试',
              class: 'ok',
              func () {
                window.location.reload();
              }
            },
          ]
        });
        return;
      }

      self.toolSta  = false;
      self.emojiSta = false;
      self.addSta   = false;
      self.reSize   = true;
    },


    // 商务客服
    handleBusiness () {
      this.params = this.$route.params;
    },

    // 创建环信连接
    handleConn () {
      if (_.isEmpty(_.get(this.formTemp, 'friend.im_id'))) {
        this.$toast('该用户不存在');
        return;
      }

      /* eslint-disable */
      // if (_.isEmpty(this.conn)) {
        this.conn = new WebIM.connection({
          isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
          https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
          url: WebIM.config.xmppURL,
          heartBeatWait: WebIM.config.heartBeatWait,
          autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
          autoReconnectInterval: WebIM.config.autoReconnectInterval,
          apiUrl: WebIM.config.apiURL,
          isAutoLogin: true
        });

        this.handleWebLogin();
      // }
      /* eslint-enable */
    },

    // 环信用户登录
    handleWebLogin () {
      this.options = {
        apiUrl: WebIM.config.apiURL,
        appKey: WebIM.config.appkey,
        user: this.userInfo.im_id,
        pwd: this.userInfo.im_pwd,
      };

      this.conn.open(this.options);

      this.handleConnListen();
    },

    // 监听环信连接回调
    handleConnListen () {
      let self = this;
      self.conn.listen({

        // 连接环信成功
        onOpened (message) {
          if (!_.isEmpty(message.accessToken)) {
            self.checkLogin = true;
          }
        },

        // 收到文本消息
        onTextMessage (message) {
          self.handleReadMessage(message);

          message.mid   = message.id;
          message.msg   = message.data;
          message.act   = 1;
          message.type  = 0;
          message.isRead  = true;
          message.time    = parseInt(new Date().getTime() / 1000);

          self.saveChatData(message);
        },

        // 收到图片消息
        onPictureMessage (message) {
          self.handleReadMessage(message);

          message.mid     = message.id;
          message.msg     = message.url;
          message.act     = 1;
          message.type    = 1;
          message.isRead  = true;
          message.time    = parseInt(new Date().getTime() / 1000);

          self.saveChatData(message);
        },

        //收到消息已读回执
        onReadMessage (message) {
          if (!_.isEmpty(message)) {
            self.handleonReadMessage(message.mid);
          }
        },
      });
    },

    // 处理已读消息
    handleReadMessage (message) {
      if (!_.isEmpty(message) && _.isObject(message) && 'chat.Home' === this.$route.name) {
        let id  = this.conn.getUniqueId();
        /* eslint-disable */
        let msg = new WebIM.message('read', id);
        /* eslint-enable */
        msg.set({
          id: message.id,
          to: message.from
        });
        this.conn.send(msg.body);
        this.scrollerUpdate();
      }

    },

    // 已读回调处理
    handleonReadMessage (message = '') {
      let self = this;
      let data = _.filter(self.formData.data, { mid: message });

      let locatData = LocalStorage.get('chatDataList');
      let uData = _.filter(locatData.data, { id: self.userInfo.id });

      if (!_.isEmpty(data)) {
        data[0].isRead = true;

        if (!_.isEmpty(uData)) {
          _.each(uData[0].data, (item) => {
            if (self.formData.uid === item.uid) {
              item.data = self.formData.data;
            }
          });

          LocalStorage.set('chatDataList', locatData.data);
          self.getChatListData();
        }
      }
      else if ('chat.Home' === self.$route.name) {
        self.$nextTick(() => {
          setTimeout(() => {
            if (!_.isEmpty(uData)) {
              let fData = _.filter(uData[0].data, { uid: _.get(self.$route, 'params.id') * 1 });

              if (!_.isEmpty(fData)) {

                _.each(fData[0].data, (item) => {
                  if (false === item.isRead) {
                    item.isRead = true;

                    let localMessageNum = LocalStorage.get('MessageNum');
                    let data = _.get(this.$store.get.state, 'Message.content.msg') || { message: 0 };

                    if (!_.isEmpty(localMessageNum) && 0 < localMessageNum.data) {
                      LocalStorage.set('MessageNum', localMessageNum.data - 1);

                      if (0 < data.message * 1) {
                        data.message -= 1;
                        self.$store.get.dispatch({
                          type: 'message',
                          msg: data,
                        });
                      }
                    }

                    self.handleReadMessage(item);
                  }
                });

                LocalStorage.set('chatDataList', locatData.data);
              }

            }
          }, 1000);
        });
      }

    },


    // 过滤消息里面的Emojis
    handleChatData (data) {

      if (1 === data.type) {
        data = '<img src=' + data.msg + ' class=pic>';
        return data;
      }

      let pattern = new RegExp('\\[(.| )+?\\]', 'igm');
      let reg = data.msg.match(pattern);
      if (!_.isEmpty(reg)) {
        let newData = data.msg;
        _.each(reg, (el) => {
          let str = '<img src=' + this.emojiObj[el] + ' class=emojis>';
          newData = newData.replace(el, str);
        });
        return newData;
      }
      return data.msg;
    },

    // 图片放大
    handleEnlarge (event) {
      if (true === this.isZoom) {
        this.isZoom = false;
      }
      if ('IMG' === event.target.nodeName) {
        let image = event.target.src;
        if (!_.isEmpty(image)) {
          this.zoomImage = image;
          this.isZoom = true;
        }
      }
    },

    // 关闭图片放大回调
    handleInput (data) {
      this.isZoom = data;
    },

    // 清除聊天记录缓存
    async handleCleanChat () {
      let data = LocalStorage.get('chatDataList');
      if (!_.isEmpty(data.data)) {
        let size = JSON.stringify(data.data).length;

        // 5M 5000000
        if (5000000 <= size * 1) {
          this.$store.get.dispatch({
            type  : 'handleChangeDialog',
            active: true,
            title : '温馨提示',
            msg   : '聊天记录缓存不足，请先清除',
            lists : [
              {
                msg: '关闭'
              },
              {
                msg: '清除缓存',
                class: 'ok',
                func () {
                  LocalStorage.remove('chatDataList');
                }
              },
            ]
          });
          return false;
        }
      }

      return true;
    },

    // 获取聊天记录信息
    getChatListData () {
      let self = this;
      let data = LocalStorage.get('chatDataList');

      if (!_.isEmpty(data.data)) {
        let uData = _.filter(data.data, { id: self.userInfo.id });

        if (!_.isEmpty(uData)) {
          let list = _.filter(uData[0].data, { uid: _.get(self.$route, 'params.id') * 1 });

          if (!_.isEmpty(list)) {
            self.formData = list[0];

            self.$nextTick(() => {
              setTimeout(() => {
                self.scrollerUpdate();
              }, 500);
            });
          }
        }

      }

    },

    // 自动回复用户信息，每天一次
    handleDelayMsgData () {
      if (6108 === this.params.id * 1 || 101 === this.params.id * 1 || 472 === this.params.id * 1) {
        let delayMsgData = LocalStorage.get('delayMsgData');

        // 当天有效
        let cTime = new Date().getDate();
        let dtime  = _.get(delayMsgData, 'expired') ? new Date(_.get(delayMsgData, 'expired') * 1000).getDate() : '';

        if (_.isEmpty(dtime + '') || cTime > dtime) {
          LocalStorage.remove('delayMsgData');
        }

        if (_.isEmpty(delayMsgData)) {
          delayMsgData.data = {
            uid: this.userInfo.id,
            kf: []
          };
        }

        if (this.userInfo.id !== delayMsgData.data.uid) {
          delayMsgData.data = {
            uid: this.userInfo.id,
            kf: []
          };
        }

        // 如果和该客服聊天记录为空，新增
        if (-1 === delayMsgData.data.kf.indexOf(this.$route.query.id)) {

          this.saveChatData({
            mid: '0',
            msg: '目前人工客服忙，请耐心等待...',
            act: 1,
            type: 0,
            isRead: true,
            time: parseInt(new Date().getTime() / 1000),
          });


          delayMsgData.data.kf.push(this.$route.query.id);
          LocalStorage.set('delayMsgData', delayMsgData.data, 60 * 60 * 24 * 1);
        }
      }
    },


    // 更新scroller高度
    scrollerUpdate () {
      let self = this;
      self.$nextTick(() => {
        let myscroller = self.$refs.myscroller;
        if (myscroller) {
          myscroller.$el.querySelector('._v-content').style.paddingBottom = document.querySelector('.input-foot').clientHeight + 10 + 'px';
          let dom = document.querySelector('ul.list');

          setTimeout(() => {
            if (0 < dom.children.length) {
              dom = dom.children[dom.children.length - 1];
              myscroller.scrollTo(0, dom.offsetTop, true);
            }
          }, 50);
        }
      });
    },

    // 发送文本消息
    sendMsgInfo () {
      let self = this;
      if (_.isEmpty(self.conn) || false === self.checkLogin) {
        self.$toast('登录聊天系统失败，请刷新页面', { duration: 5000 });
        return;
      }

      if (self.userInfo.id * 1 === _.get(self.formTemp, 'friend.user_id')) {
        self.$toast('不能与自己聊天');
        return;
      }

      if (!_.isEmpty(self.textarea) ) {
        let id = self.conn.getUniqueId();
        /* eslint-disable */
        let msg = new WebIM.message('txt', id);
        /* eslint-enable */
        msg.set({
          msg: self.textarea,
          to: _.get(self.formTemp, 'friend.im_id'),
          roomType: false,
          success: function (id, serverMsgId) {
            self.saveChatData({
              mid   : serverMsgId,
              msg   : self.textarea,
              to    : _.get(self.formTemp, 'friend.im_id'),
              act   : 0,
              type  : 0,
              isRead: false,
              time  : parseInt(new Date().getTime() / 1000)
            });

            self.handleDelayMsgData();
            self.textarea = '';
          },
          fail: () => {
            self.$toast('消息发送超时，请重试');
          }
        });
        msg.body.chatType = 'singleChat';
        self.conn.send(msg.body);
        // self.$refs.textarea.focus();
      }
    },

    // 发送图片消息
    sendImagesInfo (e) {
      let self = this;

      if (_.isEmpty(self.conn) || false === self.checkLogin) {
        self.$toast('登录聊天系统失败，请刷新页面', { duration: 5000 });
        return;
      }

      if (self.userInfo.id * 1 === _.get(self.formTemp, 'friend.user_id')) {
        self.$toast('不能与自己聊天');
        return;
      }

      let file = e.target.files[0];
      if (!_.isEmpty(file.name)) {
        let type   = _.get(file, 'type');

        if (!_.includes(type, 'image')) {
          this.$toast('Please select an image file');
          return;
        }

        let image     = new Image();
        let canvas    = document.createElement('canvas');
        let ctx       = canvas.getContext('2d');
        let data      = '';
        let msgImg    = '';

        const reader  = new FileReader();

        // 加载图片
        reader.onloadstart = () => {
          self.$store.get.dispatch({
            type: 'Loading',
            Text: '图片加载中...',
            isShow: true
          });
        };

        reader.readAsDataURL(file);

        reader.onload = (event) => {
          image.src = event.target.result;
          self.$store.get.dispatch({
            type: 'Loading',
            isShow: false
          });
        };

        image.onload = () => {
          let w = image.naturalWidth,
              h = image.naturalHeight;
              canvas.width = w;
              canvas.height = h;
              ctx.drawImage(image, 0, 0, w, h, 0, 0, w, h);

          data = canvas.toDataURL(type, 0.5);
          let blob = self.dataURLtoBlob(data);

          if (_.isObject(blob)) {
            let id  = self.conn.getUniqueId();
            /* eslint-disable */
            let msg = new WebIM.message('img', id);
            /* eslint-enable */

            msg.set({
              apiUrl: WebIM.config.apiURL,
              file: { data: blob, url: file.name },
              to: _.get(self.formTemp, 'friend.im_id'),
              roomType: false,
              chatType: 'singleChat',
              onFileUploadError: (error) => {
                self.$toast(error);
              },
              onFileUploadComplete: (data) => {
                msgImg = data.uri + '/' + data.entities[0].uuid;
              },
              success: function (id, serverMsgId) {
                if (serverMsgId) {
                  self.saveChatData({
                    mid   : serverMsgId,
                    msg   : msgImg,
                    to    : _.get(self.formTemp, 'friend.im_id'),
                    act   : 0,
                    type  : 1,
                    isRead: false,
                    time  : parseInt(new Date().getTime() / 1000)
                  });

                  self.handleDelayMsgData();
                }
              }
            });

            self.$refs.file.value = '';
            self.conn.send(msg.body);

          }
        };
      }



      self.toolSta = false;
      // self.$refs.textarea.focus();
    },

    // 保存聊天信息到Local
    saveChatData (data) {

      // 判断聊天缓存是否足够
      this.handleCleanChat()
      .then((res) => {
        if (true === res) {
          let chatLocalData = LocalStorage.get('chatDataList') || {};
          let chatList = {};

          let userId    =  _.get(this.formTemp, 'friend.user_id');
          let userName  = _.get(this.formTemp, 'friend.user_nickname');
          let avatar    = _.get(this.formTemp, 'friend.avatar');
          let time      = parseInt(new Date().getTime() / 1000);

          /**
            * 如果缓存里面没有数据
            */
          if (_.isEmpty(_.get(chatLocalData, 'data'))) {

            chatList = {
              id: this.userInfo.id,
              data: [
                {
                  uid     : userId,
                  to      : data.to,
                  username: userName,
                  avatar  : avatar,
                  time    : time,
                  data  : [data]
                }
              ]
            };

            LocalStorage.set('chatDataList', [chatList]);
          }
          else {
            /**
              * 判断该用户是否在聊天缓存中存在
              * 存在追加，否则新增
              */
            let uData = _.filter(chatLocalData.data, { id: this.userInfo.id });

            if (!_.isEmpty(uData)) {
              let user  = _.filter(uData[0].data, { uid: userId });

              // 好友记录不为空
              if (!_.isEmpty(user)) {
                user[0].data.push(data);

                // 追加
                LocalStorage.set('chatDataList', chatLocalData.data);
              }
              else {
                chatList = {
                  uid     : userId,
                  to      : data.to,
                  username: userName,
                  avatar  : avatar,
                  time    : time,
                  data  : [data]
                };

                uData[0].data.push(chatList);

                // 新增
                LocalStorage.set('chatDataList', chatLocalData.data);
              }
            }
            else {
              chatList = {
                id: this.userInfo.id,
                data: [
                  {
                    uid     : userId,
                    to      : data.to,
                    username: userName,
                    avatar  : avatar,
                    time    : time,
                    data  : [data]
                  }
                ]
              };

              chatLocalData.data.push(chatList);
              LocalStorage.set('chatDataList', chatLocalData.data);
            }

          }




          this.getChatListData();
        }
      });

    },

    // 触发Emoji图标
    handleIconEmojiClick () {
      this.emojiSta = !this.emojiSta;

      if (true === this.addSta) {
        this.addSta = false;
        return;
      }
      this.toolSta  = !this.toolSta;
    },

    // 触发其他文件图标
    handleIconAddClick () {
      this.addSta   = !this.addSta;

      if (true === this.emojiSta) {
        this.emojiSta = false;
        return;
      }
      this.toolSta  = !this.toolSta;
    },

    // 选中Emoji图标
    handleEmojiSelect (item, index) {
      this.textarea += index;
    },

    // 获取好友信息
    getfriendInfo () {
      Models.Friend
      .info({
        params: {
          user_id: _.get(this.$route, 'params.id'),
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          this.formTemp.friend = _.assign({}, this.formTemp.friend, data);
          this.handleConn();
        }
      });
    },

    // 图片数据转Blob
    dataURLtoBlob (dataurl) {
      let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n --) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type: mime});
    },

    // 返回按钮回调
    handleOther () {
      this.$router.push({
        name: 'message.Info'
      });
    },
  }
};
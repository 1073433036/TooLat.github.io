
//组件props属性：title(协议标题)、protocolContent(协议内容)、isOpenProtocol(是否打开协议窗口)、isHtml(是否是html文件)
//父组件必要监听事件：v-on:callProtocolEvent="isOpenProtocol = false"
//父组件监听是否接受协议事件：v-on:isAcceptEvent="isAccept = true" 只有勾选‘接受’才触发事件


import './index.scss';


export default {
  name: 'Protocol',
  data () {
    return {
      isAccept: false,
    };
  },
  props: {
    isOpenProtocol: {
      type: Boolean,
      default: false
    },
    isHtml: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    protocolContent: {
      type: String
    },
  },
  components: {
  },
  computed: {
    hasTitle () {
      if (this.title) {
        return true;
      }
      return false;
    }
  },
  mounted () {

  },
  watch: {},
  methods: {
    closeProtocol () {
      this.$emit('callProtocolEvent');
      this.$emit('isAcceptEvent');
    }
  }
};
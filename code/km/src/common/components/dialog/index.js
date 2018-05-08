import './index.scss';

import _ from 'lodash';

export default {
  name: 'app-dialog',
  data () {
    return {};
  },
  mounted () {
  },
  computed: {
    CustomClass () {
      return this.$store.get.state.Dialog.customClass;
    },
    Active () {
      return this.$store.get.state.Dialog.active && 0 < this.$store.get.state.Dialog.lists.length;
    },
    Title () {
      return this.$store.get.state.Dialog.title || '温馨提示';
    },
    Msg () {
      return this.$store.get.state.Dialog.msg || '';
    },
    InfoHtml () {
      return this.$store.get.state.Dialog.html || '';
    },
    IsAlign () {
      return this.$store.get.state.Dialog.align || '';
    },
    listsData () {
      return this.$store.get.state.Dialog.lists;
    },
    width () {
      return this.$store.get.state.Dialog.width;
    },
  },
  components: {
  },
  methods: {

    handleDialog (item) {
      return item.func ? _.extend(item.func(), this.handleDialogClose()) : this.handleDialogClose();
    },

    // 关闭Dialog弹窗
    handleDialogClose () {
      this.$store.get.dispatch('resetDialog');
    },

    // 关闭Dialog弹窗
    showRegion () {
      this.$store.get.dispatch('resetDialog');
    },

  }
};
import './index.scss';

export default {
  name: 'NotifyPopup',
  props: {
    isNotice: {
      type: Boolean,
      default: false
    },
    content: {
      type: Array,
      default: []
    },
    noticeTime: {
      type: Number,
      default: Date.now()
    }
  },
  data () {
    return {
    };
  },
  components: {
  },
  computed: {
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    handleNoticeClose () {
      this.$emit('toggleNotify');
    }
  },
};

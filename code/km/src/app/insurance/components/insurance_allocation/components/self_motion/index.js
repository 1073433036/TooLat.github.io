import './index.scss';

export default {
  name: 'General',
  data () {
    return {
    };
  },
  mounted () {

  },
  computed: {

  },
  components: {

  },
  methods: {
		handleInsureClick (event) {
      this.$emit('insureClickEvent', event.target);
    },
    handleInsureNumClick (event, typeValue) {
      this.$emit('insureNumClickEvent', {
        elem: event.target,
        typeValue: typeValue
      });
    }
  }
};
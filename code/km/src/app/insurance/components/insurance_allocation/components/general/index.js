import './index.scss';

import Popup1        from '../popup1';

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
		Popup1,
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
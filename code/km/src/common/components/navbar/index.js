import './index.scss';

import FastClick        from 'fastclick';

export default {
  name: 'navbar',
  data () {
    return {
      lineStyle: {
        spanline: false
      },
      componentName: ''
    };
  },
  props: {
    navList: {
      type: Array
    }
  },
  mounted () {
    FastClick.attach(document.body);
  },
  computed: {

  },
  components: {

  },
  methods: {
    handleClick (event, index) {
      let items = [...document.querySelectorAll('.itemTx')];
      items.forEach((item) => {
        item.setAttribute('class', 'itemTx');
      });
      event.currentTarget.querySelector('em').setAttribute('class', 'itemTx litext');
      this.$emit('changeComponent', index);
    }
  }
};
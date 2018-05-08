import './index.scss';

import Echarts from 'echarts';

export default {
  name: 'calculateLoan',
  data () {
    return {
      loanAmount: '140',
      interest: '166154',
      payAmount: '205.6',
      monthPay: '8551'
    };
  },
  components: {

  },
  computed: {

  },
  mounted () {
    let echartData = [{
      value: 2154,
      // name:'1'
    },
    {
      value: 3854,
      // name:'2',
    }
    ];
    let myChart = Echarts.init(this.$refs.echartDom);
    myChart.setOption({
      title: {
        text: '平均月供',
        left: 'center',
        top: '40%',
      },
      legend: {
        // selectedMode:false,
        formatter: '$62551',
        data: [echartData[0].name],
        // data: ['高等教育学'],
        // itemGap: 50,
        left: 'center',
        top: '55%',
        icon: 'none',
        align:'center',
      },
      series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            color: ['#ffa40c', '#01b3f0'],
            labelLine: {
                normal: {
                    show: false
                }
            },
            // label: {
            //   normal: {
            //     show: true,
            //     position: 'center',
            //     color: '#ffa40c',
            //   }
            // },
            data:echartData
        }
    ]
    });
    this.$refs.echartDom.style.backgroundColor = '#fff';
  },
  watch: {
  },
  methods: {
    goTaxfOrTaxgPage (event, value) {
      document.querySelector('.gone-btn').classList.remove('active-btn');
      document.querySelector('.forward-btn').classList.remove('active-btn');
      event.target.classList.add('active-btn');
      if ( 'taxgone' === value ) {
        this.isTaxgPage = true;
      }
      else if ( 'taxforward' === value ) {
        this.isTaxgPage = false;
      }
    },
  }
};
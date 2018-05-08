import './index.scss';
import Header           from '~common/components/header';
import Models           from '~common/models';

export default {
  name: 'CarBreakCheck',
  data () {
    return {
      loading: false,
      year: '',
      month: '',
      date: '',
      appointment: '',
      day:'',
      aday:'',
      cTime:''
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {

  },
  mounted () {
    this.annualDay();
  },
  watch: {
  },
  methods: {
    //获取剩余天数
    async annualDay () {
      let res = await Models.CarVio.annualDay({
        params: {
          car_id: this.$route.query.id
        }
      });
      if (res.code === 1) {
        /* eslint-disable */
        this.day = res.data.day;
        setTimeout(() => {
          this.aday = res.data.day;
        }, 500);
        // 剩余时间
        let remainData = this.day;
        let one = document.getElementsByClassName('circle')[0];
        let two = document.getElementsByClassName('progress')[0];
        for(let i=45;i<=135;i++){
            let progress = document.createElement('div');
            progress.className = 'progress';
            progress.style['transform'] = 'rotate('+i+'deg)';
            one.appendChild(progress);
        }
        let resDeg = Math.ceil((remainData/730)*270+135);
        for(let j=135;j<=405;j++){
            let green = document.createElement('div');
            green.className = 'progress2'
            green.style['transform'] = 'rotate('+j+'deg)';
            one.appendChild(green);
        }
        let minus = 270 - resDeg;
        let curDeg = 405;

        if(remainData >= 0){
            let timer = setInterval(function(){
                if(curDeg>=resDeg){
                    one.removeChild(one.lastChild);
                    curDeg--;
                   
                }else{
                    clearInterval(timer);
                }
            },10)
        }
        // 预约时间
        let today = new Date();
        let current = today.getDate();
        today.setDate(current + this.day);
        this.year = today.getFullYear();
        this.month = today.getMonth()+1;
        this.date = today.getDate();
      }else{
        this.$toast('您还没有完善年检日期');
      }
    },
    /* eslint-enable */
    handleCheck () {
      this.$toast('敬请期待');
    }
  },
};



import './index.scss';

import _                  from 'lodash';
import BombBox            from '~common/components/bomb_box';
import Dates              from '~common/components/dates';
import SetTime            from '~common/components/set_time';
import LocalStorage       from '~common/services/localStorage.cookie';
// import Models             from '~common/models';

export default {
  name: 'edit',
  props: {
    value: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      visible        : false,
      isShow         : false,
      bombShow       : false,
      setTimeShow    : false,
      formIndex      : '',
      formData       : {
        version      : '',
        operator     : '',
        network      : '',
        systemTime   : '',
        electricity  : '',
        location     : '',
        lockScreen   : '',
        clock        : '',
        bluetooth    : '',
        flow         : '',
        charge       : '',
        footer       : '',

        bank         : '',
        phone        : '',
        cardName     : '',
        quota        : '',
        code         : '',
        serialNumber : '',
        fontSize     : '',

        isShow1      : '',
        isShowTime1  : '',
        date1        : '',
        time1        : '',
        content1     : '',
        codeWarn1    : '',

        isShow2      : '',
        isShowTime2  : '',
        date2        : '',
        time2        : '',
        content2     : '',
        codeWarn2    : '',

        isShow3      : '',
        isShowTime3  : '',
        date3        : '',
        time3        : '',
        content3     : '',
        codeWarn3    : '',

        isShow4      : '',
        isShowTime4  : '',
        date4        : '',
        time4        : '',
        content4     : '',
        codeWarn4    : '',
      },
      formTemp       : {
        version      : [
          {
            name     : '苹果IOS',
            value    : 1,
          },
          {
            name     : '安卓Android1',
            value    : 2,
          },
          {
            name     : '安卓Android2',
            value    : 3,
          },
        ],
        operator     : [
          {
            name     : '移动',
            value    : 1,
          },
          {
            name     : '联通',
            value    : 2,
          },
          {
            name     : '电信',
            value    : 3,
          }
        ],
        operator2    : [
          {
            name     : '移动',
            value    : 1,
          },
          {
            name     : '联通',
            value    : 2,
          },
          {
            name     : '电信',
            value    : 3,
          }
        ],
        bank         : [
          {
            name     : '交通',
            value    : 95559,
          },
          {
            name     : '平安',
            value    : 95511,
          },
          {
            name     : '兴业',
            value    : 95561,
          },
          {
            name     : '民生',
            value    : 106902895568,
          },
          {
            name     : '浦发',
            value    : 95528,
          },
          {
            name     : '光大',
            value    : 95595,
          },
          /*{
            name     : '工商',
            value    : 95588,
          },
          {
            name     : '华夏',
            value    : 95577,
          },*/
          {
            name     : '中信',
            value    : 106980095558,
          },
          {
            name     : '宜人贷',
            value    : 106915958800,
          },
        ],
        fontSize     : [
          {
            name     : '标准',
            value    : 1,
          },
          {
            name     : '中号',
            value    : 2,
          },
          {
            name     : '大号',
            value    : 3,
          },
          {
            name     : '超大',
            value    : 4,
          },
        ],
        cardName     : [
          {
            name     : '交通银行标准信用金卡',
            value    : 1,
          },
          {
            name     : '交通银行标准信用卡',
            value    : 2,
          },
          {
            name     : '交通银行沃尔玛金卡',
            value    : 3,
          },
          {
            name     : '交通银行Y-POWER黑卡',
            value    : 4,
          },
          {
            name     : '交通银行苏宁电器卡普卡',
            value    : 5,
          },
          {
            name     : '交通银行东方航空卡金卡',
            value    : 6,
          },
          {
            name     : '交通银行国航凤凰知音信用卡普卡',
            value    : 7,
          },
          {
            name     : '光大小黄鸭酷黑主题信用卡',
            value    : 8,
          },
          {
            name     : '光大淘票票酷黑联名卡',
            value    : 9,
          },
          {
            name     : '光大“福”IC信用卡',
            value    : 10,
          },
          {
            name     : '光大银联龙腾联名IC白金信用卡',
            value    : 11,
          },
          {
            name     : '光大阳光白金卡',
            value    : 12,
          },
          {
            name     : '光大阳光信用卡银联金卡',
            value    : 13,
          },
          {
            name     : '光大菁英信用卡',
            value    : 14,
          },
          {
            name     : '光大格瓦拉卡',
            value    : 15,
          },
          {
            name     : '光大绿色零碳信用卡',
            value    : 16
          },
          {
            name     : '光大阳光商旅信用卡金卡',
            value    : 17,
          },
          {
            name     : '光大嘉人香水信用卡',
            value    : 18,
          },
        ],
      },
    };
  },
  components: {
    BombBox,
    Dates,
    SetTime,
  },
  computed: {
  },
  mounted () {
    if (this.value) {
      this.visible = true;
    }
    this.getLocalStorage();
    this.$scrollerUpdate(this.$refs.myscroller);
  },
  watch: {
    value (val) {
      this.visible = val;
    },
    visible (val) {
      this.$emit('input', val);
    },
    formData: {
      deep: true,
      handler (value) {
        this.saveEditData(value);
      },
    },
  },
  methods: {

    /*
     * 取消设置
     */
    cancel () {
      this.visible = false;
    },

    saveData () {
      this.setBankInfo();
      this.$emit('saveData', this.formData);
      this.cancel();
    },

    /*
     * 底部弹框组件2
     */
    handleBomb (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.bombShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.formData, {
              [this.formIndex]: obj.content.name,
            });

            if ('bank' === this.formIndex) {
              this.formData.phone = obj.content.value;
            }
          }
          return;
        }
      }
    },

    /*
     * 所属组件2
     */
    handleBombBoxChange (index) {
      this.formIndex  = index;
      this.bombShow   = true;
    },

    /*
     * 日期组件回调
     */
    handelDateClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isShow = obj.status;
          _.assign(this.formData, {
            [this.formIndex]: obj.content
          });
          return;
        }
      }
    },

    /*
     * 日期组件改变
     */
    handleDateChange (item) {
      this.isShow     = true;
      this.formIndex  = item;
    },

    /*
     * 设置时间组件回调
     */
    handleSetTime (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.setTimeShow = obj.status;
          _.assign(this.formData, {
            [this.formIndex]: obj.content
          });
          return;
        }
      }
    },

    /*
     * 设置时间组件改变
     */
    handleSetTimeChange (item) {
      this.setTimeShow     = true;
      this.formIndex       = item;
    },

    /*
     * 图片上传组件
     */
    setImage (event, index) {
      let file = event.target.files[0];
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
        Text: '上传中，请稍等...'
      });
      this.getBase(file, (data) => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
        this.formData[index] = data;
      });
    },

    /*
     * 压缩图片
     */
    getBase (file, callback) {
      let reader = new FileReader(),
        image = new Image(),
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        data = '';
      reader.readAsDataURL(file);
      reader.onload = function () {
        image.src = this.result;
      };
      image.onload = function () {
        let w = image.naturalWidth,
          h = image.naturalHeight;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(image, 0, 0, w, h, 0, 0, w, h);
        data = canvas.toDataURL('image/jpeg', 1);
        if (callback && 'function' === typeof callback) {
          callback(data);
        }
      };
    },

    /*
     * 本地存储
     */
    saveLocalStorage (name, key, value) {
      let data = LocalStorage.get([name]);
      if (!_.isEmpty(data, 'data')) {
        data.data[key] = value;
        LocalStorage.set([name], data.data);
      }
      else {
        LocalStorage.set([name], {
          [key]: value,
        });
      }
    },

    saveEditData (value) {
      for (let i in this.formData) {
        this.saveLocalStorage('messageFalseData', i, value[i]);
      }
    },

    getLocalStorage () {
      let data = _.get(LocalStorage.get('messageFalseData'), 'data');
      if (!_.isEmpty(data)) {
        for (let i in data) {
          this.formData[i] = data[i];
        }
        this.$emit('saveData', this.formData);
      }
    },

    setBankInfo () {
      if ('交通' === this.formData.bank) {
        this.formData.content1 = `交通银行信用卡申请手机动态密码：${this.handleHtml(this.formData.code)}；密码序号：${this.formData.serialNumber}。您正在进行交通银行太平洋信用卡的网上申请办卡业务。[${this.formData.bank}银行]`;
        this.formData.content2 = `尊敬的客户，您申请的${this.formData.cardName}于${this.formData.date1.split('-').join('')}通过审核，信用额度${this.handleHtml(this.formData.quota)}元。收到卡片后，请您带好随卡夹寄的卡函、本人身份证件和卡片至我行网点激活。请点击${this.handleHtml('cc.bankcomm.com/app14s')}下载买单吧获取更多信用卡信息【${this.formData.bank}银行】`;
        this.formData.content3 = '';
        this.formData.content4 = '';
      }

      if ('平安' === this.formData.bank) {
        this.formData.content1 = `您申请的${this.formData.bank}信用卡已审核通过，我行将尽快邮寄卡片，关注官方微信公众号“${this.formData.bank}银行信用卡”查询办卡进度。【${this.formData.bank}银行】`;
        this.formData.content2 = `您正在激活信用卡，动态验证码为${this.formData.code}，请尽快验证。银行工作人员不会向您口头索取动态验证码【${this.formData.bank}银行】`;
        this.formData.content3 = '';
        this.formData.content4 = '';
      }

      if ('兴业' === this.formData.bank) {
        this.formData.content1 = `感谢申请${this.formData.bank}信用卡，您的申请已进入审核流程，近期我行可能通过${this.handleHtml('020-20309000')}/${this.handleHtml('80344567')}/${this.handleHtml('80363410')}或当地分行来电与您核实信息，请留意接听。查询办卡进度等更多服务请关注信用卡微信公众号或下载手机银行App。[${this.handleHtml(this.formData.bank + '银行')}]`;
        this.formData.content2 = `尊敬的客户，您本次信用卡申请的动态短信验证码为${this.handleHtml(this.formData.code)}，请勿泄露。[${this.handleHtml(this.formData.bank + '银行')}]`;
        this.formData.content3 = `您的${this.formData.bank}信用卡已核发，信用额度${this.handleHtml(this.formData.quota)}元，近期我行将通过短信告知您寄送编号。收到卡片后请通过"${this.handleHtml(this.formData.bank + '银行')}信用卡"微信公众号或手机银行App办理卡片激活、密码设置等业务。祝您用卡愉快！[${this.handleHtml(this.formData.bank + '银行')}]`;
        this.formData.content4 = '';
      }

      if ('民生' === this.formData.bank) {
        this.formData.content1 = `【${this.formData.bank}银行】尊敬的客户，${this.handleHtml(this.formData.code)}为您本次信用卡申请的短信动态验证码。动态验证码生成时间为${this.handleTime(this.formData.time1)}，民生银行工作人员绝不会向您索取此验证码，请切勿告知他人，以保障您的账户安全。`;
        this.formData.content2 = `【${this.formData.bank}银行】尊敬的客户：您申请的${this.formData.bank}信用卡已初步审核通过，预计核发信用额度${this.formData.quota}元，我行最快将于三个工作日内向您发送终审短信，请继续保持关注！`;
        this.formData.content3 = '';
        this.formData.content4 = '';
      }

      if ('浦发' === this.formData.bank) {
        this.formData.content1 = `尊敬的客户，感谢您申请${this.formData.bank}信用卡，您的申请已被批准，近期将安排寄送并以短信通知。您可通过“${this.formData.bank}银行信用卡”官方微信，浦大喜奔APP，信用卡官网等自助渠道办理信用卡激活业务。卡片额度及基本信息，可通过随卡寄送的信函了解，感谢您的支持。【${this.formData.bank}银行】`;
        this.formData.content2 = '接上：送的信函了解，感谢您的支持。【浦发银行】';
        this.formData.content3 = `感谢您申请${this.formData.bank}信用卡，您的信用卡申请已被批准。您需携带本人身份证及信用卡至您办卡时登记的单位或家庭地址所在地的我行网点办理信用卡激活业务，因${this.handleHtml('9:00-17:00')}为办理激活业务高峰时段，建议查询${this.handleHtml('17点')}后仍营业的网点，错峰办理激活。卡片额度及基本信息，可通过随卡寄/待续【${this.formData.bank}银行】`;
        this.formData.content4 = '';
      }

      if ('光大' === this.formData.bank) {
        this.formData.content1 = `您正在通过网络渠道申请${this.formData.bank}银行信用卡，您申请${this.formData.bank}${this.formData.cardName}的动态密码为：${this.formData.code}[${this.formData.bank}银行]`;
        this.formData.content2 = `(2/2)地址。[${this.formData.bank}银行]`;
        this.formData.content3 = `(1/2)请您在10个工作日内携带本人二代身份证原件前往您单位所在城市的${this.formData.bank}银行营业网点核实申请信息，核实无误后我行将免费邮寄信用卡至您账单`;
        this.formData.content4 = `尊敬的客户，您申请的${this.formData.cardName}（申请表发卡）已通过初审，授信额度最高可达10万元。[${this.formData.bank}银行]`;
      }

      if ('中信' === this.formData.bank) {
        this.formData.content1 = `【${this.formData.bank}信用卡】尊敬的客户，您的中信信用卡正在审批，因未能联系到您确认相关信息，我行将再次致电，敬请留意${this.handleHtml('075582380730')}的来电，谢谢。`;
        this.formData.content2 = `【${this.formData.bank}信用卡】${this.handleHtml(this.formData.code)}（申请进度查询），请勿向他人泄露您的验证码。`;
        this.formData.content3 = `【${this.formData.bank}信用卡】尊敬的客户：恭喜您申请的${this.formData.bank}信用卡已通过初步审核，卡片将免费快递至您单位地址，请您携带收到的卡片及本人二代身份证原件，前往我行网点开卡，成功后即可使用。`;
        this.formData.content4 = '';
      }

      if ('宜人贷' === this.formData.bank) {
        this.formData.content1 = `您的借款申请于${this.handleHtml(this.handleDate(this.formData.date1))} ${this.handleHtml(this.handleTime(this.formData.time1, 1))}投标满标，我们会在3个工作日内付款至您的银行卡，请注意查收。`;
        this.formData.content2 = `【宜人贷】发放借款通知：您的审批金额${this.handleHtml(this.formData.quota)}元已于${this.handleHtml(this.handleDate(this.formData.date2))} ${this.handleHtml(this.handleTime(this.formData.time2, 1))}分支付成功。请及时查询银行账户，并按时足额还款。如有疑问，请致电${this.handleHtml('400-060-9191')}。`;
        this.formData.content3 = '';
        this.formData.content4 = '';
      }
    },

    handleTime (time, index = 0) {
      let data = time.split(':');
      if (1 === index) {
        return `${data[0]}时${data[1]}分`;
      }
      return `${data[0]}时${data[1]}分${data[2]}秒`;
    },

    handleHtml (text) {
      let html = '';
      let data = text.split('');
      data.forEach((item) => {
        html += `<span class="money">${item}</span>`;
      });
      return html;
    },

    handleDate (data) {
      let day = new Date(data);
      let month = day.getMonth() + 1;
      let date = day.getDate();
      return `${month}月${date}日`;
    },

  }
};
import './index.scss';

import Header               from '~common/components/header';
import Models               from '~common/models';

export default {
  name: 'report',
  data () {
    return {
      isShow: true,
      baseInfo       : [
        {
          key        : '查询人姓名',
          value      : '智润凌',
        },
        {
          key        : '第一联系人姓名',
          value      : '智润凌',
        },
        {
          key        : '第一联系人身份证',
          value      : '110404********1928',
        },
        {
          key        : '家庭地址',
          value      : '石家庄市宣化区东土关街****401号',
        },
        {
          key        : '借款人手机',
          value      : '133*****333',
        },
        {
          key        : 'IP',
          value      : '116.23.231.243',
        },
        {
          key        : '借款人姓名',
          value      : '皮晴晴',
        },
        {
          key        : '借款人身份证',
          value      : '370404********1915',
        },
        {
          key        : '借款人卡号',
          value      : '6224********1823',
        },
        {
          key        : '第一联系人手机号',
          value      : '138*****888',
        },
      ],
      applyRecord    : [
        {
          key        : '2018-3-20 15:30:31',
          value      : '招商银行信用卡',
          status     : '通过',
        },
        {
          key        : '2018-3-20 15:30:31',
          value      : '工商银行信用卡',
          status     : '失败',
        },
        {
          key        : '2018-3-20 15:30:31',
          value      : '招商银行信用卡',
          status     : '通过',
        },
        {
          key        : '2018-3-20 15:30:31',
          value      : '工商银行信用卡',
          status     : '失败',
        },
      ],
      illegalRecord  : [
        {
          key        : '2017-01-20 15:40:31',
          value      : '文明大道（八一四大道-管园里路）',
          detail     : '机动车违反规定停放，临时停车，妨碍其他车辆，行人通行',
          points     : {
            num      : '0',
            money    : '200元',
          },
        },
        {
          key        : '2017-01-20 15:40:31',
          value      : '白云区江夏江夏江夏江夏江夏江夏江夏（八一四大道-管园里路）',
          detail     : '机动车违反规定停放，临时停车，妨碍其他车辆，行人通行',
          points     : {
            num      : '0',
            money    : '200元',
          },
        },
      ],
      creditReport   : [
        {
          key        : '身份证命中法院失信名单',
          value      : '规则描述    身份证命中法院失信名单',
          details    : [
            {
              content: '风险类型： 法院失信、法院失信、法院失信、法院失信、法院失信、法院失信',
            },
            {
              content: '匹配字段： 借款人身份证',
            },
            {
              content: '附件：法院详情',
            },
          ],
        },
        {
          key        : '身份证命中高风险关注名单',
          value      : '规则描述    身份证命中高风险关注名单',
          details    : [
            {
              content: '风险类型： 异常交易、恶意爬取、游戏消费欠费、异常支付、风险激活、欠款公司法人代表、作弊行为、法院执行、异常登录、异常充值、信贷逾期后还款、异常接单、欠税、刑事犯罪、电商风险名单、垃圾注册、盗卡、车贷风险名单、信贷逾期名单、机构代办、异常叫车、欠税公司法人代表、信用炒作、异常退款、法院失信、异常租赁、异常提现、刷单、垃圾消息、异常转账、异常审核、伪冒风险、异常行为、电信欺诈、法院结案、助学贷款欠费、骗取补贴、异常注册、故意违章乘车',
            },
            {
              content: '匹配字段： 借款人身份证',
            },
          ],
        },
        {
          key        : '身份证归属地位于高风险较为集中地区',
          value      : '',
          details    : [
            {
              content: '高风险较为集中地区:  山东省枣庄市峄城区',
            },
          ],
        },
        {
          key        : '身份证命中犯罪通缉名单',
          value      : '规则描述    身份证命中高风险关注名单',
          details    : [
            {
              content: '风险类型： 刑事犯罪、刑事犯罪、刑事犯罪、刑事犯罪',
            },
            {
              content: '匹配字段： 借款人身份证',
            },
          ],
        },
        {
          key        : '身份证命中法院执行名单',
          value      : '规则描述    身份证命中法院执行名单',
          details    : [
            {
              content: '风险类型： 法院执行、法院执行、法院执行、法院执行',
            },
            {
              content: '匹配字段： 借款人身份证身份证命中法院执行名单',
            },
            {
              content: '附件：法院详情',
            },
          ],
        },
        {
          key        : '身份证对应人存在助学贷款欠费历史',
          value      : '规则描述    身份证对应人存在助学贷款欠费历史',
          details    : [
            {
              content: '风险类型： 助学贷款欠费、助学贷款欠费',
            },
            {
              content: '匹配字段： 借款人身份证',
            },
          ],
        },
        {
          key        : '身份证命中信贷逾期名单',
          value      : '规则描述    身份证命中信贷逾期名单',
          details    : [
            {
              content: '逾期次数: 4',
            },
            {
              content: '逾期金额: (10000,  50000] 逾期笔数: 4 逾期天数:  (90, 180] 逾期入库时间: 2017-02 身份证命中信贷逾期名单',
            },
            {
              content: '逾期金额: (10000,  50000] 逾期笔数: 1 逾期天数:  (0, 30] 逾期入库时间: 2017-06',
            },
            {
              content: '逾期金额: (10000,  50000] 逾期笔数: 4 逾期天数:  (90, 180] 逾期入库时间: 2017-02',
            },
            {
              content: '逾期金额: 逾期笔数:  逾期天数: 逾期入库时间:  2017-09',
            },
          ],
        },
        {
          key        : '身份证命中车辆租赁违约名单',
          value      : '规则描述    身份证命中车辆租赁违约名单',
          details    : [
            {
              content: '风险类型： 汽车租赁违约、汽车租赁违约',
            },
            {
              content: '匹配字段： 借款人身份证',
            },
          ],
        },
        {
          key        : '身份证命中法院结案名单',
          value      : '规则描述    身份证命中法院结案名单',
          details    : [
            {
              content: '风险类型： 法院结案、法院结案、法院结案、法院结案',
            },
            {
              content: '匹配字段： 借款人身份证',
            },
            {
              content: '附件：法院详情',
            },
          ],
        },
        {
          key        : '身份证命中中风险关注名单',
          value      : '规则描述    身份证命中中风险关注名单',
          details    : [
            {
              content: '风险类型： 异常借款',
            },
            {
              content: '匹配字段： 借款人身份证',
            },
          ],
        },
        {
          key        : '身份证命中低风险关注名单',
          value      : '规则描述    身份证命中低风险关注名单',
          details    : [
            {
              content: '风险类型： 信用异常',
            },
            {
              content: '匹配字段： 借款人身份证',
            },
          ],
        },
        {
          key        : '身份证姓名命中信贷逾期模糊名单',
          value      : '规则描述    身份证姓名命中信贷逾期模糊名单',
          details    : [
            {
              content: '风险类型： 信贷逾期名单',
            },
            {
              content: '姓名： 皮晴晴',
            },
            {
              content: '模糊身份证： 3704041990****1915',
            },
          ],
        },
        {
          key        : '身份证姓名命中法院执行模糊名单',
          value      : '规则描述    身份证姓名命中法院执行模糊名单',
          details    : [
            {
              content: '风险类型： 法院执行',
            },
            {
              content: '姓名： 皮晴晴',
            },
            {
              content: '模糊身份证： 3704041990****1915',
            },
          ],
        },
        {
          key        : '身份证姓名命中法院结案模糊名单',
          value      : '规则描述    身份证姓名命中法院结案模糊名单',
          details    : [
            {
              content: '风险类型： 法院执行',
            },
            {
              content: '姓名： 皮晴晴',
            },
            {
              content: '模糊身份证： 3704041990****1915',
            },
          ],
        },
        {
          key        : '身份证命中欠款公司法人代表名单',
          value      : '规则描述    身份证命中欠款公司法人代表名单',
          details    : [
            {
              content: '风险类型： 欠款公司法人代表、欠款公司法人代表',
            },
            {
              content: '匹配字段： 借款人身份证',
            },
          ],
        },
        {
          key        : '身份证命中故意违章乘车名单',
          value      : '规则描述    身份证对应人存在助学贷款欠费历史',
          details    : [
            {
              content: '风险类型： 故意违章乘车、故意违章乘车',
            },
            {
              content: '匹配字段： 借款人身份证',
            },
          ],
        },
        {
          key        : '身份证命中欠税名单',
          value      : '规则描述    身份证命中欠税名单',
          details    : [
            {
              content: '风险类型： 欠税',
            },
            {
              content: '匹配字段： 借款人身份证',
            },
          ],
        },
        {
          key        : '身份证命中欠税公司法人代表名单',
          value      : '规则描述    身份证命中欠税公司法人代表名单',
          details    : [
            {
              content: '风险类型： 欠税公司法人代表、欠税公司法人代表、欠税公司法人代表',
            },
            {
              content: '匹配字段： 借款人身份证',
            },
          ],
        },
        {
          key        : '身份证命中信贷逾期后还款名单',
          value      : '规则描述    身份证命中信贷逾期后还款名单',
          details    : [
            {
              content: '风险类型： 信贷逾期后还款、信贷逾期后还款、信贷逾期后还款',
            },
            {
              content: '匹配字段： 借款人身份证',
            },
          ],
        },
        {
          key        : '手机号命中虚假号码库',
          value      : '规则描述    手机号命中虚假号码库',
          details    : [
            {
              content: '风险类型： 虚假号码、虚假号码',
            },
            {
              content: '匹配字段： 借款人手机',
            },
          ],
        },
        {
          key        : '手机号命中通信小号库',
          value      : '规则描述    手机号命中通信小号库',
          details    : [
            {
              content: '风险类型： 通信小号、通信小号',
            },
            {
              content: '匹配字段： 借款人手机',
            },
          ],
        },
        {
          key        : '手机号命中诈骗骚扰库',
          value      : '规则描述    手机号命中诈骗骚扰库',
          details    : [
            {
              content: '规则描述    手机号命中诈骗骚扰库',
            },
            {
              content: '匹配字段： 借款人手机',
            },
          ],
        },
        {
          key        : '手机号命中中风险关注名单',
          value      : '规则描述    手机号命中中风险关注名单',
          details    : [
            {
              content: '风险类型： 信用异常',
            },
            {
              content: '匹配字段： 借款人手机',
            },
          ],
        },
        {
          key        : '手机号命中低风险关注名单',
          value      : '规则描述    手机号命中低风险关注名单',
          details    : [
            {
              content: '风险类型： 机构代办、异常借款',
            },
            {
              content: '匹配字段： 借款人手机',
            },
          ],
        },
        {
          key        : '手机号命中高风险关注名单',
          value      : '规则描述    手机号命中高风险关注名单',
          details    : [
            {
              content: '风险类型： 法院执行、法院失信、法院结案',
            },
            {
              content: '匹配字段： 借款人手机',
            },
          ],
        },
        {
          key        : '手机号命中信贷逾期名单',
          value      : '规则描述    手机号命中信贷逾期名单',
          details    : [
            {
              content: '逾期次数: 4',
            },
            {
              content: '逾期金额: (10000,  50000] 逾期笔数: 4 逾期天数:  (90, 180] 逾期入库时间: 2017-02',
            },
            {
              content: '逾期金额: (10000,  50000] 逾期笔数: 1 逾期天数:  (0, 30] 逾期入库时间: 2017-06 手机号命中信贷逾期名单',
            },
            {
              content: '逾期金额: (10000,  50000] 逾期笔数: 4 逾期天数:  (90, 180] 逾期入库时间: 2016-03',
            },
            {
              content: '逾期金额: (10000,  50000] 逾期笔数: 4 逾期天数:  (90, 180] 逾期入库时间: 2017-02',
            },
          ],
        },
        {
          key        : '手机号命中车辆租赁违约名单',
          value      : '规则描述    手机号命中车辆租赁违约名单',
          details    : [
            {
              content: '风险类型： 汽车租赁违约',
            },
            {
              content: '匹配字段： 借款人手机',
            },
          ],
        },
        {
          key        : '手机号命中欠款公司法人代表名单',
          value      : '规则描述    手机号命中欠款公司法人代表名单',
          details    : [
            {
              content: '风险类型： 欠款公司法人代表、欠款公司法人代表',
            },
            {
              content: '匹配字段： 借款人手机',
            },
          ],
        },
        {
          key        : '手机号命中信贷逾期后还款名单',
          value      : '规则描述    手机号命中信贷逾期后还款名单',
          details    : [
            {
              content: '风险类型： 信贷逾期后还款、信贷逾期后还款',
            },
            {
              content: '匹配字段： 借款人手机',
            },
          ],
        },
        {
          key        : '3个月内身份证关联多个申请信息',
          value      : '频度规则详情',
          details    : [
            {
              content: '3个月身份证关联家庭地址数：5',
            },
            {
              content: '石家庄市宣化区东土关街5号楼1单元401号',
            },
            {
              content: '河南省信※※※※※※※※※※※度发得分',
            },
            {
              content: '河南省周※※※※※※※※※※※式的方法',
            },
            {
              content: '成都※※银行',
            },
            {
              content: '湖南省※※※※居住地',
            },
            {
              content: '3个月身份证关联手机号数：21',
            },
            {
              content: '133※※※※3333',
            },
            {
              content: '159※※※※8173',
            },
            {
              content: '158※※※※6871',
            },
            {
              content: '189※※※※6641',
            },
            {
              content: '134※※※※1212',
            },
            {
              content: '138※※※※8298',
            },
            {
              content: '189※※※※6641',
            },
            {
              content: '188※※※※5888',
            },
            {
              content: '159※※※※※※000',
            },
            {
              content: '158※※※※9456',
            },
            {
              content: '3个月身份证关联邮箱数：6',
            },
            {
              content: 'lan※※168@126.com',
            },
            {
              content: '893※※※741@qq.com',
            },
          ],
        },
      ],
      courtFile      : [
        {
          key        : '风险类型:',
          value      : '法院失信',
        },
        {
          key        : '命中的属性值:',
          value      : '370404********1915',
        },
        {
          key        : '执行法院:',
          value      : '厦门市思明区人民法院',
        },
        {
          key        : '立案时间:',
          value      : '2014年07月16日',
        },
        {
          key        : '做出依据执行法院:',
          value      : '厦门市思明区人民法院',
        },
        {
          key        : '被执行人履行情况:',
          value      : '全部未履行',
        },
        {
          key        : '信贷逾期被执行人行为具体情形:',
          value      : '其他有履行能力而拒不履行生效法律文书确定义务',
        },
      ],
      courtFile2     : [
        {
          key        : '风险类型:',
          value      : '法院失信',
        },
        {
          key        : '命中的属性值:',
          value      : '370404********1915',
        },
        {
          key        : '执行法院:',
          value      : '厦门市思明区人民法院',
        },
        {
          key        : '立案时间:',
          value      : '2014年07月16日',
        },
        {
          key        : '做出依据执行法院:',
          value      : '厦门市思明区人民法院',
        },
        {
          key        : '被执行人姓名:',
          value      : '皮晴晴',
        },
      ],
      devices        : [
        {
          key        : '启用Cookie',
          value      : '是',
        },
        {
          key        : '操作系统',
          value      : 'Mac OS',
        },
        {
          key        : '真实IP',
          value      : '116.23.231.243',
        },
        {
          key        : '集成sdk版本号',
          value      : '0.0.3',
        },
        {
          key        : 'tokenId',
          value      : 'psyv3rrsa0w0000000',
        },
        {
          key        : '设备ID',
          value      : '023afe6ce10d103f337570cf5f4bbcff',
        },
        {
          key        : '浏览器',
          value      : 'Mozilla/5.0(Macintosh;  Intel MacOS X 10_13_2)  AppleWebKit/537.36(KHTML, like Gecko)  Chrome/63.0.3239.132 Safari/537.36',
        },
        {
          key        : '智能ID',
          value      : 's_8c0309c3349274f885baf93ad9a81761',
        },
        {
          key        : '帆布指纹',
          value      : 'e829b2a1468bc3561ec6abb045528fcc',
        },
        {
          key        : '计算机语言',
          value      : 'h-CN^^zh-CN,zh^^-^^-^^-',
        },
        {
          key        : '屏幕分辨率',
          value      : '1440^^900^^-^^-',
        },
        {
          key        : '插件列表',
          value      : '012df69e7ede2a80549273685d8e6b43',
        },
        {
          key        : '启用Flash',
          value      : '否',
        },
        {
          key        : '请求来源',
          value      : 'https://x.tongdun.cn/#/device/deviceTrial',
        },
        {
          key        : '浏览器类型',
          value      : 'chrome',
        },
        {
          key        : 'TCP协议栈特征对应的操作系统',
          value      : '',
        },
        {
          key        : '浏览器版本',
          value      : '63.0.3239.132',
        },
        {
          key        : '字体',
          value      : '',
        },
        {
          key        : '浏览器header',
          value      : '*/*',
        },
        {
          key        : '浏览器header编码类型',
          value      : 'gzip, deflate, br',
        },
        {
          key        : '浏览器header语言',
          value      : 'zh-CN,zh;q=0.9',
        },
        {
          key        : '时区',
          value      : '480',
        },
        {
          key        : '开启Debug模式',
          value      : '否',
        },
        {
          key        : '启用js',
          value      : '是',
        },
        {
          key        : '错误原因',
          value      : '',
        },
      ],

      queryList      : [],
    };
  },
  components: {
    'app-header'    : Header,
  },
  computed: {

    queryId () {
      return this.$route.query.id;
    },

  },
  mounted () {
    this.list();
  },
  watch: {},
  methods: {

    list () {
      Models.User
      .creditQuery({
        id: this.queryId,
      })
      .then((res) => {
        if (1 === res.code) {
          this.queryList = res.data;
        }
        else {
          this.$toast(res.msg);
        }
      });
    },

  },
  filters: {

    handleDate (value) {
      return new Date(value * 1000).format('yyyy-MM-dd hh:mm:ss');
    },

    handleIdentity (value) {
      if (value) {
        return value.replace(value.substr(6, 8), '*'.repeat(6));
      }
      return '';
    },

  },
};
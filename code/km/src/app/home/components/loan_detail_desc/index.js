import './index.scss';
import Header           from '~common/components/header';

export default {
  name: 'LoanDetailDesc',
  data () {
    return {
      loanId: 27,
      isShow: false,
      image: '',
      config: {
        '27': {
          banner: 'loan/nwd/banner.png',
          content: [
            {
              img: ['loan/nwd/step1.png'],
              text: '打开你我贷页面，查看基本信息后，然后点击“立即申请”',
              title: '打开你我贷页面'
            },
            {
              img: ['loan/nwd/step2.png'],
              text: '在进入借款页面之前，您需要填写申请人信息，即谁申请就填写谁的信息，另外必须与后面填写的信息一致，确认无误后，点击保存。',
              title: '填写申请人信息'
            },
            {
              img: ['loan/nwd/step3.png'],
              text: '申请之后跳转到你我贷借款页面，进行账号登录',
              title: '登录账号'
            },
            {
              img: ['loan/nwd/step4.png'],
              text: '通过自己所需要的资金，进行选择借款额度。',
              title: '选择额度'
            },
            {
              img: ['loan/nwd/step5.png'],
              text: '点击“立即申请”',
              title: '点击申请'
            },
            {
              img: ['loan/nwd/step6-1.png', 'loan/nwd/step6-2.png'],
              text: '完善个人信息，以及确认是否是本人信息!',
              title: '完善信息'
            },
            {
              img: ['loan/nwd/step7.png'],
              text: '进行手机号码验证，确保是本人信息，以防泄露！',
              title: '验证手机号码'
            },
            {
              img: ['loan/nwd/step8.png'],
              text: '填写申请借款之后，填写所需要的银行卡号，进行放款！',
              title: '填写银行卡号'
            },
          ]
        },
        '43': {
          banner: 'loan/rxf/banner.png',
          content: [
            {
              img: ['loan/rxf/step1.png'],
              text: '打开任性付页面，查看基本信息后，然后点击“立即申请”。',
              title: '打开任性付页面'
            },
            {
              img: ['loan/rxf/step2.png'],
              text: '在进入借款页面之前，您需要填写申请人信息，即谁申请就填写谁的信息。必须与后面填写的信息一致，确认无误后，点击保存。',
              title: '填写申请人信息'
            },
            {
              img: ['loan/rxf/step3.png'],
              text: '跳转进入任性付借款页面，点击“借款”按钮。',
              title: '点击“借款”'
            },
            {
              img: ['loan/rxf/step4-1.png', 'loan/rxf/step4-2.png'],
              text: '如首次借款，需要补充身份证照片以及联系人的基本信息。',
              title: '首次借款，需补充身份证等信息'
            },
            {
              img: ['loan/rxf/step5.png'],
              text: '输入借款金额等内容，按流程确认借款即可。 （温馨提示：借款操作完成后，等待借款到账信息即可）',
              title: '输入借款金额'
            },
          ]
        },
        '45': {
          banner: 'loan/crk/banner.png',
          content: [
            {
              img: ['loan/crk/step1.png'],
              text: '打开超人贷页面，查看基本信息后，然后点击“立即申请”。',
              title: '打开超人贷页面'
            },
            {
              img: ['loan/crk/step2.png'],
              text: '在进入借款页面之前，您需要填写申请人信息，即谁申请就填写谁的信息，另外必须与后面填写的信息一致，确认无误后，点击保存。',
              title: '填写申请人信息'
            },
            {
              img: ['loan/crk/step3.png'],
              text: '未注册用户输入手机号、短信码、推荐人，点击“登录”即完成用户注册并登录。',
              title: '注册登录'
            },
            {
              img: ['loan/crk/step4.png'],
              text: '如首次借款，需要补充身份证照片以及联系人的基本信息。',
              title: '实名认证'
            },
            {
              img: ['loan/crk/step5.png'],
              text: '用户扫描身份证件不通过的，可选择手动输入姓名、身份证号完成实名认证，确认后跳转到用户输入的身份信息确认页面，允许修改姓名、身份证号，点击“确定”把身份信息提交到后台，提交后不可以修改。',
              title: '手动输入,并确认'
            },
            {
              img: ['loan/crk/step6.png'],
              text: '首页根据用户状态不同展示不同页面，用户根据系统提示做对应操作。',
              title: '填写信息'
            },
            {
              img: ['loan/crk/step7.png'],
              text: '点击选填项的图标，跳转到对应页面,根据提示填写信息、授权即可。',
              title: '授权'
            },
            {
              img: ['loan/crk/step8.png'],
              text: '用户信息提交后，系统根据填写信息完成卡片激活，给出授信额度。',
              title: '卡片激活'
            },
            {
              img: ['loan/crk/step9.png'],
              text: '用户首次提现申请，进行身份验证，需要根据系统提示进行人脸识别。',
              title: '人脸识别'
            },
            {
              img: ['loan/crk/step10.png'],
              text: '点击银行卡图标，跳转到银行列表选择页面。',
              title: '跳转到银行列表'
            },
            {
              img: ['loan/crk/step11.png'],
              text: '已完成人脸识别、绑定银行卡的用户申请提现时，需要短信验证，输入短信验证码完成提现申请。',
              title: '输入验证码'
            },
          ],
        }
      }
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.loanId = this.$route.query.loanId;
  },
  watch: {
  },
  methods: {
    /*
     * 放大图片
     */
    enlarge (img) {
      this.image = img;
      this.isShow = true;
    },
  },
};

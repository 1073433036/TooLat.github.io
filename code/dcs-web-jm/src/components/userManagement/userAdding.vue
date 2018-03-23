<template>
  <div id="user-adding" class="poi-detail-popup">
    <el-dialog :title="isUpdateUser? '修改用户' : '添加用户'" v-model="showPopup" size="small" :modal="true" :modal-append-to-body="false" @close="closep" top="10%">
      <el-form :model="userFormData" ref="userFormData" :rules="rules">
        <el-form-item label="用户名" prop="account">
          <el-input type="text" v-model="userFormData.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userFormData.password" placeholder="只能输入英文和数字" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model="userFormData.checkPassword" placeholder="只能输入英文和数字" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item id='linel' label='' style="width: 100px"></el-form-item>
        <el-form-item style="margin-left: 430px">
          <el-button type="primary" @click.stop="submitUserData('userFormData')" >提交</el-button>
          <el-button @click.stop="resetForm('userFormData')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['userOprateType', 'showOprateTip', 'updateData'],
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.userFormData.checkPassword !== '') {
          this.$refs.userFormData.validateField('checkPassword');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.userFormData.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      pass: '',
      checkPass: '',
      showPopup: true,
      rules: {
        account: [
          { required: true, trigger: 'blur', message: '请输入用户名' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
      userFormData: {},
      userdata:{
        par:'abc',
        data:{},
      },
      resOptions:{},
      departmentObj:{
        'meteo':'气象局',
        'land':'国土局',
        'envir':'环保局',
        'water':'水文局',
      },
      emptyUserData: {
        account: '',
        password: '',
        checkPassword: '',
        sign: 'meteo',
        res: {
          tide: false,
          geol: false,
          waterlog: false,
          torrent: false,
        }
      },
      isValidatedPass: true,
      isEmptyPass: false,
      isEmptyAccount: false
    }
  },
  mounted() {
    this.userFormData = this.isUpdateUser ? this.updateData : this.emptyUserData;
  },
  computed: {
    isUpdateUser() {
      return this.userOprateType === 'update';
    }
  },
  watch:{
    updateData(val){
        if(this.userOprateType === 'update'){
          let formData =this.updateData;
          this.userdata.data=Object.assign({}, formData)
          this.userFormData =this.userdata.data ;
        }
    },
    userOprateType(val){
      let formData;
      if(val === 'update'){
       formData =this.updateData
      }else {
        formData =this.emptyUserData;
      }
      this.userdata.data=Object.assign({}, formData);
      this.userFormData =this.userdata.data;
    },
  },
  methods: {
    resetForm(userFormData) {
      this.$refs[userFormData].resetFields()
    },
    selectChange(){

    },
    //关闭编辑窗口
    closep(){
      this.$refs['userFormData'].resetFields()
      this.$emit('closePopup',false)
    },

    submitUserData(userFormData) {
      this.$refs[userFormData].validate((valid) => {
        if (!valid) {
          console.log('error submit!!');
          return false;
        }else {
          let userFormData = this.userFormData;
          let params = {
            account: userFormData.account,
            password: userFormData.password,
            sign: this.departmentObj[userFormData.sign]
          };

          if(this.userOprateType === 'update') {
            params = Object.assign({id: userFormData.id});
          }
          this.$http.jsonp('http://10.149.3.123:9020/jm/AddDeleteUpdate', {
            params: {
              data: JSON.stringify(params),
              table: 'user',
              action: this.userOprateType === 'update' ? 'update' : 'add'
            }
          }).then(res => {
            let operateTip;
            if(res.data.status) {
              operateTip = {
                message: this.isUpdateUser ? '更新成功' : '注册成功',
                type: 'success'
              }
            } else {
              operateTip = {
                message: this.isUpdateUser ? '更新失败' : '注册失败',
                type: 'error'
              }
            }
            this.showOprateTip(operateTip, 'user');
            this.closep();
          }, err => {
            this.closep();
            this.showOprateTip({
              message: this.isUpdateUser ? '更新失败' : '注册失败',
              type: 'error'
            }, 'user');
          })
        }
      });

    },
  }
}

</script>

<style lang="scss" scoped>
  .close{
    position: absolute;
    width: 25px;
    height:25px;
    background-color: transparent;
    z-index: 999;
    right:10px;
    top:2px;
  }
#user-adding {
  width: 300px;
  right: 50%;
  margin-right: -150px;
  background-color: white;
  z-index: 99;
  .poi-detail-title {
    cursor: default;
  }
  .poi-detail-wrapper {
    ul {
      width: calc(100% - 40px);
      display: block;
      margin: 20px 20px 0px 20px;
      font-size: 0;
      li {
        width: 100%;
        height: 24px;
        position: relative;
        display: inline-block;
        margin-bottom: 20px;
        font-size: 0;
        a {
          position: absolute;
          display: inline-block;
          bottom: -18px;
          left: 70px;
          color: red;
          font-size: 12px;
          text-decoration: none;
        }
        span {
          width: 70px;
          height: 100%;
          display: inline-block;
          line-height: 24px;
          font-size: 12px;
          text-align: left;
          font-weight: bold;
          color: #475f88;
        }
        span.required-value:after {
          content: '*';
          position: absolute;
          right: -10px;
          color: red;
          line-height: 26px;
        }
        input, select {
          width: 188px;
          height: 22px;
          display: inline-block;
          border: 1px solid #e9e9e9;
          border-radius: 4px;
          text-indent: 10px;
          outline: none;
        }
        select {
          width: 190px;
          height: 24px;
        }

        &:last-of-type {
          height: 30px;
          padding-top: 10px;
          text-align: right;
          .user-btn {
            width: 80px;
            height: 30px;
            position: relative;
            display: inline-block;
            margin-left: 10px;
            text-align: center;
            line-height: 30px;
            font-size: 12px;
            color: #299dff;
            border: 1px solid #299dff;
            border-radius: 4px;
            cursor: pointer;
            &:hover {
              background-color: #299dff;
              color: white;
            }
          }
        }
      }
      li.password-error {
        input {
          border-color: red !important;
        }
      }
      li.user-permission {
        width: 50% !important;
        &:nth-child(even) {
          text-align: right;
        }
        .user-permission-btn {
          vertical-align: top !important;
          margin: 1px 0px !important;
        }
      }
    }
  }
}

</style>
<style lang="scss">
  .el-input__inner{
    height: auto !important;
  }
  .el-dialog__headerbtn {
    padding-top: 8px !important;
  }
</style>

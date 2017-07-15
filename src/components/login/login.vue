<template>
  <div id="login">
    <!--<div class="content">
      <el-form ref="form" label-width="130px" :model="UserForm" :rules="rules" label-position="left">
        <el-form-item label="管理员账号" prop="name">
          <el-input v-model="UserForm.name" class="input"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" prop="psw">
          <el-input v-model="UserForm.psw" type="password" class="input"
                    @keyup.enter.native="onSubmit(UserForm)"></el-input>
        </el-form-item>
        <el-button type="primary" @click="onSubmit(UserForm)">登录</el-button>
      </el-form>
    </div>-->
    <div class="bg" :style="bg">

    </div>
    <div class="userLogin">
      <p class="userLogin_logo" :style="note"></p>
      <p class="userLogin_topic">欢迎回来</p>
      <div class="userLogin_content">
        <div class="login_login">
          <el-form class="login_input-area" ref="form" :model="UserForm" :rules="rules">
            <el-form-item class="login_phone" prop="name" style="margin-bottom: 0">
              <input type="text" placeholder="请输入账号" v-model="UserForm.name">
            </el-form-item>
            <el-form-item class="login_password" prop="psw" style="margin-bottom: 0">
              <input type="password" placeholder="请输入密码" v-model="UserForm.psw" @keyup.enter="onSubmit(UserForm)">
            </el-form-item>
          </el-form>
          <p class="login_login-btn" @click.prevent="onSubmit(UserForm)">登录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import vue from 'vue'
  export default {
    data(){
      return {
        UserForm: {
          name: '',
          psw: ''
        },
        note: {
          backgroundImage: "url(" + require("../../assets/img/1024.png") + ")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: 'center center',
          backgroundSize: 'cover'
        },
        bg: {
          backgroundImage: "url(" + require("../../assets/img/bg_login.jpg") + ")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: 'center center',
          backgroundSize: 'cover'
        },
      }
    },
    computed: {
      ...mapGetters({
        rules: 'rules',
        LoginStatus: 'LoginStatus'
      }),
    },
    methods: {
      onSubmit(UserForm){
        this.$refs.form.validate(function (result) {
          const _this = this;
          if (result) {
            // 验证通过,调用module里的LOGIN_login方法
            this.$store.dispatch('LOGIN_login', {
              UserForm: UserForm,
              fn: function (store) {
                const isSuccess = store.state.LoginStatus;
                if (!!isSuccess.data) {
                  _this.$message({
                    showClose: true,
                    message: '恭喜你，登录成功',
                    type: 'success',
                    duration: 1000,
                    onClose: function () {
                      _this.$router.push({path: '/index'})
                    }
                  })
                }
              }
            });

          } else {
            return false
          }
        }.bind(this));
      },
      centent(){
        const login = document.getElementById("login");
        const height = document.documentElement.clientHeight || document.body.clientHeight;
        const content = document.querySelector('.content');
        login.style.height = height + 'px';
        content.style.marginTop = -content.getBoundingClientRect().height / 2 + 'px';
        content.style.marginLeft = -content.getBoundingClientRect().width / 2 + 'px';
      }
    },
    mounted(){
      this.$nextTick(() => {
        this.centent();
      })
    },
  }
</script>

<style lang="less" scoped>
  #login {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 1920px;
    height: 1200px;
    min-width: 100%;
    min-height: 100%;
    animation: UserLogin__bg-move___1XP0s 30s ease-out .5s infinite alternate;
  }

  #login .content {
    text-align: center;
    margin: 0 auto;
    background: #ECEEF1;
    width: 330px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -56px;
    margin-left: -200px;
    padding: 30px 20px;
    padding-right: 50px;
    box-shadow: 0 0 0px 1px #fff;
  }

  #login .content .input {
    width: 200px;
  }

  .userLogin {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    width: 340px;
    height: 460px;
    border-radius: 6px;
    background-color: #3b454c;

  .userLogin_logo {
    margin-top: -48px;
    width: 103px;
    height: 103px;
    border-radius: 50%;
  }

  .userLogin_topic {
    margin-top: 30px;
    margin-bottom: 30px;
    line-height: 24px;
    font-size: 20px;
    color: #fff;
  }

  .userLogin_content {
    align-self: stretch;
    padding: 0 40px;

  .login_login {
    display: flex;
    flex-direction: column;
    align-items: center;

  .login_login-btn {
    width: 100%;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    border-radius: 6px;
    margin-top: 30px;
    background: linear-gradient(90deg, #01acf3, #30E3CA);
  }

  .login_input-area {
    align-self: stretch;
    padding: 4px 12px;
    height: 122px;
    border-radius: 6px;
    background-color: #fff;

  .login_phone {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    height: 50%;

  input {
    flex-grow: 1;
    line-height: 20px;
    font-size: 14px;
  }

  }
  .login_password {
    border-top: 1px solid #dee4e7;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    height: 50%;

  input {
    flex-grow: 1;
    line-height: 20px;
    font-size: 14px;
  }

  }
  }
  }
  }
  }
  a, button, input {
    border: 0;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  input {
    text-rendering: auto;
    color: initial;
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    margin: 0em 0em 0em 0em;
    font: 13.3333px Arial;
    -webkit-appearance: textfield;
    background-color: #fff;
    -webkit-rtl-ordering: logical;
    user-select: text;
    cursor: auto;
    padding: 1px;
    border-width: 2px;
    border-style: inset;
    border-color: initial;
    border-image: initial;
    border: transparent;
    text-indent: 10px;
  }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px white inset;
  }

  @keyframes UserLogin__bg-move___1XP0s {
    0% {
      transform: translate(0)
    }
    to {
      transform: translateY(-250px)
    }
  }

  @-webkit-keyframes UserLogin__bg-move___1XP0s {
    0% {
      transform: translate(0)
    }
    to {
      transform: translateY(-250px)
    }
  }

  .el-form-item__error {
    text-indent: 10px;
    margin-bottom: 20px;
  }
</style>

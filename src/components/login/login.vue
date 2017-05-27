<template>
  <div id="login">
    <div class="content">
      <el-form ref="form" label-width="100px"
               :model="UserForm"
               :rules="rules">
        <el-form-item label="管理员账号" prop="name">
          <el-input v-model="UserForm.name" class="input"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" prop="psw">
          <el-input v-model="UserForm.psw" type="password" class="input"
                    @keyup.enter.native="onSubmit(UserForm)"></el-input>
        </el-form-item>
        <el-button type="primary" @click="onSubmit(UserForm)">登录</el-button>
      </el-form>
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
        }
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
      }
    },
    mounted(){
      this.$nextTick(() => {
        /*登录层居中*/
        function centent() {
          const login = document.getElementById("login");
          const height = document.documentElement.clientHeight || document.body.clientHeight;
          const content = document.querySelector('.content');
          login.style.height = height + 'px';
          content.style.marginTop = -content.getBoundingClientRect().height / 2 + 'px';
          content.style.marginLeft = -content.getBoundingClientRect().width / 2 + 'px';
        }

        centent();
        window.addEventListener('resize', function () {
          centent()
        })
      })
    }
  }
</script>

<style lang="less" scoped>
  #login {
    background: #2c3e50;
    position: relative;
  }

  #login .content {
    text-align: center;
    margin: 0 auto;
    background: #ECEEF1;
    width: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 30px 20px;
    padding-right: 50px;
    box-shadow: 0 0 0px 1px #fff;
  }

  #login .content .input {
    width: 200px;
  }
</style>

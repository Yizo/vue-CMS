<script src="../../../../../../../git/github/src/api/api.js"></script>
<template>
  <div class="config">
    <!--表格-->

    <div class="container-wrapper">
      <el-form :label-position="labelPosition" label-width="320px" :model="form" class="form">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="line-height: 36px;">系统参数</span>
          </div>
          <el-form-item label="签到奖励时间(小时)">
            <el-input v-model="form.checkin_present_time" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="充值统计刷新时间（分钟)">
            <el-input v-model="form.transaction_stat_refresh_time" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="新用户默认赠送钻石数">
            <el-input v-model="form.new_user_default_coins" style="width: 300px"></el-input>
          </el-form-item>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="line-height: 36px;">代理服务器连接失败日志参数</span>
          </div>
          <el-form-item label="代理服务器连接失败预警触发时间段(秒)">
            <el-input v-model="form.proxy_conn_failed_warn_trigger_period" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="代理服务器连接失败预警触发用户数">
            <el-input v-model="form.proxy_conn_failed_warn_trigger_users" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="代理服务器连接失败预警触发累计次数">
            <el-input v-model="form.proxy_conn_failed_warn_trigger_times" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="代理服务器连接失败预警触发手机号">
            <el-input type="textarea" :rows="row" v-model="form.proxy_conn_failed_warn_trigger_phones"
                      style="width: 300px"></el-input>
            <p>多个手机号,请用符号"|"分隔开</p>
          </el-form-item>
          <el-form-item label="代理服务器连接失败预警短信发送间隔时间(分钟)">
            <el-input v-model="form.proxy_conn_failed_warn_trigger_sms_period" style="width: 300px"></el-input>
          </el-form-item>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="line-height: 36px;">测试机器人测试参数</span>
          </div>
          <el-form-item label="测试机器人每台服务器触发预警的错误百分比">
            <el-input v-model="form.test_robot_per_node_failure_percent" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="测试机器人预警触发手机号">
            <el-input type="textarea" :rows="row" v-model="form.test_robot_warn_trigger_phones"
                      style="width: 300px"></el-input>
            <p>多个手机号,请用符号"|"分隔开</p>
          </el-form-item>
          <el-form-item label="测试机器人预警短信发送间隔时间(分钟)">
            <el-input v-model="form.test_robot_warn_trigger_sms_period" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="测试机器人预警短信模版ID">
            <el-input v-model="form.test_robot_warn_trigger_sms_tpl_id" style="width: 300px"></el-input>
          </el-form-item>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="line-height: 36px;">推广钻石参数</span>
          </div>
          <el-form-item label="绑定推广码后，推广人奖励的钻石数">
            <el-input v-model="form.promo_promoter_coins" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="绑定推广码后，被推广人奖励的钻石数">
            <el-input v-model="form.promo_accepted_user_coins" style="width: 300px"></el-input>
          </el-form-item>
        </el-card>

      </el-form>
      <el-button class="btn" @click="update">修改</el-button>
    </div>

  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import * as API from '../../../api/api'
  export default {
    data(){
      return {
        labelPosition: 'left',
        row: 4,
        form: {
          checkin_present_time: 0,
          new_user_default_coins: 0,
          transaction_stat_refresh_time: 0,
          proxy_conn_failed_warn_trigger_period: 0,
          proxy_conn_failed_warn_trigger_users: 0,
          proxy_conn_failed_warn_trigger_times: 0,
          proxy_conn_failed_warn_trigger_phones: '',
          proxy_conn_failed_warn_trigger_sms_period: 0,
          proxy_conn_failed_warn_trigger_sms_period: 0,
          test_robot_warn_trigger_phones: '',
          test_robot_warn_trigger_sms_period: 0,
          test_robot_warn_trigger_sms_tpl_id: '',
          promo_promoter_coins: 0,
          promo_accepted_user_coins: 0
        }
      }
    },
    methods: {
      /*获取*/
      getList(){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.system_service,
            headers: {'Authorization': token},
          }).then(function (res) {
            if (res.status == 200) {
              resolve(res)
            } else {
              reject(res)
            }
          })
        })
      },
      /*更新*/
      upInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'POST',
            url: API.system_service_up,
            headers: {'Authorization': token},
            data: parm
          }).then(function (res) {

            if (res.status == 200) {
              resolve(res)
            } else {
              reject(res)
            }
          })
        })
      },
      update(){
        this.$confirm('您正在进行系统参数修改操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.upInfo({settings: JSON.stringify(this.form)}).then(res => {
            this.form = Object.assign({}, res.data.data.settings)
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          }).catch(err => {
            this.$message({
              type: 'error',
              message: '修改失败'
            });
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });
        });
      }

    },
    mounted(){
      this.getList().then(res => {
        this.form = Object.assign({}, res.data.data.settings)
      })
    }
  }
</script>
<style scoped>
  .container-wrapper {
    text-align: left;
    padding: 10px;
  }

  .form {
    -moz-column-count: 2; /* Firefox */
    -webkit-column-count: 2; /* Safari 和 Chrome */
    column-count: 2;
    -moz-column-gap: 1em;
    -webkit-column-gap: 1em;
    column-gap: 1em;
  }

  .box-card {
    margin: 0 0 1em 0;
    -moz-page-break-inside: avoid;
    -webkit-column-break-inside: avoid;
    break-inside: avoid;
    border: 1px solid rgba(0, 0, 0, 0.3);
    overflow: auto;
  }

  .box-card:hover {
    transition: all .3s ease-in 0s;
    box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3);
  }

  .box-card .clearfix {
    font-size: 20px;
  }

  .btn {
    margin-top: 10px;
  }

  @media screen and (max-width: 1200px) {
    .form {
      -moz-column-count: 1; /* Firefox */
      -webkit-column-count: 1; /* Safari 和 Chrome */
      column-count: 1;
    }
  }
</style>

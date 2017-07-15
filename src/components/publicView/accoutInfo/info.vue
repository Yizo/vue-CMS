<template>
  <div style="border: 1px solid #f5f5f5;padding: 20px">
    <el-form ref="form" :model="profile" label-position="left" label-width="140px">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="修改账号">
            <el-input v-model="profile.user.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="修改密码">
            <el-input v-model="profile.user.password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="修改钻石">
            <el-input v-model="profile.user.current_coins"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-for="(item,index) in profile.user_node_types" :key="index">
        <el-col :span="10">
          <el-form-item :label="item.node_type_name">
            <el-date-picker type="datetime" placeholder="选择日期" v-model="item.expired_at"
                            style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="修改用户类型" style="text-align: left">
            <el-select v-model="profile.user.user_group_id" placeholder="请选择VIP等级" style="width: 100%">
              <el-option
                v-for="(item,index) in group"
                :label="item.name"
                :value="item.id"
                :key="index">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10" :offset="2">
          <el-form-item label="修改用户状态" style="text-align: left">
            <el-radio class="radio" v-model="profile.user.is_enabled" label="0">封号</el-radio>
            <el-radio class="radio" v-model="profile.user.is_enabled" label="1">解封</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="text-align: left">
        <el-button type="primary" @click="onSubmit">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import {mapGetters, mapActions} from 'vuex'
  export default {
    data(){
      return {
        form: {
          id: 0,
          username: '',
          password: '',
          current_coins: 0,
          user_group_id: 0,
          is_enabled: 0,
          user_node_types: []
        },
        group: []
      }
    },
    computed: {
      ...mapGetters({
        profile: 'UD_profile'
      }),
    },
    watch: {
      profile(data){
        return data
      }
    },
    methods: {
      ...mapActions({
        update: 'UD_up_profile'
      }),
      /*获取账号等级信息*/
      GradeInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.user_types_get,
            headers: {'Authorization': token},
            params: parm,
          }).then(function (res) {

            if (res.status == 200) {
              resolve(res)
            } else {
              reject(res)
            }
          })
        })
      },
      getForm(data){
        let arry = [];
        let form = {
          id: window.sessionStorage.getItem('userId'),
          username: data.user.username,
          password: data.user.password,
          current_coins: data.user.current_coins,
          user_group_id: data.user.user_group_id,
          is_enabled: data.user.is_enabled,
          user_node_types: []
        }

        for (var i in data.user_node_types) {
          arry.push({id: data.user_node_types[i].id, expired_at: data.user_node_types[i].expired_at})
        }

        form.user_node_types = JSON.stringify(arry)
        return form
      },
      Times(data){
        const now = new Date(data);
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();

        if (month < 9) {
          month = '0' + month
        }
        if (date < 9) {
          date = '0' + date
        }
        if (hour < 9) {
          hour = '0' + hour
        }
        if (minute < 9) {
          minute = '0' + minute
        }
        if (second < 9) {
          second = '0' + second
        }
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
      },
      onSubmit(){

        let options = this.getForm(this.profile);
        for (let key in options.user_node_types) {
          if (typeof options.user_node_types[key].expired_at === "object") {
            options.user_node_types[key].expired_at = this.Times(options.user_node_types[key].expired_at)
          }
        }

        this.update(options).then(res => {
          if (res.status == 200) {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 2000
            });
          } else {
            this.$message({
              message: '修改失败',
              type: 'error',
              duration: 2000
            });
          }
        })
      }
    },
    mounted(){
      this.GradeInfo({is_enabled: 'true'}).then(res => {
        this.group = res.data.data.user_groups
      })
    }
  }
</script>


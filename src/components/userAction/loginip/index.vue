<template>
  <div id="loginIp">
    <!--导航-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ name:'start' }">用户基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>登录IP</el-breadcrumb-item>
    </el-breadcrumb>


    <el-tabs v-model="activeName">
      <el-tab-pane label="登录记录" name="first">
        <login></login>
      </el-tab-pane>
      <el-tab-pane label="地域分析" name="second">
        <region></region>
      </el-tab-pane>
      <el-tab-pane label="时间段分析" name="third">
        <period></period>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import login from './login.vue'
  import region from './region.vue'
  import period from './period.vue'
  export default{
    data(){
      return {
        activeName: 'first'
      }
    },
    components: {login, region, period},
    methods: {},
    mounted(){

    }
  }
</script>

<style scoped>
  #loginIp {
    padding: 10px;
    overflow: auto;
  }

  /*导航*/
  #loginIp .breadcrumb {
    height: 30px;
    line-height: 30px;
  }
</style>


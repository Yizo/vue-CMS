<template>
  <div id="loginIp">
    <!--导航-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ name:'start' }">配置管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数配置</el-breadcrumb-item>
    </el-breadcrumb>


    <el-tabs v-model="activeName">
      <el-tab-pane label="客户端参数配置" name="service">
        <service></service>
      </el-tab-pane>
      <el-tab-pane label="系统参数配置" name="system">
        <system></system>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import service from './service.vue'
  import system from './system.vue'
  export default{
    data(){
      return {
        activeName: 'service'
      }
    },
    components: {service, system},
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


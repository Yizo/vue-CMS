<template>
  <div class="serverdetailed">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>服务器信息</el-breadcrumb-item>
      <el-breadcrumb-item>服务器信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert
      title="数据说明"
      type="info"
      description="列表数据每10分钟更新一次" style="margin-top: 10px;text-align: left">
    </el-alert>
    <el-tabs v-model="activeName">
      <el-tab-pane label="当前记录" name="first">
        <current></current>
      </el-tab-pane>
      <el-tab-pane label="历史记录" name="second">
        <history></history>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import current from './current.vue'
  import history from './history.vue'
  export default{
    data(){
      return {
        activeName: 'first'
      }
    },
    components: {current, history},
    methods: {},
    mounted(){
    }
  }
</script>

<style scoped>
  .serverdetailed {
    padding: 10px;
  }
</style>


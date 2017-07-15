<template>
  <div id="onlines">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>服务器信息</el-breadcrumb-item>
      <el-breadcrumb-item>当前在线人数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert
      title="数据说明"
      type="info"
      description="在线人数及数据汇总每10分钟更新一次" style="margin-top: 10px;text-align: left">
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

  export default {
    data(){
      return {
        activeName: 'first'
      }
    },
    components: {current, history},
    methods: {},
    beforeMount(){

    }
  }

</script>


<style scoped>
  #onlines {
    padding: 10px;
  }

  .online-wrap {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
    margin-top: 20px;
  }

  .el-dialog__header {
    text-align: left;
  }

  .el-form-item__content {
    text-align: left;
  }

  .el-table th > .cell {
    text-align: left;
  }
</style>

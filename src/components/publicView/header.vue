<template>
  <div id="header">
    <el-dropdown split-button type="primary" @click="handleClick">
      <el-dropdown-menu slot="dropdown">
        yonghuming
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
        <el-dropdown-item>螺蛳粉</el-dropdown-item>
        <el-dropdown-item>双皮奶</el-dropdown-item>
        <el-dropdown-item>蚵仔煎</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  export default {
    computed: {
      username(){

      }
    },
    methods: {
      handleClick(){

      }
    },
  }
</script>

<style lang="less" scoped>
  #content {
    width: 100%;
    height: 500px;
    background: rgba(0, 0, 0, 0.1);
  }
</style>

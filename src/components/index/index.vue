<template>
  <div id="index">
    <div class="top">
      <p style="text-align: right">
        <el-button size="small" icon="el-icon-delete" @click="out">退出</el-button>
      </p>
    </div>
    <el-row class="main">
      <keep-alive>
        <navs class="nav"></navs>
      </keep-alive>

      <div class="content" style="width: calc(100% - 180px)">
        <router-view></router-view>
      </div>
    </el-row>
  </div>
</template>

<script>
  import navs from '../publicView/nav.vue'
  export default {
    components: {
      navs
    },
    methods: {
      out(){
        window.sessionStorage.removeItem('loginInfo');
        this.$router.push({path: '/login'})
      }
    },
    mounted(){

    }
  }
</script>

<style lang="less" scoped>
  #index .main {
    display: flex;
  }

  .nav {
    width: 180px;
  }

  .content {
    width: calc(100% - 180px);
    overflow: hidden;
    background-color: #f3f3f3;
  }

  .top {
    height: 40px;
    background-color: #324157;
  }

  .top p {
    height: 40px;
    line-height: 40px;
  }

  .top button {
    margin-right: 50px;
    border: 1px solid #324157;
  }

  .top button:hover {
    color: #324157;
    border: 1px solid #324157;
  }
</style>


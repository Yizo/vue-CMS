<template>
  <div class="wrap">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>帮助问答</el-breadcrumb-item>
      <el-breadcrumb-item>导航设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="conte">
      <ul class="nav nav-tabs">
        <router-link :to="{ name: 'domestic', query: {type: 'true'}}" tag="li"><a>国内</a></router-link>
        <router-link :to="{ name: 'foreign',  query: {type: 'false'}}" tag="li"><a>国外</a></router-link>
      </ul>
      <transition>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
  export default{
    components: {},
    data () {
      return {}
    },
    computed: {},
    methods: {},
    mounted () {

    }
  }
</script>

<style scoped>
  .router-link-active {
    border-bottom: 2px solid #20A0FF;
  }

  .router-link-active a {
    color: #20A0FF;
  }

  .wrap {
    padding: 10px;
  }

  .breadcrumb {
    margin-bottom: 10px;
  }

  .conte {
    background: #fff;
  }

  .nav {
    padding: 10px;
    text-align: left;
  }

  .nav li {
    display: inline-block;
    padding: 10px 20px;
    align-items: center;
    text-align: center;
    color: #ccc;
  }
</style>

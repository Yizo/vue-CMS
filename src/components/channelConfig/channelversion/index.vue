<template>
  <div id="channel-content">
    <!--导航-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>服务器管理</el-breadcrumb-item>
      <el-breadcrumb-item>渠道版本配置</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="warp" style="text-align: left;margin-top: 20px;">
      <el-select v-model="value" placeholder="请选择" @change="change" style="width: 200px">
        <el-option label="渠道" value="渠道" selected></el-option>
        <el-option label="版本" value="版本"></el-option>
      </el-select>
      <div style="margin-top: 20px;">
        <channels v-if="show"></channels>
        <versions v-else></versions>
      </div>
    </div>


  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import * as API from '../../../api/api'
  import channels from './channels.vue'
  import versions from './versions.vue'
  export default {
    name: 'channelVersion',
    data () {
      return {
        value: '渠道',
        show: true
      }
    },
    components: {channels, versions},
    methods: {
      change(val){
        if (val == '版本') {
          this.show = false
        } else {
          this.show = true
        }
      }
    },
    beforeMount(){
    }
  }
</script>

<style lang="less" scope>
  #channel-content {
    padding: 10px;
  }

  .channel-wrapper {
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

  .el-select {
    width: 200px;
  }
</style>

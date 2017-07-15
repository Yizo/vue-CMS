<template>
  <div class="payInfo">
    <!--导航-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>充值信息</el-breadcrumb-item>
      <el-breadcrumb-item>付费信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert
      title="数据说明"
      type="info"
      description="本页面每天凌晨统计一次,当天的新内容将于第二天凌晨统计" style="margin-top: 10px;text-align: left">
    </el-alert>
    <!--筛选-->
    <filter-time @change="change"></filter-time>
    <!--汇总图-->
    <smy></smy>
    <!--充值详情-->
    <detail :parm="parm"></detail>
  </div>
</template>

<script>
  import {mapActions, mapGetters}  from 'vuex'
  import payInfo from './payInfo.vue'
  import detail from './detail.vue'
  import filterTime from './filter.vue'
  import smy from './summary.vue'

  export default {
    components: {
      payInfo, detail, filterTime, smy
    },
    data(){
      return {
        tableData: [],
        parm: {}
      }
    },
    computed: {
      ...mapGetters(['time']),
    },
    methods: {
      ...mapActions({
        pay_details: 'PAYINFO_pay_details',
        coins_details: 'PAYINFO_consume_coins_details',
        chart: 'PAYINFO_pay_char'
      }),
      change(data){
        this.parm = Object.assign({}, data);
        if (data.app_version == '') {
          data.app_version = ''
        }
        if (data.app_channel == '') {
          data.app_channel = ''
        }
        this.pay_details({
          year: this.time.year,
          month: this.time.month,
          app_version: data.app_version,
          app_channel: data.app_channel,
          page: 1,
          limit: 15
        })
        this.coins_details({
          year: this.time.year,
          month: this.time.month,
          app_version: data.app_version,
          app_channel: data.app_channel,
        });
        this.chart({
          year: this.time.year,
          month: this.time.month,
          app_version: data.app_version,
          app_channel: data.app_channel,
        });
      }
    },
  }
</script>

<style scoped>
  .payInfo {
    padding: 10px;
  }

  .warp_filter {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
    margin-top: 20px;
  }
</style>

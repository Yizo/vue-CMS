<template>
  <div class="dstip">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>运营行为</el-breadcrumb-item>
      <el-breadcrumb-item>新增用户</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert
      title="数据说明"
      type="info"
      description="本页面每天凌晨统计一次,当天的新内容将于第二天凌晨统计" style="margin-top: 10px;text-align: left">
    </el-alert>
    <!--筛选-->
    <el-row style="text-align: left;margin-top: 20px">
      <div style="display: inline-block">
        <el-date-picker
          v-model="filter.start"
          type="month"
          placeholder="开始年月"
          @change="start_date">
        </el-date-picker>
        <el-date-picker
          v-model="filter.end"
          type="month"
          placeholder="结束年月"
          @change="end_date">
        </el-date-picker>
        <el-select v-model="filter.versions" placeholder="版本筛选">
          <el-option
            v-for="(item,index) in versions.app_versions"
            :label="item.name"
            :value="item.name" :key="index">
          </el-option>
        </el-select>
        <el-select v-model="filter.channels" placeholder="切换渠道">
          <el-option
            v-for="(item,index) in versions.app_channels"
            :label="item.name"
            :value="item.name" :key="index"
          >
          </el-option>
        </el-select>
      </div>
      <el-button style="margin-left: 40px" @click="filtration">筛选</el-button>
    </el-row>
    <!--视图-->
    <div class="warp">
      <div class="warp_col">
        <day class="c" :filter="filter"></day>
      </div>
      <div class="warp_col">
        <month class="c" :filter="filter"></month>
      </div>
    </div>
  </div>
</template>

<script>
  import day from './day.vue'
  import month from './month.vue'
  import * as JS from '../../../assets/js/js'
  import {mapActions, mapGetters}  from 'vuex'
  export default{
    data: () => ({
      filter: {
        start: '',
        end: '',
        versions: '',
        channels: ''
      },
      pageSize: 15
    }),
    components: {
      day, month
    },
    computed: {
      ...mapGetters(['versions', 'date', 'initDate']),
    },
    methods: {
      ...mapActions({
        day: 'ADDDAY_DAY',
        month: 'ADDDAY_MONTH',
        dayChart: 'ADDDAY_DAY_CHART',
        monthChart: 'ADDDAY_MONTH_CHART'
      }),
      //筛选
      start_date(val){
        this.filter.start = val
      },
      end_date(val){
        this.filter.end = val
      },
      filtration(){
        if (this.filter.channels == '全部渠道') {
          this.filter.channels = ''
        }
        if (this.filter.versions == '全部版本') {
          this.filter.versions = ''
        }

        if (typeof this.filter.start == 'object') {
          this.filter.start = JS.month(this.filter.start)
        }
        if (typeof this.filter.end == 'object') {
          this.filter.end = JS.month(this.filter.end)
        }
        let options = {
          page: 1,
          limit: this.pageSize,
          app_version: this.filter.versions,
          app_channel: this.filter.channels,
          start_at: this.filter.start,
          end_at: this.filter.end
        }
        this.dayChart(options);
        this.monthChart(options);
        this.day(options);
        this.month(options);
      }
    },
    mounted(){
      this.filter.start = this.initDate.start;
      this.filter.end = this.initDate.end;
      this.filtration();
    }
  }
</script>

<style scoped>
  .dstip {
    padding: 10px;
  }

  .warp {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
    margin-top: 20px;
    display: flex;
  }

  .warp_col {
    width: 50%;
  }

  .page {
    text-align: right;
    margin-top: 20px;
  }

  .el-select {
    width: 200px;
  }

  .el-input {
    width: 200px;
  }
</style>
